import { PageRankLink } from "@/types";
import * as d3 from "d3";
import { Matrix, ones, zeros } from "@/lib/math/mat";

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomLinks(
  count: number,
  nodes: d3.SimulationNodeDatum[],
): PageRankLink[] {
  const nodeIds = nodes.map((node) => node.id);
  const links: PageRankLink[] = [];
  for (let i = 0; i < count; i++) {
    links.push({
      source: randomElement(nodeIds),
      target: randomElement(nodeIds),
      value: 1,
    });
  }

  return links;
}

export function calculateRankMatrix(
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
