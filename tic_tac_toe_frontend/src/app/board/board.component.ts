import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Player } from '../game.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'ttt-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BoardComponent {
  @Input() board: Player[][] = [[]];
  @Input() disabled: boolean = false;
  @Output() cellClick = new EventEmitter<{ row: number; col: number }>();

  // PUBLIC_INTERFACE
  onClick(row: number, col: number) {
    if (this.disabled) return;
    this.cellClick.emit({ row, col });
  }

  // PUBLIC_INTERFACE
  getCellClass(player: Player | null): string {
    if (player === 'X') return 'cell-x';
    if (player === 'O') return 'cell-o';
    return '';
  }
}
