# BDD Mantine App

This is an application built with Next.js and Mantine UI framework.

## Tech Stack

- **Next.js 15** - React framework
- **Mantine 8** - React UI component library
- **TypeScript** - Type-safe JavaScript
- **Tabler Icons** - Icon library

## Setup Instructions

### Mantine Configuration

According to the [Mantine official guide](https://mantine.dev/guides/next/), the following configurations have been completed:

1. **PostCSS Configuration** (`postcss.config.js`)

   - Configure `postcss-preset-mantine` plugin
   - Configure responsive breakpoint variables

2. **Layout Configuration** (`src/app/layout.tsx`)

   - Import `MantineProvider` and `ColorSchemeScript`
   - Import Mantine CSS styles
   - Wrap the application root component
   - Add `suppressHydrationWarning` attribute to resolve hydration mismatch

3. **CSS Configuration** (`src/app/globals.css`)

   - Import Mantine core styles
   - Preserve existing custom styles

4. **Dependencies**
   - `@mantine/core` - Core components
   - `@mantine/hooks` - Utility hooks
   - `@mantine/notifications` - Notification components
   - `@tabler/icons-react` - Icon library
   - `postcss-preset-mantine` - PostCSS plugin
   - `postcss-simple-vars` - CSS variables support

### Important Fixes

**Hydration Mismatch Error Fix:**

- Move `ColorSchemeScript` from `<head>` to `<body>`
- Add `suppressHydrationWarning` attribute to `<html>` and `<body>` tags
- This resolves the inconsistency between server-side and client-side rendering

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- ✅ Complete Mantine 8 setup
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Modern UI components
- ✅ Icon support
- ✅ No hydration mismatch errors

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout (includes MantineProvider)
│   ├── page.tsx        # Main page (displays Mantine components)
│   └── globals.css     # Global styles
├── components/         # Custom components (to be added)
└── ...
```

## Next Steps

- Add more Mantine component examples
- Implement dark mode toggle
- Add form validation
- Integrate API calls
- Add testing

## References

- [Mantine Official Documentation](https://mantine.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tabler Icons](https://tabler-icons.io/)
