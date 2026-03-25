import { Routes } from '@angular/router';

import { Settings } from '@features/home/pages/settings/settings';
import { EndGame } from '@features/game/pages/end-game/end-game';
import { Layout } from '@core/layout/layout';
import { Menu } from '@features/home/pages/menu/menu';
import { Game } from '@features/game/pages/game/game';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Menu,
      },
      {
        path: 'settings',
        component: Settings,
      },
      {
        path: 'game',
        component: Game,
      },
      {
        path: 'end-game',
        component: EndGame,
      },
    ],
  },
];
