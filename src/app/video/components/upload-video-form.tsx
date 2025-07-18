"use client";

import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Alert,
  FileInput,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { IconAlertCircle, IconUpload } from "@tabler/icons-react";
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import type { UploadVideoFormData, VideoTag } from "../types";

type UploadVideoFormProps = {
  form: {
    register: UseFormRegister<UploadVideoFormData>;
    handleSubmit: UseFormHandleSubmit<UploadVideoFormData>;
    formState: {
      errors: FieldErrors<UploadVideoFormData>;
      isValid: boolean;
      isSubmitting: boolean;
    };
  };
  watchedFile: File | null;
  watchedTitle: string;
  watchedTag: string;
  videoTags: VideoTag[];
  onSubmit: (data: UploadVideoFormData) => Promise<void>;
  onFileChange: (file: File | null) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTagChange: (value: string | null) => void;
};

export const UploadVideoForm = ({
  form,
  watchedFile,
  watchedTitle,
  watchedTag,
  videoTags,
  onSubmit,
  onFileChange,
  onTitleChange,
  onDescriptionChange,
  onTagChange,
}: UploadVideoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <Paper shadow="xs" p="xl" radius="md" withBorder>
      <Title order={2} mb="lg" ta="center">
        Upload Video
      </Title>

      <form data-testid="upload-video-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {errors.root && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Upload Failed"
              color="red"
              data-testid="error-message"
            >
              {errors.root.message}
            </Alert>
          )}

          <FileInput
            {...register("file", {
              required: "Please select a video file",
              validate: (value) => {
                if (!value) return "Please select a video file";
                const allowedTypes = [
                  "video/mp4",
                  "video/avi",
                  "video/mov",
                  "video/wmv",
                ];
                if (!allowedTypes.includes(value.type)) {
                  return "Unsupported file format. Please select MP4, AVI, MOV, or WMV format";
                }
                const maxSize = 100 * 1024 * 1024; // 100MB
                if (value.size > maxSize) {
                  return "File size cannot exceed 100MB";
                }
                return true;
              },
            })}
            label="Video File"
            placeholder="Select video file"
            accept="video/*"
            data-testid="file-input"
            error={errors.file?.message}
            onChange={onFileChange}
            leftSection={<IconUpload size={16} />}
            required
          />

          <TextInput
            {...register("title", {
              required: "Please enter a video title",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
            })}
            label="Video Title"
            placeholder="Enter video title"
            data-testid="title-input"
            error={errors.title?.message}
            onChange={onTitleChange}
            required
          />

          <Textarea
            {...register("description")}
            label="Video Description"
            placeholder="Enter video description (optional)"
            data-testid="description-input"
            error={errors.description?.message}
            onChange={onDescriptionChange}
            rows={4}
          />

          <Select
            {...register("tag", {
              required: "Please select a video tag",
            })}
            label="Video Tag"
            placeholder="Select video tag"
            data-testid="tag-select"
            error={errors.tag?.message}
            onChange={onTagChange}
            data={videoTags.map((tag) => ({ value: tag.id, label: tag.name }))}
            required
          />

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={
                !isValid || !watchedFile || !watchedTitle || !watchedTag
              }
              data-testid="upload-button"
              fullWidth
              size="lg"
            >
              {isSubmitting ? "Uploading..." : "Upload Video"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};
