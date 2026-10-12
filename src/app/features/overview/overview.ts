import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MachineService } from '../../core/services/machine.service';
import { MachineTile } from '../../shared/machine-tile/machine-tile';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, TranslatePipe, MachineTile],
  styleUrl: './overview.scss',
  templateUrl: './overview.html',
})
export class Overview {
  protected readonly machineService = inject(MachineService);
}
