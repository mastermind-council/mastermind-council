# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] You have access to Vercel dashboard
- [ ] You have access to GitHub repository
- [ ] You have ElevenLabs API key ready
- [ ] You have verified Neon database is accessible

## Step 1: Add Environment Variable to Vercel
- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Add `ELEVENLABS_API_KEY` with your key
- [ ] Set for all environments (Production, Preview, Development)

## Step 2: Export Code from Manus
- [ ] Download all project files from Manus
- [ ] Ensure you have the stable commit (`afe0523a`)

## Step 3: Push to GitHub
From your local machine:

```bash
cd /path/to/mastermind-council
git pull origin main
# Copy Manus files to this directory
git add .
git commit -m "Deploy stable build from Manus"
git push origin main
```

## Step 4: Monitor Vercel Deployment
- [ ] Check Vercel dashboard for automatic deployment
- [ ] Review build logs for errors
- [ ] Wait for deployment to complete (~2-5 minutes)

## Step 5: Test Deployment
- [ ] Visit the Vercel URL
- [ ] Test login with existing credentials
- [ ] Verify all 6 advisors are visible
- [ ] Test chat with Dr. Kai (check ElevenLabs voice)
- [ ] Test chat with Maya
- [ ] Test voice dictation
- [ ] Test image upload
- [ ] Check conversation history loads

## If Something Goes Wrong
1. Check Vercel build logs first
2. Verify environment variables are set
3. Check Neon database connection
4. Review the detailed guide: `VERCEL_DEPLOYMENT_GUIDE.md`

## Success! ✅
- [ ] Application is live on Vercel
- [ ] All features working
- [ ] No console errors
- [ ] Database saving conversations
- [ ] ElevenLabs voice working for Dr. Kai

---

**Need Help?** See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
