import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  state = signal<'hidden' | 'loading' | 'ready'>('hidden');

  showLoading() {
    this.state.set('loading');
  }

  showPressStart() {
    this.state.set('ready');
  }

  hide() {
    this.state.set('hidden');
  }
}
