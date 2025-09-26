# @verenig/shared Development Guidelines

This document contains development guidelines specific to the @verenig/shared package.

## Package Philosophy

This is a **source distribution** package:
- No build step required
- Source files are distributed directly to consumers
- Consuming projects handle their own compilation
- Maximum flexibility for different project setups

## Development Tools

Use **Bun** as the primary runtime and package manager:

```bash
# Package management
bun install                    # Install dependencies
bun add <package>             # Add dependency
bun remove <package>          # Remove dependency

# Development
bun run <script>              # Run package scripts
make dev                      # Setup development environment
make typecheck               # Type checking
make verify                  # Run all checks
```

## Project Structure

```
@verenig/shared/
├── index.ts                 # Main entry point - exports all components/composables
├── vue/
│   ├── components/          # Vue SFC components
│   │   └── *.vue           # Individual components
│   └── composables/         # Vue composition functions
│       └── *.ts            # TypeScript composables
├── css/
│   └── *.css               # Stylesheets (imported directly by consumers)
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vue-shims.d.ts          # Vue TypeScript declarations
└── Makefile               # Development commands
```

## Adding New Components

1. **Vue Components**: Add to `vue/components/`
   - Use TypeScript with `<script setup lang="ts">`
   - Include proper TypeScript interfaces for props
   - Use accessibility best practices
   - Import and use existing composables when appropriate

2. **Composables**: Add to `vue/composables/`
   - Export as named functions
   - Use proper TypeScript types
   - Follow Vue composition API patterns
   - Include JSDoc comments for documentation

3. **Update Exports**: Add to `index.ts`
   ```ts
   // Add component
   import NewComponent from './vue/components/NewComponent.vue';
   
   // Add composable  
   import { useNewFeature } from './vue/composables/useNewFeature';
   
   // Export in default object and as named export
   export default {
     components: { NewComponent },
     composables: { useNewFeature }
   };
   
   export { NewComponent };
   ```

## CSS Guidelines

- Use CSS custom properties for theming
- Follow the existing color system naming convention
- Include fallbacks for older browsers when using modern CSS features
- Keep styles modular and component-focused

## TypeScript

- All source files should be TypeScript
- Use strict type checking
- Provide proper interfaces for component props
- Export types when they might be useful to consumers

## Testing

```bash
# Run tests (when added)
bun test

# Or via Makefile
make test
```

Test files should follow the pattern: `*.test.ts` or `*.spec.ts`

## Publishing Workflow

1. Make changes to source files
2. Run verification: `make verify`
3. Update version: `make version-patch` (or `version-minor`/`version-major`)
4. Publish: `make publish`

## Consumer Integration

Consuming Vue projects should be able to:

```vue
<script setup>
// Import components directly
import { Field } from '@verenig/shared'

// Import composables
import { useUid } from '@verenig/shared'

// Import CSS
import '@verenig/shared/css/colors.css'
</script>
```

## Key Principles

- **Source First**: Distribute TypeScript and Vue source files
- **Consumer Flexibility**: Let consuming projects handle compilation
- **Type Safety**: Provide full TypeScript support through source files
- **Simplicity**: No complex build pipeline
- **Vue Ecosystem**: Designed specifically for Vue 3+ projects