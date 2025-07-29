"use client";

import React from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
} from "@mantine/core";

type EditVideoModalProps = {
  opened: boolean;
  onClose: () => void;
  editForm: {
    title: string;
    description: string;
    tags: string[];
  };
  onEditFormChange: (field: string, value: string | string[]) => void;
  onSave: () => void;
};

export function EditVideoModal({
  opened,
  onClose,
  editForm,
  onEditFormChange,
  onSave,
}: EditVideoModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="編輯影片資訊"
      size="md"
      data-testid="edit-video-modal"
    >
      <Stack gap="md">
        <TextInput
          label="標題"
          value={editForm.title}
          onChange={(e) => onEditFormChange("title", e.target.value)}
          data-testid="edit-title-input"
        />
        <Textarea
          label="描述"
          value={editForm.description}
          onChange={(e) => onEditFormChange("description", e.target.value)}
          rows={3}
          data-testid="edit-description-input"
        />
        <TextInput
          label="標籤"
          value={editForm.tags.join(", ")}
          onChange={(e) =>
            onEditFormChange(
              "tags",
              e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            )
          }
          placeholder="用逗號分隔多個標籤"
          data-testid="edit-tags-input"
        />
        <Group justify="flex-end" gap="md">
          <Button variant="light" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onSave} data-testid="save-edit-button">
            儲存
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
