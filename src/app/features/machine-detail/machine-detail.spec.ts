import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, Observable, Subject, of } from 'rxjs';
import { MachineApi } from '../../core/data/machine-api';
import { MachineSocket } from '../../core/data/machine-socket';
import { ConnectionStatus, MachineDto, MachineUpdate } from '../../core/models/machine.model';
import { MachineDetail } from './machine-detail';

const dtos: MachineDto[] = [
  { id: 'scale', type: 'scale', name: 'scale', state: 'running', secondsInState: 65 },
  { id: 'packer', type: 'packer', name: 'packer', state: 'alarm', secondsInState: 0 },
];

class FakeSocket extends MachineSocket {
  readonly updatesSubject = new Subject<MachineUpdate>();
  readonly connection$: Observable<ConnectionStatus> = NEVER;

  updates(): Observable<MachineUpdate> {
    return this.updatesSubject;
  }
}

describe('MachineDetail', () => {
  let socket: FakeSocket;

  function render(id: string) {
    const fixture = TestBed.createComponent(MachineDetail);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    socket = new FakeSocket();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: MachineApi, useValue: { getMachines: () => of(dtos) } },
        { provide: MachineSocket, useValue: socket },
      ],
    });
  });

  it('shows the machine, its state and the time in state', () => {
    const element: HTMLElement = render('scale').nativeElement;

    expect(element.querySelector('h1')?.textContent).toBe('types.scale');
    expect(element.textContent).toContain('scale');
    expect(element.querySelector('app-machine-tile.state-running')).not.toBeNull();
    expect(element.querySelector('.duration')?.textContent).toBe('01:05');
  });

  it('lists only the changes of this machine', () => {
    const fixture = render('scale');
    socket.updatesSubject.next({ id: 'scale', state: 'warning', timestamp: Date.now() });
    socket.updatesSubject.next({ id: 'packer', state: 'running', timestamp: Date.now() });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.history li')).toHaveLength(1);
  });

  it('shows a message for an unknown machine', () => {
    const element: HTMLElement = render('unknown').nativeElement;

    expect(element.querySelector('h1')?.textContent).toBe('detail.notFound');
    expect(element.querySelector('app-machine-tile')).toBeNull();
  });
});
