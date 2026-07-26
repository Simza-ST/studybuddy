# StudyBuddy — Expo + Spring Boot Microservices Platform

A comprehensive educational platform combining a React Native mobile app with a distributed Spring Boot microservices backend. Powered by Gemini 1.5 Flash for intelligent quiz generation from uploaded materials.

## 🎯 Project Overview

StudyBuddy enables students to:
- **Upload** study materials (PDF, DOCX, images, text)
- **Generate quizzes** automatically using AI (Gemini 1.5 Flash)
- **Answer questions** in multiple formats (MCQ, short-answer, long-answer)
- **Track progress** with analytics and performance insights
- **Compete** with peers in leaderboards and challenges
- **Learn** with AI-powered tutoring chat

## 📦 Architecture

### Frontend
- **Framework**: React Native with Expo
- **State**: Zustand (auth) + React Query (server state)
- **Navigation**: React Navigation v6
- **Styling**: NativeWind (Tailwind CSS)
- **HTTP**: Axios with JWT interceptors

### Backend (Microservices)
1. **Auth Service** (Port 8001)
   - Spring Security + JWT
   - User registration and login
   - Token validation

2. **Upload Service** (Port 8002)
   - File parsing with Apache Tika
   - MinIO/AWS S3 integration
   - Vector embeddings (pgvector)

3. **Quiz Service** (Port 8003)
   - Question management
   - Quiz session handling
   - Answer grading

4. **Analytics Service** (Port 8004)
   - Performance tracking
   - Topic strength analysis
   - Leaderboard management

5. **AI Orchestrator** (Port 8005)
   - Gemini API integration
   - RabbitMQ job queuing
   - Async question generation

### Infrastructure
- **Database**: PostgreSQL 15 with pgvector
- **Cache**: Redis 7 (sessions, leaderboard)
- **Message Queue**: RabbitMQ 3
- **Storage**: MinIO (S3-compatible object storage)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- Java 17+
- Maven 3.8+

### 1. Clone & Setup Environment
```bash
cd myProject
cp infra/.env .env.local
# Edit .env.local with your Gemini API key
```

### 2. Start Infrastructure
```bash
docker-compose up -d
```

Services will be available at:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- RabbitMQ: `localhost:5672` (Management: `:15672`)
- MinIO: `localhost:9000` (Console: `:9001`)

### 3. Build & Run Services
```bash
cd services/auth-service
mvn clean package
java -jar target/auth-service-1.0.0.jar

# Repeat for other services (upload, quiz, analytics, ai-orchestrator)
# Or use Docker Compose once Maven builds are complete
```

### 4. Run Mobile App
```bash
cd mobile
npm install
npm start

# Then in Expo: press 'a' for Android or 'i' for iOS
```

### 5. Test Health Endpoints
```bash
# Each service exposes a health check
curl http://localhost:8001/api/auth/health
curl http://localhost:8002/api/upload/health
curl http://localhost:8003/api/quiz/health
curl http://localhost:8004/api/analytics/health
curl http://localhost:8005/api/ai/health
```

## 📁 Project Structure

```
myProject/
├── mobile/                    # React Native + Expo app
│   ├── src/
│   │   ├── screens/          # Auth, Home, Upload, Quiz, Analytics
│   │   ├── navigation/       # React Navigation setup
│   │   ├── store/            # Zustand stores (auth, quiz)
│   │   ├── api/              # Axios client
│   │   └── types/            # TypeScript interfaces
│   ├── App.tsx               # Root component
│   ├── app.json              # Expo configuration
│   └── package.json
│
├── services/                  # Spring Boot microservices
│   ├── auth-service/         # Authentication & JWT
│   ├── upload-service/       # File parsing & storage
│   ├── quiz-service/         # Quiz management
│   ├── analytics-service/    # Analytics aggregation
│   ├── ai-orchestrator/      # Gemini integration
│   └── Dockerfile            # Shared Java service Dockerfile
│
├── infra/                    # Infrastructure configuration
│   ├── .env                  # Environment variables
│   └── init-db.sql          # Database initialization
│
├── docker-compose.yml        # Full stack orchestration
└── README.md
```

