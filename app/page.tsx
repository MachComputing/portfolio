import {
  Grid,
  GridItem,
  GridItemDescription,
  GridItemHeader,
  GridItemImage,
} from "@/components/ui/grid";
import React from "react";

export default function Home() {
  return (
    <main className="mx-32">
      <Grid>
        <GridItem href="/discrete-ca">
          <GridItemHeader>Discrete Cellular Automata</GridItemHeader>
          <GridItemImage href="/DiscreteCA.png" alt="Project picture" />
          <GridItemDescription>
            <p>
              Discrete Cellular Automata, as the name implies, is a discrete
              model of computation.
            </p>
            <p>
              It consists in a grid of cells that can be in one of two states,
              on or off. The state of a cell is determined by the state of its
              neighbors.
            </p>
            <p>
              This project is a simple implementation of a 2D cellular automata.
            </p>
          </GridItemDescription>
        </GridItem>
      </Grid>
    </main>
  );
}
