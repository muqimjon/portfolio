import { Component, inject } from '@angular/core';
import { PROJECTS, Project } from './content';
import { Bubble } from './glass/bubble';
import { Glass } from './glass/glass';
import { Tilt } from './glass/tilt';
import { State } from './state';

@Component({
  selector: 'section[app-work]',
  imports: [Glass, Bubble, Tilt],
  templateUrl: './work.html',
  styleUrl: './work.scss',
})
export class Work {
  protected readonly state = inject(State);
  protected readonly projects = PROJECTS;

  protected logo(p: Project): string {
    if (p.key === 'cartex') {
      return this.state.dark() ? '/assets/logo-cartex-dark.svg' : '/assets/logo-cartex.svg';
    }
    return p.key === 'volt' ? '/assets/logo-voltstream.png' : `/assets/logo-${p.key}.svg`;
  }
}
