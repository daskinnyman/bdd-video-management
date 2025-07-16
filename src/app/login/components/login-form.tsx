import { TextInput, PasswordInput, Button, Group, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import type { LoginFormData } from "../types";

type LoginFormProps = {
  form: {
    register: UseFormRegister<LoginFormData>;
    handleSubmit: UseFormHandleSubmit<LoginFormData>;
    formState: {
      errors: FieldErrors<LoginFormData>;
      isValid: boolean;
      isSubmitting: boolean;
    };
  };
  watchedEmail: string;
  watchedPassword: string;
  onSubmit: (data: LoginFormData) => Promise<void>;
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const LoginForm = ({
  form,
  watchedEmail,
  watchedPassword,
  onSubmit,
  onEmailChange,
  onPasswordChange,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <form data-testid="login-form" onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="登入失敗"
          color="red"
          mt="md"
          data-testid="error-message"
        >
          {errors.root.message}
        </Alert>
      )}
      <TextInput
        {...register("email", {
          required: "請輸入電子郵件",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "請輸入有效的電子郵件格式",
          },
        })}
        label="電子郵件"
        placeholder="請輸入您的電子郵件"
        data-testid="email-input"
        error={errors.email?.message}
        onChange={onEmailChange}
        mt="md"
        required
      />

      <PasswordInput
        {...register("password", {
          required: "請輸入密碼",
          minLength: {
            value: 6,
            message: "密碼至少需要 6 個字元",
          },
        })}
        label="密碼"
        placeholder="請輸入您的密碼"
        data-testid="password-input"
        error={errors.password?.message}
        onChange={onPasswordChange}
        mt="md"
        required
      />

      <Group justify="center" mt="xl">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || !watchedEmail || !watchedPassword}
          data-testid="login-button"
          fullWidth
        >
          {isSubmitting ? "登入中..." : "登入"}
        </Button>
      </Group>
    </form>
  );
};
