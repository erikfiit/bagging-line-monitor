import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { STATE_ICONS } from '../../../core/models/machine.model';

@Component({
  selector: 'app-status-badges',
  imports: [TranslatePipe],
  styleUrl: './status-badges.scss',
  templateUrl: './status-badges.html',
})
export class StatusBadges {
  readonly alarms = input.required<number>();
  readonly warnings = input.required<number>();

  protected readonly stateIcons = STATE_ICONS;
}
