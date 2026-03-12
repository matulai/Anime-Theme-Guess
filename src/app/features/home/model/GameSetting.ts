export interface GameSetting {
  settingTitle: string;
  selectedOption: string;
  options: string[];
  description: Description[];
}

interface Description {
  type: string;
  content: { text: string; bold?: boolean }[];
}
