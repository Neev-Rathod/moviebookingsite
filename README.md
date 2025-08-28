# Movie Booking Application

A full-stack movie booking application with role-based authentication allowing users to browse and book movie tickets, while administrators can manage movie listings.

## Live Demo

- Deployed URL: [https://moviebookingsite.onrender.com](https://moviebookingsite.onrender.com/)

## Features

### User Features
- Browse available movies with their details (status, timing, available seats)
- Create an account (signup/login) with JWT authentication
- Book movie tickets (1-4 seats per booking)
- Cancel bookings
- View booking history

### Admin Features
- Login with pre-created admin credentials
- Add new movies with details (name, seats, time, image)
- Remove movies (only if no seats are occupied)
- Browse all movies with their status

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- Tailwind for styling

### Backend
- Node.js with Express.js
- MongoDB Atlas with Mongoose
- JWT for authentication
- Multer for image uploads

## Project Structure

```
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── uploads/          # Movie image uploads
│   └── server.js         # Server entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/          # API handler
│       ├── components/   # components
│       ├── context/      # Context
│       └── App.js        # Root component
```

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/Neev-Rathod/moviebookingsite.git
   cd movie-booking-app/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Admin login

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a specific movie
- `POST /api/movies` - Add a new movie (Admin only)
- `DELETE /api/movies/:id` - Delete a movie (Admin only)

### Bookings
- `POST /api/bookings` - Book movie tickets
- `DELETE /api/bookings/:id` - Cancel a booking
- `GET /api/bookings/user` - Get user's bookings

## User Roles

### Normal User
- Default role on signup
- Can browse movies, book and cancel tickets
- Limited to 1-4 seats per booking

### Admin
- Can add and remove movies
- Cannot book/cancel tickets
