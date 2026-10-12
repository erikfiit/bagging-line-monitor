import { Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import {
  DEFAULT_STATE_ICON,
  DEFAULT_TYPE_ICON,
  Machine,
  STATE_ICONS,
  TYPE_ICONS,
} from '../../core/models/machine.model';

@Component({
  selector: 'app-machine-tile',
  imports: [MatTooltip, TranslatePipe],
  host: { '[class]': 'classes()' },
  styleUrl: './machine-tile.scss',
  templateUrl: './machine-tile.html',
})
export class MachineTile {
  readonly machine = input.required<Machine>();
  readonly variant = input<'nav' | 'overview'>('overview');

  protected readonly typeIcon = computed(
    () => TYPE_ICONS[this.machine().type] ?? DEFAULT_TYPE_ICON,
  );
  protected readonly stateIcon = computed(
    () => STATE_ICONS[this.machine().state] ?? DEFAULT_STATE_ICON,
  );
  protected readonly classes = computed(
    () => `state-${this.machine().state} variant-${this.variant()}`,
  );
}
