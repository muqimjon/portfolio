import { DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { LiquidGlass } from './liquid-glass';

@Directive({ selector: '[glassPhoto]' })
export class GlassPhoto {
  readonly radius = input(56);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(DestroyRef).onDestroy(inject(LiquidGlass).registerPhoto(el, this.radius));
  }
}
