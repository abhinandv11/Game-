# Game കളിക്കാം

**Game കളിക്കാം** is a production-ready, mobile-first real-time multiplayer gaming platform. Two players can open the web app on separate devices, create or join a room using a unique 6-character room code, and compete against each other in real-time.

---

## 🎮 First Game: Stone • Paper • Pencil • Scissors

### Official Game Rules
The platform implements explicit rules (different from classic Rock-Paper-Scissors):

- 🪨 **Stone** beats ✂️ **Scissors** and ✏️ **Pencil**
- ✂️ **Scissors** beats 📄 **Paper** and ✏️ **Pencil**
- ✏️ **Pencil** beats 📄 **Paper**
- 📄 **Paper** beats 🪨 **Stone**
- Identical moves or any unlisted matchups result in a **Draw**

---

## 🚀 Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Mobile-first responsive CSS design system (Vanilla CSS with CSS custom properties)
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **Real-time Sync**: Supabase Realtime (WebSockets)
- **Deployment**: Vercel-ready with `vercel.json` SPA rewrite rules

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or newer)
- A free [Supabase](https://supabase.com) project

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Supabase project credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup (Supabase SQL)
Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase project's **SQL Editor**:

1. Open your Supabase Dashboard
2. Navigate to **SQL Editor** -> **New query**
3. Paste the contents of `supabase/schema.sql` and click **Run**
4. This creates:
   - `rooms` table
   - `players` table
   - `game_rounds` table
   - Row-level security (RLS) policies
   - Realtime replication publication for all three tables

---

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run game rules automated test suite
npm test

# Build for production
npm run build
```

---

## 👥 How to Test with Two Players

1. Start the dev server with `npm run dev`
2. Open `http://localhost:5173` in a normal browser window (Player 1)
3. Open `http://localhost:5173` in an Incognito/Private window or on a second device on the same local network (Player 2)
4. **Player 1**: Click **Play Now** -> **Create Room** -> Enter name -> Choose round count (e.g., 3 rounds) -> **Create Room**
5. **Player 1**: Copy the 6-character room code (e.g. `A7K2P9`)
6. **Player 2**: Click **Play Now** -> **Join Room** -> Enter name -> Enter the 6-character room code -> **Join Room**
7. Both players appear in the room lobby in real time
8. **Player 1**: Clicks **Start Game**
9. Both players are transitioned to the game screen simultaneously
10. Each player selects a move (Stone, Paper, Pencil, Scissors) and clicks **Confirm Choice**
11. Choices remain hidden until both players lock in, after which choices reveal simultaneously with an animated result banner and score increment
12. The game advances through all chosen rounds until the final result and rematch screen!

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
4. Deploy! `vercel.json` already contains the SPA routing rewrites.
