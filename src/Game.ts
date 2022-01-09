import { Board, Cell, DeadZone } from "./Board";
import { Lion } from "./Piece";
import { Player, PlayerType } from "./Player";

export class Game {
  private selectedCell: Cell;
  private turn = 0;
  private currentPlayer: Player;
  private gameInfoEl = document.querySelector(".alert");
  private state: "STARTED" | "ENDED" = "STARTED";

  readonly upperPlayer = new Player(PlayerType.UPPER);
  readonly lowerPlayer = new Player(PlayerType.LOWER);

  readonly board = new Board(this.upperPlayer, this.lowerPlayer);
  readonly upperDeadZone = new DeadZone("upper");
  readonly lowerDeadZone = new DeadZone("lower");

  constructor() {
    const boardContainer = document.querySelector(".board-container");
    boardContainer.appendChild(this.board._el);

    this.currentPlayer = this.upperPlayer;
    this.board.render();
    this.renderInfo();
    this.board._el.addEventListener("click", (event) => {
      if (this.state === "ENDED") {
        return false;
      }

      if (event.target instanceof HTMLElement) {
        let cellEl: HTMLElement;
        if (event.target.classList.contains("cell")) {
          cellEl = event.target;
        } else if (event.target.classList.contains("piece")) {
          cellEl = event.target.parentElement;
        } else {
          return false;
        }
        const cell = this.board.map.get(cellEl);

        if (this.isCurrenUserPiece(cell)) {
          this.select(cell);
          return false;
        }

        if (this.selectedCell) {
          this.move(cell);
          this.changeTurn();
        }
      }
    });
  }

  isCurrenUserPiece(cell: Cell) {
    return (
      cell !== null &&
      cell.getPiece() != null &&
      cell.getPiece().ownerType === this.currentPlayer.type
    );
  }

  select(cell: Cell) {
    if (cell.getPiece() === null) {
      return;
    }

    if (cell.getPiece().ownerType !== this.currentPlayer.type) {
      return;
    }

    if (this.selectedCell) {
      this.selectedCell.deactive();
      this.selectedCell.render();
    }

    this.selectedCell = cell;
    cell.active();
    cell.render();
  }

  move(cell: Cell) {
    this.selectedCell.deactive();
    const killed = this.selectedCell
      .getPiece()
      .move(this.selectedCell, cell)
      .getKilled();
    this.selectedCell = cell;

    if (killed) {
      if (killed.ownerType === PlayerType.UPPER) {
        this.lowerDeadZone.put(killed);
      } else {
        this.upperDeadZone.put(killed);
      }

      if (killed instanceof Lion) {
        this.state = "ENDED";
      }
    }
  }

  renderInfo(extraMessage?: string) {
    this.gameInfoEl.innerHTML = `${this.turn}턴 ${
      this.currentPlayer.type
    } 차례 ${extraMessage ? "|" + extraMessage : ""}`;
  }

  changeTurn() {
    this.selectedCell.deactive();
    this.selectedCell = null;

    if (this.state === "ENDED") {
      this.renderInfo("END");
    } else {
      this.turn += 1;
      this.currentPlayer =
        this.currentPlayer === this.lowerPlayer
          ? this.upperPlayer
          : this.lowerPlayer;
      this.renderInfo();
    }
    this.board.render();
  }
}
