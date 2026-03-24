import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  template: ` <div class="progress-bar" [style.width.%]="progress()"></div> `,
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  seconds = input.required<number>();
  running = input<boolean>(false);

  finished = output<void>();

  progress = signal(0);
  intervalId: any;

  constructor() {
    effect(() => {
      if (this.running()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  start() {
    const intervalTime = 1000; // cada 1s
    const step = (intervalTime / (this.seconds() * 1000)) * 100;

    this.progress.set(0);

    this.intervalId = setInterval(() => {
      this.progress.update((v) => {
        const currentProgress = v + step;
        if (currentProgress >= 100) {
          this.progress.set(100);
          this.stop();
          this.finished.emit();
          return 0;
        } else {
          return currentProgress;
        }
      });
    }, intervalTime);
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.stop();
  }
}
