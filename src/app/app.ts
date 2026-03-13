import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreen } from '@shared/components/loading-screen/loading-screen';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, LoadingScreen],
})
export class App {
  protected readonly title = signal('Theme-Guess');
}
