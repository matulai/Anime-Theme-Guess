export interface AnimeImage {
  facet: string;
  link: string;
}

export interface Anime {
  name: string;
  images: AnimeImage[];
}

export interface AnimeTheme {
  slug: string;
  anime: Anime;
}

export interface AnimeThemeEntry {
  animetheme: AnimeTheme;
}

export interface TrackVideoAudio {
  link: string;
}

export interface TrackVideo {
  link: string;
  audio: TrackVideoAudio;
}

export interface Track {
  animethemeentry: AnimeThemeEntry;
  video: TrackVideo;
}

export interface PlaylistResponse {
  playlist: {
    tracks: Track[];
  };
}

export interface ThemeTrack {
  slug: string;
  animeName: string;
  image: string;
  videoUrl: string;
  audioUrl: string;
}
