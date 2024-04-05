export class Matrix {
  data: number[][] = [];
  constructor(
    public rows: number,
    public cols: number,
    value: number,
  ) {
    this.data = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => value),
    );
  }

  public get(col: number, row: number): number {
    return this.data[row][col];
  }

  public set(col: number, row: number, value: number): void {
    this.data[row][col] = value;
  }

  public add(matrix: Matrix): Matrix {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrix dimensions must match");
    }

    const result = new Matrix(this.rows, this.cols, 0);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        result.set(i, j, this.get(i, j) + matrix.get(i, j));
      }
    }
    return result;
  }

  public sub(matrix: Matrix): Matrix {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrix dimensions must match");
    }

    const result = new Matrix(this.rows, this.cols, 0);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        result.set(i, j, this.get(i, j) - matrix.get(i, j));
      }
    }
    return result;
  }

  public mul(matrix: Matrix): Matrix {
    if (this.cols !== matrix.rows) {
      throw new Error("Matrix dimensions must match");
    }

    const result = new Matrix(this.rows, matrix.cols, 0);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(k, i) * matrix.get(j, k);
        }
        result.set(j, i, sum);
      }
    }

    result.print();

    return result;
  }

  public mulScalar(val: number): Matrix {
    const result = new Matrix(this.rows, this.cols, 0);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) * val);
      }
    }

    return result;
  }

  public div(val: number) {
    const result = new Matrix(this.rows, this.cols, 0);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) / val);
      }
    }
    return result;
  }

  public print() {
    console.table(this.data);
  }

  getRowSum(row: number) {
    return this.data[row].reduce((acc, cur) => acc + cur, 0);
  }

  getColumnSum(col: number) {
    return this.data.map((row) => row[col]).reduce((acc, cur) => acc + cur, 0);
  }

  replaceNaN(val: number) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (isNaN(this.get(i, j))) {
          this.set(i, j, val);
        }
      }
    }
  }

  sum() {
    return this.data.flat().reduce((acc, cur) => acc + cur, 0);
  }
}

export function ones(rows: number, cols: number): Matrix {
  return new Matrix(rows, cols, 1);
}

export function zeros(rows: number, cols: number): Matrix {
  return new Matrix(rows, cols, 0);
}
