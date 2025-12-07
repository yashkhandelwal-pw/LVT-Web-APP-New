# 📱 Mobile Access Guide - Live Visit Tracker

## Your Mobile Access URL

**Use this URL on your mobile device:**

```
http://192.168.1.8:8000
```

---

## Setup Instructions

### Step 1: Ensure Same WiFi Network
- ✅ Your computer and mobile device **MUST** be on the **same WiFi network**
- Check your WiFi settings on both devices

### Step 2: Keep Server Running
- ✅ The HTTP server is already running on your computer
- Keep the terminal window open
- Server status: `npx http-server -p 8000`

### Step 3: Access on Mobile

**On your mobile device:**

1. Open your mobile browser (Chrome, Safari, etc.)
2. Type or scan this URL:
   ```
   http://192.168.1.8:8000
   ```
3. The Live Visit Tracker app should load!

---

## QR Code Access (Optional)

You can also create a QR code for easy access:
1. Go to https://www.qr-code-generator.com/
2. Enter URL: `http://192.168.1.8:8000`
3. Generate and scan with your phone

---

## Troubleshooting

### ❌ "Can't reach this page" or "Connection refused"

**Check these:**

1. **Same WiFi?**
   - Computer and phone on same network
   
2. **Firewall blocking?**
   - Windows Firewall might be blocking port 8000
   - Run this command to allow it:
   ```powershell
   netsh advfirewall firewall add rule name="HTTP Server 8000" dir=in action=allow protocol=TCP localport=8000
   ```

3. **Server still running?**
   - Check terminal - should show "Hit CTRL-C to stop the server"
   - If stopped, restart with: `npx http-server -p 8000`

4. **Try alternative IP:**
   - If `192.168.1.8` doesn't work, try:
   ```
   http://172.24.224.1:8000
   ```

### ✅ Testing Camera on Mobile

The app is optimized for mobile:
- Camera capture will use your phone's camera
- Touch-friendly interface
- Responsive design
- Geolocation will use phone's GPS

---

## Alternative: Use ngrok for External Access

If you want to test from anywhere (not just local WiFi):

```bash
# Install ngrok
npm install -g ngrok

# Create tunnel
ngrok http 8000

# Use the https URL provided (e.g., https://abc123.ngrok.io)
```

---

## Current Server Info

- **Local IP**: 192.168.1.8
- **Port**: 8000
- **Status**: Running ✅
- **Access URLs**:
  - Desktop: `http://localhost:8000`
  - Mobile (same WiFi): `http://192.168.1.8:8000`

---

**Ready to test!** Open the URL on your mobile device and start logging visits! 📱✨
