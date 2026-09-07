import { Component, DestroyRef, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { Tab } from './content';
import { Bubble } from './glass/bubble';
import { LiquidGlass } from './glass/liquid-glass';
import { State } from './state';

@Component({
  selector: 'nav[app-nav]',
  imports: [Bubble],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected readonly state = inject(State);
  protected readonly tabs: Tab[] = ['home', 'work', 'contact'];

  private readonly ind = viewChild.required<ElementRef<HTMLElement>>('ind');
  private readonly buttons = viewChildren<ElementRef<HTMLElement>>('tabEl');
  private key = '';

  constructor() {
    inject(DestroyRef).onDestroy(inject(LiquidGlass).registerFrame(() => this.place()));
  }

  private place(): void {
    const el = this.buttons()[this.tabs.indexOf(this.state.tab())]?.nativeElement;
    if (!el) return;
    const x = el.offsetLeft - 6;
    const w = el.offsetWidth;
    const key = `${x}|${w}`;
    if (key === this.key) return;
    this.key = key;
    const style = this.ind().nativeElement.style;
    style.transform = `translateX(${x}px)`;
    style.width = `${w}px`;
  }
}
