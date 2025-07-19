/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider, createTheme } from "@mantine/core";
import { UploadVideoForm } from "../upload-video-form";
import { fireEvent } from "@testing-library/react";
import type { VideoTag } from "../../types";

// Mock react-hook-form
const mockRegister = jest.fn();
const mockOnSubmit = jest.fn(async () => {});
const mockOnFileChange = jest.fn();
const mockOnTitleChange = jest.fn();
const mockOnDescriptionChange = jest.fn();
const mockOnTagChange = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockForm = (overrides: any = {}) => ({
  register: mockRegister,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (onValid: any) => (e: React.FormEvent) => {
    e.preventDefault();
    return onValid({
      file: new File(["test"], "test.mp4", { type: "video/mp4" }),
      title: "Test Video",
      description: "Test Description",
      tag: "1",
    });
  },
  formState: {
    errors: {},
    isValid: true,
    isSubmitting: false,
    ...overrides.formState,
  },
  ...overrides,
});

const mockVideoTags: VideoTag[] = [
  { id: "1", name: "Education" },
  { id: "2", name: "Entertainment" },
  { id: "3", name: "Technology" },
];

const defaultProps = {
  form: createMockForm(),
  watchedFile: new File(["test"], "test.mp4", { type: "video/mp4" }),
  watchedTitle: "Test Video",
  watchedTag: "1",
  videoTags: mockVideoTags,
  onSubmit: mockOnSubmit,
  onFileChange: mockOnFileChange,
  onTitleChange: mockOnTitleChange,
  onDescriptionChange: mockOnDescriptionChange,
  onTagChange: mockOnTagChange,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Create test wrapper function with proper Mantine theme
const renderWithMantine = (ui: React.ReactElement) => {
  const theme = createTheme({
    primaryColor: "blue",
  });

  return render(
    <MantineProvider theme={theme} defaultColorScheme="light">
      {ui}
    </MantineProvider>
  );
};

describe("UploadVideoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Valid input cases", () => {
    it("should renderWithMantine form components correctly", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(screen.getByTestId("file-input")).toBeInTheDocument();
      expect(screen.getByTestId("title-input")).toBeInTheDocument();
      expect(screen.getByTestId("description-input")).toBeInTheDocument();
      expect(screen.getByTestId("tag-select")).toBeInTheDocument();
      expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    });

    it("should enable upload button when valid data is entered", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).not.toBeDisabled();
    });

    it("should call onSubmit function when submitted", async () => {
      const localMockOnSubmit = jest.fn(async () => {});
      const props = {
        ...defaultProps,
        onSubmit: localMockOnSubmit,
      };
      renderWithMantine(<UploadVideoForm {...props} />);
      const form = screen.getByTestId("upload-video-form");
      fireEvent.submit(form);
      // Wait for Promise to resolve
      await new Promise((r) => setTimeout(r, 0));
      expect(localMockOnSubmit).toHaveBeenCalled();
    });

    it("should call corresponding onChange functions when input changes", async () => {
      const user = userEvent.setup();
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      const titleInput = screen.getByTestId("title-input");
      const descriptionInput = screen.getByTestId("description-input");

      await user.type(titleInput, "New Video Title");
      await user.type(descriptionInput, "New Description");

      expect(mockOnTitleChange).toHaveBeenCalled();
      expect(mockOnDescriptionChange).toHaveBeenCalled();
    });

    it("should display video tags in select dropdown", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getByText("Entertainment")).toBeInTheDocument();
      expect(screen.getByText("Technology")).toBeInTheDocument();
    });
  });

  describe("Invalid input cases", () => {
    it("should display file validation error", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              file: { message: "Please select a video file" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      expect(
        screen.getByText("Please select a video file")
      ).toBeInTheDocument();
    });

    it("should display title validation error", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              title: { message: "Title must be at least 3 characters" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      expect(
        screen.getByText("Title must be at least 3 characters")
      ).toBeInTheDocument();
    });

    it("should display tag validation error", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              tag: { message: "Please select a video tag" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      expect(screen.getByText("Please select a video tag")).toBeInTheDocument();
    });

    it("should display root error message", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              root: { message: "Upload failed due to server error" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText("Upload failed due to server error")
      ).toBeInTheDocument();
    });

    it("should disable upload button when form is invalid", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {},
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });
  });

  describe("Edge cases", () => {
    it("should show loading state when submitting", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {},
            isValid: true,
            isSubmitting: true,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toHaveTextContent("Uploading...");
      expect(uploadButton).toBeDisabled();
    });

    it("should disable upload button when file is not selected", () => {
      const props = {
        ...defaultProps,
        watchedFile: null,
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });

    it("should disable upload button when title is empty", () => {
      const props = {
        ...defaultProps,
        watchedTitle: "",
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });

    it("should disable upload button when tag is not selected", () => {
      const props = {
        ...defaultProps,
        watchedTag: "",
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });

    it("should disable upload button when multiple required fields are empty", () => {
      const props = {
        ...defaultProps,
        watchedFile: null,
        watchedTitle: "",
        watchedTag: "",
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });

    it("should handle multiple errors simultaneously", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              file: { message: "Please select a video file" },
              title: { message: "Please enter a video title" },
              tag: { message: "Please select a video tag" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      expect(
        screen.getByText("Please select a video file")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a video title")
      ).toBeInTheDocument();
      expect(screen.getByText("Please select a video tag")).toBeInTheDocument();
    });

    it("should disable upload button when form is invalid and there is input value", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {},
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<UploadVideoForm {...props} />);

      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).toBeDisabled();
    });
  });

  describe("Form validation", () => {
    it("should correctly register file field", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("file", {
        required: "Please select a video file",
        validate: expect.any(Function),
      });
    });

    it("should correctly register title field", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("title", {
        required: "Please enter a video title",
        minLength: {
          value: 3,
          message: "Title must be at least 3 characters",
        },
        maxLength: {
          value: 100,
          message: "Title cannot exceed 100 characters",
        },
      });
    });

    it("should correctly register description field", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("description");
    });

    it("should correctly register tag field", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("tag", {
        required: "Please select a video tag",
      });
    });
  });

  describe("File validation", () => {
    it("should validate file type correctly", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      // Get the validate function from the register call
      const fileRegisterCall = mockRegister.mock.calls.find(
        (call: [string, unknown]) => call[0] === "file"
      );
      const validateOptions = fileRegisterCall?.[1] as {
        validate: (value: File | null) => true | string;
      };
      const validateFunction = validateOptions?.validate;

      expect(validateFunction).toBeDefined();

      // Test valid file
      const validFile = new File(["test"], "test.mp4", { type: "video/mp4" });
      expect(validateFunction(validFile)).toBe(true);

      // Test invalid file type
      const invalidFile = new File(["test"], "test.txt", {
        type: "text/plain",
      });
      expect(validateFunction(invalidFile)).toBe(
        "Unsupported file format. Please select MP4, AVI, MOV, or WMV format"
      );

      // Test null file
      expect(validateFunction(null)).toBe("Please select a video file");
    });

    it("should validate file size correctly", () => {
      renderWithMantine(<UploadVideoForm {...defaultProps} />);

      const fileRegisterCall = mockRegister.mock.calls.find(
        (call: [string, unknown]) => call[0] === "file"
      );
      const validateOptions = fileRegisterCall?.[1] as {
        validate: (value: File | null) => true | string;
      };
      const validateFunction = validateOptions?.validate;

      expect(validateFunction).toBeDefined();

      // Test file size limit (100MB)
      const largeFile = new File(["x".repeat(101 * 1024 * 1024)], "large.mp4", {
        type: "video/mp4",
      });
      expect(validateFunction(largeFile)).toBe("File size cannot exceed 100MB");
    });
  });
});
