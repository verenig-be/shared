# Verenig Shared Package Makefile

.PHONY: help build clean install dev publish test lint typecheck

# Default target
help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

clean: ## Clean build artifacts
	rm -rf dist/
	@echo "✅ Cleaned build artifacts"

build: clean ## Build the package for distribution
	@echo "🔨 Building package..."
	bun build index.ts --outdir=dist --target=node --minify
	@echo "📝 Generating TypeScript declarations..."
	bun run build:types
	@echo "🎨 Copying CSS files..."
	bun run build:css
	@echo "✅ Build complete"

dev: install ## Install dependencies and build in development mode
	@echo "🚀 Setting up development environment..."
	$(MAKE) build
	@echo "✅ Development setup complete"

typecheck: ## Run TypeScript type checking
	@echo "🔍 Type checking..."
	tsc --noEmit
	@echo "✅ Type check passed"

lint: ## Run linting (if linter is configured)
	@if [ -f "package.json" ] && grep -q "lint" package.json; then \
		echo "🔍 Running linter..."; \
		bun run lint; \
	else \
		echo "ℹ️  No linter configured"; \
	fi

test: ## Run tests
	@echo "🧪 Running tests..."
	bun test

verify: typecheck lint test ## Run all verification checks
	@echo "✅ All checks passed"

publish-check: build verify ## Check if package is ready for publishing
	@echo "📦 Checking package contents..."
	@if [ ! -d "dist" ]; then echo "❌ No dist directory found"; exit 1; fi
	@if [ ! -f "dist/index.js" ]; then echo "❌ No main entry file found"; exit 1; fi
	@if [ ! -f "dist/index.d.ts" ]; then echo "❌ No type declarations found"; exit 1; fi
	@if [ ! -d "dist/css" ]; then echo "❌ No CSS files found"; exit 1; fi
	@echo "✅ Package is ready for publishing"

publish: publish-check ## Publish to npm (with confirmation)
	@echo "🚀 Publishing package to npm..."
	@echo "Are you sure you want to publish? (y/N)"
	@read -r response; \
	if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
		npm publish --access public; \
		echo "✅ Package published successfully"; \
	else \
		echo "❌ Publishing cancelled"; \
	fi

publish-dry: build ## Dry run publish to see what would be published  
	@echo "🔍 Dry run publish..."
	npm publish --dry-run --access public

info: ## Show package information
	@echo "📦 Package Information:"
	@echo "Name: $(shell jq -r '.name' package.json)"
	@echo "Version: $(shell jq -r '.version' package.json)"
	@echo "Description: $(shell jq -r '.description' package.json)"
	@echo ""
	@echo "📂 Files that will be published:"
	@echo "$(shell jq -r '.files[]' package.json)"

version-patch: ## Bump patch version
	npm version patch
	@echo "✅ Version bumped to $(shell jq -r '.version' package.json)"

version-minor: ## Bump minor version
	npm version minor  
	@echo "✅ Version bumped to $(shell jq -r '.version' package.json)"

version-major: ## Bump major version
	npm version major
	@echo "✅ Version bumped to $(shell jq -r '.version' package.json)"

# Development workflow targets
ci: install build verify ## Complete CI workflow
	@echo "✅ CI workflow completed successfully"

release: version-patch build publish ## Release workflow: bump patch, build, and publish
	@echo "🎉 Release completed"