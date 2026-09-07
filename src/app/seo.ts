import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { State } from './state';

declare function gtag(...args: unknown[]): void;

const ORIGIN = 'https://muqimjon.uz';

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly state = inject(State);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    effect(() => {
      const tab = this.state.tab();
      const lang = this.state.lang();
      const { title, description } = this.state.t().seo[tab];
      const url = ORIGIN + this.state.url(lang, tab);
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:locale', content: lang === 'en' ? 'en_US' : 'uz_UZ' });
      this.link('link[rel="canonical"]', url);
      this.link('link[hreflang="uz"]', ORIGIN + this.state.url('uz', tab));
      this.link('link[hreflang="en"]', ORIGIN + this.state.url('en', tab));
      this.link('link[hreflang="x-default"]', ORIGIN + this.state.url('uz', tab));
      gtag('event', 'page_view', {
        page_path: this.state.url(),
        page_location: url,
        page_title: title,
      });
    });
  }

  private link(selector: string, href: string): void {
    document.head.querySelector<HTMLLinkElement>(selector)?.setAttribute('href', href);
  }
}
