import { Service, computed, signal } from '@angular/core';

/** fake auth alwayslogged in with a demo token */
@Service()
export class AuthService {
  readonly token = signal<string | null>('demo-token');
  readonly isLoggedIn = computed(() => this.token() !== null);
  readonly userName = signal('Operator');
}
