# RentRedi Technical Assessment

A modern, full-stack user management system with geographic intelligence, built with React, Node.js, TypeScript, and Firebase. This project demonstrates focus on scalability, maintainability, and is designed to be **production-ready with minimal configuration changes**.

## 🎯 Project Overview

🎯 What's This All About? This project is a complete user management system that automatically enriches user profiles with geographic data. I've used lightweight Domain-Driven Design (DDD) principles to keep the code clean and organized. This approach makes it easy to scale up to a microservices architecture in the future without a major headache.

### Key Features
- ✅ **Full CRUD operations** for user management
- ✅ **Automatic geographic enrichment** via OpenWeather API
- ✅ **Real-time database** with Firebase Realtime Database
- ✅ **Modern React frontend** with TypeScript and Tailwind CSS
- ✅ **Comprehensive API documentation** with Swagger
- ✅ **Docker containerization** for easy deployment
- ✅ **Structured logging** and error handling
- ✅ **Type-safe validation** with Zod schemas

## 🚀 Quick Start
Ready to dive in? Here's how to get it running.

### Prerequisites
- Node.js 18+ 
- npm 8+
- OpenWeather API key

### Option 1: Docker (Recommended)

**Fastest way to get everything running:**

```bash
# 1. Clone and navigate
git clone <repository-url>
cd RentRedi

# 2. Setup environment variables
# First, add your OpenWeather API key to .env.example
# Replace your-api-key-here with your actual OpenWeather API key
cp .env.example .env

# 3. Start all services (dependencies install automatically inside containers)
docker-compose up --build
```

> **📝 Note**: Dependencies are installed automatically inside the Docker containers during the build process. No need to run `npm install` locally first. The first build may take 5-10 minutes as it downloads and installs all dependencies.

**⚠️ Important: Wait for Firebase Emulator Setup**

After running `docker-compose up --build`, **wait approximately 30-60 seconds** for the Firebase emulator to fully initialize before accessing the application. You'll see logs indicating:

```
firebase-emulator  | ┌─────────────────────────────────────────────────────────────┐
firebase-emulator  | │ ✔  All emulators ready! It is now safe to connect your app. │
firebase-emulator  | └─────────────────────────────────────────────────────────────┘
```

**Once ready, all services will be available at:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/docs
- **Firebase Emulator UI**: http://localhost:4000

> **💡 Tip**: If you see connection errors in the frontend, the Firebase emulator may still be starting. Wait a moment and refresh the page.

### Option 2: Local Development

For local development without Docker:

#### Prerequisites
- Firebase CLI: `npm install -g firebase-tools`

#### Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd RentRedi

# 2. Install all dependencies (uses npm workspaces)
npm run install:all

# 3. Environment setup
# First, add your OpenWeather API key to .env.example
# Replace YOUR_API_KEY with your actual OpenWeather API key
cp .env.example .env
```

#### Running Services

**Option A: All services at once**
```bash
# Start backend + frontend concurrently
npm run dev

# In another terminal - Start Firebase emulator
firebase emulators:start --only database,ui
```

**Option B: Individual services**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev:client

# Terminal 3 - Firebase Emulator
firebase emulators:start --only database,ui
```

**Services will be available at:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Firebase UI: http://localhost:4000

## 🖼️ Frontend Screenshots

The application features a modern, responsive user interface built with React, TypeScript, and Tailwind CSS. Here are some screenshots of the frontend in action:

