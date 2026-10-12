import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ConnectionStatus as Status } from '../../../core/models/machine.model';

@Component({
  selector: 'app-connection-status',
  imports: [TranslatePipe],
  styleUrl: './connection-status.scss',
  templateUrl: './connection-status.html',
})
export class ConnectionStatus {
  readonly status = input.required<Status>();
}
