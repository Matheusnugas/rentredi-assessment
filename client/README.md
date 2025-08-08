# RentRedi Frontend

## Environment Configuration

### Development
In development mode, the frontend automatically proxies API calls to `http://localhost:8080` using Vite's proxy configuration.

### Production
For production deployments, you can configure the API base URL using environment variables:

1. **Create a `.env` file** in the `client/` directory:
```bash
# For same-domain deployment (recommended)
VITE_API_BASE_URL=/api

# For different domain/port
VITE_API_BASE_URL=https://api.yourapp.com
```

2. **Build the application**:
```bash
npm run build
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` (dev proxy) | No |

### Deployment Scenarios

#### Same Domain (Recommended)
- Frontend and backend served from the same domain
- Use `VITE_API_BASE_URL=/api`
- Backend handles routing for `/api/*` paths

#### Different Domains
- Frontend and backend on separate domains
- Use `VITE_API_BASE_URL=https://api.yourapp.com`
- Ensure CORS is configured on the backend

#### Docker/Container
- Set environment variables in your deployment configuration
- Example: `VITE_API_BASE_URL=http://backend:8080` 