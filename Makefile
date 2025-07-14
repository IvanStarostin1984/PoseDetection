.PHONY: lint test generate

lint:
	npx --yes markdownlint-cli **/*.md

test:
	@if [ -d tests ]; then \
		python -m pytest; \
	else \
		echo "No tests yet"; \
	fi

generate:
	python scripts/generate.py
