# How to Push to GitHub

It looks like `git` is not installed on your system (or not in your PATH).

## 1. Install Git
Download and install Git from [git-scm.com](https://git-scm.com/downloads).
When installing, use the default options.

## 1. Create a Repo on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name it `idea-distiller`.
3. Do **not** check "Initialize with README".
4. Click **Create repository**.

## 2. Push Your Code
I have already initialized the repo and committed your code.
Copy the commands GitHub gives you and run them in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/idea-distiller.git
git branch -M main
git push -u origin main
```
