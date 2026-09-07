import { DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { LiquidGlass } from './liquid-glass';

@Directive({ selector: '[glass]' })
export class Glass {
  readonly radius = input(20);
  readonly top = input(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(DestroyRef).onDestroy(inject(LiquidGlass).registerGlass(el, this.radius, this.top));
  }
}
