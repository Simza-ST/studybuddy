#!/bin/bash
set -e

echo "🚀 StudyBuddy Full Stack Startup"
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v docker &> /dev/null || { echo "Docker is required but not installed."; exit 1; }
command -v docker-compose &> /dev/null || { echo "Docker Compose is required but not installed."; exit 1; }

# Load environment
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local...${NC}"
    cp infra/.env .env.local
    echo -e "${YELLOW}⚠️  IMPORTANT: Update .env.local with your GEMINI_API_KEY${NC}"
fi

# Start infrastructure
echo -e "${YELLOW}Starting infrastructure (PostgreSQL, Redis, RabbitMQ, MinIO)...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
docker exec studybuddy-postgres psql -U study -d studydb -c "SELECT 1" > /dev/null && \
    echo -e "${GREEN}✓ PostgreSQL ready${NC}" || \
    { echo "PostgreSQL failed"; exit 1; }

# Test Redis
docker exec studybuddy-redis redis-cli ping | grep -q PONG && \
    echo -e "${GREEN}✓ Redis ready${NC}" || \
    { echo "Redis failed"; exit 1; }

# Test RabbitMQ
docker exec studybuddy-rabbitmq rabbitmq-diagnostics ping > /dev/null && \
    echo -e "${GREEN}✓ RabbitMQ ready${NC}" || \
    { echo "RabbitMQ failed"; exit 1; }

# Test MinIO
curl -s http://localhost:9000/minio/health/live > /dev/null && \
    echo -e "${GREEN}✓ MinIO ready${NC}" || \
    { echo "MinIO failed"; exit 1; }

echo ""
echo -e "${GREEN}✓ Infrastructure started successfully!${NC}"
echo ""
echo "Available services:"
echo "  📦 PostgreSQL:  localhost:5432"
echo "  🔴 Redis:       localhost:6379"
echo "  🐰 RabbitMQ:    localhost:5672 (Management: :15672)"
echo "  🪣 MinIO:       localhost:9000 (Console: :9001)"
echo ""
echo "Next steps:"
echo "  1. Build services: ./scripts/build-services.sh"
echo "  2. Run mobile app: cd mobile && npm install && npm start"
echo "  3. Test health: ./scripts/health-check.sh"
