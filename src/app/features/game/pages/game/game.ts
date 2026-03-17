import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { Button } from '@shared/components/button/button';
import { GameService } from '@core/services/game-service';
import { ScreenTimer } from '@features/game/components/screen-timer/screen-timer';
import { LoadingService } from '@core/services/loading-service';
import { SettingsService } from '@core/services/settings-service';
import { GameSettingOptions } from '@features/home/model/GameSetting';
import { SoundSettingOptions } from '@features/home/model/SoundSetting';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [ScreenTimer, Button],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnDestroy, AfterViewInit {
  settingsService = inject(SettingsService);
  loadingService = inject(LoadingService);
  gameService = inject(GameService);
  private router = inject(Router);

  audioPlayer = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');
  videoPlayer = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');
  settings: {
    gameSettings: GameSettingOptions;
    soundSettings: SoundSettingOptions;
  };

  isLoadingNextTrack = signal(true);
  isAudioPlaying = signal(false);
  isVideoVisible = signal(false);

  timerSeconds!: Signal<number>;
  timerRunning = signal(false);

  currentTracks = signal(1);

  constructor() {
    this.settings = this.settingsService.getAllSettingsSimplified();
    // console.log(Number(this.settings.gameSettings.timeDifficulty));
    this.timerSeconds = signal(10);
  }

  ngOnDestroy() {
    const audio = this.audioPlayer()?.nativeElement;
    const video = this.videoPlayer()?.nativeElement;

    audio?.removeEventListener('ended', this.onAudioEnded);
    video?.removeEventListener('ended', this.onVideoEnded);

    this.loadingService.hide();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  startGame(): void {
    this.audioPlayer().nativeElement.play();
    this.timerRunning.set(true);
  }

  async ngAfterViewInit() {
    this.loadingService.showLoading();

    await this.gameService.setupGame();

    await this.gameService.preloadNextAudioTrack();
    await this.gameService.preloadNextVideoTrack();

    this.gameService.nextTrack();

    const audio = this.audioPlayer().nativeElement;
    const video = this.videoPlayer().nativeElement;

    audio.addEventListener('ended', this.onAudioEnded);
    video.addEventListener('ended', this.onVideoEnded);

    const track = this.gameService.currentTrack();
    if (!track) return;

    audio.src = track.audioUrl;
    video.src = track.videoUrl;

    audio.load();
    video.load();

    this.loadingService.showPressStart(() => this.startGame());
  }

  onAudioEnded = () => {
    this.isVideoVisible.set(true);
    this.videoPlayer().nativeElement.play();

    const audio = this.audioPlayer().nativeElement;

    this.gameService.preloadNextAudioTrack();

    const nextTrack = this.gameService.getNextTrack();

    if (!nextTrack) return;

    audio.src = nextTrack.audioUrl;

    audio.load();
  };

  onVideoEnded = () => {
    this.isVideoVisible.set(false);
    this.audioPlayer().nativeElement.play();
    this.timerRunning.set(true);

    const video = this.videoPlayer().nativeElement;

    this.gameService.preloadNextVideoTrack();

    this.gameService.nextTrack();

    const nextTrack = this.gameService.currentTrack();
    if (!nextTrack) return;

    video.src = nextTrack.videoUrl;

    video.load();

    this.currentTracks.update((v) => ++v);
  };

  onTimerEnd() {
    this.timerRunning.set(false);
  }
}
