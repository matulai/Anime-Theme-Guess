import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SoundSettingOptions } from '@features/home/model/SoundSetting';
import { GameSettingOptions } from '@features/home/model/GameSetting';
import { ThemeTrack, Track } from '@features/game/model/Track';
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

    const tracks: Track[] = await firstValueFrom(
      this.themeApi.getPlaylist(settings.gameSettings.themesDifficulty as Difficulty),
    );
    this.gameTrackQueue = this.shuffle(tracks).map((track) => this.mapToGameTrack(track));
  }

  getNextTrack() {
    if (this.gameTrackQueue.length < 2) {
      return;
    }

    return this.gameTrackQueue[0];
  }

  nextTrack() {
    if (this.gameTrackQueue.length === 0) {
      this.currentTrack.set(null);
      return;
    }

    const next = this.gameTrackQueue.shift()!;
    this.currentTrack.set(next);
  }

  async preloadNextAudioTrack() {
    const nextAudioTrack = this.gameTrackQueue[0];

    if (!nextAudioTrack) return;

    const audio = document.createElement('audio');

    audio.src = nextAudioTrack.audioUrl;
    audio.preload = 'auto';

    // Ver que es esto
    return new Promise<void>((resolve) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => resolve(); // fallback
    });
  }

  async preloadNextVideoTrack() {
    const nextVideoTrack = this.gameTrackQueue[0];

    if (!nextVideoTrack) return;

    const video = document.createElement('video');

    video.src = nextVideoTrack.videoUrl;
    video.preload = 'auto';

    return new Promise<void>((resolve) => {
      video.oncanplaythrough = () => resolve();
      video.onerror = () => resolve(); // fallback
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

  private mapToGameTrack(track: Track): ThemeTrack {
    return {
      slug: track.animethemeentry.animetheme.slug,
      animeName: track.animethemeentry.animetheme.anime.name,
      image: track.animethemeentry.animetheme.anime.images[1].link,
      videoUrl: track.video.link,
      audioUrl: track.video.audio.link,
    };
  }
}
