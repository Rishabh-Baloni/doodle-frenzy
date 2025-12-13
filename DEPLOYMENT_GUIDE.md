# Deployment Guide - Doodle Frenzy

## Prerequisites
- GitHub account
- Render account
- MongoDB Atlas account (for database)

## Step 1: Prepare Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/Rishabh-Baloni/doodle-frenzy.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render
5. Get your connection string (Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/doodle-frenzy`)

## Step 3: Deploy on Render

### Option A: Using render.yaml (Automatic)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and set up both services automatically
5. Add environment variables for each service:

   **Backend Environment Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your frontend URL (after deployment, e.g., `https://doodle-frenzy-frontend.onrender.com`)
   - `PORT`: 10000 (auto-set by Render)
   - `NODE_ENV`: production

   **Frontend Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL (e.g., `https://doodle-frenzy-backend.onrender.com`)
   - `NODE_ENV`: production

### Option B: Manual Deployment

#### Deploy Backend:
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `doodle-frenzy-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables (see above)

#### Deploy Frontend:
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `doodle-frenzy-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables (see above)

## Step 4: Update CORS Configuration

After deployment, update backend's `index.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
};
```

## Step 5: Configure Socket.IO

Update `frontend/src/utils/socket.js` to use the environment variable:

```javascript
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
```

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Create a game and test all features
3. Check browser console for any errors
4. Verify WebSocket connections are working

## Important Notes

- **Free Tier Limitations**: Render's free tier spins down services after inactivity. First request after inactivity may take 30-60 seconds.
- **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.
- **Database**: Use MongoDB Atlas free tier (M0) for production.
- **Custom Domain**: Configure custom domains in Render settings if desired.

## Troubleshooting

### WebSocket Connection Issues
- Ensure backend URL in frontend env variable is correct
- Check CORS configuration
- Verify Render services are running

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has proper permissions

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

## Continuous Deployment

Render automatically redeploys when you push to the main branch. To deploy updates:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Environment Variables Reference

Copy values from `.env.example` files and update with actual production values.

---

For more help, visit [Render Documentation](https://render.com/docs) or [Render Community Forum](https://community.render.com/)
