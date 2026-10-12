import { Component, input, output } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { LANGUAGE_NAMES, Language } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-menu',
  imports: [MatMenu, MatMenuItem, MatMenuTrigger, TranslatePipe],
  styleUrl: './language-menu.scss',
  templateUrl: './language-menu.html',
})
export class LanguageMenu {
  readonly languages = input.required<readonly Language[]>();
  readonly current = input.required<Language>();
  readonly selected = output<Language>();

  protected readonly languageNames = LANGUAGE_NAMES;
}
