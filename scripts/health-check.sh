#!/bin/bash

echo "🏥 Health Check - StudyBuddy Services"
echo "===================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Service health endpoints
declare -A SERVICES=(
    ["Auth Service"]="http://localhost:8001/api/auth/health"
    ["Upload Service"]="http://localhost:8002/api/upload/health"
    ["Quiz Service"]="http://localhost:8003/api/quiz/health"
    ["Analytics Service"]="http://localhost:8004/api/analytics/health"
    ["AI Orchestrator"]="http://localhost:8005/api/ai/health"
)

# Infrastructure checks
echo -e "${YELLOW}Infrastructure:${NC}"

# PostgreSQL
if command -v psql &> /dev/null; then
    if psql -h localhost -U study -d studydb -c "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL (5432)"
    else
        echo -e "${RED}✗${NC} PostgreSQL (5432) - Not responding"
    fi
else
    docker exec studybuddy-postgres psql -U study -d studydb -c "SELECT 1" &> /dev/null && \
        echo -e "${GREEN}✓${NC} PostgreSQL (5432)" || \
        echo -e "${RED}✗${NC} PostgreSQL (5432)"
fi

# Redis
docker exec studybuddy-redis redis-cli ping &> /dev/null && \
    echo -e "${GREEN}✓${NC} Redis (6379)" || \
    echo -e "${RED}✗${NC} Redis (6379)"

# RabbitMQ
docker exec studybuddy-rabbitmq rabbitmq-diagnostics ping &> /dev/null && \
    echo -e "${GREEN}✓${NC} RabbitMQ (5672)" || \
    echo -e "${RED}✗${NC} RabbitMQ (5672)"

# MinIO
curl -s http://localhost:9000/minio/health/live &> /dev/null && \
    echo -e "${GREEN}✓${NC} MinIO (9000)" || \
    echo -e "${RED}✗${NC} MinIO (9000)"

echo ""
echo -e "${YELLOW}Microservices:${NC}"

# Check each service
for service in "${!SERVICES[@]}"; do
    url="${SERVICES[$service]}"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✓${NC} $service"
    else
        echo -e "${RED}✗${NC} $service (Status: $response)"
    fi
done

echo ""
echo -e "${YELLOW}Endpoints:${NC}"
echo "  Dashboard: http://localhost:3000 (if frontend running)"
echo "  RabbitMQ:  http://localhost:15672"
echo "  MinIO:     http://localhost:9001"
