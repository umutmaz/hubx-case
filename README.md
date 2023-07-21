


## Running the app


Navigate to the directory where docker-compose.yml and Dockerfile exist, run:
```bash
$ docker-compose up -d --build
```
The application will be running on $PORT if set in .env, 3000 if not set in .env file.

Interactive OpenAPI documentation will be available at:
<http://localhost:PORT/docs>

*Note: .env file is not uploaded. You can create your own with PORT, MONGO_PORT and DB_NAME, or the application will use the defaults: 
{PORT: 3000, MONGO_PORT: 27018, DB_NAME: hubx_db}

## Test

1. Get in the container
```bash
$ docker exec -it hubx-node-api bash
```
2. Run tests
```bash
$ npm run test
```