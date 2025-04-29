# Game Management API Solution

## Project Architecture

This project implements a backend API for game management with a simple admin frontend. It follows a clean architecture approach with clear separation of concerns.

### Backend Architecture

The backend is built using Firebase Cloud Functions with Express and follows these architectural principles:

1. **Domain-Driven Design (DDD)**: The core domain entities (Game) are encapsulated with their own business logic and validation.

2. **Repository Pattern**: Data access is abstracted through repositories, enabling easy switching between data sources.

3. **Factory Pattern**: Controllers and repositories are created through factory functions for better dependency injection.

4. **Service Layer**: Business logic is encapsulated in service classes that coordinate between controllers and repositories.

5. **Validation**: Input validation is handled through dedicated validators before reaching the domain logic.

### Project Structure

```
functions/
├── src/
│   ├── apis/            # External API integrations (Firebase, etc.)
│   ├── controllers/     # HTTP request handlers
│   ├── entities/        # Domain entities and validators
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── scripts/         # Utility scripts (seeding, etc.)
│   └── utils/           # Shared utilities
```

### Design Patterns Used

- **SOLID Principles**: The code follows Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
- **Dependency Injection**: Dependencies are passed to components rather than created within them.
- **Memoization**: Expensive operations like Firebase connections are memoized for performance.
- **Error Handling**: Consistent error handling patterns throughout the application.

### Frontend Implementation

The frontend is built with React and Ant Design, offering a simple but functional UI to interact with the API. While not the primary focus of this project, it demonstrates basic CRUD operations against the backend.

## Running the Project (Following Test Instructions)

The project includes the required scripts in the root package.json:

```bash
# Build the Docker image
npm run buildImage

# Start the Docker container
# This will automatically start emulators AND seed the database
npm run start
```

### Script Details

1.  **buildImage**: Builds a Docker image that contains the Firebase emulators and the application code.
2.  **start**: Runs the Docker container. The container's entrypoint script automatically starts the Firebase emulators, waits for them to initialize, and then runs the seed script. The emulators remain running.
3.  **seed**: (This script is primarily for local development *without* Docker). Seeds the Firestore database with game data from `games.json`, connecting to locally running emulators if the environment variables are set.

### Important Notes

-   When using Docker (`npm run start`), the database seeding happens **automatically** after the emulators start inside the container.
-   You no longer need to run `npm run seed` in a separate terminal when using the Docker workflow.
-   The emulators will be accessible at their default ports mapped to your host machine. **Check the container logs when running `npm run start` for the exact ports**, as they might shift if the default is busy.
    -   Firebase UI: http://localhost:5000
    -   **Admin UI (Hosting): http://localhost:5002** (Commonly shifts from 5001)
    -   Functions: http://localhost:5004
    -   Firestore: http://localhost:5003
    -   Auth: http://localhost:9099

## API Endpoints

The API provides the following endpoints (typically served on port 5004):

- `GET /v1/games`: Get all games
- `GET /v1/games/:id`: Get a specific game by ID
- `POST /v1/games`: Create a new game
- `PUT /v1/games/:id`: Update an existing game
- `DELETE /v1/games/:id`: Delete a game

## Data Model

Games have the following structure:
```typescript
interface Game {
  id: number;
  name: string;
  releaseYear: number;
  players: {
    min: number;
    max?: number;
  };
  publisher: string;
  expansions: number[];
  standalone?: boolean;
  type: 'BaseGame' | 'Expansion';
  baseGame?: number;
}
```

## Troubleshooting

If you encounter any issues:

1.  Check the Docker container logs using `docker logs <container_id>`.
2.  Ensure no other processes are using the required ports (5000-5004, 9099).
3.  If seeding fails within the container, check the error messages in the logs. You might need to adjust the `sleep` duration in `entrypoint.sh` if your machine takes longer to start the emulators.