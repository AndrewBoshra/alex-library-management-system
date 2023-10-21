# **Alex Library Management System**

## **Project Overview**

This is a simple Library Management System implemented in Node.js using the NestJS framework. The system allows you to manage books, borrowers, and the borrowing process. It includes features like adding, updating, and deleting books, registering borrowers, and tracking due dates and overdue books.

## **Requirements**

Before running the project, ensure you have the following prerequisites:

- Node.js
- npm (Node Package Manager)
- MySQL database
- A **`.env`** file with the following configuration (you can use **`.env.example`** as a template):

```makefile

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=Password
DB_NAME=library

PORT=3000
ENV=development

```

## **Getting Started**

1. Clone the repository:

```bash

git clone https://github.com/andrew-boshra/alex-library-management-system.git

```

1. Install project dependencies:

```bash

cd alex-library-management-system
npm install

```

1. Create the database in your MySQL server with the name specified in your **`.env`** file (e.g., **`library`**).
2. Start the NestJS application:

```bash

npm run start:dev
```

The application should now be running on port 3000 (or the port specified in your **`.env`** file).

## **API Documentation**

The project is equipped with Swagger documentation. To access it, go to:

```bash

http://localhost:3000/swagger

```

You can interact with and test the API endpoints using Swagger's user-friendly interface.

## **Bonus Features**

The project also includes some optional bonus features:

- Analytical reports
