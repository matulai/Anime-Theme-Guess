import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-screen-timer',
  imports: [],
  template: `<p>{{ time() }}</p>`,
  styles: [
    `
      :host {
        position: absolute;
        z-index: 10;
      }

      p {
        font-size: 64px;
        font-weight: 700;
        letter-spacing: 0.1rem;
        color: var(--text-color-primary);
      }
    `,
  ],
})
export class ScreenTimer {
  seconds = input.required<number>();
  running = input<boolean>(false);

  finished = output<void>();

  time = signal(0);

  private intervalId: any;

  constructor() {
    effect(() => {
      if (this.running()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  private start() {
    this.stop();

    this.time.set(this.seconds());

    this.intervalId = setInterval(() => {
      this.time.update((t) => {
        if (t <= 1) {
          this.stop();
          this.finished.emit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
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
