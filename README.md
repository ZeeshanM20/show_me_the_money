# Show Me The Money

"Show Me The Money" is a web application designed to display a balance sheet report from Xero, leveraging a microservices architecture with a frontend, backend, and a mock Xero API. This project uses Docker for containerization, facilitating easy deployment and scaling.

The original task requirements can be found [here](https://github.com/DemystData/code-drills/tree/main/show-me-the-money).

## Project Structure

### Frontend
- **Directory**: `show-me-the-money-fe`
- **Technology**: React, TypeScript
- **Port**: 3001
- **Description**: The frontend is a React application that provides a user interface for displaying balance sheet data. It interacts with the backend service to fetch and display financial data.
- **Build Command**: `npm run build`
- **Start Command**: `serve -s build -l 3001` (served using the `serve` package)

### Backend
- **Directory**: `show-me-the-money-be`
- **Technology**: Node.js, Express, TypeScript
- **Port**: 3002
- **Description**: The backend service provides an API endpoint that retrieves balance sheet data from a mock Xero API. It handles requests from the frontend and interacts with the mock Xero service to provide the required data.
- **Start Command**: `npm start`

### Xero API (Mock)
- **Image**: `jaypeng2015/show-me-the-money`
- **Port**: 3000
- **Description**: A mock Xero API that simulates responses from the actual Xero service. It is used by the backend to retrieve balance sheet data for demonstration purposes.

## Docker Setup

The project is containerized using Docker. The Docker Compose configuration is used to build and run the frontend, backend, and mock Xero API services together.

### Docker Compose File
```yaml
version: '1.0'

services:
  backend:
    build: ./show-me-the-money-be
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
    depends_on:
      - xero-api
    networks:
      - app-network

  frontend:
    build: ./show-me-the-money-fe
    ports:
      - "3001:3001"
    networks:
      - app-network
    environment:
      - REACT_APP_API_URL=http://backend:3002/api
    depends_on:
      - backend

  xero-api:
    image: jaypeng2015/show-me-the-money
    ports:
      - "3000:3000"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Running the Application

1. **Build and Run Containers**:
   ```bash
   docker-compose up --build

2. **Access the Application**:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3002
- **Mock Xero API**: http://localhost:3000/api/balance-sheet


## Testing

### Backend Tests
To run the backend tests, use the following command:

```bash
npm test
```

### Frontend Tests
To run the frontend tests, use the following command:

```bash
npm test
```

### Troubleshooting
- **Module Not Found Errors**: Ensure all dependencies are correctly installed in each service by running npm install in both show-me-the-money-fe and show-me-the-money-be directories.
- **Docker Networking Issues**: Make sure all services are correctly defined in the Docker Compose file and are on the same network.
- **Service Not Starting**: Check the logs for each service using docker-compose logs to identify any issues during startup.
