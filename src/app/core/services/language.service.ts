import { DOCUMENT } from '@angular/common';
import { Service, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export const LANGUAGES = ['en', 'cs'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', cs: 'Čeština' };

const STORAGE_KEY = 'language';

@Service()
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  readonly current = signal<Language>(this.readStoredLanguage());

  init(): Promise<unknown> {
    return this.use(this.current());
  }

  async set(language: Language): Promise<void> {
    this.current.set(language);
    this.storeLanguage(language);
    await this.use(language);
  }

  private async use(language: Language): Promise<unknown> {
    this.document.documentElement.lang = language;
    try {
      return await firstValueFrom(this.translate.use(language));
    } catch {
      return undefined;
    }
  }

  // default english
  private readStoredLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return LANGUAGES.find((language) => language === stored) ?? 'en';
    } catch {
      return 'en';
    }
  }

  private storeLanguage(language: Language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      //
    }
  }
}
