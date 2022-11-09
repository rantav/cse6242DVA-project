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


	# @cd be && \
	# 	/usr/local/bin/python3.9 -m venv .venv
	# @cd be && \
	# 	source .venv/bin/activate && \
	# 	pip install --upgrade pip && \
	# 	pip install -r requirements.txt && \
	# 	pip install -r server/requirements.txt

deploy:
	@echo "Deploying app"
	@cd ui; npm run build
	git push heroku $$(git rev-parse --abbrev-ref HEAD):master

	# @cd be/server && \
	# 	source ../.venv/bin/activate && \
	# 	export AWS_CONFIG_FILE="../../.aws/config" && \
	#   	chalice deploy --stage dev
	# @echo "Server URL: "
	# @cd be/server && \
	# 	chalice url


be:
	@echo "Visit http://127.0.0.1:5000/_vite/"
	source .venv/bin/activate && \
		FLASK_DEBUG=1 flask run
ui:
	@cd ui; npm run dev

ui-preview:
	@cd ui; npm run build && npm run preview

ui-deploy:
	ui/deploy.sh

.PHONY: ui be
