import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[tilt]' })
export class Tilt {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    this.el.addEventListener('mousemove', this.onMove);
    this.el.addEventListener('mouseleave', this.onLeave);
    inject(DestroyRef).onDestroy(() => {
      this.el.removeEventListener('mousemove', this.onMove);
      this.el.removeEventListener('mouseleave', this.onLeave);
    });
  }

  private readonly onMove = (e: MouseEvent): void => {
    const b = this.el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    this.el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-3px)`;
  };

  private readonly onLeave = (): void => {
    this.el.style.transform = '';
  };
}