## 🔄 API Endpoints

### Auth Service
```
POST   /api/auth/login      - User login
POST   /api/auth/signup     - User registration
GET    /api/auth/health     - Health check
```

### Upload Service
```
POST   /api/upload/materials - Upload material
GET    /api/upload/health    - Health check
```

### Quiz Service
```
POST   /api/quiz/start       - Start quiz
POST   /api/quiz/{id}/answer - Submit answer
GET    /api/quiz/health      - Health check
```

### Analytics Service
```
GET    /api/analytics/summary - Get analytics summary
GET    /api/analytics/topics  - Get topic strength
GET    /api/analytics/health  - Health check
```

### AI Orchestrator
```
POST   /api/ai/generate-questions - Generate quiz questions
GET    /api/ai/health             - Health check
```

## 🔐 Security

- **JWT Tokens**: Stored securely in Expo SecureStore
- **Password**: BCrypt hashing
- **CORS**: Configured per service
- **Secrets**: Environment variables (.env)
- **Database**: SQL injection prevention via parameterized queries

## 📊 Database Schema

Key tables:
- `users` - Student accounts
- `materials` - Uploaded study documents
- `questions` - AI-generated quiz questions
- `quiz_sessions` - Quiz attempts
- `quiz_answers` - User responses

## 🤖 AI Integration

**Gemini 1.5 Flash** generates structured JSON:
```json
{
  "type": "mcq",
  "text": "What is the capital of France?",
  "options": ["Paris", "Lyon", "Marseille", "Nice"],
  "correctAnswer": "Paris",
  "difficulty": "easy",
  "topic": "Geography",
  "explanation": "Paris is the capital and largest city of France..."
}
```

## 🛠 Development

### Add Dependencies
```bash
# Mobile
cd mobile && npm install <package>

# Services
cd services/<service> && mvn dependency:tree
```

### Code Quality
```bash
# Mobile
npm run lint
npm run format

# Services
mvn clean test
```

### Database Migrations
```bash
# Schema updates go in infra/init-db.sql
# Restart containers to apply:
docker-compose down && docker-compose up -d
```

## 📦 Deployment

### Docker Images
```bash
# Build all service images
for service in auth upload quiz analytics ai; do
  cd services/${service}-service
  mvn clean package
  docker build -t studybuddy/${service}-service:1.0 .
  cd ../..
done
```

### Production Checklist
- [ ] Update `.env` with production secrets
- [ ] Change JWT_SECRET
- [ ] Set GEMINI_API_KEY
- [ ] Configure PostgreSQL backups
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring (Prometheus/Grafana)

## 📝 Environment Variables

```bash
# Auth
JWT_SECRET=<change-me>
JWT_EXPIRATION=86400000

# Gemini
GEMINI_API_KEY=<your-key>

# Database
POSTGRES_USER=study
POSTGRES_PASSWORD=study

# Object Storage
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker logs studybuddy-<service>

# Verify database is healthy
docker exec studybuddy-postgres psql -U study -d studydb -c "SELECT 1"
```

### Mobile App Connection Issues
- Verify API_BASE_URL in mobile/.env.local
- Check services are running: `docker ps`
- Test endpoints: `curl http://localhost:8001/api/auth/health`

### Database Errors
```bash
# Reset database
docker exec studybuddy-postgres psql -U study -d studydb -f /docker-entrypoint-initdb.d/init.sql

# Or restart with fresh data
docker-compose down -v
docker-compose up -d
```

## 📚 Documentation

- [Mobile README](./mobile/README.md) - Expo setup and architecture
- [Services README](./services/README.md) - Spring Boot configuration
- [API Specification](./API.md) - Full endpoint documentation (TODO)

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code style (Prettier for JS, Google Java Style for Java)
4. Submit a pull request

---

**Built with ❤️ for students everywhere**

# studybuddy
