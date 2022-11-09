setup: setup-be setup-ui

setup-ui:
	@echo "Setting up the UI"
	@cd ui; npm i


setup-be:
	@echo "Setting up backend environment"
	rm -rf .venv
	python3 -m venv .venv
	source .venv/bin/activate && \
		pip install --upgrade pip && \
		pip install -r requirements.txt
# heroku apps:create  --region eu --team dva-project gh-explorer-081


deploy:
	@echo "Deploying app"
	git rm -rf ui/dist
	@cd ui; npm run build
	git add ui/dist/
	git ci -m "Deploy" || echo ""
	git push heroku $$(git rev-parse --abbrev-ref HEAD):master

be:
	@echo "Visit http://127.0.0.1:5000/_vite/"
	source .venv/bin/activate && \
		FLASK_DEBUG=1 flask run
ui:
	@cd ui; npm run dev

ui-preview:
	@cd ui; npm run build && npm run preview


.PHONY: ui be
