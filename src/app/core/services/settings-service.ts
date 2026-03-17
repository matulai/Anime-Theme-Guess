import { Injectable, signal, effect } from '@angular/core';
import { DEFAULT_GAME_SETTINGS, DEFAULT_SOUND_SETTINGS } from '@core/constants/default-settings';
import { SoundSettingOptions } from '@features/home/model/SoundSetting';
import { GameSettingOptions } from '@features/home/model/GameSetting';

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

  getAllSettingsSimplified(): {
    gameSettings: GameSettingOptions;
    soundSettings: SoundSettingOptions;
  } {
    const simplifiedGameSettings = {
      gameMode: this.gameSettings().find((s) => s.settingTitle === 'Game mode')!.selectedOption,
      typingGraceTime: this.gameSettings().find((s) => s.settingTitle === 'Typing grace time')!
        .selectedOption,
      timeDifficulty: this.gameSettings().find((s) => s.settingTitle === 'Time difficulty')!
        .selectedOption,
      themesDifficulty: this.gameSettings().find((s) => s.settingTitle === 'Themes difficulty')!
        .selectedOption,
      themesPerDifficult: this.gameSettings().find(
        (s) => s.settingTitle === 'Themes per difficulty',
      )!.selectedOption,
      mediaReveal: this.gameSettings().find((s) => s.settingTitle === 'Media reveal')!
        .selectedOption,
    };

    const simplifiedSoundSettings = {
      themeVolume: this.soundSettings().find((s) => s.settingTitle === 'Theme volume')!.volume,
    };

    const simplifiedSettings = {
      gameSettings: simplifiedGameSettings,
      soundSettings: simplifiedSoundSettings,
    };

    return simplifiedSettings;
  }
}
