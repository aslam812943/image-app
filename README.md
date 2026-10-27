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
3.  Create a `.env` file with:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  Run development server: `npm run dev`.

### Frontend Setup
1.  Navigate to `frontend/` folder.
2.  Install dependencies: `npm install`.
3.  Run development server: `npm run dev`. Vite proxies `/api` to the backend on port 5000, so start the backend first.

## 🌐 Hosting & Deployment

### Vercel Services

Import this repository as one Vercel project, keep the project root at the repository root, and set its Framework Preset to **Services**. The root `vercel.json` builds `backend` as Express and `frontend` as Vite. Public `/api/*` requests reach the backend; all other paths reach the frontend. The frontend calls `/api` on the same origin, so no `VITE_API_URL` or service binding is needed. Image files are stored on Cloudinary, not on the function filesystem.

Set `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the Vercel project environment. Set `COOKIE_MAX_AGE` if you want to override the one-day default. Do not set a binding URL manually.

Use `vercel dev -L` from the repository root to run both services locally without linking a Vercel project. The separate `npm run dev` commands described above also work.


