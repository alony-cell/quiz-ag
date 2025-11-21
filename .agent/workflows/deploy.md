---
description: How to deploy the Next.js application
---

# Deploying the Application

The recommended way to deploy this Next.js application is using **Vercel**, the creators of Next.js. It provides the best performance, ease of use, and integration.

## Option 1: Deploy to Vercel (Recommended)

1.  **Push to Git**: Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).
2.  **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up.
3.  **Import Project**:
    *   Click "Add New..." -> "Project".
    *   Select your Git repository.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**: Add any environment variables you use (e.g., database URLs, API keys).
5.  **Deploy**: Click "Deploy". Vercel will build and deploy your app.

## Option 2: Self-Hosting (Node.js)

If you prefer to host it on your own server (e.g., DigitalOcean, AWS EC2, VPS):

1.  **Install Node.js**: Ensure Node.js (v18 or later) is installed on your server.
2.  **Clone & Install**:
    ```bash
    git clone <your-repo-url>
    cd <your-project-folder>
    npm install
    ```
3.  **Build the App**:
    ```bash
    npm run build
    ```
4.  **Start the Server**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000` (or the port specified by `$PORT`).
