import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
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
  private readonly text = viewChild.required<ElementRef<HTMLElement>>('text');

  constructor() {
    const observer = new ResizeObserver(([entry]) =>
      document.documentElement.style.setProperty('--home-text', `${entry.contentRect.height}px`),
    );
    afterNextRender(() => observer.observe(this.text().nativeElement));
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
