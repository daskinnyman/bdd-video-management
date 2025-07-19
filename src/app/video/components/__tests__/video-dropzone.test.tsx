import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider, createTheme } from "@mantine/core";
import { VideoDropzone } from "../video-dropzone";

const theme = createTheme({});

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider theme={theme}>{component}</MantineProvider>);
};

describe("VideoDropzone", () => {
  const mockOnFileChange = jest.fn();
  const mockWatchedFile = new File(["test content"], "test.mp4", {
    type: "video/mp4",
  });

  const defaultProps = {
    watchedFile: mockWatchedFile,
    isSubmitting: false,
    onFileChange: mockOnFileChange,
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render dropzone with correct text", () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      expect(
        screen.getByText("Drag video here or click to select files")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Upload MP4, AVI, MOV, or WMV files up to 100MB")
      ).toBeInTheDocument();
    });

    it("should show selected file message when file is provided", () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      expect(screen.getByTestId("file-selected-message")).toBeInTheDocument();
      expect(screen.getByText("Selected file: test.mp4")).toBeInTheDocument();
    });

    it("should not show selected file message when no file is provided", () => {
      const props = { ...defaultProps, watchedFile: null };
      renderWithMantine(<VideoDropzone {...props} />);

      expect(
        screen.queryByTestId("file-selected-message")
      ).not.toBeInTheDocument();
    });

    it("should show error message when file error exists", () => {
      const props = {
        ...defaultProps,
        errors: {
          file: { message: "Please select a valid video file" },
        },
      };
      renderWithMantine(<VideoDropzone {...props} />);

      expect(screen.getByTestId("file-error-message")).toBeInTheDocument();
      expect(
        screen.getByText("Please select a valid video file")
      ).toBeInTheDocument();
    });
  });

  describe("Drag and Drop functionality", () => {
    it("should handle valid file drop", async () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      const file = new File(["video content"], "test-video.mp4", {
        type: "video/mp4",
      });

      // Create drag and drop events
      const dragEnterEvent = new Event("dragenter", { bubbles: true });
      const dropEvent = new Event("drop", { bubbles: true });

      // Add dataTransfer to the drop event
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: {
          files: [file],
          types: ["Files"],
        },
        writable: false,
      });

      // Simulate drag and drop
      fireEvent(dropzone, dragEnterEvent);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(mockOnFileChange).toHaveBeenCalledWith(file);
      });
    });

    it("should handle multiple files drop by selecting first file", async () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      const file1 = new File(["video content 1"], "test1.mp4", {
        type: "video/mp4",
      });
      const file2 = new File(["video content 2"], "test2.mp4", {
        type: "video/mp4",
      });

      const dropEvent = new Event("drop", { bubbles: true });
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: {
          files: [file1, file2],
          types: ["Files"],
        },
        writable: false,
      });

      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(mockOnFileChange).toHaveBeenCalledWith(file1);
        expect(mockOnFileChange).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle empty drop", async () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      const dropEvent = new Event("drop", { bubbles: true });
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: {
          files: [],
          types: [],
        },
        writable: false,
      });

      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(mockOnFileChange).not.toHaveBeenCalled();
      });
    });

    it("should handle drag events without dropping", () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      const dragEnterEvent = new Event("dragenter", { bubbles: true });
      const dragLeaveEvent = new Event("dragleave", { bubbles: true });

      // These should not cause any errors
      fireEvent(dropzone, dragEnterEvent);
      fireEvent(dropzone, dragLeaveEvent);

      expect(mockOnFileChange).not.toHaveBeenCalled();
    });
  });

  describe("File rejection", () => {
    it("should handle invalid file type drop", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      const invalidFile = new File(["text content"], "test.txt", {
        type: "text/plain",
      });

      const dropEvent = new Event("drop", { bubbles: true });
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: {
          files: [invalidFile],
          types: ["Files"],
        },
        writable: false,
      });

      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "rejected files",
          expect.arrayContaining([
            expect.objectContaining({
              file: invalidFile,
            }),
          ])
        );
      });

      consoleSpy.mockRestore();
    });

    it("should handle oversized file drop", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      const dropzone = screen.getByTestId("file-input");
      // Create a file larger than 100MB
      const oversizedFile = new File(
        ["x".repeat(101 * 1024 * 1024)],
        "large.mp4",
        {
          type: "video/mp4",
        }
      );

      const dropEvent = new Event("drop", { bubbles: true });
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: {
          files: [oversizedFile],
          types: ["Files"],
        },
        writable: false,
      });

      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "rejected files",
          expect.arrayContaining([
            expect.objectContaining({
              file: oversizedFile,
            }),
          ])
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Loading and disabled states", () => {
    it("should disable dropzone when submitting", () => {
      const props = { ...defaultProps, isSubmitting: true };
      renderWithMantine(<VideoDropzone {...props} />);

      const dropzone = screen.getByTestId("file-input");
      expect(dropzone).toHaveAttribute("data-disabled", "true");
    });

    it("should show loading state when submitting", () => {
      const props = { ...defaultProps, isSubmitting: true };
      renderWithMantine(<VideoDropzone {...props} />);

      const dropzone = screen.getByTestId("file-input");
      expect(dropzone).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Accessibility", () => {
    it("should have proper test ID for testing", () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      expect(screen.getByTestId("file-input")).toBeInTheDocument();
    });

    it("should have proper test IDs for messages", () => {
      renderWithMantine(<VideoDropzone {...defaultProps} />);

      expect(screen.getByTestId("file-selected-message")).toBeInTheDocument();
    });
  });
});
