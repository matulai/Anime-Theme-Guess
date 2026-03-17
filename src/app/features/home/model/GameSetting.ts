import { Description } from './Description';

export interface GameSetting {
  settingTitle: string;
  selectedOption: string;
  options: string[];
  description: Description[];
}

export interface GameSettingOptions {
  gameMode: string;
  typingGraceTime: string;
  timeDifficulty: string;
  themesDifficulty: string;
  themesPerDifficult: string;
  mediaReveal: string;
}
