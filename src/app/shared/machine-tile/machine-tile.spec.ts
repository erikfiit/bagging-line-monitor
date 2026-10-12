import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import {
  DEFAULT_TYPE_ICON,
  Machine,
  MachineState,
  STATE_ICONS,
} from '../../core/models/machine.model';
import { MachineTile } from './machine-tile';

const states: MachineState[] = ['running', 'alarm', 'warning'];

function render(state: MachineState, variant: 'nav' | 'overview'): HTMLElement {
  const machine: Machine = {
    id: 'packer',
    type: 'packer',
    name: 'packer',
    state,
    since: 0,
  };
  const fixture = TestBed.createComponent(MachineTile);
  fixture.componentRef.setInput('machine', machine);
  fixture.componentRef.setInput('variant', variant);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('MachineTile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
  });

  it.each(states)('shows the icon, label and class for the %s state', (state) => {
    const tile = render(state, 'overview');

    expect(tile.classList).toContain(`state-${state}`);
    expect(tile.querySelector('.state-icon')?.textContent?.trim()).toBe(STATE_ICONS[state]);
    expect(tile.querySelector('.sr-only')?.textContent).toContain(`states.${state}`);
    expect(tile.querySelector('.label')?.textContent).toBe('types.packer');
    expect(tile.querySelector('.label')?.getAttribute('title')).toBe('packer');
  });

  it('shows the big machine icon only in the overview variant', () => {
    expect(render('running', 'overview').querySelector('.machine-icon')).not.toBeNull();
    expect(render('running', 'nav').querySelector('.machine-icon')).toBeNull();
  });

  it('uses the default icon for a machine type it does not know', () => {
    const fixture = TestBed.createComponent(MachineTile);
    const machine: Machine = {
      id: 'x',
      type: 'labeler',
      name: 'LB-01',
      state: 'running',
      since: 0,
    };
    fixture.componentRef.setInput('machine', machine);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.machine-icon').textContent.trim();
    expect(icon).toBe(DEFAULT_TYPE_ICON);
  });

  it('sets the variant class', () => {
    expect(render('alarm', 'nav').classList).toContain('variant-nav');
    expect(render('alarm', 'overview').classList).toContain('variant-overview');
  });
});
