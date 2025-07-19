import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Box,
} from "@mantine/core";
import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { ThemeToggle } from "./components/theme-toggle";

export default function Home() {
  return (
    <Container size="lg" py="xl">
      <Box pos="absolute" top={20} right={20}>
        <ThemeToggle />
      </Box>

      <Stack gap="xl" align="center">
        <Title order={1} ta="center" size="3rem">
          Welcome to Mantine + Next.js
        </Title>

        <Text size="lg" c="dimmed" ta="center" maw={600}>
          This is a sample page demonstrating Mantine components in a Next.js
          application. The setup is complete and ready for development!
        </Text>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Mantine Features</Title>
            <Group gap="xs">
              <Badge color="blue">TypeScript</Badge>
              <Badge color="green">Dark Mode</Badge>
              <Badge color="violet">Responsive</Badge>
              <Badge color="orange">Accessible</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Mantine provides 100+ customizable components and hooks to cover
              you in any situation.
            </Text>
          </Stack>
        </Card>

        <Group gap="md">
          <Button
            leftSection={<IconBrandGithub size={16} />}
            variant="default"
            component="a"
            href="https://mantine.dev"
            target="_blank"
          >
            Mantine Docs
          </Button>
          <Button
            leftSection={<IconBrandTwitter size={16} />}
            variant="filled"
            component="a"
            href="https://nextjs.org/docs"
            target="_blank"
          >
            Next.js Docs
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
