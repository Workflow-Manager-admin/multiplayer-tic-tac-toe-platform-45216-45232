import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { GameHistory } from '../game.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'ttt-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GameHistoryComponent {
  @Input() history: GameHistory[] = [];
}
