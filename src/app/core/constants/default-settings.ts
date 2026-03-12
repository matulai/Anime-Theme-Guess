import { GameSetting } from '@features/home/model/GameSetting';
import { SoundSetting } from '@features/home/model/SoundSetting';

export const DEFAULT_GAME_SETTINGS: GameSetting[][] = [
  [
    {
      settingTitle: 'Game mode',
      selectedOption: 'Auto skip',
      options: ['Auto skip', 'Typing'],
    },
  ],
  [
    {
      settingTitle: 'Typing grace time',
      selectedOption: '0',
      options: ['0', '3', '5', '7'],
    },
  ],
  [
    {
      settingTitle: 'Time difficulty',
      selectedOption: 'Easy',
      options: ['Easy', 'Medium', 'Hard', 'Extreme'],
    },
  ],
  [
    {
      settingTitle: 'Themes difficulty',
      selectedOption: 'All',
      options: ['All', 'Easy', 'Medium', 'Hard', 'Extreme'],
    },
    {
      settingTitle: 'Themes per difficulty',
      selectedOption: '10',
      options: ['10', '15', '20', '25'],
    },
  ],
  [
    {
      settingTitle: 'Media reveal',
      selectedOption: 'Video',
      options: ['Video', 'Image'],
    },
  ],
];

export const DEFAULT_SOUND_SETTINGS: SoundSetting[][] = [
  [
    {
      settingTitle: 'Theme volume',
      volume: 50,
    },
  ],
];
