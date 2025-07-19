import type { notifications } from "@mantine/notifications";

// Mock function types
export type MockNotifications = jest.Mocked<typeof notifications>;

// Mock API responses
export const createMockApiResponse = (
  success: boolean,
  data: unknown,
  status: number = 200
) => {
  return {
    ok: success,
    status,
    json: jest.fn().mockResolvedValue(data),
  };
};

// Mock successful login response
export const mockSuccessfulLoginResponse = (
  role: "user" | "admin" = "user"
) => {
  return createMockApiResponse(true, {
    success: true,
    message: "Login successful!",
    role,
    token: `mock-${role}-token`,
  });
};

// Mock failed login response
export const mockFailedLoginResponse = (
  message: string = "Invalid username or password"
) => {
  return createMockApiResponse(
    false,
    {
      success: false,
      message,
    },
    401
  );
};

// Mock successful upload response
export const mockSuccessfulUploadResponse = () => {
  return createMockApiResponse(true, {
    success: true,
    message: "Video uploaded successfully!",
    videoId: "mock-video-id",
  });
};

// Mock failed upload response
export const mockFailedUploadResponse = (message: string = "Upload failed") => {
  return createMockApiResponse(
    false,
    {
      success: false,
      message,
    },
    400
  );
};

// Mock video tags data
export const mockVideoTags = [
  { id: "1", name: "Education" },
  { id: "2", name: "Entertainment" },
  { id: "3", name: "Music" },
  { id: "4", name: "Gaming" },
  { id: "5", name: "Tutorial" },
];

// Mock form data
export const mockLoginFormData = {
  email: "test@example.com",
  password: "password123",
};

export const mockUploadVideoFormData = {
  file: new File(["test"], "test.mp4", { type: "video/mp4" }),
  title: "Test Video Title",
  description: "Test video description",
  tag: "1",
};

// Mock form errors
export const mockFormErrors = {
  email: { message: "Please enter a valid email", type: "pattern" },
  password: {
    message: "Password must be at least 6 characters",
    type: "minLength",
  },
  file: { message: "Please select a video file", type: "required" },
  title: { message: "Title is required", type: "required" },
  tag: { message: "Please select a tag", type: "required" },
  root: { message: "Server error occurred", type: "server" },
};

// Mock form state
export const createMockFormState = (
  overrides: Record<string, unknown> = {}
) => {
  return {
    errors: {},
    isValid: true,
    isSubmitting: false,
    ...overrides,
  };
};

// Mock form with errors
export const createMockFormWithErrors = (errors: Record<string, unknown>) => {
  return {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: createMockFormState({ errors, isValid: false }),
  };
};

// Mock form with submitting state
export const createMockFormWithSubmitting = () => {
  return {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: createMockFormState({ isSubmitting: true }),
  };
};

// Mock notifications
export const createMockNotifications = (): MockNotifications => {
  return {
    show: jest.fn(),
    hide: jest.fn(),
    update: jest.fn(),
    clean: jest.fn(),
    cleanQueue: jest.fn(),
    updateState: jest.fn(),
  } as MockNotifications;
};

// Mock router
export const createMockRouter = () => {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };
};

// Mock fetch with response
export const mockFetchWithResponse = (
  mockFetch: jest.MockedFunction<typeof fetch>,
  response: unknown
) => {
  mockFetch.mockResolvedValueOnce(response as Response);
};

// Mock fetch with error
export const mockFetchWithError = (
  mockFetch: jest.MockedFunction<typeof fetch>,
  error: Error = new Error("Network error")
) => {
  mockFetch.mockRejectedValueOnce(error);
};

// Mock file
export const createMockFile = (
  content: string = "test content",
  filename: string = "test-file.mp4",
  type: string = "video/mp4"
): File => {
  return new File([content], filename, { type });
};

// Mock video file
export const createMockVideoFile = (
  filename: string = "test-video.mp4"
): File => {
  return createMockFile("video content", filename, "video/mp4");
};

// Mock image file
export const createMockImageFile = (
  filename: string = "test-image.jpg"
): File => {
  return createMockFile("image content", filename, "image/jpeg");
};

// Mock invalid file
export const createMockInvalidFile = (filename: string = "test.txt"): File => {
  return createMockFile("text content", filename, "text/plain");
};

// Mock large file (over 100MB)
export const createMockLargeFile = (
  filename: string = "large-video.mp4"
): File => {
  const largeContent = "x".repeat(100 * 1024 * 1024); // 100MB
  return new File([largeContent], filename, { type: "video/mp4" });
};

// Mock form validation functions
export const mockValidateEmail = jest.fn().mockReturnValue(true);
export const mockValidatePassword = jest.fn().mockReturnValue(true);
export const mockValidateFile = jest.fn().mockReturnValue(true);
export const mockValidateTitle = jest.fn().mockReturnValue(true);
export const mockValidateTag = jest.fn().mockReturnValue(true);

// Mock form submission functions
export const mockSubmitLogin = jest.fn().mockResolvedValue(undefined);
export const mockSubmitUpload = jest.fn().mockResolvedValue(undefined);

// Mock change handlers
export const mockOnEmailChange = jest.fn();
export const mockOnPasswordChange = jest.fn();
export const mockOnFileChange = jest.fn();
export const mockOnTitleChange = jest.fn();
export const mockOnDescriptionChange = jest.fn();
export const mockOnTagChange = jest.fn();

// Clear all mock functions
export const clearAllMockFunctions = () => {
  jest.clearAllMocks();
  mockValidateEmail.mockClear();
  mockValidatePassword.mockClear();
  mockValidateFile.mockClear();
  mockValidateTitle.mockClear();
  mockValidateTag.mockClear();
  mockSubmitLogin.mockClear();
  mockSubmitUpload.mockClear();
  mockOnEmailChange.mockClear();
  mockOnPasswordChange.mockClear();
  mockOnFileChange.mockClear();
  mockOnTitleChange.mockClear();
  mockOnDescriptionChange.mockClear();
  mockOnTagChange.mockClear();
};
