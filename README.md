# @verenig/shared

Shared utilities and components for Verenig projects. This package provides reusable Vue components, composables, and CSS utilities that can be directly imported into Vue applications.

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

### Import Methods

The package provides targeted entry points for clean imports:

```javascript
// Import components
import { Field } from '@verenig/shared/components'

// Import composables
import { useUid } from '@verenig/shared/composables'

// Import CSS
import '@verenig/shared/css/colors.css'
```

## Available Components
1. Field


## Available Composables

2. useUid


## Development

This project uses [Bun](https://bun.com) as the runtime and package manager.

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
├── vue/
│   ├── components/
│   │   ├── index.ts      # Components entry point
│   │   └── Field.vue     # Form field component
│   └── composables/
│       ├── index.ts      # Composables entry point
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

### Development Workflow

```bash
# 1. Create a feature branch (determines version bump)
git checkout -b feat/new-select-component    # → minor release
# or: fix/field-validation                   # → patch release  
# or: major/redesign-api                     # → major release

# 2. Make your changes
# Edit files in vue/ or css/

# 3. Verify changes locally
make verify

# 4. Commit and push
git add .
git commit -m "feat: add Select component with accessibility features"
git push origin feat/new-select-component

# 5. Create pull request to main
# When merged, GitHub Actions will automatically:
# - Detect "feat/" → minor version bump
# - Run tests and validation  
# - Bump version (e.g., 1.2.0 → 1.3.0)
# - Create GitHub release
# - Publish to npm
```

No build step required - source files are distributed directly!

## Deployment

This package uses GitHub Actions for automated deployment to npm with **automatic version detection**.

### 🤖 Automatic Release (Recommended)

When you merge to `main`, the version is automatically bumped based on:

#### Branch Naming Convention
```bash
# Patch releases (1.0.0 → 1.0.1) - Bug fixes
fix/button-styling
hotfix/memory-leak  
patch/typo-correction

# Minor releases (1.0.0 → 1.1.0) - New features
feat/new-component
feature/dark-mode
minor/api-enhancement

# Major releases (1.0.0 → 2.0.0) - Breaking changes  
major/new-architecture
breaking/api-redesign
```

#### Conventional Commits
Alternatively, use conventional commit messages:
```bash
fix: resolve button alignment issue          # → patch
feat: add new DatePicker component          # → minor  
feat!: redesign Field component API         # → major
# or include "BREAKING CHANGE" in commit body
```

#### Workflow Process
1. Create branch with appropriate name (e.g., `feat/new-button`)
2. Make your changes and commit
3. Create pull request to `main`
4. When merged, GitHub Actions will:
   - Detect version bump type from branch/commits
   - Run all tests and validation
   - Bump version in package.json
   - Create GitHub release
   - Publish to npm automatically

### 🔧 Manual Release (Backup)
If you need manual control:
1. Go to GitHub Actions → "Version and Release" workflow  
2. Click "Run workflow" and select version type
3. Workflow handles the rest

### 📋 Requirements
Set up this GitHub repository secret:
- `NPM_TOKEN`: Your npm access token with publish permissions

### 🛡️ Safety Features
- Skips release if commit is already a version bump
- Full validation before publishing
- Rollback safety with tagged releases

## License

MIT

## Requirements

- Vue 3.5+
- TypeScript 5+
- A build system that can process Vue SFCs (Vite, Nuxt, etc.)
