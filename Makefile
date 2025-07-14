.PHONY: lint lint-docs test generate

lint:
	npx --yes markdownlint-cli **/*.md
	ruff check scripts tests

lint-docs: lint

test:
	@if [ -d tests ]; then \
		python -m pytest; \
	else \
		echo "No tests yet"; \
	fi

generate:
	python scripts/generate.py

update-todo-date:
	python scripts/update_todo_date.py

check-versions:
	python scripts/check_versions.py
