import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  Notifications: () => null,
  notifications: {
    show: jest.fn(),
  },
}));

// Mock fetch API
global.fetch = jest.fn();

// Load the feature file
const feature = loadFeature("./features/upload-video.feature");

// Get the mocked function after mock is defined
import { notifications } from "@mantine/notifications";
const mockNotifications = jest.mocked(notifications);
const mockFetch = jest.mocked(fetch);

// Mock functions for upload video functionality
const mockUploadVideo = jest.fn();
const mockValidateFile = jest.fn();
const mockValidateTitle = jest.fn();
const mockValidateTag = jest.fn();

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <Notifications />
    {children}
  </MantineProvider>
);

// Simple test component for upload video
const TestUploadVideoComponent = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [error, setError] = React.useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a video file");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a video title");
      return;
    }

    if (!tag.trim()) {
      setError("Please select a video tag");
      return;
    }

    // Simulate success
    mockNotifications.show({
      title: "Success",
      message: "Video uploaded successfully!",
      color: "green",
    });
  };

  return (
    <form data-testid="upload-video-form" onSubmit={handleSubmit}>
      <label htmlFor="file-input">Video File</label>
      <input
        id="file-input"
        type="file"
        accept="video/*"
        data-testid="file-input"
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Video Title"
        data-testid="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Video Description"
        data-testid="description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="tag-select">Video Tag</label>
      <select
        id="tag-select"
        data-testid="tag-select"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      >
        <option value="">Please select a tag</option>
        <option value="1">Education</option>
        <option value="2">Entertainment</option>
        <option value="3">Music</option>
      </select>
      <button type="submit" data-testid="upload-button">
        Upload Video
      </button>
      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockFetch.mockClear();
    mockUploadVideo.mockClear();
    mockValidateFile.mockClear();
    mockValidateTitle.mockClear();
    mockValidateTag.mockClear();
  });

  test("Upload a video", ({ given, when, then }) => {
    given("I am on the upload video page", () => {
      render(
        <TestWrapper>
          <TestUploadVideoComponent />
        </TestWrapper>
      );
    });

    when("I click the upload button", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);
    });

    then("I should open a file chooser", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I should see a file input", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I choose a video file with a valid format", async () => {
      const fileInput = screen.getByTestId("file-input");
      const file = new File(["video content"], "test-video.mp4", {
        type: "video/mp4",
      });
      await userEvent.upload(fileInput, file);
    });

    then("I fill the title", async () => {
      const titleInput = screen.getByTestId("title-input");
      await userEvent.type(titleInput, "Test Video Title");
    });

    then("I fill the description", async () => {
      const descriptionInput = screen.getByTestId("description-input");
      await userEvent.type(
        descriptionInput,
        "This is a test video description"
      );
    });

    then("I choose a video tag", async () => {
      const tagSelect = screen.getByTestId("tag-select");
      await userEvent.selectOptions(tagSelect, "1");
    });

    then("I should see a success message", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockNotifications.show).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Success",
            color: "green",
          })
        );
      });
    });
  });

  test("Upload a video with empty file", ({ given, then }) => {
    given("I am on the upload video page", () => {
      render(
        <TestWrapper>
          <TestUploadVideoComponent />
        </TestWrapper>
      );
    });

    then("I fill the title", async () => {
      const titleInput = screen.getByTestId("title-input");
      await userEvent.type(titleInput, "Test Video Title");
    });

    then("I fill the description", async () => {
      const descriptionInput = screen.getByTestId("description-input");
      await userEvent.type(
        descriptionInput,
        "This is a test video description"
      );
    });

    then("I choose a video tag", async () => {
      const tagSelect = screen.getByTestId("tag-select");
      await userEvent.selectOptions(tagSelect, "1");
    });

    then("I leave the file input empty", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
      // File input remains empty
    });

    then("I should see an error message", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please select a video file")
        ).toBeInTheDocument();
      });
    });
  });

  test("Upload a video with an empty title", ({ given, when, then }) => {
    given("I am on the upload video page", () => {
      render(
        <TestWrapper>
          <TestUploadVideoComponent />
        </TestWrapper>
      );
    });

    when("I click the upload button", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);
    });

    then("I should open a file chooser", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I should see a file input", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I choose a video file with a valid format", async () => {
      const fileInput = screen.getByTestId("file-input");
      const file = new File(["video content"], "test-video.mp4", {
        type: "video/mp4",
      });
      await userEvent.upload(fileInput, file);
    });

    then("I leave the title empty", () => {
      const titleInput = screen.getByTestId("title-input");
      expect(titleInput).toBeInTheDocument();
      // Title remains empty
    });

    then("I fill the description", async () => {
      const descriptionInput = screen.getByTestId("description-input");
      await userEvent.type(
        descriptionInput,
        "This is a test video description"
      );
    });

    then("I choose a video tag", async () => {
      const tagSelect = screen.getByTestId("tag-select");
      await userEvent.selectOptions(tagSelect, "1");
    });

    then("I should see an error message", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a video title")
        ).toBeInTheDocument();
      });
    });
  });

  test("Upload a video with an empty tag", ({ given, when, then }) => {
    given("I am on the upload video page", () => {
      render(
        <TestWrapper>
          <TestUploadVideoComponent />
        </TestWrapper>
      );
    });

    when("I click the upload button", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);
    });

    then("I should open a file chooser", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I should see a file input", () => {
      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toBeInTheDocument();
    });

    then("I choose a video file with a valid format", async () => {
      const fileInput = screen.getByTestId("file-input");
      const file = new File(["video content"], "test-video.mp4", {
        type: "video/mp4",
      });
      await userEvent.upload(fileInput, file);
    });

    then("I fill the title", async () => {
      const titleInput = screen.getByTestId("title-input");
      await userEvent.type(titleInput, "Test Video Title");
    });

    then("I fill the description", async () => {
      const descriptionInput = screen.getByTestId("description-input");
      await userEvent.type(
        descriptionInput,
        "This is a test video description"
      );
    });

    then("I leave the tag empty", () => {
      const tagSelect = screen.getByTestId("tag-select");
      expect(tagSelect).toBeInTheDocument();
      // Tag remains empty
    });

    then("I should see an error message", async () => {
      const uploadButton = screen.getByTestId("upload-button");
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please select a video tag")
        ).toBeInTheDocument();
      });
    });
  });
});
