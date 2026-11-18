import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { PlaylistResponse, ThemeTrack } from '@features/game/model/Track';

@Injectable({
  providedIn: 'root',
})
export class ThemeApi {
  private baseUrl = 'https://graphql.animethemes.moe/';
  private http = inject(HttpClient);
  private difficultyIds = {
    Easy: 'qM5mTldm',
    Medium: 'A6XdcZyY',
    Hard: 'wmXxFBnw',
    Extreme: '356jUx0Y',
  };

  getPlaylist(themesDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'): Observable<ThemeTrack[]> {
    const query = `
      query GetPlaylist($id: String!) {
        playlist(id: $id) {
          tracks(first: 100) {
            video {
              link
              audio {
                link
              }
            }
            animethemeentry {
              animetheme {
                slug
                anime {
                  title {
                    romaji
                  }
                  images(first: 100) {
                    nodes {
                      facet
                      link
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    let difficultyId = this.difficultyIds[themesDifficulty];

    const body = {
      query,
      variables: {
        id: difficultyId,
      },
    };

    console.log(difficultyId);
    console.log('Difficulty:', themesDifficulty);
    console.log('Difficulty ID:', this.difficultyIds[themesDifficulty]);

    return this.http.post<PlaylistResponse>(this.baseUrl, body).pipe(
      tap((res) => console.log('GraphQL response:', res)),
      map((res) =>
        res.data.playlist.tracks.map((track): ThemeTrack => {
          const anime = track.animethemeentry.animetheme.anime;

          return {
            slug: track.animethemeentry.animetheme.slug,
            animeName: anime.title.romaji,
            image: anime.images.nodes[0]?.link ?? '',
            videoUrl: track.video.link,
            audioUrl: track.video.audio.link,
          };
        }),
      ),
    );
  }
}
