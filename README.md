# Tanstack Themes

A theme management solution for [Tanstack Start](https://tanstack.com/start/latest).

> This is a WIP and not ready for production use yet.

## Features

- 🌓 Seamless dark/light mode switching
- 🔄 System theme detection
- 🍪 Theme persistence via cookies
- ⚡ Zero-flash theme loading
- 🔌 Easy integration with Tanstack Start

## Installation

```bash
pnpm add tanstack-themes
```

## Quick Start

### 1. Update `__root.ts`

First, import the necessary dependencies and set up the server functions:

```ts
import { ThemeProvider } from "tanstack-themes";
import { getThemeCookie, setThemeCookie } from "tanstack-themes/server";
import { themeModeSchema } from "tanstack-themes/schemas";
import { createServerFn } from "@tanstack/start";

// Server function to get theme cookie
const getCookieFn = createServerFn({
  method: "GET",
}).handler(() => getThemeCookie());

// Server function to set theme cookie
const setCookieFn = createServerFn({
  method: "POST",
})
  .validator(themeModeSchema)
  .handler(({ data }) => {
    setThemeCookie(data);
  });
```

Then, update your root loader:

```ts
export const Route = createRootRoute({
  loader: async () => {
    const cookie = await getCookieFn();
    return {
      themeCookie: cookie,
    };
  },
  // ... other configuration
});
```

### 2. Set up the Theme Provider

Wrap your app with the `ThemeProvider` and add the necessary theme initialization:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  const { themeCookie } = Route.useLoaderData();
  const themeClass = themeCookie === "dark" ? "dark" : "";

  return (
    // add the theme class to the html tag
    <html lang="en" className={themeClass}>
      <head>
        <HeadContent />
        {/* if the theme is system, add a script to set the theme */}
        {themeCookie === "system" ? (
          <ScriptOnce
            children={`window.matchMedia('(prefers-color-scheme: dark)').matches ? document.documentElement.classList.add('dark') : null`}
          />
        ) : null}
      </head>
      {/* wrap the app in the ThemeProvider and pass the theme cookie and the setCookieFn */}
      <ThemeProvider defaultTheme={themeCookie} updateThemeCookie={setCookieFn}>
        <body>
          {children}
          <Scripts />
        </body>
      </ThemeProvider>
    </html>
  );
}
```

## Usage Examples

```tsx
import { useTheme } from "tanstack-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

## API Reference

### ThemeProvider Props

| Prop                | Type                            | Description                     |
| ------------------- | ------------------------------- | ------------------------------- |
| `defaultTheme`      | `'light' \| 'dark' \| 'system'` | Initial theme value             |
| `updateThemeCookie` | `(theme: string) => void`       | Callback to update theme cookie |

### useTheme Hook

Returns an object with:

- `theme`: Current theme value
- `setTheme`: Function to update theme
- `resolvedTheme`: Resolved theme (actual theme being applied)

<!-- ## Contributing -->

<!-- Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started. -->

## License

MIT

## Acknowledgments

Inspired by:

- [next-themes](https://github.com/pacocoursey/next-themes)
- [tanstack website](https://github.com/TanStack/tanstack.com)
