# README #
Mern Media User and Post Microservice

This microservice is a Node.js application that provides a RESTful API for managing users and their associated posts.

### Prerequisites ###   
* Node.js v14 or higher

### Installation ###
* Clone the repository: git clone https://github.com/SRK-prog/social-media-project-user-and-post-microservice

* Install the dependencies: npm install

* Create a .env file in the root of the project and set the following environment variables:
    - MONGO_URI: the connection string for your MongoDB database
    - JWT_SECRET_TOKEN:  a secret key used to sign JSON web tokens
    - WEB_APP_BASE_URL: the client side url to send password recovery link
    - MAIL_EMAIL: gmail for nodemailer to send emails to user for password recover link
    - MAIL_PASSWORD: google email app password for nodemailer

* Start the application: 
    - production: npm start
    - development: npm run dev


### Usage ###
The API supports the following endpoints:
- POST /auth/sigup: Creates a new user
- POST /auth/login: login a user
- GET /users: Retrieves a specific user by userId or username in query
- PUT /users: Updates an existing user
- DELETE /users: Deletes an existing user
- GET : Retrieves a list of all posts for a specific user
- GET :postId: Retrieves a specific post for a user by ID
- POST : Creates a new post for a user
- PUT :postId: Updates an existing post for a user
- DELETE :postId: Deletes an existing post for a user

Requests to create, update, or delete a user or post require authentication.

### Deployment ###
The application can be deployed to a hosting platform such as Heroku or AWS. Make sure to set the environment variables in the hosting platform as well.

