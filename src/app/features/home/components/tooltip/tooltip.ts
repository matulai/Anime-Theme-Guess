import { Component, input } from '@angular/core';
import { Description } from '@features/home/model/Description';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip {
  description = input.required<Description[]>();
}
