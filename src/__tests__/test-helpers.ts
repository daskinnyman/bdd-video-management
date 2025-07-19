import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import type { MockNotifications } from "./mock-functions";

// Helper function to create a test file
export const createTestFile = (
  content: string = "test content",
  filename: string = "test-file.mp4",
  type: string = "video/mp4"
): File => {
  return new File([content], filename, { type });
};

// Helper function to upload a file
export const uploadFile = async (
  fileInput: HTMLElement,
  file: File
): Promise<void> => {
  const user = userEvent.setup();
  await user.upload(fileInput, file);
};

// Helper function to fill form fields
export const fillFormField = async (
  testId: string,
  value: string
): Promise<void> => {
  const user = userEvent.setup();
  const field = screen.getByTestId(testId);
  await user.type(field, value);
};

// Helper function to clear form field
export const clearFormField = async (testId: string): Promise<void> => {
  const user = userEvent.setup();
  const field = screen.getByTestId(testId);
  await user.clear(field);
};

// Helper function to select option from dropdown
export const selectOption = async (
  testId: string,
  value: string
): Promise<void> => {
  const user = userEvent.setup();
  const select = screen.getByTestId(testId);
  await user.selectOptions(select, value);
};

// Helper function to click button
export const clickButton = async (testId: string): Promise<void> => {
  const user = userEvent.setup();
  const button = screen.getByTestId(testId);
  await user.click(button);
};

// Helper function to wait for success notification
export const waitForSuccessNotification = async (
  mockNotifications: MockNotifications,
  expectedMessage?: string
): Promise<void> => {
  await waitFor(() => {
    expect(mockNotifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
        color: "green",
        ...(expectedMessage && { message: expectedMessage }),
      })
    );
  });
};

// Helper function to wait for error notification
export const waitForErrorNotification = async (
  mockNotifications: MockNotifications,
  expectedMessage?: string
): Promise<void> => {
  await waitFor(() => {
    expect(mockNotifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        color: "red",
        ...(expectedMessage && { message: expectedMessage }),
      })
    );
  });
};

// Helper function to wait for error message on form
export const waitForFormError = async (errorMessage: string): Promise<void> => {
  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
};

// Helper function to wait for error message by test ID
export const waitForErrorByTestId = async (
  testId: string,
  errorMessage: string
): Promise<void> => {
  await waitFor(() => {
    const errorElement = screen.getByTestId(testId);
    expect(errorElement).toHaveTextContent(errorMessage);
  });
};

// Helper function to check if button is disabled
export const expectButtonDisabled = (testId: string): void => {
  const button = screen.getByTestId(testId);
  expect(button).toBeDisabled();
};

// Helper function to check if button is enabled
export const expectButtonEnabled = (testId: string): void => {
  const button = screen.getByTestId(testId);
  expect(button).not.toBeDisabled();
};

// Helper function to check if field is required
export const expectFieldRequired = (testId: string): void => {
  const field = screen.getByTestId(testId);
  expect(field).toBeRequired();
};

// Helper function to check if field has error
export const expectFieldError = (
  testId: string,
  errorMessage: string
): void => {
  const field = screen.getByTestId(testId);
  const errorElement = field.parentElement?.querySelector("span");
  expect(errorElement).toHaveTextContent(errorMessage);
};

// Helper function to fill login form
export const fillLoginForm = async (
  email: string,
  password: string
): Promise<void> => {
  await fillFormField("email-input", email);
  await fillFormField("password-input", password);
};

// Helper function to fill upload video form
export const fillUploadVideoForm = async (
  title: string,
  description: string,
  tag: string,
  file?: File
): Promise<void> => {
  if (file) {
    const fileInput = screen.getByTestId("file-input");
    await uploadFile(fileInput, file);
  }

  await fillFormField("title-input", title);
  await fillFormField("description-input", description);
  await selectOption("tag-select", tag);
};

// Helper function to submit form
export const submitForm = async (formTestId: string): Promise<void> => {
  const form = screen.getByTestId(formTestId);
  const user = userEvent.setup();
  await user.click(form);
};

// Helper function to check API call
export const expectApiCall = (
  mockFetch: jest.MockedFunction<typeof fetch>,
  url: string,
  method: string = "POST",
  body?: object
): void => {
  expect(mockFetch).toHaveBeenCalledWith(
    url,
    expect.objectContaining({
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body && { body: JSON.stringify(body) }),
    })
  );
};
