# Live Visit Tracker

A mobile-first native web application for tracking school visits with real-time data synchronization.

## Features

✨ **Smart Authentication**
- Email-based login with Supabase verification
- Automatic role detection (Field Employee, Reporting Manager, Zonal Manager)

🎯 **Role-Based Access**
- Field employees see their assigned schools directly
- Managers can filter by district and view all team schools

📱 **Mobile-First Design**
- Responsive layout optimized for mobile devices
- Touch-friendly interface with smooth animations
- Works seamlessly on desktop too

📸 **Image Capture & Compression**
- Camera-only photo capture (no file uploads)
- Automatic compression to max 100KB
- Instant preview before submission

📍 **Geolocation Tracking**
- Captures location on form submission
- Helps verify visit authenticity

🎨 **Beautiful UI/UX**
- Modern gradient design
- Smooth animations and transitions
- Color-coded visit status indicators
- Loading states and error handling

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Storage)
- **APIs**: Geolocation API, Camera API

## Getting Started

### Prerequisites

1. Modern web browser (Chrome, Safari, Firefox, Edge)
2. Internet connection
3. Camera and location permissions

### Installation

1. Open `index.html` in your web browser
2. Or serve via a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
3. Access at `http://localhost:8000`

### Usage

1. **Login**: Enter your registered email address
2. **Select School**: 
   - Field employees: Choose from assigned schools
   - Managers: First select district, then school
3. **Fill Form**: Complete all required fields
4. **Capture Photo**: Take a photo of the visit
5. **Submit**: Review and submit the visit report

## Database Schema

### Tables Used

**emp_record**
- Employee information and hierarchy
- Columns: email, name, reporting_manager_email, zonal_manager_email

**lvt_universe_data_school_selector**
- School master data with SPOC information
- Columns: school_name, district, state, employee_email, spoc1-4 details

**live_visit_tracker_form_responses**
- Visit submission records
- Columns: submission_id, employee_email_id, school_name, visit_status, etc.

### Storage Bucket

**LVT Images**
- Stores compressed visit photos
- Public read access
- Organized by year/month folders

## Configuration

Update Supabase credentials in `app.js`:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_API_KEY = 'your-anon-key';
```

## Form Fields

### Required Fields
- School Selection
- Sampling Needed
- Discussion Stage
- Meeting SPOC
- Visit Status (Green/Yellow/Orange/Red)
- Photo Capture

### Optional Fields
- Subjects (if sampling identified)
- Co-Visitor 1 & 2
- Remarks

### Add New SPOC
- Designation (dropdown)
- Name (alphabetical only)
- Contact (9-11 digits)
- Email (optional, must contain @)

## Visit Status Colors

- 🟢 **Green**: 90%+ likelihood (High confidence)
- 🟡 **Yellow**: 70-90% likelihood (Good potential)
- 🟠 **Orange**: 30-70% likelihood (Moderate interest)
- 🔴 **Red**: <30% likelihood (Low probability)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Image compression reduces storage and bandwidth
- Lazy loading of form sections
- Efficient database queries with filters
- Minimal external dependencies
- Optimized CSS animations

## Security Features

- Email verification against authorized users
- Supabase Row Level Security (RLS)
- Secure image storage
- Input validation and sanitization

## Troubleshooting

**Login Issues**
- Ensure email is registered in emp_record table
- Check internet connection
- Verify Supabase credentials

**Camera Not Working**
- Grant camera permissions in browser
- Use HTTPS or localhost
- Check device camera availability

**Location Not Captured**
- Enable location services
- Grant browser location permission
- Check GPS signal

**Image Upload Fails**
- Check storage bucket permissions
- Verify bucket name is correct
- Ensure image is compressed properly

## Future Enhancements

- [ ] Email notifications via Edge Functions
- [ ] Offline mode with sync
- [ ] Visit history and analytics
- [ ] Export reports to Excel
- [ ] Push notifications
- [ ] Dark mode support

## Support

For issues or questions, contact your system administrator.

## License

Internal use only - Physics Wallah

---

**Version**: 1.0.0  
**Last Updated**: December 2025
