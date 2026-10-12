import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ClockService } from '../../core/services/clock.service';
import { LanguageService } from '../../core/services/language.service';
import { MachineService } from '../../core/services/machine.service';
import { ConnectionStatus } from './connection-status/connection-status';
import { LanguageMenu } from './language-menu/language-menu';
import { StatusBadges } from './status-badges/status-badges';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    DatePipe,
    NgOptimizedImage,
    TranslatePipe,
    StatusBadges,
    ConnectionStatus,
    LanguageMenu,
  ],
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly machineService = inject(MachineService);
  protected readonly languageService = inject(LanguageService);
  protected readonly now = inject(ClockService).now;
  protected readonly userName = inject(AuthService).userName;
}
