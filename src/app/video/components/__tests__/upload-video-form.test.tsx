import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadVideoForm } from "../upload-video-form";
import type { VideoTag } from "../../types";

// Mock Mantine components to avoid React 19 compatibility issues
jest.mock("@mantine/core", () => ({
  TextInput: ({
    label,
    placeholder,
    "data-testid": testId,
    error,
    onChange,
    required,
    ...props
  }: {
    label?: string;
    placeholder?: string;
    "data-testid"?: string;
    error?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    [key: string]: unknown;
  }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={testId}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <span>{error}</span>}
    </div>
  ),
  Textarea: ({
    label,
    placeholder,
    "data-testid": testId,
    error,
    onChange,
    ...props
  }: {
    label?: string;
    placeholder?: string;
    "data-testid"?: string;
    error?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    [key: string]: unknown;
  }) => (
    <div>
      <label>{label}</label>
      <textarea
        data-testid={testId}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
      {error && <span>{error}</span>}
    </div>
  ),
  Select: ({
    label,
    placeholder,
    "data-testid": testId,
    error,
    onChange,
    required,
    data,
    ...props
  }: {
    label?: string;
    placeholder?: string;
    "data-testid"?: string;
    error?: string;
    onChange?: (value: string | null) => void;
    required?: boolean;
    data?: Array<{ value: string; label: string }>;
    [key: string]: unknown;
  }) => (
    <div>
      <label>{label}</label>
      <select
        data-testid={testId}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {data?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error && <span>{error}</span>}
    </div>
  ),
  Button: ({
    children,
    "data-testid": testId,
    disabled,
    loading,
    type,
    ...props
  }: {
    children?: React.ReactNode;
    "data-testid"?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: "submit" | "reset" | "button";
    [key: string]: unknown;
  }) => (
    <button
      data-testid={testId}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? "Uploading..." : children}
    </button>
  ),
  FileInput: ({
    label,
    "data-testid": testId,
    error,
    onChange,
    required,
    ...props
  }: {
    label?: string;
    "data-testid"?: string;
    error?: string;
    onChange?: (file: File | null) => void;
    required?: boolean;
    [key: string]: unknown;
  }) => (
    <div>
      <label>{label}</label>
      <input
        type="file"
        data-testid={testId}
        onChange={(e) => onChange?.(e.target.files?.[0] || null)}
        required={required}
        {...props}
      />
      {error && <span>{error}</span>}
    </div>
  ),
  Alert: ({
    children,
    "data-testid": testId,
    ...props
  }: {
    children?: React.ReactNode;
    "data-testid"?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid={testId} {...props}>
      {children}
    </div>
  ),
  Paper: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Title: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <h2 {...props}>{children}</h2>,
  Stack: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Group: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
}));

// Mock react-hook-form
const mockRegister = jest.fn();
const mockHandleSubmit = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnFileChange = jest.fn();
const mockOnTitleChange = jest.fn();
const mockOnDescriptionChange = jest.fn();
const mockOnTagChange = jest.fn();

const mockForm = {
  register: mockRegister,
  handleSubmit: mockHandleSubmit,
  formState: {
    errors: {},
    isValid: true,
    isSubmitting: false,
  },
};

const mockVideoTags: VideoTag[] = [
  { id: "1", name: "Gaming" },
  { id: "2", name: "Tutorial" },
  { id: "3", name: "Music" },
];

const defaultProps = {
  form: mockForm,
  watchedFile: null,
  watchedTitle: "",
  watchedTag: "",
  videoTags: mockVideoTags,
  onSubmit: mockOnSubmit,
  onFileChange: mockOnFileChange,
  onTitleChange: mockOnTitleChange,
  onDescriptionChange: mockOnDescriptionChange,
  onTagChange: mockOnTagChange,
};

