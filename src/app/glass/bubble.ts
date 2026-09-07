import { DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { LiquidGlass } from './liquid-glass';

@Directive({ selector: '[bubble]' })
export class Bubble {
  readonly radius = input(20);
  readonly indicator = input(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(DestroyRef).onDestroy(
      inject(LiquidGlass).registerBubble(el, this.radius, this.indicator),
    );
  }
}
