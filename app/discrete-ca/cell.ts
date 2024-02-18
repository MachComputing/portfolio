export class Cell {
  constructor(
    public state: number,
    public posX: number,
    public posY: number,
  ) {
    if (state !== 0 && state !== 1) {
      throw new Error("Invalid cell state");
    }

    this.state = state;
    this.posX = posX;
    this.posY = posY;
  }

  public transition(grid: Cell[][]) {
    const aliveNeighbors = this.countAliveNeighbors(grid);
    if (this.isAlive) {
      if (aliveNeighbors < 2 || aliveNeighbors > 3) {
        this.state = 0;
      }
    } else if (aliveNeighbors === 3) {
      this.state = 1;
    }
  }

  public render(ctx: CanvasRenderingContext2D, cellSize: number) {
    ctx.fillStyle = this.isAlive ? "black" : "white";
    ctx.fillRect(
      this.posX * cellSize,
      this.posY * cellSize,
      cellSize,
      cellSize,
    );
  }

  get isAlive() {
    return this.state === 1;
  }

  get isDead() {
    return this.state === 0;
  }

  private countAliveNeighbors(grid: Cell[][]) {
    let count = 0;
    for (let i = this.posX - 1; i <= this.posX + 1; i++) {
      for (let j = this.posY - 1; j <= this.posY + 1; j++) {
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
          if (i !== this.posX || j !== this.posY) {
            count += grid[i][j].isAlive ? 1 : 0;
          }
        }
      }
    }
    return count;
  }
}
