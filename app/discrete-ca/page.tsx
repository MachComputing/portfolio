"use client";
import React, { useEffect, useRef } from "react";
import { Cell } from "@/app/discrete-ca/cell";
import { cloneDeep } from "lodash";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiscreteCA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellWidth = 10;
  let paused = useRef<boolean>(false);
  let cells = useRef<Cell[][] | null>(null);

  const init = () => {
    const width = canvasRef.current?.width || 0;
    const height = canvasRef.current?.height || 0;

    const cols = Math.ceil(width / cellWidth);
    const rows = Math.ceil(height / cellWidth);
    return Array.from({ length: cols }, (_: unknown, idx1: number) =>
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
      cells.current = init();
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
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cells.current = init();

      if (ctx) {
        update();
      }
      window.addEventListener("resize", () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          cells.current = init();
          update();
        }
      });
    }
  }, [canvasRef]);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 px-4 py-2 bg-gray-500/20 backdrop-blur-3xl">
        <Link href="/">Main Page</Link>
      </div>
      <div className="absolute top-0 right-0 w-60 px-4 py-2 bg-gray-500/20 backdrop-blur-3xl flex flex-col gap-2">
        <h1 className="text-2xl">Controls</h1>
        <Button onClick={() => (paused.current = true)}>
          Pause simulation
        </Button>
        <Button
          onClick={() => {
            paused.current = false;
            requestAnimationFrame(update);
          }}
        >
          Resume simulation
        </Button>
        <Button
          onClick={() => {
            cells.current = init();
            update();
          }}
        >
          Reset
        </Button>
      </div>
      <canvas className="w-full h-screen" ref={canvasRef}></canvas>
    </div>
  );
}
