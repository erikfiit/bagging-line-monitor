import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Language } from '../../../core/services/language.service';
import { LanguageMenu } from './language-menu';

describe('LanguageMenu', () => {
  async function openMenu() {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(LanguageMenu);
    fixture.componentRef.setInput('languages', ['en', 'cs']);
    fixture.componentRef.setInput('current', 'en');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    const items: HTMLButtonElement[] = Array.from(
      document.querySelectorAll('[role="menuitemradio"]'),
    );
    return { fixture, items };
  }

  it('shows the code of the current language on the button', async () => {
    const { fixture } = await openMenu();

    expect(fixture.nativeElement.querySelector('.code').textContent).toBe('EN');
  });

  it('lists the languages and marks the current one', async () => {
    const { items } = await openMenu();

    expect(items.map((item) => item.textContent?.replace('check', '').trim())).toEqual([
      'English',
      'Čeština',
    ]);
    expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual(['true', 'false']);
  });

  it('emits the chosen language', async () => {
    const { fixture, items } = await openMenu();
    const chosen: Language[] = [];
    fixture.componentInstance.selected.subscribe((language) => chosen.push(language));

    items[1].click();

    expect(chosen).toEqual(['cs']);
  });
});
