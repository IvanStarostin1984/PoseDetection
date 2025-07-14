.PHONY: lint test generate update-todo-date

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

update-todo-date:
	python scripts/update_todo_date.py
