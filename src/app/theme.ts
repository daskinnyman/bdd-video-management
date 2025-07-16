import type { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
  components: {
    Text: {
      styles: {
        root: {
          color: "#1A1B1E",
        },
      },
    },
    TextInput: {
      styles: {
        label: {
          color: "#1A1B1E",
          fontWeight: 500,
        },
      },
    },
    PasswordInput: {
      styles: {
        label: {
          color: "#1A1B1E",
          fontWeight: 500,
        },
      },
    },
  },
};
