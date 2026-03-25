import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Signal,
  signal,
  viewChild,
  WritableSignal,
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

  videoPlayer1 = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer1');
  videoPlayer2 = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer2');

  settings: {
    gameSettings: GameSettingOptions;
    soundSettings: SoundSettingOptions;
  };

  willBePlayedVideo1 = signal(true);
  isVideoVisible = signal(false);

  isLoadingNextTrack = signal(false);
  onLoadingNextTrackEnded = () => {};

  timerSeconds!: Signal<number>;
  timerRunning = signal(false);
  onGuessTimeEnded = () => {};

  actualVideoPlayer!: WritableSignal<HTMLVideoElement>;
  nextVideoPlayer!: WritableSignal<HTMLVideoElement>;

  currentTracks = signal(1);

  constructor() {
    this.settings = this.settingsService.getAllSettingsSimplified();
    // console.log(Number(this.settings.gameSettings.timeDifficulty));
    this.timerSeconds = signal(10);
  }

  async ngAfterViewInit() {
    this.loadingService.showLoading();

    await this.gameService.setupGame();

    const videoPlayer1 = this.videoPlayer1().nativeElement;
    const videoPlayer2 = this.videoPlayer2().nativeElement;

    await this.gameService.preloadNextVideoTrack(videoPlayer1);

    this.gameService.nextTrack();

    this.actualVideoPlayer = signal(videoPlayer1);
    this.nextVideoPlayer = signal(videoPlayer2);

    videoPlayer1.onended = () => this.onNextOrEndedVideo();
    videoPlayer2.onended = () => this.onNextOrEndedVideo();

    this.onLoadingNextTrackEnded = () => this.playNextTrack(videoPlayer1, videoPlayer2);
    this.onGuessTimeEnded = () => this.onShowCurrentVideo(videoPlayer1, videoPlayer2);

    this.loadingService.showPressStart(() => this.startGame());
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  startGame() {
    this.isLoadingNextTrack.set(true);
  }

  onNextOrEndedVideo(): void {
    this.isVideoVisible.set(false);
    this.willBePlayedVideo1.update((v) => !v);
    this.currentTracks.update((v) => v + 1);

    this.actualVideoPlayer().pause();
    this.actualVideoPlayer().removeAttribute('src');
    this.actualVideoPlayer().load();

    // seteo el tiempo de donde empezara
    this.nextVideoPlayer().muted = true;
    this.nextVideoPlayer().currentTime = 0;
    this.nextVideoPlayer().pause();

    this.gameService.nextTrack();

    if (this.gameService.currentTrack() === null) {
      this.navigateTo('/end-game');
    }

    this.isLoadingNextTrack.set(true);
  }

  // Luego de terminar el tiempo para adivinar
  onShowCurrentVideo(currentVideoPlayer: HTMLVideoElement, nextVideoPlayer: HTMLVideoElement) {
    this.isVideoVisible.set(true);
    this.timerRunning.set(false);

    // se supone que evita que use mucha memoria borrando del cache el anterior video.
    nextVideoPlayer.src = '';

    this.gameService.preloadNextVideoTrack(nextVideoPlayer);

    this.onGuessTimeEnded = () => this.onShowCurrentVideo(nextVideoPlayer, currentVideoPlayer);
  }

  // Luego de terminar el tiempo de inicio del track
  playNextTrack(currentVideoPlayer: HTMLVideoElement, nextVideoPlayer: HTMLVideoElement) {
    this.isLoadingNextTrack.set(false);

    currentVideoPlayer.muted = false;
    currentVideoPlayer.play();

    this.timerRunning.set(true);

    // No es buena practica pero estoy quemado.
    this.onLoadingNextTrackEnded = () => this.playNextTrack(nextVideoPlayer, currentVideoPlayer);
    this.nextVideoPlayer.set(nextVideoPlayer);
    this.actualVideoPlayer.set(currentVideoPlayer);
  }

  ngOnDestroy() {
    this.loadingService.hide();
  }
}
