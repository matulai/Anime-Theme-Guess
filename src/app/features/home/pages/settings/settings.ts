import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Button } from '@shared/components/button/button';
import { ButtonOptions } from '@shared/components/button-options/button-options';
import { InputVolume } from '@features/home/components/input-volume/input-volume';
import { Tooltip } from '@features/home/components/tooltip/tooltip';

import { SettingsService } from '@core/services/settings-service';

@Component({
  selector: 'app-settings',
  imports: [Button, ButtonOptions, InputVolume, Tooltip],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private router = inject(Router);
  settingsService: SettingsService = inject(SettingsService);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  handleGameSettingOptionClick(settingIndex: number, option: string) {
    this.settingsService.gameSettings.update((settings) =>
      settings.map((setting, index) =>
        index === settingIndex ? { ...setting, selectedOption: option } : setting,
      ),
    );
  }

  handleSoundSettingOptionClick(settingIndex: number, volume: number) {
    this.settingsService.soundSettings.update((settings) =>
      settings.map((setting, index) =>
        index === settingIndex ? { ...setting, volume: volume } : setting,
      ),
    );
  }
}
