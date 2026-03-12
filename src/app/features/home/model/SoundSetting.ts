export interface SoundSetting {
  settingTitle: string;
  volume: number;
  description: Description[];
}

interface Description {
  type: string;
  content: { text: string; bold?: boolean }[];
}
