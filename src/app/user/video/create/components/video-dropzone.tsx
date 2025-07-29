import { Group, Text, Alert } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, MIME_TYPES, type FileRejection } from "@mantine/dropzone";
import styles from "./video-dropzone.module.scss";

type VideoDropzoneProps = {
  watchedFile: File | null;
  isSubmitting: boolean;
  onFileChange: (file: File | null) => void;
  errors: {
    file?: {
      message?: string;
    };
  };
};

export const VideoDropzone = ({
  watchedFile,
  isSubmitting,
  onFileChange,
  errors,
}: VideoDropzoneProps) => {
  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleReject = (files: FileRejection[]) => {
    console.log("rejected files", files);
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={100 * 1024 * 1024} // 100MB
        accept={[MIME_TYPES.mp4, "video/avi", "video/mov", "video/wmv"]}
        data-testid="file-input"
        loading={isSubmitting}
        disabled={isSubmitting}
        className={styles.dropzone}
      >
        <Group
          justify="center"
          gap="xl"
          mih={120}
          className={styles.dropzoneContent}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag video here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Upload MP4, AVI, MOV, or WMV files up to 100MB
            </Text>
          </div>
        </Group>
      </Dropzone>

      {watchedFile && (
        <Alert color="green" data-testid="file-selected-message">
          Selected file: {watchedFile.name}
        </Alert>
      )}

      {errors.file && (
        <Alert color="red" data-testid="file-error-message">
          {errors.file.message}
        </Alert>
      )}
    </>
  );
};
