.PHONY: help startup stop logs health test build clean

help:
	@echo "StudyBuddy Development Commands"
	@echo "================================"
	@echo "make startup       - Start all infrastructure and services"
	@echo "make stop          - Stop all services"
	@echo "make logs          - View service logs"
	@echo "make health        - Check service health"
	@echo "make build         - Build all Java services"
	@echo "make test          - Run tests"
	@echo "make clean         - Clean and remove containers"
	@echo "make mobile-start  - Start Expo dev server"
	@echo "make mobile-build  - Build mobile app"

startup:
	@bash scripts/startup.sh

stop:
	@echo "Stopping services..."
	@docker-compose down

logs:
	@docker-compose logs -f

health:
	@bash scripts/health-check.sh

build:
	@bash scripts/build-services.sh

test:
	@echo "Running tests..."
	@cd services/auth-service && mvn test -q
	@cd ../..

clean:
	@echo "Cleaning up..."
	@docker-compose down -v
	@for service in services/*/; do cd $$service && mvn clean -q && cd ../..; done

mobile-start:
	@echo "Starting mobile app..."
	@cd mobile && npm install && npm start

mobile-build:
	@echo "Building mobile app..."
	@cd mobile && npm run build

docker-build:
	@echo "Building Docker images..."
	@docker-compose build --no-cache

db-reset:
	@echo "Resetting database..."
	@docker-compose down -v postgres
	@docker-compose up -d postgres
	@sleep 5

ps:
	@docker-compose ps

shell-db:
	@docker exec -it studybuddy-postgres psql -U study -d studydb

shell-redis:
	@docker exec -it studybuddy-redis redis-cli

shell-rabbit:
	@docker exec -it studybuddy-rabbitmq bash
