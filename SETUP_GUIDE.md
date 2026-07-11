# Complete Setup Guide - Attendance System

## Prerequisites

Before starting, ensure you have:

1. **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
3. **Git** (optional) - For cloning the repository
4. **Webcam** - For face recognition features

## Step-by-Step Setup

### Part 1: Backend Setup

#### Windows Users (Automated)

1. Open Command Prompt or PowerShell in the project directory
2. Run the setup script:
   ```bash
   setup-backend.bat
   ```
3. Wait for installation to complete
4. The script will:
   - Create a virtual environment
   - Install all Python dependencies
   - Initialize the database
   - Create default admin account

#### All Users (Manual Setup)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   
   Windows:
   ```bash
   venv\Scripts\activate
   ```
   
   Linux/Mac:
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   Note: This may take 5-10 minutes as it installs face recognition libraries.

5. **Initialize database:**
   ```bash
   python init_db.py
   ```
   
   This creates:
   - Database file (attendance.db)
   - Default admin account
   - Sample data for testing

### Part 2: Frontend Setup

1. **Return to project root:**
   ```bash
   cd ..
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   
   This installs React and all frontend libraries.

### Part 3: Running the Application

#### Option 1: Using Batch Scripts (Windows - Recommended)

1. **Start Backend** (Terminal 1):
   ```bash
   start-backend.bat
   ```
   
   You should see:
   ```
   * Running on http://127.0.0.1:5000
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   start-frontend.bat
   ```
   
   You should see:
   ```
   Local: http://localhost:5173/
   ```

#### Option 2: Manual Start

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # or source venv/bin/activate  # Linux/Mac
   python app.py
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

### Part 4: First Login

1. Open your browser and go to: **http://localhost:5173**

2. Login with default admin account:
   - Username: `admin`
   - Password: `admin123`

3. **Important:** Change the admin password immediately!

## Testing the System

### Test with Sample Data

After initialization, you have:

1. **Admin Account:**
   - Username: `admin`
   - Password: `admin123`

2. **Teacher Account:**
   - Username: `teacher@example.com`
   - Password: `teacher123`
   - Assigned Classes: CS-101, CS-102

3. **Student Accounts:**
   - John Doe (STU001) - Class: CS-101
   - Jane Smith (STU002) - Class: CS-101
   - Bob Johnson (STU003) - Class: CS-102
   - Password for all: Use student number (e.g., STU001)

### Testing Face Recognition

1. **Login as Admin**
2. Go to "Upload Face Embeddings"
3. Select a student
4. Upload a clear photo of the student's face
5. System will extract and save face data

6. **Login as Teacher**
7. Start an attendance session
8. Students can now mark attendance using face recognition

## Troubleshooting

### Backend Issues

#### Problem: "Python not found"
**Solution:**
- Install Python from python.org
- Make sure to check "Add Python to PATH" during installation
- Restart your terminal

#### Problem: "pip install fails"
**Solution:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Try installing again
pip install -r requirements.txt
```

#### Problem: "face_recognition installation fails"
**Solution:**

Windows:
1. Install Visual Studio Build Tools
2. Install CMake: `pip install cmake`
3. Try again: `pip install face-recognition`

Linux:
```bash
sudo apt-get update
sudo apt-get install cmake
sudo apt-get install python3-dev
pip install face-recognition
```

#### Problem: "Database locked"
**Solution:**
- Close all terminals running the backend
- Delete `attendance.db` file
- Run `python init_db.py` again

### Frontend Issues

#### Problem: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
# or
rmdir /s node_modules & del package-lock.json  # Windows

# Install again
npm install
```

#### Problem: "Port 5173 already in use"
**Solution:**
- Kill the process using port 5173
- Or change port in vite.config.js

#### Problem: "Cannot connect to backend"
**Solution:**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API_BASE_URL in src/services/api.js

### Face Recognition Issues

#### Problem: "No webcam detected"
**Solution:**
- Check webcam is connected
- Grant browser permission to access camera
- Try different browser (Chrome recommended)

#### Problem: "Face not recognized"
**Solution:**
- Ensure good lighting
- Face camera directly
- Upload multiple photos of the student
- Adjust threshold in face_recognition_service.py

## Production Deployment

### Security Checklist

Before deploying to production:

1. **Change Secret Key:**
   ```python
   # In backend/app.py
   app.secret_key = 'generate-a-strong-random-key-here'
   ```

2. **Change Admin Password:**
   - Login as admin
   - Go to settings
   - Update password

3. **Disable Debug Mode:**
   ```python
   # In backend/app.py
   app.run(debug=False, host='0.0.0.0', port=5000)
   ```

4. **Use HTTPS:**
   - Set up SSL certificates
   - Configure reverse proxy (nginx/Apache)

5. **Environment Variables:**
   - Create `.env` file
   - Store sensitive data there
   - Never commit `.env` to git

### Database Backup

Regular backups are crucial:

```bash
# Manual backup
cp attendance.db backups/attendance_backup_$(date +%Y%m%d).db

# Or use admin panel "Database Tools" > "Backup Database"
```

## Advanced Configuration

### Custom Port Configuration

**Backend (app.py):**
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Change 5000 to 8000
```

**Frontend (vite.config.js):**
```javascript
export default defineConfig({
  server: {
    port: 3000,  // Change from 5173
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Match backend port
      }
    }
  }
})
```

**API Service (src/services/api.js):**
```javascript
const API_BASE_URL = 'http://localhost:8000/api'  // Match backend port
```

### Database Configuration

To use PostgreSQL instead of SQLite:

1. Install psycopg2: `pip install psycopg2-binary`
2. Update database.py connection string
3. Modify create_tables() for PostgreSQL syntax

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check system logs in admin panel
4. Search for similar issues online
5. Create an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - System information (OS, Python version, Node version)

## Next Steps

After successful setup:

1. **Customize the system:**
   - Add your school/organization logo
   - Modify color scheme in tailwind.config.js
   - Add custom fields to student/teacher forms

2. **Add real data:**
   - Import student list
   - Create teacher accounts
   - Upload face photos

3. **Train users:**
   - Create user guides
   - Conduct training sessions
   - Set up support channels

4. **Monitor system:**
   - Check system logs regularly
   - Monitor database size
   - Review attendance reports

## Maintenance

### Regular Tasks

**Daily:**
- Check system logs for errors
- Verify attendance sessions are working

**Weekly:**
- Backup database
- Review attendance reports
- Update student/teacher data

**Monthly:**
- Clear old logs
- Optimize database
- Update dependencies

### Updating the System

```bash
# Update backend dependencies
cd backend
venv\Scripts\activate
pip install --upgrade -r requirements.txt

# Update frontend dependencies
cd ..
npm update

# Test thoroughly after updates
```

---

**Congratulations!** Your attendance system is now set up and ready to use.

For additional support, refer to the main README.md or backend/README.md files.
