.PHONY: lint lint-docs test generate docs

lint:
	npx --yes markdownlint-cli **/*.md
	black --check backend scripts tests
	ruff check scripts tests

lint-docs: lint

test:
	@if [ -d tests ]; then \
	python -m pytest --cov=backend --cov=frontend --cov-config=.coveragerc --cov-fail-under=80; \
	else \
	echo "No tests yet"; \
	fi
	@if [ -d frontend/src/__tests__ ]; then \
	npx --yes jest; \
	fi

generate:
	python scripts/generate.py

update-todo-date:
	python scripts/update_todo_date.py

check-versions:
	python scripts/check_versions.py

docs:
	$(MAKE) -C docs html
