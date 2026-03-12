import { Injectable, signal, effect } from '@angular/core';
import { DEFAULT_GAME_SETTINGS, DEFAULT_SOUND_SETTINGS } from '@core/constants/default-settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  gameSettings = signal(this.load('GAME_SETTINGS', DEFAULT_GAME_SETTINGS));
  soundSettings = signal(this.load('SOUND_SETTINGS', DEFAULT_SOUND_SETTINGS));

  constructor() {
    effect(() => {
      localStorage.setItem('GAME_SETTINGS', JSON.stringify(this.gameSettings()));
    });

    effect(() => {
      localStorage.setItem('SOUND_SETTINGS', JSON.stringify(this.soundSettings()));
    });
  }

  private load<T>(key: string, defaultValue: T): T {
    const value = localStorage.getItem(key);

    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
}
