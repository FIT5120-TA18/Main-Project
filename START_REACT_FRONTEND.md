# 🚀 Start React Frontend - Quick Guide

## Step 1: Install Dependencies
```bash
cd app/static/client
npm install
```

## Step 2: Start in Development Mode

### Option A: Dev Server (Recommended)
```bash
npm run dev
```
Open browser: http://localhost:5173

### Option B: Production Build
```bash
npm run build
npm run preview
```

## Step 3: Start Flask Backend (another terminal)
```bash
cd Main-Project
python run.py
```
Flask server runs at: http://localhost:8000

## ✅ Verification

- [ ] Browser can open http://localhost:5173 (React dev server)
- [ ] Clicking "Get Started" navigates to Profile Step 1
- [ ] Form validation works (try leaving fields blank)
- [ ] Can complete the full flow to the Results screen

## 📊 Full User Flow

1. **Landing Page** → Click "Get Started"
2. **Step 1** → Fill in 6 fields → Click Next
3. **Step 2** → Select goal → Click Build My Pathways
4. **Pathway Builder** → Fill in Pathway A (optional: +Add Pathway B) → Click See My Results
5. **Results** → View financial analysis → Click education guide links
6. **Education Guides** → Return to results

## 🆘 Common Issues

**Q: Port already in use?**
A: Change the port:
```bash
npm run dev -- --port 5174
python run.py  # Change port in Flask's run.py
```

**Q: npm errors?**
A: Clean and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Q: Styles not visible?**
A: Clear browser cache or press Ctrl+Shift+R for a hard refresh.

## 📁 Important File Locations

```
Main-Project/
├── app/
│   ├── static/client/          ← React application
│   │   └── src/
│   ├── routes.py               ← Flask backend
│   ├── templates/              ← Legacy HTML (can be replaced)
│   └── static/js/              ← Legacy JS (can be replaced)
├── run.py                       ← Flask startup script
└── requirements.txt             ← Python dependencies
```

---

**Now you're ready! Let's go! 🎉**
