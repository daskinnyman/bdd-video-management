"use client";

import React from "react";
import { Modal, Text, Button, Stack, Group } from "@mantine/core";
import { Video } from "../mock-data";

type DeleteVideoModalProps = {
  opened: boolean;
  onClose: () => void;
  video: Video | null;
  onConfirm: () => void;
};

export function DeleteVideoModal({
  opened,
  onClose,
  video,
  onConfirm,
}: DeleteVideoModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="確認刪除"
      size="sm"
      data-testid="delete-video-modal"
    >
      <Stack gap="md">
        <Text>
          確定要刪除影片 &quot;{video?.title}&quot; 嗎？此操作無法復原。
        </Text>
        <Group justify="flex-end" gap="md">
          <Button variant="light" onClick={onClose}>
            取消
          </Button>
          <Button
            color="red"
            onClick={onConfirm}
            data-testid="confirm-delete-button"
          >
            確認刪除
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
