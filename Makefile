.PHONY: lint lint-docs test generate docs typecheck

lint:
	npx --yes markdownlint-cli '**/*.md' --ignore node_modules --ignore .pre-commit-cache --ignore frontend/dist --ignore docs/_build
	black --check backend scripts tests
	ruff check backend scripts tests

lint-docs:
	npx --yes markdownlint-cli '**/*.md'
	grep -R --line-number -E '<{7}|={7}|>{7}' --exclude=ci.yml \
	  --exclude-dir=node_modules --exclude-dir=.pre-commit-cache \
	  --exclude-dir=frontend/dist --exclude-dir=docs/_build . && exit 1 \
	  || echo "No conflict markers"

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


typecheck:
	mypy backend

update-todo-date:
	python scripts/update_todo_date.py

check-versions:
	python scripts/check_versions.py

docs:
	$(MAKE) -C docs html
