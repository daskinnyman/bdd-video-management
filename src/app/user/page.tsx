"use client";

import {
  Box,
  Paper,
  Text,
  Group,
  Button,
  Card,
  Stack,
  Title,
  Avatar,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconLogout,
  IconEdit,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  return (
    <Box p="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="xl">
          <Title order={1}>User Dashboard</Title>
          <Button
            leftSection={<IconLogout size={16} />}
            variant="outline"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Logout
          </Button>
        </Group>

        <Group align="flex-start" gap="xl">
          <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
            <Stack align="center" mb="md">
              <Avatar size="xl" radius="xl" color="blue">
                <IconUser size={32} />
              </Avatar>
              <Title order={3}>John Doe</Title>
              <Text c="dimmed">Regular User</Text>
            </Stack>

            <Stack gap="sm">
              <Group>
                <IconMail size={16} />
                <Text>test@example.com</Text>
              </Group>
              <Group>
                <IconCalendar size={16} />
                <Text>Member since January 2024</Text>
              </Group>
            </Stack>

            <Button
              leftSection={<IconEdit size={16} />}
              variant="outline"
              fullWidth
              mt="md"
              data-testid="edit-profile-button"
            >
              Edit Profile
            </Button>
          </Card>

          <Card shadow="sm" p="lg" radius="md" withBorder style={{ flex: 2 }}>
            <Title order={2} mb="md">
              Recent Activity
            </Title>
            <Stack gap="md">
              <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
                <Text fw={600}>Last Login</Text>
                <Text size="sm" c="dimmed">
                  Today at 10:30 AM
                </Text>
              </Box>
              <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
                <Text fw={600}>Profile Updated</Text>
                <Text size="sm" c="dimmed">
                  Yesterday at 2:15 PM
                </Text>
              </Box>
              <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
                <Text fw={600}>Password Changed</Text>
                <Text size="sm" c="dimmed">
                  Last week
                </Text>
              </Box>
            </Stack>
          </Card>
        </Group>

        <Box mt="xl">
          <Title order={2} mb="md">
            Quick Actions
          </Title>
          <Group>
            <Button variant="filled" data-testid="view-profile-button">
              View Profile
            </Button>
            <Button variant="outline" data-testid="change-password-button">
              Change Password
            </Button>
            <Button variant="outline" data-testid="view-settings-button">
              Settings
            </Button>
          </Group>
        </Box>
      </Paper>
    </Box>
  );
}
