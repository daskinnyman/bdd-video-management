import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import type { LoginFormData } from "../types";
import { loginService } from "../services/login-service";

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  const showNotification = (
    title: string,
    message: string,
    color: "green" | "red"
  ) => {
    const icon =
      color === "green" ? (
        <IconCheck size={16} />
      ) : (
        <IconAlertCircle size={16} />
      );
    notifications.show({
      title,
      message,
      color,
      icon,
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();

    try {
      const result = await loginService.login(data.email, data.password);

      if (result.success) {
        showNotification("成功", result.message, "green");
      } else {
        setError("root", {
          type: "manual",
          message: result.message,
        });
        showNotification("錯誤", result.message, "red");
      }
    } catch {
      const errorMsg = "登入時發生錯誤，請稍後再試";
      setError("root", {
        type: "manual",
        message: errorMsg,
      });
      showNotification("錯誤", errorMsg, "red");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("email", value);
    trigger("email");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("password", value);
    trigger("password");
  };

  return {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watchedEmail,
    watchedPassword,
    onSubmit,
    handleEmailChange,
    handlePasswordChange,
  };
};
