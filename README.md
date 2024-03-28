# Task Manager Api

## Description
The Task Manager API is a RESTful web service that allows users to manage their tasks. It provides endpoints for creating, updating, and deleting tasks, as well as retrieving task details and a list of all tasks. In addition, tasks can be added to projects, as well as filtered and sorted.

This API is built using Nest.js, a progressive Node.js framework for building efficient, scalable, and maintainable server-side applications. Nest.js provides a solid foundation for developing robust and modular applications, making it an ideal choice for projects like the Task Manager API.

## Documentation
The documentation for the Task Manager API is implemented with Swagger API and can be accessed at `localhost:3000/api`.

## Installation

```bash
$ npm install
```

## Configuration
To ensure proper functionality of the application, it's necessary to create a `.env` file in the root directory of the repository. Below is an example of its contents:
```bash
MONGO_URI="mongoUri"
JWT_SECRET="secretWord"
JWT_EXPIRE="1h"
```
Make sure to replace `mongoUri` with your actual MongoDB connection string, `secretWord` with your desired JWT secret key, and adjust the JWT expiry time (`1h`) as needed.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

[MIT licensed](LICENSE).
