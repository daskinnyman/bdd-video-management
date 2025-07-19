"use client";

import { Paper, Box, Text } from "@mantine/core";
import { useLoginForm } from "../hooks/use-login-form";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "../../components/theme-toggle";
import styles from "../login.module.scss";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watchedEmail,
    watchedPassword,
    onSubmit,
    handleEmailChange,
    handlePasswordChange,
  } = useLoginForm();

  const form = {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  };

  return (
    <Box className={styles.loginContainer}>
      <Box pos="absolute" top={20} right={20}>
        <ThemeToggle />
      </Box>

      <Paper shadow="md" p="xl" radius="md" className={styles.loginCard}>
        <Text size="xl" fw={700} className={styles.loginTitle}>
          Login System
        </Text>
        <LoginForm
          form={form}
          watchedEmail={watchedEmail}
          watchedPassword={watchedPassword}
          onSubmit={onSubmit}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
        />
      </Paper>
    </Box>
  );
}
