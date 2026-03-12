import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-button-options',
  imports: [],
  templateUrl: './button-options.html',
  styleUrl: './button-options.scss',
})
export class ButtonOptions {
  options = input.required<string[]>();
  selectedOption = input.required<string>();
  onClick = input.required<(arg0: string) => void>();
  showOptions = signal<boolean>(false);

  toggleShowOptions() {
    this.showOptions.update((bool) => !bool);
  }

  handleClick(option: string) {
    this.toggleShowOptions();
    this.onClick()(option);
  }
}
