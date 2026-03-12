import { GameSetting } from '@features/home/model/GameSetting';
import { SoundSetting } from '@features/home/model/SoundSetting';

export const DEFAULT_GAME_SETTINGS: GameSetting[] = [
  {
    settingTitle: 'Game mode',
    selectedOption: 'Auto skip',
    options: ['Auto skip', 'Typing'],
    description: [
      {
        type: 'paragraph',
        content: [
          { text: 'TYPING', bold: true },
          { text: ': Guess the theme by typing its name after the preview ends.' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          { text: 'AUTO SKIP', bold: true },
          { text: ': The game automatically skips to the next song when the preview ends.' },
        ],
      },
    ],
  },
  {
    settingTitle: 'Typing grace time',
    selectedOption: '0',
    options: ['0', '3', '5', '7'],
    description: [
      {
        type: 'paragraph',
        content: [{ text: 'Sets the time to type the answer after the time song ends.' }],
      },
    ],
  },
  {
    settingTitle: 'Time difficulty',
    selectedOption: 'Easy',
    options: ['Easy', 'Medium', 'Hard', 'Extreme'],
    description: [
      {
        type: 'paragraph',
        content: [
          { text: 'Higher difficulties give you less time to listen or random parts to listen.' },
        ],
      },
    ],
  },
  {
    settingTitle: 'Themes difficulty',
    selectedOption: 'All',
    options: ['All', 'Easy', 'Medium', 'Hard', 'Extreme'],
    description: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'Controls how recognizable the songs are, higher difficulties include more obscure or less popular tracks.',
          },
        ],
      },
    ],
  },
  {
    settingTitle: 'Themes per difficulty',
    selectedOption: '10',
    options: ['10', '15', '20', '25'],
    description: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'Sets how many songs are played for each difficulty level.',
          },
        ],
      },
    ],
  },
  {
    settingTitle: 'Media reveal',
    selectedOption: 'Video',
    options: ['Video', 'Image'],
    description: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'Choose how the song is revealed after the audio preview.',
          },
        ],
      },
    ],
  },
];

export const DEFAULT_SOUND_SETTINGS: SoundSetting[] = [
  {
    settingTitle: 'Theme volume',
    volume: 50,
    description: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'Set the volume of the theme in game',
          },
        ],
      },
    ],
  },
];
