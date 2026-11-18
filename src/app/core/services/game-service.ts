import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SoundSettingOptions } from '@features/home/model/SoundSetting';
import { GameSettingOptions } from '@features/home/model/GameSetting';
import { ThemeTrack } from '@features/game/model/Track';
import { SettingsService } from './settings-service';
import { ThemeApi } from './theme-api';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private settingsService = inject(SettingsService);
  private themeApi = inject(ThemeApi);

  private gameTrackQueue: ThemeTrack[] = [];

  currentTrack = signal<ThemeTrack | null>(null);

  async setupGame() {
    const settings: {
      gameSettings: GameSettingOptions;
      soundSettings: SoundSettingOptions;
    } = this.settingsService.getAllSettingsSimplified();

    const tracks: ThemeTrack[] = await firstValueFrom(
      this.themeApi.getPlaylist(settings.gameSettings.themesDifficulty as Difficulty),
    );
    this.gameTrackQueue = this.shuffle(tracks).slice(
      0,
      Number(settings.gameSettings.themesPerDifficult),
    );
  }

  nextTrack() {
    if (this.gameTrackQueue.length === 0) {
      this.currentTrack.set(null);
      return;
    }

    const next = this.gameTrackQueue.shift()!;
    this.currentTrack.set(next);
  }

  async preloadNextVideoTrack(nextVideoPlayer: HTMLVideoElement) {
    const nextVideoTrack = this.gameTrackQueue[0];
    if (!nextVideoTrack) return;

    nextVideoPlayer.src = nextVideoTrack.videoUrl;
    nextVideoPlayer.preload = 'auto';
    nextVideoPlayer.load();

    return new Promise<void>((resolve) => {
      nextVideoPlayer.oncanplay = () => resolve();
      nextVideoPlayer.onerror = () => resolve(); // fallback
    });
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }
}
