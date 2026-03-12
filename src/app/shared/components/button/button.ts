import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[style.width]': `isFill() ? '100%': '' `,
  },
})
export class Button {
  isFill = input<boolean>(false);
  onClick = input.required<() => void>();

  handleClick() {
    const fn = this.onClick();

    if (fn) {
      fn();
    }
  }
}
