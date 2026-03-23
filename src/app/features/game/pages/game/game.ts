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

  audioPlayer1 = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer1');
  audioPlayer2 = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer2');

  videoPlayer1 = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer1');
  videoPlayer2 = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer2');

  settings: {
    gameSettings: GameSettingOptions;
    soundSettings: SoundSettingOptions;
  };

  isLoadingNextTrack = signal(true);
  isVideoVisible = signal(false);

  timerSeconds!: Signal<number>;
  timerRunning = signal(false);

  currentTracks = signal(1);

  constructor() {
    this.settings = this.settingsService.getAllSettingsSimplified();
    // console.log(Number(this.settings.gameSettings.timeDifficulty));
    this.timerSeconds = signal(10);
  }

  async ngAfterViewInit() {
    this.loadingService.showLoading();

    await this.gameService.setupGame();

    const audioPlayer1 = this.audioPlayer1().nativeElement;
    const audioPlayer2 = this.audioPlayer2().nativeElement;

    const videoPlayer1 = this.videoPlayer1().nativeElement;
    const videoPlayer2 = this.videoPlayer2().nativeElement;

    await this.gameService.preloadNextAudioTrack(audioPlayer1);
    await this.gameService.preloadNextVideoTrack(videoPlayer1);

    this.gameService.nextTrack();

    audioPlayer1.onended = () => this.onAudioEnded(videoPlayer1, audioPlayer1, audioPlayer2);
    videoPlayer1.onended = () => this.onVideoEnded(audioPlayer2, videoPlayer1, videoPlayer2);
    audioPlayer2.onended = () => this.onAudioEnded(videoPlayer2, audioPlayer2, audioPlayer1);
    videoPlayer2.onended = () => this.onVideoEnded(audioPlayer1, videoPlayer2, videoPlayer1);

    this.loadingService.showPressStart(() => this.startGame());
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async startGame(): Promise<void> {
    await this.audioPlayer1().nativeElement.play();
    this.timerRunning.set(true);
  }

  async onAudioEnded(
    videoPlayer: HTMLVideoElement,
    actualAudioPlayer: HTMLAudioElement,
    nextAudioPlayer: HTMLAudioElement,
  ): Promise<void> {
    await videoPlayer.play();
    this.isVideoVisible.set(true);

    actualAudioPlayer.pause();
    actualAudioPlayer.removeAttribute('src');
    actualAudioPlayer.load();

    await this.gameService.preloadNextAudioTrack(nextAudioPlayer);
  }

  async onVideoEnded(
    audioPlayer: HTMLAudioElement,
    actualVideoPlayer: HTMLVideoElement,
    nextVideoPlayer: HTMLVideoElement,
  ): Promise<void> {
    this.isVideoVisible.set(false);
    await audioPlayer.play();
    this.timerRunning.set(true);
    this.currentTracks.update((v) => ++v);

    actualVideoPlayer.pause();
    actualVideoPlayer.removeAttribute('src');
    actualVideoPlayer.load();

    await this.gameService.preloadNextVideoTrack(nextVideoPlayer);
    this.gameService.nextTrack();
  }

  onTimerEnd() {
    this.timerRunning.set(false);
  }

  ngOnDestroy() {
    this.loadingService.hide();
  }
}
