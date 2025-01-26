export const mergeVideoAndAudio = async (
  videoUrl: string,
  audioUrl: string,
  format: "webm" | "mp4" | "mov" = "webm"
): Promise<Blob> => {

  const response = await fetch("/api/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl, audioUrl, format }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate video");
  }

  return response.blob();
};
