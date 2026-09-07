import { Component, inject } from '@angular/core';
import { RESUME } from './content';
import { Bubble } from './glass/bubble';
import { State } from './state';

@Component({
  selector: 'section[app-home]',
  imports: [Bubble],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly state = inject(State);
  protected readonly resume = RESUME;
}
