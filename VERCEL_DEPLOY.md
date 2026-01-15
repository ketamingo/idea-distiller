# How to Deploy to Vercel

Since your code is now on GitHub, deploying to Vercel is very easy.

## 1. Create a Vercel Account
If you don't have one, go to [vercel.com/signup](https://vercel.com/signup) and sign up with **GitHub**.

## 2. Import Your Repository
1.  On your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2.  You should see your repository `ketamingo/idea-distiller` in the list (if you signed up with GitHub).
3.  Click the **"Import"** button next to it.

## 3. Configure Environment Variables (CRITICAL)
Before you click deploy, you **MUST** add your API Key so the AI works on the live site.

1.  Look for the **"Environment Variables"** section and expand it.
2.  Add a new variable:
    *   **Key**: `GOOGLE_API_KEY`
    *   **Value**: `AIzaSyA32Lk_UkImzX88aTtyUJ53AAHh_LfYBXI`
3.  Click **"Add"**.

*(Note: Never share this key publicly. Vercel keeps it encrypted and safe.)*

## 4. Deploy
1.  Click **"Deploy"**.
2.  Wait about a minute for Vercel to build your site.
3.  Once done, you will get a live URL (e.g., `idea-distiller.vercel.app`).
4.  Visit that URL on your phone to install it as an app!
