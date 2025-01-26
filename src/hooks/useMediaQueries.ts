import { useQuery } from "@tanstack/react-query";
import { fetchBackgroundVideos, fetchAmbientMusic } from "../api/api";
import type { VideoOption } from "../types/video";
import { themes } from "../data/themes";

export function useVideos(theme: string, duration: string = "any") {
  return useQuery({
    queryKey: ["videos", theme, duration],
    queryFn: async () => {
      const results = await fetchBackgroundVideos(theme, duration);
      return results.map((v) => ({
        id: v.id,
        preview_url:
          v.video_files.find((f) => f.quality === "hd")?.link ||
          v.video_files[0].link,
        download_url:
          v.video_files.find((f) => f.quality === "hd")?.link ||
          v.video_files[0].link,
      })) as VideoOption[];
    },
  });
}

export function useMusic(theme: string, enabled: boolean) {
  const currentTheme = themes.find((t) => t.id === theme);

  return useQuery({
    queryKey: ["music", currentTheme?.musicTags],
    queryFn: () => fetchAmbientMusic(currentTheme?.musicTags || "ambient"),
    enabled: enabled && !!currentTheme,
  });
}