describe("UploadVideoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleSubmit.mockImplementation((callback) => (e: React.FormEvent) => {
      e.preventDefault();
      return callback({ file: null, title: "", description: "", tag: "" });
    });
  });

  describe("Component Rendering", () => {
    it("should render the upload video form with all required fields", () => {
      render(<UploadVideoForm {...defaultProps} />);

      expect(screen.getByTestId("upload-video-form")).toBeInTheDocument();
      expect(screen.getByTestId("file-input")).toBeInTheDocument();
      expect(screen.getByTestId("title-input")).toBeInTheDocument();
      expect(screen.getByTestId("description-input")).toBeInTheDocument();
      expect(screen.getByTestId("tag-select")).toBeInTheDocument();
      expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    });

    it("should display the form title", () => {
      render(<UploadVideoForm {...defaultProps} />);

      // Use a more specific selector to avoid conflicts with button text
      const titleElement = screen.getByRole("heading", { level: 2 });
      expect(titleElement).toHaveTextContent("Upload Video");
    });

    it("should render video tags in the select dropdown", () => {
      render(<UploadVideoForm {...defaultProps} />);

      const tagSelect = screen.getByTestId("tag-select");
      expect(tagSelect).toBeInTheDocument();
    });
  });

  describe("Form Validation and Error Handling", () => {
    it("should display error message when form has root error", () => {
      const propsWithError = {
        ...defaultProps,
        form: {
          ...mockForm,
          formState: {
            ...mockForm.formState,
            errors: {
              root: {
                message: "Upload failed due to server error",
                type: "server",
              },
            },
          },
        },
      };

      render(<UploadVideoForm {...propsWithError} />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText("Upload failed due to server error")
      ).toBeInTheDocument();
    });

    it("should display field-specific error messages", () => {
      const propsWithFieldErrors = {
        ...defaultProps,
        form: {
          ...mockForm,
          formState: {
            ...mockForm.formState,
            errors: {
              file: { message: "Please select a video file", type: "required" },
              title: { message: "Title is required", type: "required" },
              tag: { message: "Please select a tag", type: "required" },
            },
          },
        },
      };

      render(<UploadVideoForm {...propsWithFieldErrors} />);

      expect(
        screen.getByText("Please select a video file")
      ).toBeInTheDocument();
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Please select a tag")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit when form is submitted successfully", async () => {
      const user = userEvent.setup();
      render(<UploadVideoForm {...defaultProps} />);

      const submitButton = screen.getByTestId("upload-button");
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalledWith(mockOnSubmit);
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("should show loading state during form submission", () => {
      const propsWithSubmitting = {
        ...defaultProps,
        form: {
          ...mockForm,
          formState: {
            ...mockForm.formState,
            isSubmitting: true,
          },
        },
      };

      render(<UploadVideoForm {...propsWithSubmitting} />);

      const submitButton = screen.getByTestId("upload-button");
      expect(submitButton).toHaveTextContent("Uploading...");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Button State Management", () => {
    it("should disable upload button when form is invalid", () => {
      const propsWithInvalidForm = {
        ...defaultProps,
        form: {
          ...mockForm,
          formState: {
            ...mockForm.formState,
            isValid: false,
          },
        },
      };

      render(<UploadVideoForm {...propsWithInvalidForm} />);

      const submitButton = screen.getByTestId("upload-button");
      expect(submitButton).toBeDisabled();
    });

    it("should disable upload button when required fields are empty", () => {
      render(<UploadVideoForm {...defaultProps} />);

      const submitButton = screen.getByTestId("upload-button");
      expect(submitButton).toBeDisabled();
    });

    it("should enable upload button when all required fields are filled", () => {
      const propsWithFilledFields = {
        ...defaultProps,
        watchedFile: new File(["test"], "test.mp4", { type: "video/mp4" }),
        watchedTitle: "Test Video",
        watchedTag: "1",
      };

      render(<UploadVideoForm {...propsWithFilledFields} />);

      const submitButton = screen.getByTestId("upload-button");
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("File Input Handling", () => {
    it("should call onFileChange when file is selected", async () => {
      const user = userEvent.setup();
      render(<UploadVideoForm {...defaultProps} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["test"], "test.mp4", { type: "video/mp4" });

      await user.upload(fileInput, file);

      expect(mockOnFileChange).toHaveBeenCalledWith(file);
      expect(mockOnFileChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Text Input Handling", () => {
    it("should call onTitleChange when title is typed", async () => {
      const user = userEvent.setup();
      render(<UploadVideoForm {...defaultProps} />);

      const titleInput = screen.getByTestId("title-input");
      await user.type(titleInput, "Test Video Title");

      expect(mockOnTitleChange).toHaveBeenCalled();
    });

    it("should call onDescriptionChange when description is typed", async () => {
      const user = userEvent.setup();
      render(<UploadVideoForm {...defaultProps} />);

      const descriptionInput = screen.getByTestId("description-input");
      await user.type(descriptionInput, "Test video description");

      expect(mockOnDescriptionChange).toHaveBeenCalled();
    });
  });

  describe("Tag Selection", () => {
    it("should call onTagChange when tag is selected", async () => {
      const user = userEvent.setup();
      render(<UploadVideoForm {...defaultProps} />);

      const tagSelect = screen.getByTestId("tag-select");
      await user.selectOptions(tagSelect, "1");

      expect(mockOnTagChange).toHaveBeenCalledWith("1");
    });
  });

  describe("Form Accessibility", () => {
    it("should have proper form labels", () => {
      render(<UploadVideoForm {...defaultProps} />);

      expect(screen.getByText("Video File")).toBeInTheDocument();
      expect(screen.getByText("Video Title")).toBeInTheDocument();
      expect(screen.getByText("Video Description")).toBeInTheDocument();
      expect(screen.getByText("Video Tag")).toBeInTheDocument();
    });

    it("should have required field indicators", () => {
      render(<UploadVideoForm {...defaultProps} />);

      const fileInput = screen.getByTestId("file-input");
      const titleInput = screen.getByTestId("title-input");
      const tagSelect = screen.getByTestId("tag-select");

      expect(fileInput).toBeRequired();
      expect(titleInput).toBeRequired();
      expect(tagSelect).toBeRequired();
    });
  });
});
