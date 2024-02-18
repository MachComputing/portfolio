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
        <GridItem>
          <GridItemHeader>Hello 1</GridItemHeader>
          <GridItemImage href="/next.svg" alt="Project picture" />
          <GridItemDescription>Test</GridItemDescription>
        </GridItem>
        <GridItem>
          <GridItemHeader>Hello 2</GridItemHeader>
        </GridItem>
        <GridItem>
          <GridItemHeader>Hello 3</GridItemHeader>
        </GridItem>
        <GridItem>
          <GridItemHeader>Hello 4</GridItemHeader>
        </GridItem>
        <GridItem>
          <GridItemHeader>Hello 5</GridItemHeader>
        </GridItem>
      </Grid>
    </main>
  );
}
