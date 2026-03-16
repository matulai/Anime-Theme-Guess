import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { GameService } from '@core/services/game-service';
import { LoadingService } from '@core/services/loading-service';
import { SettingsService } from '@core/services/settings-service';
import { GameSettingsMap } from '@features/home/model/GameSetting';
import { SoundSettingsMap } from '@features/home/model/SoundSetting';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit, OnDestroy, AfterViewInit {
  settingsService = inject(SettingsService);
  loadingService = inject(LoadingService);
  gameService = inject(GameService);

  audioPlayer = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');
  videoPlayer = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');
  settings: {
    gameSettings: GameSettingsMap;
    soundSettings: SoundSettingsMap;
  };

  isVideoVisible = signal(false);

  constructor() {
    this.settings = this.settingsService.getAllSettingsSimplified();
  }

  async ngOnInit() {
    this.loadingService.showLoading();

    await this.gameService.setupGame();

    this.loadingService.showPressStart(() => this.startGame());
  }

  ngOnDestroy() {
    const audio = this.audioPlayer()?.nativeElement;
    const video = this.videoPlayer()?.nativeElement;

    audio?.removeEventListener('ended', this.onAudioEnded);
    video?.removeEventListener('ended', this.onVideoEnded);

    this.loadingService.hide();
  }

  startGame(): void {
    this.playTrack();
  }

  ngAfterViewInit() {
    const audio = this.audioPlayer().nativeElement;
    const video = this.videoPlayer().nativeElement;

    audio.addEventListener('ended', this.onAudioEnded);
    video.addEventListener('ended', this.onVideoEnded);
  }

  playTrack() {
    const audio = this.audioPlayer().nativeElement;
    const video = this.videoPlayer().nativeElement;

    const track = this.gameService.currentTrack();
    if (!track) return;

    audio.src = track.audioUrl;
    video.src = track.videoUrl;

    audio.load();
    video.load();

    audio.play();
  }

  onAudioEnded = () => {
    this.isVideoVisible.set(true);
    this.videoPlayer().nativeElement.play();
    this.gameService.preloadNextAudioTrack();
  };

  onVideoEnded = () => {
    this.isVideoVisible.set(false);
    const audio = this.audioPlayer().nativeElement;
    const video = this.videoPlayer().nativeElement;

    this.gameService.preloadNextVideoTrack();

    this.gameService.nextTrack();

    const track = this.gameService.currentTrack();
    if (!track) return;

    audio.src = track.audioUrl;
    video.src = track.videoUrl;

    audio.load();
    video.load();

    audio.play();
  };
}
