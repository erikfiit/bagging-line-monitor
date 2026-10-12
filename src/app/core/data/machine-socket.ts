import { Observable } from 'rxjs';
import { ConnectionStatus, Machine, MachineUpdate } from '../models/machine.model';

/** WebSocket, live state changes, machines = the start state */
export abstract class MachineSocket {
  abstract updates(machines: Machine[]): Observable<MachineUpdate>;
  abstract readonly connection$: Observable<ConnectionStatus>;
}
