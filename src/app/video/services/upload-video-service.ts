import type {
  UploadVideoFormData,
  VideoTag,
  UploadVideoResponse,
} from "../types";

// Mock video tags data
export const videoTags: VideoTag[] = [
  { id: "1", name: "Education" },
  { id: "2", name: "Entertainment" },
  { id: "3", name: "Music" },
  { id: "4", name: "Gaming" },
  { id: "5", name: "Technology" },
];

export const uploadVideoService = {
  // Validate file
  validateFile: (file: File | null): { isValid: boolean; message: string } => {
    if (!file) {
      return { isValid: false, message: "Please select a video file" };
    }

    const allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/wmv"];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message:
          "Unsupported file format. Please select MP4, AVI, MOV, or WMV format",
      };
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { isValid: false, message: "File size cannot exceed 100MB" };
    }

    return { isValid: true, message: "" };
  },

  // Validate title
  validateTitle: (title: string): { isValid: boolean; message: string } => {
    if (!title.trim()) {
      return { isValid: false, message: "Please enter a video title" };
    }

    if (title.length < 3) {
      return { isValid: false, message: "Title must be at least 3 characters" };
    }

    if (title.length > 100) {
      return { isValid: false, message: "Title cannot exceed 100 characters" };
    }

    return { isValid: true, message: "" };
  },

  // Validate tag
  validateTag: (tag: string): { isValid: boolean; message: string } => {
    if (!tag.trim()) {
      return { isValid: false, message: "Please select a video tag" };
    }

    const validTags = videoTags.map((t) => t.id);
    if (!validTags.includes(tag)) {
      return { isValid: false, message: "Please select a valid video tag" };
    }

    return { isValid: true, message: "" };
  },

  // Upload video
  uploadVideo: async (
    data: UploadVideoFormData
  ): Promise<UploadVideoResponse> => {
    try {
      // Validate all fields
      const fileValidation = uploadVideoService.validateFile(data.file);
      if (!fileValidation.isValid) {
        return { success: false, message: fileValidation.message };
      }

      const titleValidation = uploadVideoService.validateTitle(data.title);
      if (!titleValidation.isValid) {
        return { success: false, message: titleValidation.message };
      }

      const tagValidation = uploadVideoService.validateTag(data.tag);
      if (!tagValidation.isValid) {
        return { success: false, message: tagValidation.message };
      }

      // Mock API call
      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          tag: data.tag,
          fileName: data.file?.name,
          fileSize: data.file?.size,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return {
        success: true,
        message: "Video uploaded successfully!",
        videoId: result.videoId,
      };
    } catch {
      return {
        success: false,
        message: "An error occurred during upload, please try again later",
      };
    }
  },

  // Get video tags list
  getVideoTags: async (): Promise<VideoTag[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(videoTags);
      }, 100);
    });
  },
};
