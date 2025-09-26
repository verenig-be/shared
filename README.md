# @verenig/shared

Shared utilities and components for Verenig projects. This package provides reusable Vue components, composables, and CSS utilities that can be directly imported into Vue applications.

## Features

- 🧩 **Vue Components**: Pre-built, accessible components with TypeScript support
- 🎨 **CSS Color System**: Comprehensive color palette with modern CSS features
- 🔧 **Composables**: Reusable Vue composition functions
- 📦 **Source Distribution**: Components distributed as source files for maximum flexibility
- 🎯 **TypeScript**: Full type safety through source TypeScript files

## Installation

```bash
# Using Bun (recommended)
bun add @verenig/shared

# Using npm
npm install @verenig/shared

# Using yarn
yarn add @verenig/shared
```

## Usage

### Components

```vue
<template>
  <Field
    v-model="email"
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    help="We'll never share your email"
    :error="emailError"
    required
  />
</template>

<script setup>
import { Field } from '@verenig/shared'
import { ref } from 'vue'

const email = ref('')
const emailError = ref('')
</script>
```

### Composables

```vue
<script setup>
import { useUid } from '@verenig/shared'

// Generate unique IDs for form elements
const fieldId = useUid('field')
const buttonId = useUid('btn', 'submit')
</script>
```

### CSS Colors

```css
/* Import the color system */
@import '@verenig/shared/css/colors.css';

.my-component {
  background-color: var(--clr-blue-a50);
  color: var(--clr-light-a10);
  border: 1px solid var(--clr-blue-a30);
}

/* Modern browsers with oklch support will automatically use better colors */
```

## Available Components

### Field

A comprehensive form field component with built-in accessibility features.

**Props:**
- `modelValue?: string` - The input value (v-model)
- `label?: string` - Field label text
- `type?: string` - Input type (default: 'text')
- `placeholder?: string` - Placeholder text
- `help?: string` - Help text displayed below the field
- `error?: string` - Error message to display
- `required?: boolean` - Whether the field is required
- `disabled?: boolean` - Whether the field is disabled

**Features:**
- Automatic unique ID generation
- ARIA attributes for accessibility
- Error state styling
- Help text support

## Available Composables

### useUid

Generates unique IDs for components, useful for form labels and ARIA attributes.

```typescript
function useUid(prefix?: string, postfix?: string): Ref<string>
```

**Parameters:**
- `prefix?: string` - Optional prefix for the ID
- `postfix?: string` - Optional postfix for the ID

**Returns:** A reactive reference containing a unique ID string.

## Color System

The package includes a comprehensive color system with:

- **5 Color Families**: Blue, Red, Yellow, Light, Dark
- **10-Step Scales**: From a10 (lightest) to a90 (darkest)
- **Modern CSS Support**: Automatic fallback from oklch() to hex colors
- **Consistent Naming**: `--clr-{family}-a{step}` format

### Color Families

- `--clr-blue-*` - Primary blue colors
- `--clr-red-*` - Error and warning colors  
- `--clr-yellow-*` - Accent and highlight colors
- `--clr-light-*` - Light theme colors
- `--clr-dark-*` - Dark theme colors

## Development

This project uses [Bun](https://bun.com) as the runtime and package manager.

### Setup

```bash
# Install dependencies
bun install

# Run type checking
make typecheck

# Run all checks
make verify
```

### Available Scripts

```bash
# Development workflow
make dev

# Type checking
make typecheck

# Run tests
make test

# Package info
make info
```

## Package Structure

```
@verenig/shared/
├── index.ts              # Main entry point
├── vue/
│   ├── components/
│   │   └── Field.vue     # Form field component
│   └── composables/
│       └── useUid.ts     # Unique ID composable
└── css/
    └── colors.css        # Color system
```

## Architecture

This package follows a **source distribution** approach:

- **No bundling**: Components and utilities are distributed as source files
- **Consumer flexibility**: Importing projects handle their own build process
- **Type safety**: TypeScript source files provide full IDE support
- **Direct imports**: Vue components remain as `.vue` files for proper SFC processing

## Contributing

1. Make changes to source files in `vue/`, `css/`, or `index.ts`
2. Run `make verify` to ensure all checks pass
3. Update version with `make version-patch` (or `version-minor`/`version-major`)
4. Publish with `make publish`

No build step required - source files are distributed directly!

## License

MIT

## Requirements

- Vue 3.5+
- TypeScript 5+
- A build system that can process Vue SFCs (Vite, Nuxt, etc.)