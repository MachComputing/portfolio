import * as d3 from "d3";
import { Checkbox } from "@/components/ui/checkbox";

function findLink(
  links: { source: string; target: string; value: number }[],
  a: string,
  b: string,
  isDirected: boolean,
) {
  if (isDirected) {
    return !!links.find((link) => link.source === a && link.target === b);
  }

  return !!links.find(
    (link) =>
      (link.source === a && link.target === b) ||
      (link.source === b && link.target === a),
  );
}

export function AdjacencyTable({
  data,
  isDirected,
  setData,
}: {
  data: {
    nodes: d3.SimulationNodeDatum[];
    links: { source: string; target: string; value: number }[];
  };
  isDirected: boolean;
  setData: (newData: {
    nodes: d3.SimulationNodeDatum[];
    links: { source: string; target: string; value: number }[];
  }) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0, 1fr)_minmax(0, 2fr)] grid-rows-[minmax(0, 1fr)_minmax(0, 2fr)]">
      <p className="col-start-2 row-start-1 text-center text-white bg-slate-800">
        From
      </p>
      <p
        className="col-start-1 row-start-2 transform rotate-180 text-center text-white bg-slate-800"
        style={{ writingMode: "vertical-rl" }}
      >
        TO
      </p>
      <div className="col-start-2 row-start-2">
        <div className="items-end justify-end flex bg-slate-800">
          {data.nodes.map((node, idx) => (
            <p
              key={idx}
              className="w-5 min-h-5 text-center break-all text-white"
            >
              {node.id}
            </p>
          ))}
        </div>
        {data.nodes.map((outerNode, outerIdx) => (
          <div key={outerIdx} className="flex justify-end">
            <p className="p-0 m-0 min-w-5 h-5 text-center text-white bg-slate-800">
              {outerNode.id}
            </p>
            {data.nodes.map((innerNode, innerIdx) => (
              <Checkbox
                key={`${outerIdx}-${innerIdx}`}
                className="w-5 h-5"
                onCheckedChange={(checked) => {
                  const newLinks = [...data.links];
                  if (checked) {
                    newLinks.push({
                      source: outerNode.id,
                      target: innerNode.id,
                      value: 1,
                    });
                  } else {
                    const idx = newLinks.findIndex(
                      (link) =>
                        link.source === outerNode.id &&
                        link.target === innerNode.id,
                    );
                    newLinks.splice(idx, 1);
                  }

                  setData({
                    nodes: data.nodes,
                    links: newLinks,
                  });
                }}
                checked={findLink(
                  data.links,
                  outerNode.id,
                  innerNode.id,
                  isDirected,
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
