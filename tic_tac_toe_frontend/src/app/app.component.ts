import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, Player, GameState, GameHistory } from './game.service';
import { BoardComponent } from './board/board.component';
import { GameHistoryComponent } from './game-history/game-history.component';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoardComponent, GameHistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Multiplayer Tic-Tac-Toe';
  game: GameState | null = null;
  history: GameHistory[] = [];

  private gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService.getCurrentGame().subscribe(game => {
      this.game = game;
    });
    this.gameService.getHistory().subscribe(h => {
      this.history = h;
    });
  }

  // PUBLIC_INTERFACE
  onCellClick(event: { row: number; col: number }) {
    if (this.game?.winner || this.game?.board[event.row][event.col]) return;
    this.gameService.makeMove(event.row, event.col);
  }

  // PUBLIC_INTERFACE
  onNewGame() {
    this.gameService.newGame();
  }

  // PUBLIC_INTERFACE
  onReset() {
    this.gameService.resetBoard();
  }

  // PUBLIC_INTERFACE
  getPlayerName(player: Player | null) {
    return player === 'X'
      ? 'Player 1 (X)'
      : player === 'O'
      ? 'Player 2 (O)'
      : '';
  }

  // PUBLIC_INTERFACE
  getStatusMessage() {
    if (!this.game) return '';
    if (this.game.winner) {
      if (this.game.winner === 'Draw') return "It's a Draw!";
      return `${this.getPlayerName(this.game.winner)} wins!`;
    }
    return `${this.getPlayerName(this.game.playerTurn)}'s turn`;
  }
}
