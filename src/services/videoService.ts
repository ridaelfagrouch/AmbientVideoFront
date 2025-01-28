export const mergeVideoAndAudio = async (
  videoUrl: string,
  audioUrl: string,
  format: "webm" | "mp4" | "mov" = "webm",
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> => {
  try {
    onProgress?.(0, "Initializing...");

    const response = await fetch("/api/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl, audioUrl, format }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate video");
    }

    const blob = await response.blob();
    onProgress?.(100, "Complete!");
    return blob;
  } catch (error) {
    console.error("Error in mergeVideoAndAudio:", error);
    onProgress?.(0, "Generation failed");
    throw error;
  }
};
