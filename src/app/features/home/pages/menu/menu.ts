import { Component, inject } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [Button],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private router = inject(Router);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  startNewGame() {
    console.log('STARTING A NEW GAME...');
  }
}
