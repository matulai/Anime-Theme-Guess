import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-input-volume',
  imports: [],
  templateUrl: './input-volume.html',
  styleUrl: './input-volume.scss',
})
export class InputVolume {
  volume = input.required<number>();
  onClick = input.required<(arg0: number) => void>();

  onVolumeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onClick()(Number(value));
  }

  sliderBackground() {
    const value = this.volume();
    return `linear-gradient(
    to right,
    #f5f2fa 0%,
    #f5f2fa ${value}%,
    #453d53 ${value}%,
    #453d53 100%
  )`;
  }
}
