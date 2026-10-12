import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineDto } from '../models/machine.model';

/** REST api, machines at startup as request to the backend */
@Service()
export class MachineApi {
  private readonly http = inject(HttpClient);

  getMachines(): Observable<MachineDto[]> {
    return this.http.get<MachineDto[]>('data.json');
  }
}
