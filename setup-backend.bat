@echo off
echo Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Initializing database...
python init_db.py

echo.
echo ========================================
echo Backend setup complete!
echo ========================================
echo.
echo To start the backend server:
echo   1. cd backend
echo   2. venv\Scripts\activate
echo   3. python app.py
echo.
echo Or simply run: start-backend.bat
echo.
pause
