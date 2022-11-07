setup: setup-be setup-ui

setup-ui:
	@echo "Setting up the UI"
	@cd ui; npm i


setup-be:
	@echo "Setting up backend environment"
	@cd be && \
		rm -rf .venv && \
		/usr/local/bin/python3.9 -m venv .venv
	@cd be && \
		source .venv/bin/activate && \
		pip install --upgrade pip && \
		pip install -r requirements.txt && \
		pip install -r server/requirements.txt

be-deploy:
	@echo "Deploying backend"
	@cd be/server && \
		source ../.venv/bin/activate && \
		export AWS_CONFIG_FILE="../../.aws/config" && \
	  	chalice deploy

be:
	@cd be/server && \
		source ../.venv/bin/activate && \
		chalice local
ui:
	@cd ui; npm run dev

ui-preview:
	@cd ui; npm run build && npm run preview

ui-deploy:
	ui/deploy.sh

.PHONY: ui be
