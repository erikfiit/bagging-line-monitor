import { Service } from '@angular/core';
import { BehaviorSubject, Observable, repeat, retry } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ConnectionStatus, MachineUpdate } from '../models/machine.model';
import { MachineSocket } from './machine-socket';

const WS_URL = 'ws://localhost:8081';
const RECONNECT_DELAY_MS = 2000;

/**
 * Real WebSocket client. The server sends one JSON message per state change:
 * { "id": "packer", "state": "alarm", "timestamp": 1760000000000 }
 */
@Service()
export class WebSocketMachineSocket extends MachineSocket {
  private readonly status = new BehaviorSubject<ConnectionStatus>('connecting');

  readonly connection$ = this.status.asObservable();

  updates(): Observable<MachineUpdate> {
    return webSocket<MachineUpdate>({
      url: WS_URL,
      openObserver: { next: () => this.status.next('connected') },
      closeObserver: { next: () => this.status.next('reconnecting') },
    }).pipe(
      // Reconnect after an error (retry) and after the server closed the connection (repeat).
      retry({ delay: RECONNECT_DELAY_MS }),
      repeat({ delay: RECONNECT_DELAY_MS }),
    );
  }
}
