import { Component, inject } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-end-game',
  imports: [Button],
  templateUrl: './end-game.html',
  styleUrl: './end-game.scss',
})
export class EndGame {
  private router = inject(Router);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
