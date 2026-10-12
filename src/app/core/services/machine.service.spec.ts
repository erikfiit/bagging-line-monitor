import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { MachineApi } from '../data/machine-api';
import { MachineSocket } from '../data/machine-socket';
import { ConnectionStatus, MachineDto, MachineState, MachineUpdate } from '../models/machine.model';
import { MachineService } from './machine.service';

const dtos: MachineDto[] = [
  { id: 'scale', type: 'scale', name: 'scale', state: 'running', secondsInState: 10 },
  { id: 'packer', type: 'packer', name: 'packer', state: 'alarm', secondsInState: 0 },
  { id: 'closer', type: 'closer', name: 'closer', state: 'warning', secondsInState: 0 },
];

class FakeApi {
  result: Observable<MachineDto[]> = of(dtos);

  getMachines(): Observable<MachineDto[]> {
    return this.result;
  }
}

class FakeSocket extends MachineSocket {
  readonly updatesSubject = new Subject<MachineUpdate>();
  readonly connectionSubject = new BehaviorSubject<ConnectionStatus>('connecting');

  readonly connection$ = this.connectionSubject.asObservable();

  updates(): Observable<MachineUpdate> {
    return this.updatesSubject;
  }
}

describe('MachineService', () => {
  let api: FakeApi;
  let socket: FakeSocket;

  function createService(): MachineService {
    TestBed.configureTestingModule({
      providers: [
        { provide: MachineApi, useValue: api },
        { provide: MachineSocket, useValue: socket },
      ],
    });
    return TestBed.inject(MachineService);
  }

  beforeEach(() => {
    api = new FakeApi();
    socket = new FakeSocket();
    vi.useFakeTimers();
    vi.setSystemTime(100_000);
  });

  afterEach(() => vi.useRealTimers());

  it('loads the machines and computes since from the time in state', () => {
    const service = createService();

    expect(service.status()).toBe('ready');
    expect(service.machines().map((m) => m.id)).toEqual(['scale', 'packer', 'closer']);
    expect(service.machines()[0].since).toBe(90_000);
  });

  it('counts alarms and warnings', () => {
    const service = createService();

    expect(service.alarmCount()).toBe(1);
    expect(service.warningCount()).toBe(1);

    socket.updatesSubject.next({ id: 'scale', state: 'alarm', timestamp: 101_000 });

    expect(service.alarmCount()).toBe(2);
  });

  it('applies an update immutably and records the change', () => {
    const service = createService();
    const before = service.machines();

    socket.updatesSubject.next({ id: 'scale', state: 'alarm', timestamp: 101_000 });

    expect(before[0].state).toBe('running');
    expect(service.machines()).not.toBe(before);
    expect(service.machineById().get('scale')).toEqual(
      expect.objectContaining({ state: 'alarm', since: 101_000 }),
    );
    expect(service.lastChange()).toEqual({
      id: 'scale',
      type: 'scale',
      name: 'scale',
      from: 'running',
      to: 'alarm',
      timestamp: 101_000,
    });
    expect(service.history()).toHaveLength(1);
  });

  it('ignores updates with the same state, an unknown machine or an unknown state', () => {
    const service = createService();
    const before = service.machines();

    socket.updatesSubject.next({ id: 'scale', state: 'running', timestamp: 101_000 });
    socket.updatesSubject.next({ id: 'unknown', state: 'alarm', timestamp: 101_000 });
    socket.updatesSubject.next({
      id: 'scale',
      state: 'broken' as MachineState,
      timestamp: 101_000,
    });

    expect(service.machines()).toBe(before);
    expect(service.history()).toEqual([]);
  });

  it('keeps at most 50 history entries, newest first', () => {
    const service = createService();

    for (let i = 0; i < 60; i++) {
      socket.updatesSubject.next({
        id: 'scale',
        state: i % 2 === 0 ? 'alarm' : 'running',
        timestamp: 101_000 + i,
      });
    }

    expect(service.history()).toHaveLength(50);
    expect(service.history()[0].timestamp).toBe(101_059);
  });

  it('reports an error when the answer is not a list', () => {
    api.result = of({} as unknown as MachineDto[]);

    expect(createService().status()).toBe('error');
  });

  it('reports an error and recovers when it is loaded again', () => {
    api.result = throwError(() => new Error('offline'));
    const service = createService();

    expect(service.status()).toBe('error');

    api.result = of(dtos);
    service.load();

    expect(service.status()).toBe('ready');
    expect(service.machines()).toHaveLength(3);
  });

  it('exposes the connection status of the socket', () => {
    const service = createService();

    socket.connectionSubject.next('reconnecting');

    expect(service.connection()).toBe('reconnecting');
  });
});
