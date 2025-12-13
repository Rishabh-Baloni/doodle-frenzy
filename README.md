# Draw and Guess Game (Doodle Frenzy)

A real-time multiplayer drawing and guessing game built with React, Node.js, Socket.IO, and MongoDB.

## 🎮 Features

- **Real-time multiplayer gameplay** using Socket.IO
- **Drawing canvas** with multiple tools and colors
- **Live chat** for guessing words
- **Scoring system** with points based on guess order
- **Party code system** for easy game joining
- **Configurable game settings** (rounds, time limits, custom words)

## 📁 Project Structure

```
Draw and guess game/
├── backend/              # Node.js + Express + Socket.IO server
│   ├── models/          # MongoDB models (Game, Player)
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   └── .env             # Environment variables
│
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts (GameContext)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utilities (socket client)
│   └── .env             # Frontend environment variables
│
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   cd "d:\Projects\Mini Project\New folder (3)\Draw and guess game"
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

   Backend (`backend/.env`):
   ```env
   MONGODB_URL=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   PORT=4000
   NODE_ENV=development
   ```

   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   ```

### Running the Application

1. **Start the backend server** (in backend folder):
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:4000

2. **Start the frontend development server** (in frontend folder):
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## 🚀 Deployment

### Deploy Frontend to Vercel

The frontend is now built with Next.js 14 and can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import to Vercel: https://vercel.com/new
3. Set environment variable: `NEXT_PUBLIC_API_BASE=https://your-backend-url.com`
4. Deploy!

See [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) for detailed deployment instructions.

### Deploy Backend

Deploy your backend to:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

Remember to:
- Set all environment variables
- Update MongoDB Atlas IP whitelist
- Configure CORS for your frontend domain

## 🎯 How to Play

1. **Create or Join a Game**
   - Enter your name
   - Create a new party (leave code blank) or join existing party (enter code)

2. **Game Lobby**
   - Host can configure game settings
   - Wait for players to join
   - Start the game when ready

3. **Drawing Round**
   - One player is chosen as the drawer
   - Drawer sees the word and draws it
   - Other players guess in the chat
   - Points awarded based on guess order (1st: 100pts, 2nd: 60pts, 3rd: 40pts, others: 20pts)

4. **Results**
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
- **Fabric.js** - Canvas drawing library
- **Tailwind CSS** - Utility-first CSS framework

## 📝 API Endpoints

- `POST /api/games` - Create new game
- `POST /api/games/:partyCode/join` - Join existing game
- `GET /api/games/:partyCode` - Get game state
- `PATCH /api/games/:partyCode/start` - Start game
- `PATCH /api/games/:partyCode/next-turn` - Advance to next turn
- `GET /health` - Health check endpoint

## 🔌 Socket Events

### Client → Server
- `send-message` - Send chat message
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
