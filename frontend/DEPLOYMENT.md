# Doodle Frenzy - Next.js Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- A [Vercel](https://vercel.com) account
- Your MongoDB Atlas connection string
- Backend server deployed (e.g., on Heroku, Railway, or Render)

### Step 1: Prepare Your Project

1. **Ensure environment variables are set**
   
   Create `.env.local` in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE=https://your-backend-url.com
   ```

2. **Test locally**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set up environment variables when prompted

#### Option B: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Convert to Next.js"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Select the `frontend` folder as the root directory
   - Framework preset: Next.js (auto-detected)

3. **Configure Environment Variables**
   Add in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE` = Your backend API URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Configure Backend CORS

Update your backend `.env` to allow requests from Vercel:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

And in your backend `index.js`, ensure CORS is configured:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
```

### Step 4: Update Socket.IO Configuration

In your backend, allow connections from your Vercel domain:
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});
```

## 📦 Build Configuration

The project uses:
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Fabric.js** for canvas drawing

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000  # Development
# NEXT_PUBLIC_API_BASE=https://your-backend.com  # Production
```

### Backend (.env)
```env
MONGODB_URL=your-mongodb-connection-string
FRONTEND_URL=http://localhost:3000  # Development
# FRONTEND_URL=https://your-vercel-app.vercel.app  # Production
PORT=4000
NODE_ENV=production
```

## 🐛 Troubleshooting

### Build Errors

**"Module not found: Can't resolve 'fabric'"**
- Ensure fabric is in dependencies, not devDependencies
- Run: `npm install fabric`

**CORS errors in production**
- Check that FRONTEND_URL in backend matches your Vercel URL exactly
- Verify CORS configuration in backend includes credentials: true

**Socket.IO connection fails**
- Ensure backend Socket.IO CORS allows your Vercel domain
- Check that NEXT_PUBLIC_API_BASE uses https:// in production

### Performance Optimization

Add these to `next.config.js` for better production performance:
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};
```

## 📱 Production Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas IP whitelist updated (allow all: 0.0.0.0/0 for cloud deployments)
- [ ] Environment variables set in Vercel
- [ ] CORS configured for production domain
- [ ] Socket.IO CORS configured for production domain
- [ ] Test create/join game functionality
- [ ] Test drawing and real-time sync
- [ ] Test on mobile devices

## 🔗 Useful Links

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Socket.IO CORS Configuration](https://socket.io/docs/v4/handling-cors/)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test backend endpoints directly (use Postman/Thunder Client)
