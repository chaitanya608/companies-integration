# Partner Simulator API

## Overview

The Partner Simulator API is a Node.js application designed to simulate the backend functionalities of the partner product. It is developed as part of a partnership integration proof of concept, enabling users of the partner product to seamlessly log into Qmap without a separate login process. This simulator uses ExpressJs for routing and TypeScript for enhanced type safety.

## Features

- User registration and self-signup
- User login
- Fetch user details by email
- Health check endpoint for application liveliness

## Getting Started

### Prerequisites

- Node.js (version 20.11.1 or higher recommended)

### Environment Variables

- `DATABASE_URL` - connection string for the database.
- `QMAP_BASEURL` - base url of the qmap application that this API server communicates with.
- `Q_API_KEY` - API key generated and shared by Qapita for authenticating issuer creation endpoints.

### Installation

```
// project root dir
npm install
```

### Starting the application

```
// project root dir
npm run devStart
```

This launches the application in the default `3000` port.

### Building the application

```
// project root dir
npm run build
```

## API Endpoints

1. `[POST] /api/self-signup` - user registration

```ts
type SelfSignupRequest = {
  companyDetails: {
    name: string;
    country: string;
    currency: string;
  };
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};
```

2. `[POST] /api/login` - user login

```ts
type LoginRequest = {
  email: string;
  password: string;
};
```

3. `[GET] /api/user` - get user by email

```
query params - email
```
