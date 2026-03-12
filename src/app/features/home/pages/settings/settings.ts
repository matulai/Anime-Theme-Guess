import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Button } from '@shared/components/button/button';
import { ButtonOptions } from '@shared/components/button-options/button-options';
import { InputVolume } from '@features/home/components/input-volume/input-volume';

import { SettingsService } from '@core/services/settings-service';
import { GameSetting } from '@features/home/model/GameSetting';
import { SoundSetting } from '@features/home/model/SoundSetting';

@Component({
  selector: 'app-settings',
  imports: [Button, ButtonOptions, InputVolume],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private router = inject(Router);
  settingsService: SettingsService = inject(SettingsService);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  handleGameSettingOptionClick(groupIndex: number, settingIndex: number, option: string) {
    this.settingsService.gameSettings.update((settings) => {
      const newSettings = settings.map((group) => [...group]);

      newSettings[groupIndex][settingIndex] = {
        ...newSettings[groupIndex][settingIndex],
        selectedOption: option,
      };

      return newSettings;
    });
  }

  handleSoundSettingOptionClick(groupIndex: number, settingIndex: number, volume: number) {
    this.settingsService.soundSettings.update((settings) => {
      const newSettings = settings.map((group) => [...group]);

      newSettings[groupIndex][settingIndex] = {
        ...newSettings[groupIndex][settingIndex],
        volume: volume,
      };

      return newSettings;
    });
  }
}
