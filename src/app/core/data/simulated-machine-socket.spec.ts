import { Subscription } from 'rxjs';
import { ConnectionStatus, Machine, MachineUpdate } from '../models/machine.model';
import { SimulatedMachineSocket } from './simulated-machine-socket';

const machines: Machine[] = [
  { id: 'scale', type: 'scale', name: 'Scale', state: 'running', since: 0 },
  { id: 'packer', type: 'packer', name: 'Packer', state: 'alarm', since: 0 },
];

describe('SimulatedMachineSocket', () => {
  let socket: SimulatedMachineSocket;
  let updates: MachineUpdate[];
  let statuses: ConnectionStatus[];
  let subscription: Subscription;

  beforeEach(() => {
    vi.useFakeTimers();
    socket = new SimulatedMachineSocket();
    socket.changeEveryMs = 1000;
    socket.dropEveryMs = 10_000;
    socket.reconnectMs = 2000;
    updates = [];
    statuses = [];
    socket.connection$.subscribe((status) => statuses.push(status));
    subscription = socket.updates(machines).subscribe((update) => updates.push(update));
  });

  afterEach(() => {
    subscription.unsubscribe();
    vi.useRealTimers();
  });

  it('emits nothing until the first interval has passed', () => {
    expect(updates).toEqual([]);
  });

  it('emits one change per interval for a known machine', () => {
    vi.advanceTimersByTime(3000);

    expect(updates).toHaveLength(3);
    for (const update of updates) {
      expect(machines.map((m) => m.id)).toContain(update.id);
    }
  });

  it('always changes the machine to a different state', () => {
    const current = new Map(machines.map((m) => [m.id, m.state]));

    vi.advanceTimersByTime(20_000);

    for (const update of updates) {
      expect(update.state).not.toBe(current.get(update.id));
      current.set(update.id, update.state);
    }
  });

  it('is connecting until started, then connected', () => {
    expect(statuses).toEqual(['connecting', 'connected']);
  });

  it('drops the connection and recovers', () => {
    vi.advanceTimersByTime(10_000);
    expect(statuses.at(-1)).toBe('reconnecting');

    vi.advanceTimersByTime(2000);
    expect(statuses.at(-1)).toBe('connected');
  });

  it('sends no changes while reconnecting', () => {
    vi.advanceTimersByTime(10_000);
    updates.length = 0;

    vi.advanceTimersByTime(1500);

    expect(updates).toEqual([]);
  });
});
