import { Description } from './Description';

export interface GameSetting {
  settingTitle: string;
  selectedOption: string;
  options: string[];
  description: Description[];
}

export type GameSettingsMap = Record<string, string>;
