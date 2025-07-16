"use client";

import { Paper, Box, Text } from "@mantine/core";
import { useLoginForm } from "../hooks/use-login-form";
import { LoginForm } from "./login-form";
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
