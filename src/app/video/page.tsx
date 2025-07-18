"use client";

import { Container, Box } from "@mantine/core";
import { UploadVideoForm } from "./components/upload-video-form";
import { useUploadVideoForm } from "./hooks/use-upload-video-form";

export default function UploadVideoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watchedFile,
    watchedTitle,
    watchedTag,
    videoTags,
    onSubmit,
    handleFileChange,
    handleTitleChange,
    handleDescriptionChange,
    handleTagChange,
  } = useUploadVideoForm();

  return (
    <Container size="sm" py="xl">
      <Box>
        <UploadVideoForm
          form={{
            register,
            handleSubmit,
            formState: { errors, isValid, isSubmitting },
          }}
          watchedFile={watchedFile}
          watchedTitle={watchedTitle}
          watchedTag={watchedTag}
          videoTags={videoTags}
          onSubmit={onSubmit}
          onFileChange={handleFileChange}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onTagChange={handleTagChange}
        />
      </Box>
    </Container>
  );
}
