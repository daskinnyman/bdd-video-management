import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Alert,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import type { UploadVideoFormData, VideoTag } from "../types";
import { VideoDropzone } from "./video-dropzone";

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
    <form data-testid="upload-video-form" onSubmit={handleSubmit(onSubmit)}>
      <Paper shadow="xs" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg" ta="center">
          Upload Video
        </Title>
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

          <VideoDropzone
            watchedFile={watchedFile}
            isSubmitting={isSubmitting}
            onFileChange={onFileChange}
            errors={errors}
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
              disabled={!isValid || !watchedFile}
              data-testid="upload-button"
              fullWidth
              size="lg"
            >
              {isSubmitting ? "Uploading..." : "Upload Video"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </form>
  );
};
