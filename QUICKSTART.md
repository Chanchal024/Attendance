# Quick Start Guide - 5 Minutes Setup

Get your attendance system running in 5 minutes!

## Prerequisites Check

✅ Python 3.8+ installed? Run: `python --version`  
✅ Node.js 16+ installed? Run: `node --version`  
✅ Webcam connected?

## Setup (Choose One Method)

### Method 1: Automated Setup (Windows - Fastest!)

```bash
# 1. Setup backend (takes 3-5 minutes)
setup-backend.bat

# 2. Install frontend
npm install

# 3. Start backend (Terminal 1)
start-backend.bat

# 4. Start frontend (Terminal 2)
start-frontend.bat
```

### Method 2: Manual Setup (All Platforms)

```bash
# 1. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python init_db.py
cd ..

# 2. Frontend setup
npm install

# 3. Start backend (Terminal 1)
cd backend
venv\Scripts\activate
python app.py

# 4. Start frontend (Terminal 2)
npm run dev
```

## Access the System

Open browser: **http://localhost:5173**

## Default Login Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`
- Access: Full system control

### Teacher Account
- Username: `teacher@example.com`
- Password: `teacher123`
- Access: Attendance management for CS-101, CS-102

### Student Accounts
- Username: Student number (e.g., `STU001`)
- Password: Same as username
- Students: John Doe (STU001), Jane Smith (STU002), Bob Johnson (STU003)

## Quick Test

### Test as Admin (2 minutes)

1. Login with admin credentials
2. Go to "Student Management"
3. View the 3 sample students
4. Go to "Upload Face Embeddings"
5. Try uploading a face photo for a student

### Test as Teacher (2 minutes)

1. Logout and login as teacher
2. Go to "Attendance Session"
3. Click "Start Session" for CS-101
4. View the list of students
5. Try marking attendance manually

### Test as Student (1 minute)

1. Logout and login as student (STU001)
2. View "My Attendance" page
3. Check attendance calendar
4. View class information

## What's Next?

### For Production Use:

1. **Change Admin Password**
   - Login as admin
   - Go to settings
   - Update password immediately

2. **Add Real Students**
   - Admin > Student Management
   - Add students one by one
   - Or import from CSV (if implemented)

3. **Upload Face Photos**
   - Admin > Upload Face Embeddings
   - Upload clear, front-facing photos
   - One face per photo

4. **Create Teacher Accounts**
   - Admin > Teacher Management
   - Create accounts for all teachers
   - Assign classes to each teacher

5. **Start Using**
   - Teachers start attendance sessions
   - Students mark attendance via face recognition
   - Admin monitors reports

## Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000    # Windows
lsof -i :5000                   # Linux/Mac

# Kill the process or change port in app.py
```

### Frontend won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Face recognition not working?
- Ensure webcam is connected
- Grant browser camera permissions
- Use Chrome or Firefox (recommended)
- Check good lighting conditions

### Can't login?
- Verify you ran `python init_db.py`
- Check backend is running (Terminal 1)
- Check browser console for errors
- Try clearing browser cookies

## File Structure

```
attendance-system/
├── backend/                 # Flask API backend
│   ├── app.py              # Main application
│   ├── database.py         # Database operations
│   ├── auth.py             # Authentication
│   ├── face_recognition_service.py
│   ├── init_db.py          # Database initialization
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── context/           # React context
├── setup-backend.bat      # Automated setup (Windows)
├── start-backend.bat      # Start backend (Windows)
├── start-frontend.bat     # Start frontend (Windows)
└── package.json           # Node.js dependencies
```

## Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: See backend/API_TESTING.md

## Getting Help

1. **Setup Issues**: Read SETUP_GUIDE.md
2. **API Testing**: Read backend/API_TESTING.md
3. **Full Documentation**: Read README.md
4. **Backend Details**: Read backend/README.md

## Security Reminder

⚠️ **Before deploying to production:**

1. Change `SECRET_KEY` in app.py
2. Change admin password
3. Disable debug mode
4. Set up HTTPS
5. Configure firewall
6. Regular database backups

---

**That's it!** You now have a fully functional attendance system.

Start exploring the features and customize it for your needs.

For detailed documentation, see README.md and SETUP_GUIDE.md.
