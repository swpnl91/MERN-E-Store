# E-Commerce Website with MERN Stack

E-Store is a full-stack web application that was built using the MERN (MongoDB, Express, React, Node.js) stack.

It is essentially an e-commerce website where users can browse products, add items to their cart, and checkout using BrainTree for payment processing.

The application also features a user authentication system that allows users to create an account and save their information for future purchases.

## Final Product

###### Click [here](https://easy-erin-zebra-shoe.cyclic.app/) to check out the deployed app

###### The following is a snippet of the admin dashboard and its functionalities. These functionalities are only accessible to the admins.

https://user-images.githubusercontent.com/91759275/229358156-e19a9b8e-4cb9-40af-911a-88bf05245f5c.mov

## Features

- User authentication and authorization using JSON Web Tokens (JWT).
- Product catalog browsing and search functionality.
- Product filtering by category and price range.
- Shopping cart functionality with the ability to add, remove, and update items.
- BrainTree integration for secure and reliable payment processing.
- Admin panel for managing products, categories, and orders.

## Technologies used -

- MongoDB: NoSQL database used for storing product information, user information, and order details.
- Express: Web application framework used for building the server-side API.
- React: Front-end JavaScript library used in tandem with React Context for building the user interface.
- Node.js: JavaScript runtime environment used for running the server-side code.
- BrainTree: Payment processing API used for securely processing credit card payments.
- JWT: Authentication and authorization method used for securing user accounts and API routes.
- Bootstrap: Front-end framework used for styling the application.

## Things to be added in future -

- This app is _NOT_ mobile responsive and hence this functionality will be added in future.
- Currently, it also doesn't factor in products that are out of stock.
- Pagination will also be added in future.
- Using nodemailer to communicate with the users (for sending email confirmation link, OTPs etc.).
- Functionality to add same product twice in a single order that makes it a single product and ony increases its quantity instead of making two separate entries.
- Using Redux instead of React Context so that the handling of state changes, is quick and efficient.
- Using Cloudinary to store images.

## Dependencies

#### Backend

- Express
- Mongoose
- Bcrypt
- JSON Web Token
- Braintree
- Concurrently
- Cors
- Nodemon
- Morgan
- Dotenv
- Slugify
- Express Formidable
- Colors

#### Frontend

- React
- React-router
- Axios
- React icons
- React helmet
- Toastify
- React hot toast
- Antd
- React Braintree web drop-in
- Moment

## Setup & Installation

1. Clone the repository:`git clone https://github.com/swpnl91/MERN-E-Store.git`
2. Install server dependencies: `npm install`
3. Install client dependencies: `cd client && npm install`
4. Configure environment variables:
   - Create a .env file in the server directory.
   - Add the following variables:
     - PORT: Port number of your liking for running the server.
     - MONGO_URL: MongoDB connection string.
     - JWT_SECRET: Secret key used for JWT authentication.
     - BRAINTREE_MERCHANT_ID: BrainTree Merchant ID.
     - BRAINTREE_PUBLIC_KEY: BrainTree API public key.
     - BRAINTREE_PRIVATE_KEY: BrainTree API secret key.
   - Create a .env file in the client directory.
   - Add the following variable:
     - REACT_APP_API: For connecting React App with backend.
5. Start the development server:
   - `npm run server` for running server (in the server directory) _AND_
   - `npm run client` for running client (in the client directory) _OR_
   - `npm run dev` for running both server/client concurrently (in the server directory).
