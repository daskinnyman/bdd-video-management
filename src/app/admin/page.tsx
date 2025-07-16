"use client";

import {
  Box,
  Paper,
  Text,
  Group,
  Button,
  Card,
  Grid,
  Title,
} from "@mantine/core";
import {
  IconUsers,
  IconSettings,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  return (
    <Box p="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Admin Dashboard</Title>
          <Button
            leftSection={<IconLogout size={16} />}
            variant="outline"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Logout
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={4}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group>
                <IconUsers size={32} color="blue" />
                <Box>
                  <Text size="lg" fw={600}>
                    Total Users
                  </Text>
                  <Text size="xl" fw={700} c="blue">
                    1,234
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={4}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group>
                <IconChartBar size={32} color="green" />
                <Box>
                  <Text size="lg" fw={600}>
                    Active Sessions
                  </Text>
                  <Text size="xl" fw={700} c="green">
                    567
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={4}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group>
                <IconSettings size={32} color="orange" />
                <Box>
                  <Text size="lg" fw={600}>
                    System Status
                  </Text>
                  <Text size="xl" fw={700} c="green">
                    Online
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Box mt="xl">
          <Title order={2} mb="md">
            Quick Actions
          </Title>
          <Group>
            <Button
              leftSection={<IconUsers size={16} />}
              variant="filled"
              data-testid="manage-users-button"
            >
              Manage Users
            </Button>
            <Button
              leftSection={<IconSettings size={16} />}
              variant="outline"
              data-testid="system-settings-button"
            >
              System Settings
            </Button>
            <Button
              leftSection={<IconChartBar size={16} />}
              variant="outline"
              data-testid="view-reports-button"
            >
              View Reports
            </Button>
          </Group>
        </Box>
      </Paper>
    </Box>
  );
}
