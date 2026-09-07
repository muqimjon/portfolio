import { Component, ElementRef, afterNextRender, computed, inject, viewChild } from '@angular/core';
import { Contact } from './contact';
import { Glass } from './glass/glass';
import { GlassPhoto } from './glass/glass-photo';
import { LiquidGlass } from './glass/liquid-glass';
import { Home } from './home';
import { Nav } from './nav';
import { State } from './state';
import { Work } from './work';

@Component({
  selector: 'app-root',
  imports: [Nav, Home, Work, Contact, Glass, GlassPhoto],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { '[attr.data-tab]': 'state.tab()' },
})
export class App {
  protected readonly state = inject(State);
  private readonly liquid = inject(LiquidGlass);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly photoRadius = computed(() => {
    const home = this.state.tab() === 'home';
    return this.state.mobile() ? (home ? 120 : 42) : home ? 150 : 70;
  });

  constructor() {
    afterNextRender(() => this.liquid.attach(this.canvas().nativeElement));
  }

  protected splash(el: HTMLElement): void {
    const b = el.getBoundingClientRect();
    this.liquid.ripple(b.left + b.width / 2, b.top + b.height / 2);
  }
}
