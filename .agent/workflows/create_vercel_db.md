---
description: How to create and connect a Vercel Postgres database
---

# Creating a Database in Vercel

Vercel provides a serverless PostgreSQL database that integrates perfectly with Next.js.

## 1. Create the Database

1.  Go to your project dashboard on [vercel.com](https://vercel.com).
2.  Click on the **Storage** tab at the top.
3.  Click **Create Database**.
4.  Select **Postgres**.
5.  Click **Continue**.
6.  Accept the terms and click **Create**.
7.  Choose a region (select the one closest to your users, e.g., `Washington, D.C. (iad1)` or `Frankfurt (fra1)`).
8.  Click **Create**.

## 2. Connect to Your Project

1.  Once created, go to the **Settings** tab of your new database (or the "Project" section in the database view).
2.  Ensure your project is listed under "Connected Projects". If not, click **Connect Project** and select your app.

## 3. Pull Environment Variables Locally

To develop locally with this database, you need to pull the credentials.

1.  Open your terminal in the project folder.
2.  Run:
    ```bash
    npx vercel env pull .env.local
    ```
    *(You may need to log in with `npx vercel login` first)*.

3.  This will create (or update) your `.env.local` file with keys like `POSTGRES_URL`, `POSTGRES_USER`, etc.

## 4. Install the SDK

To use the database in your code, install the Vercel Postgres SDK:

```bash
npm install @vercel/postgres
```
