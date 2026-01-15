# How to Push to GitHub

It looks like `git` is not installed on your system (or not in your PATH).

## 1. Install Git
Download and install Git from [git-scm.com](https://git-scm.com/downloads).
When installing, use the default options.

## 2. Initialize the Repository
Open a terminal in this folder (`C:\Users\Steven\.gemini\antigravity\scratch`) and run:

```bash
git init
git add .
git commit -m "Initial commit: Idea Distiller PWA"
```

## 3. Create a Repo on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name it `idea-distiller` (or whatever you like).
3. Do **not** check "Initialize with README" (you already have files).
4. Click **Create repository**.

## 4. Push Your Code
Copy the commands GitHub gives you (under "…or push an existing repository from the command line") and run them. They will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/idea-distiller.git
git branch -M main
git push -u origin main
```
