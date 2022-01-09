import { Board, DeadZone } from "./Board";

export class Game {
  readonly board = new Board();
  readonly upperDeadZone = new DeadZone("upper");
  readonly innerDeadZone = new DeadZone("lower");

  constructor() {
    const boardContainer = document.querySelector(".board-container");
    boardContainer.appendChild(this.board._el);
  }
}
