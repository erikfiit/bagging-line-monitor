import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, Observable, of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { MachineApi } from './core/data/machine-api';
import { MachineSocket } from './core/data/machine-socket';
import { ConnectionStatus, MachineDto, MachineUpdate } from './core/models/machine.model';

const dtos: MachineDto[] = [
  { id: 'scale', type: 'scale', name: 'scale', state: 'running', secondsInState: 0 },
  {
    id: 'attacher',
    type: 'attacher',
    name: 'attacher',
    state: 'alarm',
    secondsInState: 0,
  },
  { id: 'packer', type: 'packer', name: 'packer', state: 'running', secondsInState: 0 },
  { id: 'closer', type: 'closer', name: 'closer', state: 'warning', secondsInState: 0 },
];

class FakeSocket extends MachineSocket {
  readonly connection$: Observable<ConnectionStatus> = of('connected');

  updates(): Observable<MachineUpdate> {
    return NEVER;
  }
}

describe('App', () => {
  let root: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideTranslateService(),
        { provide: MachineApi, useValue: { getMachines: () => of(dtos) } },
        { provide: MachineSocket, useClass: FakeSocket },
      ],
    });
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    root = fixture.nativeElement;
  });

  it('renders one nav link per machine', () => {
    expect(root.querySelectorAll('nav a')).toHaveLength(4);
  });

  it('renders one overview tile per machine', () => {
    expect(root.querySelectorAll('app-overview app-machine-tile')).toHaveLength(4);
  });
});
