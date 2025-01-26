import { JamendoTrack } from '../api/api';

export interface VideoOption {
  id: number;
  preview_url: string;
  download_url: string;
}

export interface VideoSettings {
  theme: string;
  resolution: string;
  withMusic: boolean;
  format: "webm" | "mp4" | "mov";
  duration_filter: "any" | "short" | "medium" | "long";
  selectedVideo?: VideoOption;
  selectedMusic?: JamendoTrack;
}