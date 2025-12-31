# Master Mind Council - Vercel Deployment Guide

## 🎯 Current Status
- ✅ Application fully functional on Manus dev server
- ✅ Stable commit: `afe0523a`
- ✅ All 6 advisors operational
- ✅ Database: Neon PostgreSQL (already configured)
- ✅ Authentication: Email/password (JWT-based)

## 📋 Pre-Deployment Checklist

### ✅ Already Complete
- [x] `vercel.json` configuration file created
- [x] GitHub repository exists: `https://github.com/mastermind-council/mastermind-council`
- [x] Vercel project connected to GitHub
- [x] Some environment variables already in Vercel

### 🔑 Environment Variables Status

#### Already in Vercel ✅
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`

#### Need to Add to Vercel ⚠️
- `ELEVENLABS_API_KEY` - **CRITICAL** for Dr. Kai's custom voice
- `DATABASE_URL_NEON` - (if different from DATABASE_URL)

#### NOT Needed (Manus-specific) ❌
- ~~`VITE_APP_ID`~~ - Only needed for Manus OAuth (you use email/password)
- ~~`OAUTH_SERVER_URL`~~ - Only needed for Manus OAuth
- ~~`OWNER_OPEN_ID`~~ - Only needed for Manus OAuth
- ~~`BUILT_IN_FORGE_API_URL`~~ - Only needed for Manus built-in services
- ~~`BUILT_IN_FORGE_API_KEY`~~ - Only needed for Manus built-in services

## 🚀 Deployment Steps

### Step 1: Add Missing Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

```
ELEVENLABS_API_KEY=<your-elevenlabs-api-key>
```

**Important:** Make sure to set it for all environments (Production, Preview, Development)

### Step 2: Push Code to GitHub

From your local machine (NOT from Manus):

```bash
# Navigate to your local project directory
cd /path/to/mastermind-council

# Pull latest changes from GitHub
git pull origin main

# Download the latest code from Manus
# (You'll need to export/download the project files from Manus)

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Update from Manus stable build (afe0523a) - all 6 advisors operational"

# Push to GitHub
git push origin main
```

### Step 3: Vercel Will Auto-Deploy

Once you push to GitHub, Vercel will automatically:
1. Detect the changes
2. Run the build process (`pnpm build`)
3. Deploy to production

### Step 4: Verify Deployment

1. **Check Build Logs** in Vercel dashboard
2. **Test the live URL** that Vercel provides
3. **Verify key features:**
   - Login works
   - All 6 advisors accessible
   - Chat functionality (text)
   - Voice dictation
   - Image uploads
   - Dr. Kai's ElevenLabs voice

## ⚠️ Potential Issues & Solutions

### Issue 1: Build Fails with TypeScript Errors

**Solution:** The app has 1 known TypeScript error that doesn't affect functionality:
```
client/src/pages/Home.tsx(1,31): error TS7016: Could not find a declaration file for module '@/components/MasterMindCouncil'
```

This is because `MasterMindCouncil.jsx` is JavaScript, not TypeScript. This won't break the build.

### Issue 2: Database Connection Fails

**Symptoms:** Login doesn't work, conversations don't save

**Solution:**
1. Verify `DATABASE_URL` in Vercel matches your Neon connection string
2. Check Neon dashboard to ensure database is accessible
3. Verify connection string format:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

### Issue 3: Dr. Kai's Voice Doesn't Work

**Symptoms:** Dr. Kai's TTS falls back to OpenAI voice instead of ElevenLabs

**Solution:**
1. Verify `ELEVENLABS_API_KEY` is set in Vercel
2. Check ElevenLabs dashboard for API key validity
3. Verify voice ID in code: `9IzcwKmvwJcw58h3KnlH`

### Issue 4: 404 Errors on API Routes

**Symptoms:** `/api/chat`, `/api/tts`, etc. return 404

**Solution:**
1. Verify `vercel.json` is in the repository root
2. Check Vercel build logs for routing errors
3. Ensure build output includes `dist/index.js`

### Issue 5: Static Assets Not Loading

**Symptoms:** Images, CSS, or JS files return 404

**Solution:**
1. Verify build creates `dist/public/` directory
2. Check `vite.config.ts` has correct `outDir`
3. Ensure all assets are in `client/public/` directory

## 🔍 Debugging Tips

### Check Build Logs
1. Go to Vercel dashboard
2. Click on the deployment
3. View **Build Logs** tab
4. Look for errors in:
   - `npm install` / `pnpm install`
   - `pnpm build`
   - File copying/moving

### Check Runtime Logs
1. Go to Vercel dashboard
2. Click **Logs** tab
3. Filter by **Errors** to see runtime issues
4. Common issues:
   - Missing environment variables
   - Database connection errors
   - API errors

### Test Locally First
Before pushing to Vercel, test the production build locally:

```bash
# Build the project
pnpm build

# Start production server
pnpm start

# Test at http://localhost:3000
```

## 📊 Build Process Explained

Your `package.json` build script does two things:

```json
"build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

1. **`vite build`** - Builds the React frontend
   - Input: `client/` directory
   - Output: `dist/public/` (configured in `vite.config.ts`)
   - Creates optimized HTML, CSS, JS bundles

2. **`esbuild server/_core/index.ts`** - Builds the Express backend
   - Input: `server/_core/index.ts`
   - Output: `dist/index.js`
   - Bundles all server code into single file

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Login page loads
- ✅ Can log in with existing credentials
- ✅ All 6 advisors visible on main page
- ✅ Can start conversation with any advisor
- ✅ Text chat works (messages send/receive)
- ✅ Voice dictation works (Web Speech API)
- ✅ Image uploads work
- ✅ Dr. Kai uses ElevenLabs voice (not OpenAI fallback)
- ✅ Conversation history persists
- ✅ Can load previous conversations from archive

## 🆘 If All Else Fails

If deployment fails repeatedly:

1. **Check Vercel's Node.js version**
   - Your app requires Node.js 18+
   - Add to `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

2. **Simplify the build**
   - Try deploying without the latest changes first
   - Use a known-good commit (like `afe0523a`)

3. **Contact Vercel Support**
   - Provide build logs
   - Mention you're migrating from Manus platform

## 📝 Post-Deployment Tasks

After successful deployment:

1. **Update DNS** (if using custom domain)
2. **Test all 6 advisors** thoroughly
3. **Monitor error logs** for first 24 hours
4. **Set up Vercel analytics** (optional)
5. **Configure custom domain** (optional)

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/mastermind-council/mastermind-council
- **Neon Database:** https://console.neon.tech
- **ElevenLabs:** https://elevenlabs.io/app/speech-synthesis
- **OpenAI API:** https://platform.openai.com/api-keys

---

**Last Updated:** December 30, 2025  
**Stable Commit:** `afe0523a`  
**Status:** Ready for deployment ✅
