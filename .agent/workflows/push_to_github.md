---
description: How to push your code to GitHub
---

# Pushing to GitHub

Since you already have a local Git repository, follow these steps to push your code to GitHub.

## 1. Create a Repository on GitHub

1.  Go to [github.com/new](https://github.com/new).
2.  Enter a **Repository name** (e.g., `my-quiz-app`).
3.  Choose **Public** or **Private**.
4.  **Do not** initialize with README, .gitignore, or License (you already have these).
5.  Click **Create repository**.

## 2. Connect Local Repo to GitHub

Copy the URL of your new repository (e.g., `https://github.com/username/my-quiz-app.git`).

Run the following command in your terminal (replace the URL with yours):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## 3. Commit and Push

1.  **Stage all changes**:
    ```bash
    git add .
    ```

2.  **Commit changes**:
    ```bash
    git commit -m "Initial commit of quiz app"
    ```

3.  **Push to GitHub**:
    ```bash
    git push -u origin main
    ```

## Future Pushes

After the initial setup, you only need to run:

```bash
git add .
git commit -m "Description of changes"
git push
```
