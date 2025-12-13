# 🎨 Doodle Frenzy

A real-time multiplayer drawing and guessing game built with Next.js, Node.js, Socket.IO, and MongoDB. Challenge your friends to guess your drawings in this fast-paced, fun game!

## 🎮 Features

- **Real-time multiplayer gameplay** using Socket.IO
- **Drawing canvas** with multiple tools and colors
- **Live chat** for guessing words
- **Scoring system** with points based on guess order
- **Party code system** for easy game joining
- **Configurable game settings** (rounds, time limits, custom words)

## 📁 Project Structure

```
doodle-frenzy/
├── backend/              # Node.js + Express + Socket.IO server
│   ├── models/          # MongoDB models (Game, Player)
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (word list)
│   ├── index.js         # Server entry point
│   └── .env.example     # Environment variables template
│
├── frontend/            # Next.js 14 application
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # React components (game, lobby, common)
│   │   ├── contexts/    # React contexts (GameContext)
│   │   ├── hooks/       # Custom React hooks (useCanvas, useChat)
│   │   └── utils/       # Utilities (socket client)
│   └── .env.example     # Frontend environment variables template
│
├── render.yaml          # Render deployment configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. git clone https://github.com/Rishabh-Baloni/doodle-frenzy.git
   cd doodle-frenzy
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create `.env` files based on the `.env.example` templates:

   Backend (`backend/.env`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   NODE_ENV=development
   ```

   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```env
#### Option 1: Using the batch file (Windows)
```bash
START-SERVERS.bat
```

#### Option 2: Manual start

1. **Start the backend server** (from project root):
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start the f on Render

This project is configured for easy deployment on Render using the included `render.yaml` file.

### Quick Deploy Steps

1. **Set up MongoDB Atlas**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user and get your connection string
   - Whitelist IP: `0.0.0.0/0` (for Render access)

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml` and create both services

3. **Configure Environment Variables**
   
   **Backend Service:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://doodle-frenzy-frontend.onrender.com`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (auto-configured)

   **Frontend Service:**
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL (e.g., `https://doodle-frenzy-backend.onrender.com`)
   - `NODE_ENV`: `production`

4. **Update URLs**
   - After initial deployment, update the cross-referenced URLs in environment variables
   - Trigger manual redeploy for both services

### Important Notes

- Free tier services spin down after inactivity (30-60s cold start)
- Ensure MongoDB connection string is properly formatted
- CORS is automatically configured via environment variables

See [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) for detailed deployment instructions.

### Deploy Backend

Deploy your backend to:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

Remember to:
- Set all environment variables
- Update MongoDB Atlas IP whitelist
- Configure + Express.js** - Server framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB + Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Socket.IO Client** - Real-time communication
- **Fabric.js** - Canvas drawing library
- **Tailwind CSS** - Styling

3. **Drawing Round**
   GET /` - Health check
- `POST /api/games` - Create new game
- `POST /api/games/:partyCode/join` - Join existing game
- `GET /api/games/:partyCode` - Get game state
- `PATCH /api/games/:partyCode/settings` - Update game settings
- `PATCH /api/games/:partyCode/start` - Start game
- `PATCH /api/games/:partyCode/next-turn` - Advance to next turn
   - View final scores and leaderboard
   - Play again or return to home

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB + Mongoose** - Database and ODM
- **dotenv** - Environment variable management

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Socket.IO Client** - WebSocket client
- *🎯 Game Features

- **Multiple Drawing Tools**: Pencil, eraser, line, circle, rectangle
- **Color Palette**: Choose from various colors
- **Adjustable Brush Size**: Customize your drawing style
- **Real-time Synchronization**: All players see drawings instantly
- **Smart Scoring System**: Points based on guess speed
- **Customizable Settings**: Rounds, time limits, custom word lists
- **Party Code System**: Easy game sharing
- **Responsive Design**: Works on desktop and mobile

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

ISC

## 🔗 Links

- **GitHub Repository**: https://github.com/Rishabh-Baloni/doodle-frenzy
- **Live Demo**: Coming soon!

## 👤 Author

**Rishabh Baloni**
- GitHub: [@Rishabh-Baloni](https://github.com/Rishabh-Baloni) Send chat message
- `update-drawing` - Sync canvas state
- `join-game` - Join game room
- `request-time-update` - Request time sync

### Server → Client
- `game:update` - Game state updated
- `chat-message` - New chat message
- `drawing-update` - Canvas state updated
- `correct-guess` - Player guessed correctly
- `time-update` - Timer update
- `players-updated` - Player list changed

## 🐛 Known Issues & Fixes

All major issues have been resolved:
- ✅ Folder structure standardized (backend/frontend)
- ✅ Environment variables properly configured
- ✅ Dependencies installed
- ✅ MongoDB connection configured
- ✅ **Converted to Next.js 14 for easy Vercel deployment**

## 📄 License

ISC

## 👥 Authors

Doodle Frenzy Team
