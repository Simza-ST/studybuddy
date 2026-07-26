# StudyBuddy

An educational platform that lets students upload study materials, generate AI-powered quizzes, track progress, and compete on leaderboards.

## Stack

**Frontend** — React + Vite + TypeScript + Tailwind CSS + Zustand  
**Backend** — Spring Boot 3 microservices (Java 17)  
**AI** — Gemini 1.5 Flash (quiz generation)  
**Infra** — PostgreSQL · Redis · RabbitMQ · MinIO · Nginx (API gateway)

## Project Structure

```
studybuddy/
├── frontend/               # React + Vite web app
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── store/          # Zustand state (auth, quiz)
│   │   └── types/          # TypeScript interfaces
│   └── ...
├── backend/                # Spring Boot microservices
│   ├── auth-service/       # JWT auth (port 8001)
│   ├── upload-service/     # File upload + MinIO (port 8002)
│   ├── quiz-service/       # Quiz sessions (port 8003)
│   ├── analytics-service/  # Progress tracking (port 8004)
│   ├── ai-orchestrator/    # Gemini integration (port 8005)
│   └── Dockerfile          # Shared Java Dockerfile
├── infra/
│   ├── nginx.conf          # API gateway (single port 8080)
│   ├── init-db.sql         # Database schema
│   └── .env                # Environment variables
├── scripts/                # Build and health-check scripts
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js >= 18
- Java 17 + Maven 3.8+

### 1. Build backend services
```bash
cd backend/auth-service && mvn clean package -DskipTests && cd ../..
# repeat for upload-service, quiz-service, analytics-service, ai-orchestrator
```

### 2. Start all services
```bash
docker-compose up -d
```

All API traffic goes through the gateway at `http://localhost:8080`.

### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:4173`.

## API Gateway Routes

| Path prefix       | Service            |
|-------------------|--------------------|
| `/api/auth/`      | auth-service       |
| `/api/upload/`    | upload-service     |
| `/api/quiz/`      | quiz-service       |
| `/api/analytics/` | analytics-service  |
| `/api/ai/`        | ai-orchestrator    |

## Environment Variables

Copy `infra/.env` and set:

```bash
GEMINI_API_KEY=<your-key>
JWT_SECRET=<change-in-production>
```

## License

MIT
# studybuddy