### Dashboard Overview
![Dashboard](https://i.ibb.co/ZzFB73m/Screenshot-2025-08-08-at-15-07-59.png)
*Main dashboard showing user management interface with clean, modern design*

### User List View
![User List](https://i.ibb.co/Cpc2ZSn/Screenshot-2025-08-08-at-15-08-12.png)
*Comprehensive user listing with search and filter capabilities*

### Create User Form
![Create User](https://i.ibb.co/zV4Nb31/Screenshot-2025-08-08-at-15-08-31.png)
*User creation form with real-time validation and geographic data enrichment*

### User Details View
![User Details](https://i.ibb.co/xqhK97J/Screenshot-2025-08-08-at-15-08-39.png)
*Detailed user profile view showing all user information and geographic data*

### Edit User Interface
![Edit User](https://i.ibb.co/mCC7yQM/Screenshot-2025-08-08-at-15-08-49.png)
*User editing interface with form validation and seamless user experience*

### Key Frontend Features
- ✨ **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX**: Clean, intuitive interface with smooth animations
- ⚡ **Real-time Updates**: Instant feedback and updates using React Query
- 🔍 **Search & Filter**: Advanced user search and filtering capabilities
- ✅ **Form Validation**: Real-time form validation with helpful error messages
- 🌍 **Geographic Integration**: Automatic location data enrichment for users
- 🎭 **Smooth Animations**: Powered by Framer Motion for enhanced user experience

## 🏗️ Architecture & Technical Decisions

### Lightweight Domain-Driven Design (DDD)

The project implements a **lightweight DDD approach** to maintain clean architecture while avoiding over-engineering. This design enables future scaling to microservices:

```
src/
├── domain/          # Business entities and repository interfaces
│   └── users/
│       ├── User.entity.ts           # Core business entity
│       └── UsersRepository.port.ts  # Repository interface
├── application/     # Use cases and business logic
│   └── users/
│       ├── CreateUser.usecase.ts
│       ├── UpdateUser.usecase.ts
│       ├── GetUser.usecase.ts
│       ├── ListUsers.usecase.ts
│       └── DeleteUser.usecase.ts
├── infrastructure/  # External services and implementations
│   ├── firebase/
│   │   └── UsersRepository.firebase.ts
│   └── openweather/
│       └── OpenWeatherClient.ts
└── interfaces/      # HTTP controllers and routes
    └── http/
        ├── users.routes.ts
        └── UsersController.ts
```

**Benefits of this approach:**
- **Clear separation of concerns** - Domain logic is isolated from infrastructure
- **Testability** - Easy to mock external dependencies
- **Scalability** - Can extract microservices without major refactoring
- **Maintainability** - Changes in one layer don't affect others
- **Team collaboration** - Clear boundaries for different team members

### Technology Stack Decisions

#### Backend (Node.js + Express + TypeScript)
- **Express.js over NestJS**: To follow the codesandbox.io scaffolding, I chose Express.js for:
  - Simpler setup and lower complexity for this specific use case
  - Faster development iteration for a focused feature set
  - Easier to understand for reviewers not familiar with NestJS decorators and DI patterns
  - Still maintains clean architecture through manual DDD implementation
- **TypeScript**: Type safety and modern development practices
- **Firebase Realtime Database**: NoSQL database with real-time capabilities
- **OpenWeather API**: Geographic data enrichment with caching
- **Zod**: Type-safe validation with excellent error messages
- **Pino**: High-performance structured logging
- **Swagger**: Comprehensive API documentation

#### Frontend (React + TypeScript + Vite)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Efficient data fetching and caching
- **React Router**: Client-side routing

#### Development & Operations
- **Docker**: Reproducible environments with multi-stage builds
- **Docker Compose**: Easy local development setup
- **Firebase Emulator**: Local development without external dependencies
- **ESLint + Prettier**: Code quality and formatting
- **Jest + Supertest**: Comprehensive testing

## 📋 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/users` | List all users | - |
| `POST` | `/api/users` | Create new user | `{ "name": "string", "zipCode": "string" }` |
| `GET` | `/api/users/:id` | Get user by ID | - |
| `PATCH` | `/api/users/:id` | Update user | `{ "name"?: "string", "zipCode"?: "string" }` |
| `DELETE` | `/api/users/:id` | Delete user | - |
| `GET` | `/health` | Health check | - |
| `GET` | `/ready` | Readiness check | - |
| `GET` | `/docs` | API documentation | - |

### Example Usage

```bash
# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "zipCode": "10001"}'

# List all users
curl http://localhost:8080/api/users

# Get specific user
curl http://localhost:8080/api/users/-OX7xMzQC1CF9HwgASmq
```

## 🗺️ Geographic Data Enrichment

### OpenWeather API Integration

The system automatically enriches user data with geographic information when creating or updating users:

- **Automatic enrichment** on user creation/update
- **Error handling** for API failures
- **US ZIP codes only** (limitation of OpenWeather API)

### Geographic Data Structure

```typescript
interface User {
  id: string;
  name: string;
  zipCode: string;        // US ZIP code (e.g., "10001")
  latitude: number;       // Decimal degrees
  longitude: number;      // Decimal degrees
  timezone: string;       // Timezone offset (e.g., "UTC-4")
  createdAt: string;
  updatedAt: string;
}
```

### ZIP Code Limitations

**Important**: This implementation is limited to **US ZIP codes only** due to OpenWeather API constraints. The API requires:
- Valid US ZIP code format (5 digits or 5+4 format)
- Geographic coordinates within the United States

**Future considerations for international support:**
- Integrate with multiple geocoding services
- Implement country-specific validation
- Add timezone handling for different regions

## 🔄 Scaling to Microservices

The lightweight DDD architecture enables easy scaling to microservices:

### Potential Microservice Breakdown

1. **User Service**
   - User CRUD operations
   - User profile management
   - Authentication/authorization

2. **Geographic Service**
   - ZIP code validation
   - Geographic data enrichment
   - Timezone management

3. **Notification Service**
   - Email notifications
   - Push notifications
   - Event-driven messaging

4. **Analytics Service**
   - User analytics
   - Geographic analytics
   - Reporting

### Migration Strategy

1. **Extract bounded contexts** from domain layer
2. **Implement service interfaces** for inter-service communication
3. **Add message queues** for async communication
4. **Implement API gateway** for unified access
5. **Add service discovery** and load balancing

## 🧪 Development Scripts

### Available Commands

```bash
# Install dependencies in all workspaces
npm run install:all

# Development (runs backend + frontend concurrently)
npm run dev

# Individual services
npm run dev:server    # Backend only
npm run dev:client    # Frontend only

# Building
npm run build         # Build both server and client

# Testing
npm run test          # Run all tests
npm run lint          # Lint all code
```

### Testing Strategy

```bash
# Backend testing
cd server
npm run test              # Unit tests
npm run test:watch       # Watch mode
npm run type-check       # TypeScript checking

# Frontend testing
cd client
npm run test             # Unit tests
```

## 🐳 Docker Configuration

The project includes Docker configuration for both development and deployment:

```yaml
# Development (docker-compose.yml)
services:
  backend:
    build: ./server
    ports: ["8080:8080"]
    environment:
      - NODE_ENV=development
      - FIREBASE_EMULATOR_HOST=firebase-emulator
    volumes:
      - ./server:/app  # Hot reload

  frontend:
    image: node:20-alpine
    ports: ["5173:5173"]
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api

  firebase-emulator:
    image: node:20-slim
    ports: ["9000:9000", "4000:4000"]
```

### Docker Commands

```bash
# Start all services (wait for Firebase emulator to be ready)
docker-compose up --build

# Run in background (still wait ~60s before using the app)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean rebuild (if you encounter dependency issues)
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Troubleshooting Docker Setup

If you encounter issues with dependencies or builds:

```bash
# 1. Clean everything and rebuild
docker-compose down --volumes --remove-orphans
docker system prune -f
docker-compose up --build

# 2. If still having issues, install dependencies locally first (fallback)
npm run install:all
docker-compose up --build
```

## 🔒 Security & Performance

### Security Measures
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate limiting**: Protection against abuse
- **Input validation**: Zod schemas for all inputs
- **Error sanitization**: No sensitive data in error responses

### Performance Optimizations
- **Compression**: Gzip compression for responses
- **Connection pooling**: Database connection management
- **Lazy loading**: Frontend component lazy loading

## 📊 Monitoring & Observability

### Logging
- **Structured logging** with Pino
- **Request correlation** IDs
- **Performance metrics** tracking
- **Error tracking** and alerting

### Health Checks
- **Health endpoint**: `/health` (always OK)
- **Readiness endpoint**: `/ready` (checks dependencies)
- **Docker health checks** for container orchestration

## 🚀 Environment Variables

### Required
```bash
# Replace this with your actual OpenWeather API key
OPENWEATHER_API_KEY=your_api_key_here
```

### Optional (with defaults)
```bash
NODE_ENV=development
PORT=8080
LOG_LEVEL=info
FIREBASE_PROJECT_ID=rentredi-assessment-dev
FIREBASE_DATABASE_URL=http://firebase-emulator:9000?ns=rentredi-assessment-dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the RentRedi technical assessment.

## 🙏 Acknowledgments

- **OpenWeather API** for geographic data
- **Firebase** for real-time database capabilities
- **Express.js** team for the excellent framework
- **React** team for the amazing frontend library

## 🔍 Assumptions & Limitations

### Technical Assumptions
- Deviated from NestJS scaffolding to keep implementation simpler and more focused
- Users have modern browsers that support ES6+ features
- Node.js 18+ is available in the development/deployment environment
- Docker is available for containerized deployment
- Stable internet connection for OpenWeather API calls
- Single timezone operation (UTC) for backend services

### Business Assumptions
- Only US ZIP codes are supported (OpenWeather API limitation)
- User names don't require special characters or multilingual support
- No authentication/authorization required for MVP
- Single tenant system (no organization/team separation)
- No need for soft delete (users are hard deleted)

### Data Assumptions
- ZIP codes are valid US postal codes
- User names are between 2 and 50 characters
- Geographic coordinates are always available for valid ZIP codes
- Reasonable request rate (no need for complex rate limiting)

## 🧪 Testing Details

### Backend Testing Coverage
- **Unit Tests**
  - User entity validation
  - Use case business logic
  - Repository implementations
  - OpenWeather API client
  - Error handling middleware

- **Integration Tests**
  - API endpoints (CRUD operations)
  - Database interactions
  - External API integration
  - Error responses
  - Input validation

- **Test Environment**
  - Jest for test runner
  - Supertest for HTTP assertions
  - Firebase emulator for database tests
  - Mock service for OpenWeather API

### Manual Testing Scenarios
- Form validation edge cases
- Geographic data accuracy
- Real-time updates
- Mobile responsiveness
- Error state handling
- Loading state displays
- Animation smoothness

### Performance Testing
- Load testing with Artillery
- Memory usage monitoring
- Response time benchmarking
- Database query optimization
- Frontend bundle size analysis

---

**Built with ❤️ using modern web technologies and best practices**