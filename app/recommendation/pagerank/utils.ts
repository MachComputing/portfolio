import { PageRankLink } from "@/types";
import * as d3 from "d3";

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
