import { Description } from './Description';

export interface SoundSetting {
  settingTitle: string;
  volume: number;
  description: Description[];
}

export type SoundSettingsMap = Record<string, number>;
