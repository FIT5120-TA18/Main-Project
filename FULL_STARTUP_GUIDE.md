# 🚀 Complete Project Startup Guide

## Project Configuration

- **Flask Backend:** http://127.0.0.1:8000
- **React Frontend:** http://localhost:5173
- **API URL:** http://127.0.0.1:8000/api

---

## Option A: Two Terminals (Recommended for Development)

### Terminal 1: Start Flask Backend
```bash
# Navigate to project directory
cd Main-Project

# Start Flask server
python run.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:8000
```

### Terminal 2: Start React Frontend
```bash
# Navigate to React directory
cd app/static/client

# Start dev server
npm run dev
```

**Expected output:**
```
 ➜  Local:   http://localhost:5173/
 ➜  press h to show help
```

### Terminal 3 (Optional): Watch Build
```bash
# Watch for build changes
cd app/static/client
npm run build -- --watch
```

**Open the app:**
Browser → **http://localhost:5173**

---

## Option B: Single Command (Production)

### Step 1: Build React
```bash
cd app/static/client
npm run build
```

This creates production files in `dist/`.

### Step 2: Start Flask (serve static files)
```bash
cd Main-Project
python run.py
```

**Open the app:**
Browser → **http://127.0.0.1:8000**

Flask automatically serves static files from `app/static/client/dist/`.

---

## Option C: Script (One-click Startup)

### Create `run_all.sh`
```bash
#!/bin/bash
cd Main-Project

# Start Flask backend (background)
echo "Starting Flask backend on 127.0.0.1:8000..."
python run.py &
FLASK_PID=$!

# Start React frontend (background)
echo "Starting React frontend on localhost:5173..."
cd app/static/client
npm run dev &
REACT_PID=$!

echo ""
echo "Project started!"
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://127.0.0.1:8000"
echo ""
echo "Press Ctrl+C to stop all services..."

wait $FLASK_PID $REACT_PID
```

**Usage:**
```bash
chmod +x run_all.sh
./run_all.sh
```

---

## ✅ Verification Steps

### 1️⃣ Check Flask Backend
```bash
curl http://127.0.0.1:8000/
# Should return HTML or JSON
```

### 2️⃣ Check React Frontend
Open browser → **http://localhost:5173**

You should see:
- ✅ Landing page loads
- ✅ Blue theme displayed
- ✅ "Get Started" button is clickable

### 3️⃣ Check API Connection
React console (press F12) should have no CORS errors

---

## 🆘 Common Issues

### ❌ "Port 8000 is already in use"
```bash
# Find process using port 8000
lsof -i :8000

# Terminate if needed (replace PID with actual number)
# kill -9 <PID>

# Or change port in run.py
app.run(debug=True, host='127.0.0.1', port=8001)
```

### ❌ "Port 5173 is already in use"
```bash
# Use a different port
npm run dev -- --port 5174

# Update .env.local
VITE_DEV_PORT=5174
```

### ❌ React page loads but no data
- Check Flask backend is running
- Check `VITE_API_URL` in `.env.local` is correct
- Check browser console for CORS errors

### ❌ Form submission fails
1. Ensure Flask backend is running on `127.0.0.1:8000`
2. Ensure `app/routes.py` has the required API endpoints
3. Check requests in the browser Network tab

---

## 📁 Project File Structure
```
Main-Project/
├── run.py                    ← Startup script (port 8000)
├── requirements.txt
├── app/
│   ├── __init__.py
│   ├── routes.py             ← Flask API endpoints
│   ├── static/
│   │   ├── client/           ← React application
│   │   │   ├── src/
│   │   │   ├── dist/         ← Production build
│   │   │   ├── .env.local    ← React environment variables
│   │   │   ├── package.json
│   │   │   └── vite.config.js
│   │   ├── js/               ← Legacy JS (can be removed)
│   │   └── css/              ← Legacy CSS (can be removed)
│   └── templates/            ← Legacy HTML (can be removed)
└── db_conn.py
```

---

## 📊 Development Workflow

### Scenario 1: Frontend Development
1. Start Flask: `python run.py`
2. Start React: `npm run dev` (in `app/static/client`)
3. Open http://localhost:5173 in browser
4. Edit React components → auto hot-reload (HMR)

### Scenario 2: Backend Development
1. Start Flask: `python run.py` (auto-restart with `--reload`)
2. Edit `app/routes.py`
3. Flask auto-restarts
4. React auto-refreshes data

### Scenario 3: Integration Testing
1. Build React: `npm run build`
2. Start Flask: `python run.py`
3. Open http://127.0.0.1:8000
4. Flask serves the production React build

---

## 🎯 Quick Command Reference

```bash
# Navigate to project root
cd Main-Project

# Start Flask (Terminal 1)
python run.py

# Start React (Terminal 2)
cd app/static/client && npm run dev

# Build React for production
cd app/static/client && npm run build

# Preview production build
cd app/static/client && npm run preview

# Clean build cache
cd app/static/client && rm -rf dist node_modules && npm install
```

---

## 📝 .env.local Configuration

**Location:** `app/static/client/.env.local`

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=TheNextChapter
VITE_DEV_PORT=5173
```

---

## ✨ You can now:

✅ Run frontend and backend simultaneously  
✅ See changes instantly during frontend development  
✅ Test API integration  
✅ Build the app for production  

**Ready? Let's go!** 🚀

```bash
# Terminal 1
python run.py

# Terminal 2
cd app/static/client && npm run dev
```

Then open http://localhost:5173 🎉
