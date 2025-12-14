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
│   └── utils/           # Utility functions (word list)
│
├── frontend/            # Next.js 14 application
│   ├── server.js        # Unified server (combines backend + frontend)
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # React components (game, lobby, common)
│   │   ├── contexts/    # React contexts (GameContext)
│   │   ├── hooks/       # Custom React hooks (useCanvas, useChat)
│   │   └── utils/       # Utilities (socket client)
│   └── .env.example     # Environment variables template
│
├── package.json         # Root package with deploy scripts
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rishabh-Baloni/doodle-frenzy.git
   cd doodle-frenzy
   ```

2. **Install all dependencies**
   ```bash
   npm run build:render
   ```
   This installs both frontend and backend dependencies.

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   PORT=3001
   ```

### Running Locally

**Start the unified server:**
```bash
npm run start:render
```

The application will run on http://localhost:3001
- Frontend: http://localhost:3001
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

> **Note:** This project uses a monolith architecture where both frontend and backend run on the same server. ## 🌐 Deployment on Render

This project is deployed as a **single unified service** combining frontend and backend.

### Quick Deploy Steps

1. **Set up MongoDB Atlas**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user and get your connection string
   - Whitelist IP: `0.0.0.0/0` (for Render access)

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New"** → **"Web Service"**
   - Connect your GitHub repository: `Rishabh-Baloni/doodle-frenzy`
   - Configure the service:
     - **Build Command:** `npm run build:render`
     - **Start Command:** `npm run start:render`
     - **Environment:** Node

3. **Configure Environment Variables**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment to complete
   - Your app will be live at `https://your-app-name.onrender.com`

### Important Notes

- Free tier services spin down after inactivity (~50s cold start on first request)
- Ensure MongoDB connection string includes the database name
- The monolith architecture runs both frontend and backend on a single server/port

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js** - Server framework
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
