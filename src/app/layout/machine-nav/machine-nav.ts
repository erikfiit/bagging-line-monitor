import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MachineService } from '../../core/services/machine.service';
import { MachineTile } from '../../shared/machine-tile/machine-tile';

@Component({
  selector: 'app-machine-nav',
  imports: [RouterLink, RouterLinkActive, MachineTile, TranslatePipe],
  styleUrl: './machine-nav.scss',
  templateUrl: './machine-nav.html',
})
export class MachineNav {
  protected readonly machineService = inject(MachineService);

  // scrollIntoView after click
  protected showTab(active: boolean, tab: HTMLElement) {
    if (active) {
      tab.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }
}
