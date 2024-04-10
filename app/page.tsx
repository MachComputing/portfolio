import {
  Grid,
  GridItem,
  GridItemDescription,
  GridItemHeader,
  GridItemImage,
} from "@/components/ui/grid";
import React from "react";
import { HeroSection } from "@/components/ui/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <main className="mx-2 md:mx-32">
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
                This project is a simple implementation of a 2D cellular
                automata.
              </p>
            </GridItemDescription>
          </GridItem>
          <GridItem href="/recommendation/pagerank">
            <GridItemHeader>Google Page Rank</GridItemHeader>
            <GridItemImage
              href="/RecommendationPageRank.png"
              alt="Project picture"
            />
            <GridItemDescription>
              <p>
                Page Rank is an algorithm used by Google Search to rank
                websites.
              </p>
              <p>
                It works by counting the references from and to a website. It
                then calculates the importance of a website based on the
                importance of the websites that reference it.
              </p>
              <p>
                This project is a simple implementation of the Page Rank
                algorithm.
              </p>
            </GridItemDescription>
          </GridItem>
        </Grid>
      </main>
    </>
  );
}
