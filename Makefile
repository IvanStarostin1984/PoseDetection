.PHONY: lint test

lint:
	npx --yes markdownlint-cli **/*.md

test:
	@if [ -d tests ]; then \
		python -m pytest; \
	else \
		echo "No tests yet"; \
	fi
