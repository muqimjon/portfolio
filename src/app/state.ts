import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Lang, T, Tab } from './content';

const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

@Injectable({ providedIn: 'root' })
export class State {
  private readonly media = matchMedia('(max-width: 760px)');

  readonly tab = signal<Tab>('home');
  readonly lang = signal<Lang>(read('lang') === 'en' ? 'en' : 'uz');
  readonly dark = signal(read('dark') !== 'false');
  readonly copied = signal(false);
  readonly mobile = signal(this.media.matches);
  readonly t = computed(() => T[this.lang()]);

  constructor() {
    const onChange = (): void => this.mobile.set(this.media.matches);
    this.media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media.removeEventListener('change', onChange));

    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      write('lang', lang);
    });
    effect(() => {
      const dark = this.dark();
      document.documentElement.classList.toggle('light', !dark);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#121316' : '#f1f2f4');
      write('dark', String(dark));
    });
  }

  go(tab: Tab): void {
    this.tab.set(tab);
    this.copied.set(false);
  }

  toggleLang(): void {
    this.lang.update((l) => (l === 'uz' ? 'en' : 'uz'));
  }

  toggleDark(): void {
    this.dark.update((d) => !d);
  }

  copyEmail(): void {
    navigator.clipboard?.writeText(this.t().email).then(
      () => this.copied.set(true),
      () => {},
    );
  }
}
