import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { formatDuration } from '../../core/utils/duration';
import { ClockService } from '../../core/services/clock.service';
import { MachineService } from '../../core/services/machine.service';
import { MachineTile } from '../../shared/machine-tile/machine-tile';

@Component({
  selector: 'app-machine-detail',
  imports: [RouterLink, DatePipe, TranslatePipe, MachineTile],
  styleUrl: './machine-detail.scss',
  templateUrl: './machine-detail.html',
})
export class MachineDetail {
  private readonly machineService = inject(MachineService);
  private readonly now = inject(ClockService).now;

  /** from the route param */
  readonly id = input.required<string>();

  protected readonly machine = computed(() => this.machineService.machineById().get(this.id()));
  protected readonly history = computed(() =>
    this.machineService.history().filter((change) => change.id === this.id()),
  );
  protected readonly timeInState = computed(() => {
    const machine = this.machine();
    return machine ? formatDuration(this.now() - machine.since) : '';
  });
}
