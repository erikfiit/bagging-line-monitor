import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MachineService } from './core/services/machine.service';
import { Header } from './layout/header/header';
import { MachineNav } from './layout/machine-nav/machine-nav';

@Component({
  imports: [RouterOutlet, TranslatePipe, Header, MachineNav],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly machineService = inject(MachineService);
}
