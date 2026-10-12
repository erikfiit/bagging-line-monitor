import { Service } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  delay,
  filter,
  ignoreElements,
  interval,
  map,
  merge,
  tap,
} from 'rxjs';
import { ConnectionStatus, Machine, MachineState, MachineUpdate } from '../models/machine.model';
import { MachineSocket } from './machine-socket';

const STATES: MachineState[] = ['running', 'alarm', 'warning'];

/**
 * one of the loaded machines changes state every few seconds.
 */
@Service()
export class SimulatedMachineSocket extends MachineSocket {
  private readonly status = new BehaviorSubject<ConnectionStatus>('connecting');

  changeEveryMs = 4000;
  dropEveryMs = 40000;
  reconnectMs = 3000;

  readonly connection$ = this.status.asObservable();

  updates(machines: Machine[]): Observable<MachineUpdate> {
    this.status.next('connected');
    const states = new Map(machines.map((machine) => [machine.id, machine.state]));

    const changes$ = interval(this.changeEveryMs).pipe(
      filter(() => this.status.value === 'connected'),
      map(() => this.changeRandomMachine(states)),
    );
    const drops$ = interval(this.dropEveryMs).pipe(
      tap(() => this.status.next('reconnecting')),
      delay(this.reconnectMs),
      tap(() => this.status.next('connected')),
      ignoreElements(),
    );
    return merge(changes$, drops$);
  }

  private changeRandomMachine(states: Map<string, MachineState>): MachineUpdate {
    const ids = [...states.keys()];
    const id = ids[Math.floor(Math.random() * ids.length)];
    const others = STATES.filter((state) => state !== states.get(id));
    const state = others[Math.floor(Math.random() * others.length)];
    states.set(id, state);
    return { id, state, timestamp: Date.now() };
  }
}
