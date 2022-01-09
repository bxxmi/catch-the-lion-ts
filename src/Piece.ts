import { Cell, Position } from "./Board";
import { PlayerType } from "./Player";
import loinImage from "../images/lion.png";
import chickenImage from "../images/chicken.png";
import griffImage from "../images/griff.png";
import elephantImage from "../images/elephant.png";

// 말이 움직인 결과를 처리하는 클래스
export class MoveResult {
  constructor(private killedPiece: Piece) {}

  getKilled() {
    return this.killedPiece;
  }
}

// x, y 위치에 있을 말들에 대한 인터페이스 생성
// 말들의 종류와 말들의 위치가 계속 변경되는 등 변동이 많기 때문에 별도의 파일로 생성
export interface Piece {
  // 현재 말의 주인이 누구인지 알 수 있게 플레이어 타입 지정
  ownerType: PlayerType;
  // 현재 말의 위치를 알 수 있게 위치 타입 지정
  currentPosition: Position;

  move(from: Cell, to: Cell): MoveResult;
  render(): string;
}

abstract class DefaultPiece implements Piece {
  constructor(
    public readonly ownerType: PlayerType,
    public currentPosition: Position
  ) {}

  move(from: Cell, to: Cell): MoveResult {
    if (!this.canMove(to.position)) {
      throw new Error("can no move");
    }

    const moveResult = new MoveResult(
      to.getPiece() !== null ? to.getPiece() : null
    );
    to.putPiece(this);
    from.putPiece(null);
    this.currentPosition = to.position;
    return moveResult;
  }

  abstract canMove(position: Position): boolean;
  abstract render();
}

export class Lion extends DefaultPiece {
  canMove(pos: Position) {
    const canMove =
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col) ||
      (pos.col === this.currentPosition.col + 1 &&
        pos.row === this.currentPosition.row) ||
      (pos.col === this.currentPosition.col - 1 &&
        pos.row === this.currentPosition.row) ||
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col + 1) ||
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col - 1) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col + 1) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col - 1);
    return canMove;
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${loinImage}" width="90%" height="90%"/>`;
  }
}

export class Elephant extends DefaultPiece {
  canMove(pos: Position) {
    return (
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col + 1) ||
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col - 1) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col + 1) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col - 1)
    );
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${elephantImage}" width="90%" height="90%"/>`;
  }
}

export class Griff extends DefaultPiece {
  canMove(pos: Position) {
    return (
      (pos.row === this.currentPosition.row + 1 &&
        pos.col === this.currentPosition.col) ||
      (pos.row === this.currentPosition.row - 1 &&
        pos.col === this.currentPosition.col) ||
      (pos.col === this.currentPosition.col + 1 &&
        pos.row === this.currentPosition.row) ||
      (pos.col === this.currentPosition.col - 1 &&
        pos.row === this.currentPosition.row)
    );
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${griffImage}" width="90%" height="90%"/>`;
  }
}

export class Chick extends DefaultPiece {
  canMove(pos: Position) {
    return (
      this.currentPosition.row +
        (this.ownerType == PlayerType.UPPER ? +1 : -1) ===
      pos.row
    );
  }

  render(): string {
    return `<img class="piece ${this.ownerType}" src="${chickenImage}" width="90%" height="90%"/>`;
  }
}
