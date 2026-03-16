import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading-service';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss',
  host: {
    '(window:keydown)': 'handlePressButton()',
  },
})
export class LoadingScreen {
  loadingService = inject(LoadingService);

  state = this.loadingService.state;

  start() {
    if (this.state() === 'ready') {
      this.loadingService.hide();
      this.loadingService.onPressAction();
    }
  }

  handlePressButton() {
    this.start();
  }
}
