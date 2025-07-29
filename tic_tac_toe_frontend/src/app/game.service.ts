import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// PUBLIC_INTERFACE
export type Player = 'X' | 'O' | null;

export interface GameState {
  id: number;
  board: Player[][];
  playerTurn: Player;
  winner: Player | 'Draw' | null;
  history: Move[];
  started: boolean;
}

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface GameHistory {
  id: number;
  winner: Player | 'Draw' | null;
  timestamp: Date;
  moves: Move[];
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private games: GameState[] = [];
  private gameHistory: GameHistory[] = [];
  private currentGameIndex: number = -1;

  private gameStateSubject: BehaviorSubject<GameState | null> = new BehaviorSubject<GameState | null>(null);
  private historySubject: BehaviorSubject<GameHistory[]> = new BehaviorSubject<GameHistory[]>([]);

  constructor() {
    // For demonstration, auto start a new game
    this.newGame();
  }

  // PUBLIC_INTERFACE
  getCurrentGame(): Observable<GameState | null> {
    return this.gameStateSubject.asObservable();
  }

  // PUBLIC_INTERFACE
  getHistory(): Observable<GameHistory[]> {
    return this.historySubject.asObservable();
  }

  // PUBLIC_INTERFACE
  newGame(): void {
    const newState: GameState = {
      id: Date.now(),
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      playerTurn: 'X',
      winner: null,
      history: [],
      started: true,
    };
    this.games.push(newState);
    this.currentGameIndex = this.games.length - 1;
    this.gameStateSubject.next(
      JSON.parse(JSON.stringify(this.games[this.currentGameIndex]))
    );
  }

  // PUBLIC_INTERFACE
  makeMove(row: number, col: number): void {
    const game = this.games[this.currentGameIndex];
    if (!game.started || game.board[row][col] !== null || game.winner) {
      return;
    }
    game.board[row][col] = game.playerTurn;
    game.history.push({ row, col, player: game.playerTurn });

    const winner = this.checkWinner(game.board);
    if (winner) {
      game.winner = winner;
      this.pushToHistory(game);
      game.started = false;
    } else if (game.history.length === 9) {
      game.winner = 'Draw';
      this.pushToHistory(game);
      game.started = false;
    } else {
      game.playerTurn = game.playerTurn === 'X' ? 'O' : 'X';
    }
    this.gameStateSubject.next(
      JSON.parse(JSON.stringify(game))
    );
  }

  // PUBLIC_INTERFACE
  resetBoard(): void {
    if (this.currentGameIndex >= 0) {
      this.newGame();
    }
  }

  // PUBLIC_INTERFACE
  checkWinner(board: Player[][]): Player | null {
    for (let i = 0; i < 3; i++) {
      // Rows
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
      // Columns
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }
    // Diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }
    return null;
  }

  private pushToHistory(game: GameState) {
    const historyItem: GameHistory = {
      id: game.id,
      winner: game.winner,
      timestamp: new Date(),
      moves: [...game.history],
    };
    this.gameHistory.unshift(historyItem);
    this.historySubject.next([...this.gameHistory]);
  }
}
