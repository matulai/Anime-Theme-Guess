import { Description } from './Description';

export interface SoundSetting {
  settingTitle: string;
  volume: number;
  description: Description[];
}

export interface SoundSettingOptions {
  themeVolume: number;
}
