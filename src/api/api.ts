
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || "";

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  audio: string; // Stream URL
  audiodownload: string; // Download URL
  image: string; // Album/Track artwork
}

// Define theme tags for better type safety
export const themeToTags: Record<string, string> = {
  // Nature & Outdoors
  nature: "ambient,nature,relaxing",
  forest: "forest,ambient,peaceful",
  ocean: "water,ambient,waves",
  mountains: "ambient,majestic,peaceful",
  sunset: "ambient,chill,relaxing",
  rain: "rain,ambient,meditation",

  // Space & Sky
  space: "space,ambient,cosmic",
  stars: "ambient,night,peaceful",
  aurora: "ambient,ethereal,dream",
  clouds: "ambient,floating,soft",

  // Urban & City
  cityscape: "urban,ambient,modern",
  neon: "electronic,ambient,night",
  cafe: "jazz,lofi,ambient",
  subway: "urban,ambient,underground",

  // Abstract & Moods
  abstract: "experimental,ambient,art",
  minimal: "minimal,ambient,clean",
  zen: "meditation,zen,peaceful",
  dream: "dream,ambient,soft",
};

// export const fetchBackgroundVideos = async (
//   theme: string
// ): Promise<PexelsVideo[]> => {
//   try {
//     // Add additional search terms for better video results
  

//     const searchQuery = searchTerms[theme as keyof typeof searchTerms] || theme;

//     const response = await fetch(
//       `https://api.pexels.com/videos/search?query=${encodeURIComponent(
//         searchQuery
//       )}&per_page=15&orientation=landscape`,
//       {
//         headers: {
//           Authorization: PEXELS_API_KEY,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch videos: ${response.statusText}`);
//     }

//     const data = await response.json();

//     if (!data.videos || !Array.isArray(data.videos)) {
//       console.warn("No videos found in response:", data);
//       return [];
//     }

//     return data.videos;
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     return [];
//   }
// };

export const fetchBackgroundVideos = async (
  theme: string,
  duration: string = 'any'
): Promise<PexelsVideo[]> => {
  try {
     const searchTerms = {
       // Nature & Outdoors
       nature: "nature landscape scenic",
       forest: "forest trees woodland",
       ocean: "ocean waves sea",
       mountains: "mountains landscape peaks",
       sunset: "sunset landscape golden hour",
       rain: "rain nature water drops",
       beach: "beach ocean waves sand",
       desert: "desert sand dunes landscape",
       jungle: "jungle tropical rainforest",

       // Space & Sky
       space: "space galaxy universe stars",
       stars: "night stars starry sky",
       aurora: "aurora borealis northern lights",
       clouds: "clouds timelapse sky",
       space_station: "space station orbit earth",

       // Urban & City
       cityscape: "city skyline timelapse urban",
       neon: "city night neon lights urban",
       cafe: "cafe coffee shop interior",
       subway: "subway station metro underground",
       retro: "vintage retro aesthetic",

       // Abstract & Moods
       abstract: "abstract art motion graphics",
       minimal: "minimal clean simple",
       zen: "zen garden peaceful",
       dream: "abstract dreamy ethereal",
       night: "night city moonlight",

       // Seasonal
       spring: "spring flowers bloom nature",
       summer: "summer sunny beach",
       autumn: "autumn fall leaves colors",
       winter: "winter snow landscape",
       snow: "snowfall winter wonderland",
       fireplace: "fireplace cozy fire",

       // Fantasy
       fairy: "magical forest enchanted",
       medieval: "castle medieval ancient",
       mythical: "fantasy magical mystical",
       cyberpunk: "cyberpunk futuristic neon",

       // Relaxation & Meditation
       meditation: "meditation calm peaceful",
       spa: "spa wellness relaxation",
       yoga: "yoga meditation peaceful",
       sleep: "night stars peaceful",

       // Additional search terms for better results
       waterfall: "waterfall nature water",
       canyon: "canyon landscape nature",
       volcano: "volcano lava nature",
       glacier: "glacier ice nature",
       reef: "coral reef underwater ocean",
       cave: "cave underground natural",
       garden: "garden flowers nature",
       lighthouse: "lighthouse ocean coast",
       morning: "morning sunrise dawn",
       evening: "evening sunset dusk",
       moonlight: "moon night sky",
       storm: "thunderstorm lightning weather",
       infinity: "abstract infinity loop",
       kaleidoscope: "kaleidoscope pattern abstract",
       geometric: "geometric patterns abstract",
       fractal: "fractal animation abstract",
       sci_fi: "science fiction space futuristic",
       steampunk: "steampunk mechanical vintage",
       temple: "ancient temple architecture",
       observatory: "space observatory telescope",
     };

    const searchQuery = searchTerms[theme as keyof typeof searchTerms] || theme;
    const durationParam = duration !== 'any' ? `&duration=${duration}` : '';

    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        searchQuery
      )}${durationParam}&per_page=15&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.videos || !Array.isArray(data.videos)) {
      console.warn("No videos found in response:", data);
      return [];
    }

    // Filter videos based on duration if needed
    let filteredVideos = data.videos;
    if (duration !== 'any') {
      filteredVideos = data.videos.filter((video: PexelsVideo) => {
        switch (duration) {
          case 'short':
            return video.duration <= 10;
          case 'medium':
            return video.duration > 10 && video.duration <= 30;
          case 'long':
            return video.duration > 30;
          default:
            return true;
        }
      });
    }

    return filteredVideos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export const fetchAmbientMusic = async (
  category: string
): Promise<JamendoTrack[]> => {
  try {
    const apiUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=15&include=musicinfo&orderby=popularity_total&search=${encodeURIComponent(
        category.toLowerCase()
      )}`;

    console.log("Fetching music from:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(`Failed to fetch music: ${response.statusText}`);
    }

    if (!data.results || !Array.isArray(data.results)) {
      console.warn("No tracks found in response:", data);
      return [];
    }

    return data.results.map((track: JamendoTrack) => ({
      id: track.id || `track-${Math.random()}`,
      name: track.name || "Untitled Track",
      duration: track.duration || 0,
      artist_name: track.artist_name || "Unknown Artist",
      audio: track.audio || "",
      audiodownload: track.audiodownload || track.audio || "",
      image: track.image || "",
    }));
  } catch (error) {
    console.error("Error fetching music:", error);
    return [];
  }
};