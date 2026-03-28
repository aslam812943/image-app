# Image App - Professional Image Management System

A full-stack, secure, and modern image management application built with React, Node.js, and MongoDB. This application allows users to securely manage their image collections with advanced features like drag-and-drop reordering and robust identity verification.

## 🚀 Key Features

*   **Secure Authentication**: Full user lifecycle management including registration, login, logout, and password recovery.
*   **Identity Verification**: Robust "Forgot Password" flow with multi-step identity verification (Email/Phone).
*   **Image Management**: 
    *   Secure image uploads via Cloudinary.
    *   Dynamic image gallery with real-time updates.
    *   **Drag & Drop Reordering**: Intuitively organize your collection using `@dnd-kit`.
    *   CRUD operations for image metadata (Update/Delete).
*   **Modern UI/UX**: Built with Tailwind CSS v4 for a sleek, responsive, and premium feel.
*   **Production Ready**: Implements SOLID principles and a repository pattern.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API
- **Networking**: [Axios](https://axios-http.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Notifications**: [Toastify-js](https://github.com/apvarun/toastify-js)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Validation/Security**: Bcrypt for password hashing

## 🏗️ Architecture

The project is structured using the **Repository Pattern** and adheres to **SOLID principles** for better maintainability and scalability:

-   **Controllers**: Handle incoming HTTP requests, validate input, and return appropriate responses.
-   **Services**: Contain the core business logic and coordinate between different components.
-   **Repositories**: Abstraction layer for database operations, ensuring that the service layer is decoupled from the data storage implementation.
-   **Middleware**: Handles cross-cutting concerns such as authentication, error handling, and file processing.
-   **Interfaces**: Ensure loose coupling by defining strict contracts for services and repositories.

## 📥 Installation & Setup

### Prerequisites
- Node.js (>= 20.0.0)
- MongoDB account
- Cloudinary account

### Backend Setup
1.  Navigate to `backend/` folder.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    FRONTEND_URL=http://localhost:5173
    ```
4.  Run development server: `npm run dev`.

### Frontend Setup
1.  Navigate to `frontend/` folder.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Run development server: `npm run dev`.

## 🌐 Hosting & Deployment

### Backend (e.g., Render, Railway)
-   Set the Build Command to `npm install && npm run build`.
-   Set the Start Command to `npm start`.
-   Configure Environment Variables as listed in the Backend Setup.

### Frontend (e.g., Vercel, Netlify)
-   Set the Build Command to `npm run build`.
-   Set the Output Directory to `dist`.
-   Configure `VITE_API_URL` as an environment variable pointing to your deployed backend.


