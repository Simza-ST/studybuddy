#!/bin/bash
set -e

echo "🔨 Building Spring Boot Services"
echo "================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Services to build
SERVICES=("auth-service" "upload-service" "quiz-service" "analytics-service" "ai-orchestrator")

# Build each service
for service in "${SERVICES[@]}"; do
    echo ""
    echo -e "${BLUE}Building ${service}...${NC}"
    cd "services/${service}"
    
    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        echo -e "${YELLOW}Maven not found. Skipping ${service}${NC}"
        cd ../..
        continue
    fi
    
    mvn clean package -DskipTests -q
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${service} built successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed to build ${service}${NC}"
    fi
    
    cd ../..
done

echo ""
echo -e "${GREEN}✓ Build complete!${NC}"
echo ""
echo "Docker Compose will build images on 'docker-compose up -d'"
echo "Or build manually with: docker build -t studybuddy/<service>:1.0 ./services/<service>"
