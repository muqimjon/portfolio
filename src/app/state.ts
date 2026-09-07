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
  readonly lang = signal<Lang>('uz');
  readonly dark = signal(read('dark') !== 'false');
  readonly copied = signal(false);
  readonly mobile = signal(this.media.matches);
  readonly t = computed(() => T[this.lang()]);

  constructor() {
    this.apply();
    history.replaceState(null, '', this.url());
    const onChange = (): void => this.mobile.set(this.media.matches);
    const onPop = (): void => this.apply();
    this.media.addEventListener('change', onChange);
    window.addEventListener('popstate', onPop);
    inject(DestroyRef).onDestroy(() => {
      this.media.removeEventListener('change', onChange);
      window.removeEventListener('popstate', onPop);
    });

    effect(() => {
      document.documentElement.lang = this.lang();
    });
    effect(() => {
      const dark = this.dark();
      document.documentElement.classList.toggle('light', !dark);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#121316' : '#e3e6eb');
      write('dark', String(dark));
    });
  }

  go(tab: Tab): void {
    this.tab.set(tab);
    this.copied.set(false);
    this.push();
  }

  toggleLang(): void {
    this.lang.update((l) => (l === 'uz' ? 'en' : 'uz'));
    this.push();
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

  url(lang = this.lang(), tab = this.tab()): string {
    const parts: string[] = [];
    if (lang === 'en') parts.push('en');
    if (tab !== 'home') parts.push(tab);
    return '/' + parts.join('/');
  }

  private apply(): void {
    const [first = '', second = ''] = location.pathname.split('/').filter(Boolean);
    const tab = first === 'uz' || first === 'en' ? second : first;
    this.lang.set(first === 'en' ? 'en' : 'uz');
    this.tab.set(tab === 'work' || tab === 'contact' ? tab : 'home');
    this.copied.set(false);
  }

  private push(): void {
    const url = this.url();
    if (url !== location.pathname) history.pushState(null, '', url);
  }
}
