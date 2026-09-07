import { Component, computed, inject } from '@angular/core';
import { RESUME, SOCIALS } from './content';
import { Bubble } from './glass/bubble';
import { State } from './state';

@Component({
  selector: 'section[app-contact]',
  imports: [Bubble],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly state = inject(State);
  protected readonly socials = SOCIALS;
  protected readonly resume = RESUME;

  protected readonly emailLine = computed(() =>
    this.state.copied() ? `✓ ${this.state.t().copy}` : this.state.t().email,
  );
}
