# Face Recognition Attendance System

A complete face recognition-based attendance management system with React frontend and Flask backend.

## 🎉 Features

### 🧑 **Admin Dashboard**
- ✅ Add/delete/update students
- ✅ Register teachers with class assignments
- ✅ View all attendance records
- ✅ Upload face embeddings for biometric recognition
- ✅ Manage system classes and structure
- ✅ Full database management tools
- ✅ System logs and monitoring

### 👨‍🏫 **Teacher Dashboard**
- ✅ Start webcam-based attendance sessions
- ✅ View today's present/absent students
- ✅ Check attendance by date
- ✅ Access only assigned class(es)
- ✅ Approve manual attendance requests

### 🎓 **Student Dashboard**
- ✅ Register using student number
- ✅ View personal attendance history
- ✅ Check attendance statistics
- ✅ View assigned classes

## 🚀 Quick Start

### 1. Install Dependencies

#### Backend Setup (Automated - Windows)
```bash
# Run the setup script
setup-backend.bat
```

#### Backend Setup (Manual)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py
```

#### Frontend Dependencies
```bash
npm install
```

### 2. Run the System

#### Option 1: Using Batch Scripts (Windows - Easiest)
```bash
# Terminal 1: Start Backend
start-backend.bat

# Terminal 2: Start Frontend
start-frontend.bat
```

#### Option 2: Manual Start
```bash
# Terminal 1: Start Backend
cd backend
venv\Scripts\activate  # or source venv/bin/activate
python app.py

# Terminal 2: Start Frontend
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: username: `admin`, password: `admin123`

### 4. Default Test Accounts

After running `init_db.py`, you'll have:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teacher:**
- Username: `teacher@example.com`
- Password: `teacher123`

**Students:**
- Login with student number (e.g., `STU001`, `STU002`, `STU003`)
- Password is same as student number

## 📋 System Requirements

### Minimum Requirements
- **Python 3.8+**
- **Node.js 16+**
- **Webcam** (for face recognition)
- **Modern web browser**

### Hardware Recommendations
- **Camera**: HD webcam (1080p minimum)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Processor**: Intel i5/Core i5 or equivalent

## 🛠️ API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/check-session` - Check active session

### Student Management (Admin)
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/<id>` - Update student
- `DELETE /api/students/<id>` - Delete student

### Teacher Management (Admin)
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/<id>` - Update teacher
- `DELETE /api/teachers/<id>` - Delete teacher

### Attendance Management
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/<id>` - Update attendance record

### Face Recognition
- `POST /api/face/upload` - Upload face embedding
- `GET /api/face/check/<student_id>` - Check face data status

### Database Tools (Admin Only)
- `GET /api/db/stats` - Get database statistics
- `GET /api/logs` - Get system logs

### Reports
- `GET /api/reports/export` - Export attendance reports

## 🎯 Admin Workflow

1. **Login as Admin** (`admin` / `admin123`)
2. **Add Students**:
   - Go to "Student Management"
   - Click "Add Student"
   - Fill student details and assign class
   - Upload face photos for biometric recognition
3. **Register Teachers**:
   - Go to "Teacher Management"
   - Create teacher accounts
   - Assign classes to teachers
4. **Monitor System**:
   - View attendance reports
   - Check system logs
   - Manage database operations

## 🎯 Teacher Workflow

1. **Login as Teacher**
2. **Start Attendance Session**:
   - Navigate to class section
   - Click "Start Webcam Attendance"
   - System begins face recognition
3. **Manual Attendance**: Mark attendance for students without face data
4. **View Reports**: Check daily attendance statistics

## 🎯 Student Workflow

1. **Registration**: Use student number to register account
2. **View Attendance**: Check personal attendance history
3. **Track Statistics**: Monitor attendance patterns

## 🔧 Configuration

### Backend Configuration
- **Port**: 5000 (configurable in backend.py)
- **Database**: attendance.db (SQLite)
- **CORS**: Configured for localhost:3001

### Frontend Configuration
- **Port**: 3001
- **API Base URL**: http://localhost:5000/api
- **Build**: Optimized production build available

## 🚨 Security Features

- **Password Hashing**: bcrypt encryption
- **Session Management**: Secure server-side sessions
- **CORS Protection**: Configured origins only
- **Role-Based Access**: Admin/Teacher/Student permissions
- **Input Validation**: All API endpoints validated

## 🐛 Troubleshooting

### Common Issues

#### Face Recognition Not Working
```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install cmake
sudo apt-get install python3-dev

# Or reinstall face-recognition
pip uninstall dlib face-recognition
pip install dlib face-recognition --no-cache-dir
```

#### Database Connection Issues
- Delete `attendance.db` file
- Restart backend server to recreate database

#### Frontend Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in backend.py

## 📊 Database Schema

```sql
-- Users table for authentication
users (id, username, password, role, email, name, student_number, class_name, status)

-- Student information
students (id, name, email, student_number, class_name, face_embedding, status)

-- Teacher information
teachers (id, name, email, password, assigned_classes, status)

-- Attendance records
attendance (id, student_id, teacher_id, date, time_in, time_out, match_score, status, approved)

-- Face embeddings for processing
face_embeddings (id, student_id, embedding_data)

-- Class management
classes (id, class_name, teacher_id, time_slots)

-- Active attendance sessions
sessions (id, teacher_id, class_name, start_time, end_time, status)

-- System activity logs
system_logs (id, user_id, action, details, timestamp, level)
```

## 🌟 Development

### Adding New Features
1. **Backend API**: Add routes in `backend.py`
2. **Frontend**: Create components in `src/components/`
3. **Database**: Update schema in `create_tables()` function
4. **API Calls**: Add methods in `src/services/api.js`

### Environment Variables
Create `.env` files for different environments:
```bash
# backend/.env
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///attendance.db
FLASK_ENV=development

# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@attendance-system.com
- 🐛 Issues: GitHub Issues
- 📖 Wiki: Project Documentation

---

**Made with ❤️ for educational institutions**
