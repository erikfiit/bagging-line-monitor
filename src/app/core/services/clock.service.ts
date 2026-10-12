import { Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Service()
export class ClockService {
  readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() });
}
