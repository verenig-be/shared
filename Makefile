# Verenig Shared Package Makefile

.PHONY: help install dev publish test lint typecheck

# Default target
help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

dev: install ## Install dependencies for development
	@echo "🚀 Setting up development environment..."
	@echo "✅ Development setup complete"

typecheck: ## Run TypeScript type checking
	@echo "🔍 Type checking..."
	bunx tsc --noEmit
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
	@if find . -name "*.test.*" -o -name "*.spec.*" | grep -q .; then \
		bun test; \
	else \
		echo "ℹ️  No test files found"; \
	fi

verify: typecheck lint test ## Run all verification checks
	@echo "✅ All checks passed"

publish-check: verify ## Check if package is ready for publishing
	@echo "📦 Checking package contents..."
	@if [ ! -f "index.ts" ]; then echo "❌ No main entry file found"; exit 1; fi
	@if [ ! -d "vue" ]; then echo "❌ No Vue components found"; exit 1; fi
	@if [ ! -d "css" ]; then echo "❌ No CSS files found"; exit 1; fi
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

publish-dry: ## Dry run publish to see what would be published  
	@echo "🔍 Dry run publish..."
	npm publish --dry-run --access public

info: ## Show package information
	@echo "📦 Package Information:"
	@echo "Name: $(shell jq -r '.name' package.json)"
	@echo "Version: $(shell jq -r '.version' package.json)"
	@echo "Description: $(shell jq -r '.description' package.json)"
	@echo "Main: $(shell jq -r '.main' package.json)"
	@echo ""
	@echo "📂 Files that will be published:"
	@echo "$(shell jq -r '.files[]' package.json)"
	@echo ""
	@echo "📁 Source structure:"
	@echo "  index.ts (main entry point)"
	@echo "  vue/ (Vue components and composables)"
	@echo "  css/ (stylesheets)"

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
ci: install verify ## Complete CI workflow
	@echo "✅ CI workflow completed successfully"

release: version-patch publish ## Release workflow: bump patch and publish
	@echo "🎉 Release completed"