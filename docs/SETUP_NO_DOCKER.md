# Setup Instructions - Without Docker

Since Docker is not installed, here's how to get started without it:

## Prerequisites

- ✅ Node.js and npm (you have this!)
- ❌ Docker (not required for initial setup)
- ❌ pnpm (we'll use npm instead)

## Quick Setup

### 1. Install Dependencies

```powershell
cd c:\Users\Pabli\slowsteady
npm install
```

This will install all dependencies for the monorepo.

### 2. Setup Without Database (Frontend Only)

For now, you can run the frontend without the backend:

```powershell
cd packages\frontend
npm install
npm run dev
```

The frontend will start at http://localhost:5173

### 3. To Run Full Stack (Requires Database)

You have two options:

#### Option A: Install Docker Desktop (Recommended)
1. Download Docker Desktop for Windows: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Run: `docker-compose up -d`
4. Continue with backend setup

#### Option B: Install PostgreSQL Directly
1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Install PostgreSQL with default settings
3. Create database: `slowsteady`
4. Update `packages\backend\.env` with your Postgres connection
5. Run backend

## Current Issue

The connection error you're seeing is because:
1. Dependencies are not installed yet
2. Docker is not running (no database)
3. Backend server is not started

## Fix the Connection Error

### Step 1: Install pnpm (recommended) OR use npm

**Option A: Install pnpm globally**
```powershell
npm install -g pnpm
```

**Option B: Use npm instead**
We can modify scripts to use npm instead of pnpm.

### Step 2: Install Dependencies

```powershell
cd c:\Users\Pabli\slowsteady
npm install
```

### Step 3: Run Frontend Only (No Database Needed)

```powershell
cd packages\frontend
npm run dev
```

Visit http://localhost:5173 - you'll see the UI but can't login yet (needs backend).

### Step 4: Setup Backend (Requires Database)

Either install Docker Desktop OR PostgreSQL, then:

```powershell
cd packages\backend
copy .env.example .env
# Edit .env with your database URL
npm run dev
```

## Simplified First Run

Let me create a simple standalone frontend that works without backend first:

1. Install dependencies
2. Run frontend only
3. See the UI working
4. Then add backend + database later

Would you like me to:
1. **Install pnpm** and continue with the original setup?
2. **Modify scripts to use npm** instead?
3. **Create a demo mode** that works without backend?

Let me know and I'll help you get it running!
