"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AdjacencyTable } from "@/components/ui/adjacencytable";
import _ from "lodash";
import { randomLinks } from "@/app/recommendation/pagerank/utils";
import { PageRankLink } from "@/types";
import { Button } from "@/components/ui/button";
import { Matrix, ones, zeros } from "@/lib/math/mat";

declare module "d3" {
  interface SimulationNodeDatum {
    id: string;
    group: number;
    size: number;
  }
}

export default function PageRank() {
  const ref = useRef<SVGSVGElement>(null);
  const [isDirected, setIsDirected] = useState(true);
  const [nodes, setNodes] = useState<Record<string, any>[]>([]);
  const [links, setLinks] = useState<PageRankLink[]>([]);

  function calculateRankMatrix(
    nodes: Record<string, any>[],
    links: PageRankLink[],
  ): Matrix {
    const dampingFactor = 0.85;
    const L = zeros(nodes.length, nodes.length);
    for (const link of links) {
      const source = nodes.findIndex((n) => n.id === link.source);
      const target = nodes.findIndex((n) => n.id === link.target);
      L.set(target, source, L.get(target, source) + 1);
    }

    const H = zeros(nodes.length, nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      const colSum = L.getColumnSum(i);
      for (let j = 0; j < nodes.length; j++) {
        H.set(
          i,
          j,
          colSum != 0 ? L.get(i, j) / colSum : NaN, // Normalize by column sum
        );
      }
    }

    const regularPath = H.mulScalar(dampingFactor);
    const teleportation = ones(nodes.length, nodes.length).mulScalar(
      (1 - dampingFactor) / nodes.length,
    );

    const A = regularPath.add(teleportation);
    A.replaceNaN(1 / nodes.length);
    return A;
  }

  const [rankMatrix, setRankMatrix] = useState<Matrix>(() =>
    calculateRankMatrix(nodes, links),
  );

  const [data, setData] = useState<{
    nodes: d3.SimulationNodeDatum[];
    links: PageRankLink[];
  }>({ nodes: [], links: [] });

  useEffect(() => {
    const n = [
      { id: "A", group: 1, size: 1 / 8 },
      { id: "B", group: 1, size: 1 / 8 },
      { id: "C", group: 1, size: 1 / 8 },
      { id: "D", group: 1, size: 1 / 8 },
      { id: "E", group: 2, size: 1 / 8 },
      { id: "F", group: 2, size: 1 / 8 },
      { id: "G", group: 2, size: 1 / 8 },
      { id: "H", group: 2, size: 1 / 8 },
    ];
    const rl = randomLinks(8, n);

    setNodes(n);
    setLinks(rl);
    setData({
      nodes: _.cloneDeep(
        n.map((n) => ({
          ...n,
          size: n.size * 30 + 20,
        })),
      ) as d3.SimulationNodeDatum[],
      links: _.cloneDeep(rl),
    });
  }, []);

  useEffect(() => {
    setRankMatrix(calculateRankMatrix(nodes, links));
  }, [nodes.length, links]);

  useEffect(() => {
    const width = 928;
    const height = 600;

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide().radius(function (d) {
          return d.size + 30;
        }),
      )
      .on("tick", ticked);

    // clears the svg
    d3.select(ref.current).selectAll("*").remove();
    const svg = d3.select(ref.current).attr("viewBox", [0, 0, width, height]);
    const marker = svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto");
    marker.append("path").attr("fill", "#999").attr("d", "M0,-5L10,0L0,5");

    let link: d3.Selection<any, any, any, any>;
    if (isDirected) {
      link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("path")
        .data(data.links)
        .join("path")
        .attr("stroke-width", (d) => Math.sqrt(d.value))
        .attr("fill", "none")
        .attr("marker-end", "url(#arrow)");
    } else {
      link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("path")
        .data(data.links)
        .join("path")
        .attr("fill", "none")
        .attr("stroke-width", (d) => Math.sqrt(d.value));
    }

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => d.size)
      .attr("fill", "gray") as d3.Selection<
      SVGCircleElement,
      d3.SimulationNodeDatum,
      SVGGElement,
      unknown
    >;

    const text = svg
      .append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("x", (d) => d.x || 0)
      .attr("y", (d) => d.y || 0)
      .text((d) => d.id + ": " + ((d.size - 20) / 30).toFixed(2))
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("user-select", "none");

    const dragBehaviour = d3
      .drag<SVGCircleElement, d3.SimulationNodeDatum>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
    node.call(dragBehaviour);

    function ticked() {
      const padding = 5;
      const loopRadius = 5;

      link.attr("d", (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
        const source = d.source as d3.SimulationNodeDatum;
        const target = d.target as d3.SimulationNodeDatum;

        if (source.id === target.id) {
          const dx = loopRadius + source.size;
          const dy = (loopRadius + source.size) / 2;

          const polarAngle = Math.PI / 4;
          const polarRadius = source.size;
          const x = source.x! + polarRadius * Math.cos(polarAngle);
          const y = source.y! + polarRadius * Math.sin(polarAngle);

          return `M${source.x!},${source.y!}A${dx},${dy} 0 1,1 ${x},${y}`;
        } else {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${source.x},${source.y}Q${(source.x! + target.x!) / 2},${(source.y! + target.y!) / 2} ${target.x! - (dx * target.size) / dr},${target.y! - (dy * target.size) / dr}`;
        }
      });

      node
        .attr("cx", (d) => {
          d.x = Math.max(padding, Math.min(width - padding, d.x || 0)); // constrain x
          return d.x;
        })
        .attr("cy", (d) => {
          d.y = Math.max(padding, Math.min(height - padding, d.y || 0)); // constrain y
          return d.y;
        });

      text
        .attr("x", (d) => {
          d.x = Math.max(padding, Math.min(width - padding, d.x || 0)); // constrain x
          return d.x;
        })
        .attr("y", (d) => {
          d.y = Math.max(padding, Math.min(height - padding, d.y || 0)); // constrain y
          return d.y;
        });
    }

    function dragstarted(event: any, _: d3.SimulationNodeDatum) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any, _: d3.SimulationNodeDatum) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any, _: d3.SimulationNodeDatum) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [data, nodes, links, ref]);

  const step = () => {
    const X = zeros(nodes.length, 1);
    for (let i = 0; i < nodes.length; i++) {
      X.set(0, i, nodes[i].size);
    }
    const newX = rankMatrix.mul(X);

    setNodes(nodes.map((n, i) => ({ ...n, size: newX.get(0, i) })));
    setData({
      nodes: _.cloneDeep(
        nodes.map((n, i) => ({ ...n, size: newX.get(0, i) * 30 + 20 })),
      ) as d3.SimulationNodeDatum[],
      links: _.cloneDeep(links),
    });
  };

  const reset = (
    newLinks: { source: string; target: string; value: number }[],
  ) => {
    setNodes(nodes.map((n) => ({ ...n, size: 1 / nodes.length })));
    setData({
      nodes: _.cloneDeep(
        nodes.map((n) => ({
          ...n,
          size: (1 / nodes.length) * 30 + 20,
        })),
      ) as d3.SimulationNodeDatum[],
      links: _.cloneDeep(newLinks),
    });
  };

  return (
    <>
      <div className="absolute top-0 right-0">
        <Button onClick={() => step()}>Step</Button>

        <AdjacencyTable
          data={{ nodes: nodes as d3.SimulationNodeDatum[], links }}
          setData={(newData) => {
            setLinks(newData.links);
            reset(newData.links);
          }}
          isDirected={isDirected}
        />
      </div>
      <svg ref={ref} className="w-full h-screen" />
    </>
  );
}
