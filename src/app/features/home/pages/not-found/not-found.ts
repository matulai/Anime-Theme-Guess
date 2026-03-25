import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  template: ` <div class="not-found"><p class="text">404 Not Found</p></div> `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .not-found {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .text {
      color: var(--text-color-primary);
      font-weight: 700;
      font-size: 2rem;
      letter-spacing: 0.1rem;
    }
  `,
})
export class NotFound {}
