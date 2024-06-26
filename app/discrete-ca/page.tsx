"use client";
import React, { useEffect, useRef } from "react";
import { Cell } from "@/app/discrete-ca/cell";
import { cloneDeep } from "lodash";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiscreteCA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellWidth = 10;
  const initialized = useRef<boolean>(false);
  const paused = useRef<boolean>(false);
  const cells = useRef<Cell[][] | null>(null);

  const init = () => {
    canvasRef.current!.width = window.innerWidth;
    canvasRef.current!.height = window.innerHeight;

    const width = canvasRef.current?.width || 0;
    const height = canvasRef.current?.height || 0;

    const cols = Math.ceil(width / cellWidth);
    const rows = Math.ceil(height / cellWidth);
    cells.current = Array.from({ length: cols }, (_: unknown, idx1: number) =>
      Array.from(
        { length: rows },
        (_: unknown, idx2: number) =>
          new Cell(+(Math.random() > 0.5), idx1, idx2),
      ),
    );
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (cells.current === null) {
      init();
      return;
    }

    // clone the cells
    const newCells = cloneDeep(cells.current);
    for (let i = 0; i < cells.current.length; i++) {
      for (let j = 0; j < cells.current[i].length; j++) {
        newCells[i][j].transition(cells.current!);
      }
    }
    cells.current = newCells;

    for (let i = 0; i < cells.current.length; i++) {
      for (let j = 0; j < cells.current[i].length; j++) {
        cells.current[i][j].render(ctx, cellWidth);
      }
    }

    if (!paused.current) {
      requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      init();
      update();

      window.addEventListener("resize", () => {
        const canvas = canvasRef.current;
        if (canvas) {
          init();
          if (paused.current) update();
        }
      });
    }
  }, [canvasRef]);

  return (
    <div className="relative">
      <Link href="/">
        <div className="absolute top-0 left-0 px-4 py-2 bg-gray-500/20 hover:bg-gray-700/30 backdrop-blur-3xl">
          Main Page
        </div>
      </Link>
      <div className="absolute top-0 right-0 w-60 px-4 py-2 bg-gray-500/20 backdrop-blur-3xl flex flex-col gap-2">
        <h1 className="text-2xl">Controls</h1>
        <Button onClick={() => (paused.current = true)}>
          Pause simulation
        </Button>
        <Button
          onClick={() => {
            if (paused.current) {
              paused.current = false;
              update();
            }
          }}
        >
          Resume simulation
        </Button>
        <Button
          onClick={() => {
            init();
            if (paused.current) update();
          }}
        >
          Reset
        </Button>
      </div>
      <canvas className="w-full h-screen" ref={canvasRef}></canvas>
    </div>
  );
}
