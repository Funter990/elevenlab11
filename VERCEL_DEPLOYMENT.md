# Deploy Ali Voice Generator to Vercel (Free)

## Prerequisites
- A GitHub account
- A Vercel account (free at vercel.com)
- Your project files downloaded from Replit

## Step 1: Prepare Your Project

1. **Download your project files** from Replit
2. **Create a new folder** on your computer for the Vercel version
3. **Copy all files** except the `server/` folder (we've converted this to serverless functions)
4. **Replace package.json** with the contents from `package-vercel.json`
5. **Replace vite.config.ts** with the contents from `vite.config.vercel.ts`

## Step 2: Upload to GitHub

1. **Create a new repository** on GitHub
2. **Upload all your project files** to this repository, including:
   - `client/` folder (your React app)
   - `api/` folder (serverless functions)
   - `shared/` folder (shared types)
   - `vercel.json` (Vercel configuration)
   - `package.json` (renamed from package-vercel.json)
   - `vite.config.ts` (renamed from vite.config.vercel.ts)
   - All other config files (tailwind.config.ts, tsconfig.json, etc.)

## Step 3: Deploy on Vercel

1. **Go to vercel.com** and sign in with your GitHub account
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework Preset: **Vite**
   - Root Directory: **.**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

5. **Click "Deploy"**

## Step 4: Your App is Live!

- Vercel will give you a free URL like `your-app-name.vercel.app`
- Your voice generator will be accessible worldwide
- Updates automatically deploy when you push to GitHub

## Custom Domain (Optional)

To use your own domain:
1. **In Vercel dashboard**, go to your project settings
2. **Click "Domains"**
3. **Add your custom domain**
4. **Follow the DNS instructions** Vercel provides
5. **Wait for verification** (usually a few minutes)

## Vercel Free Tier Limits

- **100 GB** bandwidth per month
- **Unlimited** static file hosting
- **100** serverless function executions per day
- **10 seconds** max execution time per function

Perfect for your voice generator app!

## Support

If you need help, contact the developer via WhatsApp: https://wa.me/03107835694