import { Piece } from "./Piece";

// 이미지들의 x, y 위치를 잡아주는 인터페이스 생성
export interface Position {
  row: number;
  col: number;
}

// 하나의 보드는 여러 개의 셀을 갖고 있으므로 셀들의 집합인 Cell 클래스를 생성한다.
export class Cell {
  private isActive = false;
  readonly _el: HTMLElement = document.createElement("div");

  // 생성자로 Position 타입을 갖는 위치 값을 부여한다.
  constructor(public readonly position: Position, private piece: Piece) {
    this._el.classList.add("cell");
  }

  putPiece(piece: Piece) {
    this.piece = piece;
  }

  getPiece() {
    return this.piece;
  }

  active() {
    this.isActive = true;
  }

  deactive() {
    this.isActive = false;
  }

  // cell 렌더링 메소드
  render() {
    if (this.isActive) {
      this._el.classList.add("active");
    } else {
      this._el.classList.remove("active");
    }

    this._el.innerHTML = this.piece ? this.piece.render() : "";
  }
}

export class Board {
  // cells는 클래스 Cell 배열타입이므로 빈 배열을 가지게 선언한다.
  cells: Cell[] = [];
  _el: HTMLElement = document.createElement("div");

  constructor() {
    this._el.className = "board";

    for (let row = 0; row < 4; row++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      this._el.appendChild(rowEl);

      for (let col = 0; col < 3; col++) {
        const cell = new Cell({ row, col }, null);
        this.cells.push(cell);
        rowEl.appendChild(cell._el);
      }
    }
  }
  render() {
    this.cells.forEach((cell) => cell.render());
  }
}

export class DeadZone {
  private cells: Cell[] = [];
  readonly deadzoneEl = document
    .getElementById(`${this.type}_deadzone`)
    .querySelector(".card-body");

  constructor(public type: "upper" | "lower") {
    for (let col = 0; col < 4; col++) {
      const cell = new Cell({ col, row: 0 }, null);
      this.cells.push(cell);
      this.deadzoneEl.appendChild(cell._el);
    }
  }

  put(piece: Piece) {
    const emptyCell = this.cells.find((cell) => cell.getPiece() === null);
    emptyCell.putPiece(piece);
    emptyCell.render();
  }

  render() {
    this.cells.forEach((cell) => cell.render());
  }
}
