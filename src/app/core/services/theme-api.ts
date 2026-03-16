import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PlaylistResponse, Track } from '@features/game/model/Track';

@Injectable({
  providedIn: 'root',
})
export class ThemeApi {
  private baseUrl = 'https://api.animethemes.moe';
  private http = inject(HttpClient);
  private difficultyIds = {
    Easy: 'qM5mTldm',
    Medium: 'A6XdcZyY',
    Hard: 'wmXxFBnw',
    Extreme: '356jUx0Y',
  };

  getPlaylist(themesDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'): Observable<Track[]> {
    let difficultyId = this.difficultyIds[themesDifficulty];
    return this.http
      .get<PlaylistResponse>(
        `${this.baseUrl}/playlist/${difficultyId}?fields[playlist]=name&include=tracks.video.audio,tracks.animethemeentry.animetheme.anime.images`,
      )
      .pipe(map((res) => res.playlist.tracks));
  }
}
