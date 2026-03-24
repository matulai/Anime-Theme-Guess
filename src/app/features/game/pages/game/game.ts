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
import { Router } from '@angular/router';
import { Button } from '@shared/components/button/button';
import { GameService } from '@core/services/game-service';
import { ProgressBar } from '@features/game/components/progress-bar/progress-bar';
import { ScreenTimer } from '@features/game/components/screen-timer/screen-timer';
import { LoadingService } from '@core/services/loading-service';
import { SettingsService } from '@core/services/settings-service';
import { GameSettingOptions } from '@features/home/model/GameSetting';
import { SoundSettingOptions } from '@features/home/model/SoundSetting';

@Component({
  selector: 'app-game',
  imports: [ScreenTimer, Button, ProgressBar],
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

  willBePlayedVideo1 = signal(true);
  isVideoVisible = signal(false);

  isLoadingNextTrack = signal(false);
  onEndenLoadingNextTrack = signal(() => {});

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

    this.onEndenLoadingNextTrack.set(() => this.playNextTrack(audioPlayer1));

    this.loadingService.showPressStart(() => this.startGame());
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  startGame() {
    this.isLoadingNextTrack.set(true);
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
    this.currentTracks.update((v) => ++v);
    this.willBePlayedVideo1.update((v) => !v);

    audioPlayer.muted = true;
    await audioPlayer.play();
    audioPlayer.pause;
    audioPlayer.currentTime = 0;
    this.onEndenLoadingNextTrack.set(() => this.playNextTrack(audioPlayer));
    this.isLoadingNextTrack.set(true);

    actualVideoPlayer.pause();
    actualVideoPlayer.removeAttribute('src');
    actualVideoPlayer.load();

    await this.gameService.preloadNextVideoTrack(nextVideoPlayer);
    this.gameService.nextTrack();
  }

  onTimerEnd() {
    this.timerRunning.set(false);
  }

  playNextTrack(audioPlayer: HTMLAudioElement) {
    console.log('called');
    this.isLoadingNextTrack.set(false);
    audioPlayer.muted = false;
    audioPlayer.play();
    this.timerRunning.set(true);
  }

  ngOnDestroy() {
    this.loadingService.hide();
  }
}
