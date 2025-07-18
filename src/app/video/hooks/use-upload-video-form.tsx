"use client";

import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { UploadVideoFormData, VideoTag } from "../types";
import { uploadVideoService } from "../services/upload-video-service";

export const useUploadVideoForm = () => {
  const router = useRouter();
  const [videoTags, setVideoTags] = useState<VideoTag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    reset,
  } = useForm<UploadVideoFormData>({
    mode: "onChange",
    defaultValues: {
      file: null,
      title: "",
      description: "",
      tag: "",
    },
  });

  const watchedFile = watch("file");
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedTag = watch("tag");

  // Load video tags
  useEffect(() => {
    const loadVideoTags = async () => {
      try {
        const tags = await uploadVideoService.getVideoTags();
        setVideoTags(tags);
      } catch (error) {
        console.error("Failed to load video tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadVideoTags();
  }, []);

  const showNotification = (
    title: string,
    message: string,
    color: "green" | "red"
  ) => {
    const icon =
      color === "green" ? (
        <IconCheck size={16} />
      ) : (
        <IconAlertCircle size={16} />
      );
    notifications.show({
      title,
      message,
      color,
      icon,
    });
  };

  const onSubmit = async (data: UploadVideoFormData) => {
    clearErrors();

    try {
      const result = await uploadVideoService.uploadVideo(data);

      if (result.success) {
        showNotification("Success", result.message, "green");
        reset();
        // Can redirect to video list page or other pages
        router.push("/video");
      } else {
        setError("root", {
          type: "manual",
          message: result.message,
        });
        showNotification("Error", result.message, "red");
      }
    } catch {
      const errorMsg =
        "An error occurred during upload, please try again later";
      setError("root", {
        type: "manual",
        message: errorMsg,
      });
      showNotification("Error", errorMsg, "red");
    }
  };

  const handleFileChange = (file: File | null) => {
    setValue("file", file);
    trigger("file");
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("title", value);
    trigger("title");
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setValue("description", value);
  };

  const handleTagChange = (value: string | null) => {
    setValue("tag", value || "");
    trigger("tag");
  };

  return {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watchedFile,
    watchedTitle,
    watchedDescription,
    watchedTag,
    videoTags,
    isLoadingTags,
    onSubmit,
    handleFileChange,
    handleTitleChange,
    handleDescriptionChange,
    handleTagChange,
  };
};
