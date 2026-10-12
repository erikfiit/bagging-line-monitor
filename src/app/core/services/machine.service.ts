import { DestroyRef, Service, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MachineApi } from '../data/machine-api';
import { MachineSocket } from '../data/machine-socket';
import {
  LoadStatus,
  Machine,
  MachineDto,
  MachineUpdate,
  STATE_ICONS,
  StateChange,
} from '../models/machine.model';

const HISTORY_LIMIT = 50;

@Service()
export class MachineService {
  private readonly api = inject(MachineApi);
  private readonly socket = inject(MachineSocket);
  private readonly destroyRef = inject(DestroyRef);
  private listening = false;

  readonly machines = signal<Machine[]>([]);
  readonly status = signal<LoadStatus>('loading');

  readonly history = signal<StateChange[]>([]);
  readonly lastChange = computed(() => this.history()[0]);
  readonly connection = toSignal(this.socket.connection$, { initialValue: 'connecting' });

  readonly alarmCount = computed(() => this.countState('alarm'));
  readonly warningCount = computed(() => this.countState('warning'));
  readonly machineById = computed(() => new Map(this.machines().map((m) => [m.id, m])));

  constructor() {
    this.load();
  }

  load() {
    this.status.set('loading');
    this.api
      .getMachines()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dtos) => {
          if (!Array.isArray(dtos)) {
            this.status.set('error');
            return;
          }
          this.machines.set(dtos.map((dto) => this.toMachine(dto)));
          this.status.set('ready');
          this.listenForUpdates(this.machines());
        },
        error: () => this.status.set('error'),
      });
  }

  private listenForUpdates(machines: Machine[]) {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.socket
      .updates(machines)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => this.apply(update));
  }

  private apply(update: MachineUpdate) {
    const current = this.machineById().get(update.id);
    // ignore unknown machine, no change, unknownstate
    if (!current || current.state === update.state || !Object.hasOwn(STATE_ICONS, update.state)) {
      return;
    }
    const change: StateChange = {
      id: update.id,
      type: current.type,
      name: current.name,
      from: current.state,
      to: update.state,
      timestamp: update.timestamp,
    };
    this.machines.update((machines) =>
      machines.map((m) =>
        m.id === update.id ? { ...m, state: update.state, since: update.timestamp } : m,
      ),
    );
    this.history.update((history) => [change, ...history].slice(0, HISTORY_LIMIT));
  }

  private toMachine(dto: MachineDto): Machine {
    return { ...dto, since: Date.now() - dto.secondsInState * 1000 };
  }

  private countState(state: Machine['state']): number {
    return this.machines().filter((m) => m.state === state).length;
  }
}
