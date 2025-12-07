# Live Visit Tracker - Quick Start Server

## The Issue
The app needs to run on an HTTP server (not file://) for Supabase to work properly due to CORS restrictions.

## Solution: Use Live Server

### Option 1: VS Code Live Server (Recommended)
1. Open VS Code
2. Install "Live Server" extension by Ritwick Dey
3. Right-click on `index.html`
4. Select "Open with Live Server"
5. App will open at `http://127.0.0.1:5500`

### Option 2: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project folder
cd "d:\LVT Native"

# Start server
http-server -p 8000

# Open browser to: http://localhost:8000
```

### Option 3: Python HTTP Server
```bash
# Navigate to project folder
cd "d:\LVT Native"

# Python 3
python -m http.server 8000

# Open browser to: http://localhost:8000
```

### Option 4: PHP Server (if PHP installed)
```bash
cd "d:\LVT Native"
php -S localhost:8000

# Open browser to: http://localhost:8000
```

## Testing
Once the server is running:
1. Open `http://localhost:8000` (or the appropriate port)
2. Login with a valid email from `emp_record` table
3. School list should load correctly
4. Check browser console (F12) for detailed logs

## Troubleshooting
- **No schools loading**: Check console logs for Supabase errors
- **Email not authorized**: Verify email exists in `emp_record` table
- **CORS errors**: Make sure you're using HTTP (not file://)
