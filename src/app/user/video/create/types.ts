export type UploadVideoFormData = {
  file: File | null;
  title: string;
  description: string;
  tag: string;
};

export type VideoTag = {
  id: string;
  name: string;
};

export type UploadVideoResponse = {
  success: boolean;
  message: string;
  videoId?: string;
};
