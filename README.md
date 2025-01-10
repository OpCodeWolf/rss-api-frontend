# RSS-API-Frontend

This RSS-API-Frontend is a React-based user interface designed to interact with the RSS-API-Server. It provides a seamless experience for users to manage RSS feeds, authenticate, and access various functionalities offered by the backend RSS-API-Server.

![Alt text](/resources/img/Screenshot_20250107_220112.png?raw=true "RSS API Frontend Latest News - This is how I get all of my news.")

![Alt text](/resources/img/Screenshot_20250109_212106.png?raw=true "Responsive Design")

![Alt text](/resources/img/Screenshot_20250109_212509.png?raw=true "Mobile View")

## Features
- User authentication and management
- Dashboard for viewing and managing RSS feeds
- User-friendly interface for adding, editing, and deleting RSS streams
- Responsive design for optimal viewing on various devices

## Configuration
Before running the project, you need to create a `config.json` file based on the provided `config-example.json`. This file contains essential configuration settings for the application.

### Configuration File
The `config.json` file should include the following settings:

```json
{
  "serverPort": 4000,
  "serverUrl": "https://rssfrontend.example.com",
  "backendAPIBaseUrl": "https://rss.example.com"
}
```

- **serverPort**: The port on which the server will run.
- **serverUrl**: The URL of the frontend application.
- **backendAPIBaseUrl**: The base URL for the backend API that the frontend will communicate with.

Make sure to adjust these values according to your environment.

## Installation
To install the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/OpCodeWolf/rss-api-frontend
   cd rss-api-frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Starting the Project
To start the project locally, run:
```bash
npm start
```
This command will build the TypeScript code and start the development server.

## Testing
To run the tests for the project, use the following command:
```bash
npm test
```
This will build the project and execute the tests using Jest.

## Deployment as a Docker Container
To deploy the project as a Docker container, follow these steps:

1. Build the Docker image:
   ```bash
   npm run build
   ```

2. Start the container:
   ```bash
   docker-compose up -d
   ```

The UI will be accessible at `http://localhost:3000`.

### Environment Variables
You can set environment variables in the `docker-compose.yml` file as needed. The `NODE_ENV` variable is set to `production` by default.

## Logging In with the Default Admin User
>Please note that you can change the password and token with the API once authenticated.

To log in with the default admin user account, use the following credentials:

- **Username**: `admin`
- **Password**: `admin123`

You can also view the UI specification in the [rss-api-frontend-spec.md](rss-api-frontend-spec.md) file.
