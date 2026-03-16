import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  state = signal<'hidden' | 'loading' | 'ready'>('hidden');
  onPressAction: () => void = () => {};

  showLoading() {
    this.state.set('loading');
  }

  showPressStart(onPressAction: () => void = () => {}) {
    this.onPressAction = onPressAction;
    this.state.set('ready');
  }

  hide() {
    this.state.set('hidden');
  }
}
