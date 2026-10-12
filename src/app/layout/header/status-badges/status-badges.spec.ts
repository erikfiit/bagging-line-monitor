import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { StatusBadges } from './status-badges';

function render(alarms: number, warnings: number): HTMLElement {
  const fixture = TestBed.createComponent(StatusBadges);
  fixture.componentRef.setInput('alarms', alarms);
  fixture.componentRef.setInput('warnings', warnings);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('StatusBadges', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
  });

  it('shows no badge when the counts are zero', () => {
    expect(render(0, 0).querySelectorAll('.badge')).toHaveLength(0);
  });

  it('shows a badge with the count for each state above zero', () => {
    const element = render(2, 1);

    expect(element.querySelector('.state-alarm')?.textContent).toContain('2');
    expect(element.querySelector('.state-warning')?.textContent).toContain('1');
  });

  it('shows only the badge that has a count', () => {
    const element = render(0, 3);

    expect(element.querySelector('.state-alarm')).toBeNull();
    expect(element.querySelector('.state-warning')).not.toBeNull();
  });
});
