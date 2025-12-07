# Live Visit Tracker

A mobile-first native web application for tracking school visits with real-time Supabase integration.

## 🚀 Features

- **Smart Authentication** - Email-based login with role detection (Field Employee/Manager)
- **Role-Based Access** - Dynamic forms based on user hierarchy
- **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- **Image Compression** - Automatic compression to max 100KB
- **Geolocation Tracking** - GPS capture on form submission
- **Real-time Sync** - Supabase database integration

## 📱 Live Demo

**Desktop**: `http://localhost:8000`  
**Mobile**: `http://YOUR_LOCAL_IP:8000`

## 🛠️ Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Supabase (Database + Storage)
- Geolocation API, Camera API

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/live-visit-tracker.git

# Navigate to project
cd live-visit-tracker

# Start local server
npx http-server -p 8000

# Open browser
http://localhost:8000
```

## 🔧 Configuration

Update Supabase credentials in `app.js`:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_API_KEY = 'your-anon-key';
```

## 📊 Database Schema

### Tables Required

- `emp_record` - Employee master data
- `lvt_universe_data_school_selector` - School data with SPOC info
- `live_visit_tracker_form_responses` - Visit submissions

### Storage Bucket

- **Name**: `LVT Images`
- **Access**: Public read, authenticated write

## 🚀 Quick Start

1. Set up Supabase project and tables
2. Configure storage bucket RLS policies
3. Update credentials in `app.js`
4. Start HTTP server
5. Access on desktop or mobile

## 📱 Mobile Access

**Requirements:**
- Computer and mobile on same WiFi
- HTTP server running

**URL**: `http://YOUR_LOCAL_IP:8000`

See [MOBILE_ACCESS.md](MOBILE_ACCESS.md) for detailed instructions.

## 🎨 Features

- ✅ Email authentication
- ✅ Role-based school filtering
- ✅ Searchable dropdowns
- ✅ Conditional form fields
- ✅ Dynamic SPOC management
- ✅ Image capture & compression
- ✅ GPS geolocation
- ✅ Form validation
- ✅ Success notifications

## 📝 Usage

1. Login with authorized email
2. Select school (or district for managers)
3. Fill visit details
4. Capture photo
5. Submit form
6. View success confirmation with submission ID

## 🐛 Troubleshooting

See [START_SERVER.md](START_SERVER.md) for server setup issues.

## 📄 License

Internal use only - Physics Wallah

## 🤝 Contributing

This is an internal project. For issues or suggestions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2025
