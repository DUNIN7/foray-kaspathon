# FORAY Backend Setup on Mac Mini - Complete Guide

## [OK] What You'll Have When Done

- FORAY backend running on your Mac Mini
- Accessible from any device on your network (or internet)
- No domain required (can use IP address or free dynamic DNS)
- Professional setup for development and production use

---

## [CLIPBOARD] Prerequisites

- [OK] Mac Mini with macOS (any recent version)
- [OK] Internet connection
- [OK] Router access (for port forwarding if accessing from internet)
- [OK] Anthropic API key (get from https://console.anthropic.com)

---

## [ROCKET] Part 1: Install Node.js on Mac Mini

### Step 1: Install Homebrew (if not already installed)

Open Terminal (Applications -> Utilities -> Terminal) and run:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the instructions it gives you to add Homebrew to your PATH
# Usually something like:
echo -> eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install Node.js

```bash
# Install Node.js
brew install node

# Verify installation
node --version # Should show v20.x.x or similar
npm --version # Should show v10.x.x or similar
```

---

## [FOLDER] Part 2: Setup FORAY Backend

### Step 3: Create Project Directory

```bash
# Create a directory for FORAY
mkdir ~/foray-backend
cd ~/foray-backend

# Create subdirectories
mkdir logs
```

### Step 4: Create Backend Files

**Create server.js:**
```bash
nano server.js
```

Paste the server.js content (from the file we created earlier), then:
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

**Create package.json:**
```bash
nano package.json
```

Paste the package.json content, then save and exit (Ctrl+O, Enter, Ctrl+X)

**Create .env file:**
```bash
nano .env
```

Add your configuration:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PORT=3001
NODE_ENV=production
```

Save and exit (Ctrl+O, Enter, Ctrl+X)

**Create .gitignore:**
```bash
nano .gitignore
```

Add:
```
.env
node_modules/
logs/
*.log
```

Save and exit.

### Step 5: Install Dependencies

```bash
npm install
```

This will install Express, Anthropic SDK, CORS, and dotenv.

### Step 6: Test the Server

```bash
npm start
```

You should see:
```
=+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
| FORAY Transaction Generator API |
| Status: Running |
| Port: 3001 |
| API Key: [CHECK] Configured |
|++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
```

Keep this terminal window open!

---

## [DOOR] Part 3: Find Your Mac Mini's IP Address

### Step 7: Get Local IP Address

Open a NEW terminal window and run:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

You'll see something like:
```
inet 192.168.1.150 netmask 0xffffff00 broadcast 192.168.1.255
```

Your Mac Mini's IP is **192.168.1.150** (yours will be different)

### Step 8: Test Access from Mac Mini

In the new terminal window:

```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"healthy","timestamp":"2026-01-23T...","service":"FORAY Transaction Generator API"}
```

---

## [COMPUTER] Part 4: Access from Other Devices (Same Network)

### Step 9: Test from Another Computer/Phone on Same Wi-Fi

From any device on your network, open a browser and go to:
```
http://192.168.1.150:3001/health
```
(Replace with YOUR Mac Mini's IP)

You should see the JSON health response!

### Step 10: Update Frontend to Use Mac Mini

If using the React frontend:

**Option A: Environment Variable**
Create `.env.local` in your React app:
```env
REACT_APP_API_URL=http://192.168.1.150:3001
```

**Option B: Direct in Code**
In `foray-tx-review-with-backend.jsx`:
```javascript
const API_BASE_URL = -> http://192.168.1.150:3001'; // Your Mac Mini's IP
```

---

## [EYE] Part 5: Access from Internet (Optional)

If you want to access from anywhere on the internet:

### Option A: Port Forwarding (Requires Router Access)

#### Step 11: Setup Port Forwarding

1. **Find your router's IP:**
 ```bash
 netstat -nr | grep default
 ```
 Usually `192.168.1.1` or `192.168.0.1`

2. **Login to your router:**
 - Open browser: `http://192.168.1.1`
 - Login (check router label for password)

3. **Setup port forwarding:**
 - Find "Port Forwarding" or "Virtual Server" section
 - Add new rule:
 - **Service Name:** FORAY API
 - **External Port:** 3001
 - **Internal IP:** 192.168.1.150 (your Mac Mini)
 - **Internal Port:** 3001
 - **Protocol:** TCP
 - Save and apply

4. **Find your public IP:**
 ```bash
 curl ifconfig.me
 ```
 Example output: `203.0.113.45`

5. **Test external access:**
 From phone (turn off Wi-Fi to use cellular):
 ```
 http://203.0.113.45:3001/health
 ```

### Option B: Free Dynamic DNS (Better!)

Your public IP changes periodically. Use a free dynamic DNS service:

#### Step 12: Setup No-IP (Free Dynamic DNS)

1. **Create account at No-IP:**
 - Go to: https://www.noip.com
 - Sign up for free account
 - Create hostname: `myforay.ddns.net` (or similar)

2. **Install No-IP DUC (Dynamic Update Client) on Mac:**
 ```bash
 # Download and install No-IP DUC for Mac
 # Visit: https://www.noip.com/download
 # Download "Mac OS X Dynamic Update Client"
 # Install the .dmg file
 ```

3. **Configure No-IP DUC:**
 - Open No-IP DUC app
 - Login with your No-IP account
 - Select your hostname
 - It will automatically update your IP

4. **Now you can access via:**
 ```
 http://myforay.ddns.net:3001/health
 ```

This works even if your home IP changes!

---

## [KEY] Part 6: Keep Server Running 24/7

### Step 13: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Go to your project directory
cd ~/foray-backend

# Start server with PM2
pm2 start server.js --name foray-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on Mac boot
pm2 startup
# This will show a command - copy and run it
```

### Step 14: Verify PM2 is Running

```bash
# Check status
pm2 status

# View logs
pm2 logs foray-api

# Monitor in real-time
pm2 monit
```

Now your server will:
- [OK] Restart automatically if it crashes
- [OK] Start automatically when Mac Mini boots
- [OK] Run in the background (can close Terminal)

---

## [SHIELD] Part 7: Security (Important!)

### Step 15: Enable Mac Firewall

1. **System Settings -> Network -> Firewall**
2. Turn ON firewall
3. Add exception for Node.js if prompted

### Step 16: Add Basic Authentication (Optional but Recommended)

Update your `server.js` to add authentication:

```javascript
// Add this near the top after other requires
const ADMIN_KEY = process.env.ADMIN_API_KEY || -> your-secret-key-here';

// Add this middleware before routes
app.use('/api/generate-foray', (req, res, next) => {
 const apiKey = req.headers['x-api-key'];
 
 if (apiKey !== ADMIN_KEY) {
 return res.status(401).json({ error: -> Unauthorized' });
 }
 
 next();
});
```

Update `.env`:
```env
ADMIN_API_KEY=make-this-a-long-random-string
```

Now clients must send header:
```javascript
fetch('http://192.168.1.150:3001/api/generate-foray', {
 headers: {
 -> X-API-Key': -> your-secret-key-here'
 }
})
```

---

## [CHART] Part 8: Monitoring & Maintenance

### Useful PM2 Commands

```bash
# View all processes
pm2 list

# Restart server
pm2 restart foray-api

# Stop server
pm2 stop foray-api

# View logs
pm2 logs foray-api

# Monitor CPU/Memory
pm2 monit

# Clear logs
pm2 flush

# Remove from PM2
pm2 delete foray-api
```

### View Server Logs

```bash
# Real-time logs
pm2 logs foray-api --lines 100

# Or view log file directly
tail -f ~/.pm2/logs/foray-api-out.log
```

### Check Mac Mini Resources

```bash
# Check CPU/Memory usage
top

# Check disk space
df -h
```

---

## Part 9: Troubleshooting

### Problem: "Port 3001 already in use"

```bash
# Find what's using the port
lsof -i :3001

# Kill the process (replace PID with actual number)
kill -9 PID

# Or change port in .env
PORT=3002
```

### Problem: "Cannot connect from other devices"

1. **Check firewall:** System Settings -> Network -> Firewall
2. **Check Mac Mini is awake:** System Settings -> Energy Saver -> Prevent sleeping
3. **Verify IP address:** `ifconfig | grep "inet "`
4. **Test locally first:** `curl http://localhost:3001/health`

### Problem: "API Key not working"

```bash
# Check .env file
cat ~/foray-backend/.env

# Make sure there are no spaces around =
# CORRECT: ANTHROPIC_API_KEY=sk-ant-xxx
# WRONG: ANTHROPIC_API_KEY = sk-ant-xxx

# Restart server
pm2 restart foray-api
```

### Problem: "Mac Mini goes to sleep"

```bash
# Prevent sleep (run as one command)
sudo pmset -a displaysleep 0 sleep 0 disksleep 0

# Or use GUI:
# System Settings -> Energy Saver -> 
# - Prevent computer from sleeping automatically: ON
```

---

## [MEDAL] Part 10: Making It Production-Ready

### Enable HTTPS (Optional - Advanced)

For production use, you should use HTTPS. Options:

**Option 1: Cloudflare Tunnel (Easiest - Free)**
```bash
# Install Cloudflare Tunnel
brew install cloudflare/cloudflare/cloudflared

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create foray-tunnel

# Route to your service
cloudflared tunnel route dns foray-tunnel foray.yourdomain.com

# Run tunnel
cloudflared tunnel --url http://localhost:3001 run foray-tunnel
```

**Option 2: Self-Signed Certificate**
```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update server.js to use HTTPS
const https = require('https');
const fs = require('fs');

const options = {
 key: fs.readFileSync('key.pem'),
 cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(3001);
```

### Setup Automatic Backups

```bash
# Create backup script
nano ~/foray-backend/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf ~/foray-backups/foray-backup-$DATE.tar.gz ~/foray-backend
# Keep only last 7 days
find ~/foray-backups -name "foray-backup-*.tar.gz" -mtime +7 -delete
```

Make executable:
```bash
chmod +x ~/foray-backend/backup.sh
mkdir ~/foray-backups
```

Add to crontab (runs daily at 2am):
```bash
crontab -e
```

Add line:
```
0 2 * * * ~/foray-backend/backup.sh
```

---

## [PHONE] Part 11: Access URLs Summary

After setup, you can access your FORAY backend from:

### Local Network Only:
```
http://192.168.1.150:3001/health
http://192.168.1.150:3001/api/generate-foray
```

### From Internet (with port forwarding):
```
http://YOUR_PUBLIC_IP:3001/health
http://YOUR_PUBLIC_IP:3001/api/generate-foray
```

### From Internet (with No-IP):
```
http://myforay.ddns.net:3001/health
http://myforay.ddns.net:3001/api/generate-foray
```

### With Cloudflare Tunnel (HTTPS):
```
https://foray.yourdomain.com/health
https://foray.yourdomain.com/api/generate-foray
```

---

## [OK] Final Checklist

- [ ] Node.js installed
- [ ] FORAY backend files created
- [ ] Dependencies installed (`npm install`)
- [ ] .env file with API key
- [ ] Server starts successfully
- [ ] Can access from Mac Mini (localhost)
- [ ] Can access from other devices on network
- [ ] PM2 installed and configured
- [ ] Server auto-starts on boot
- [ ] Firewall configured
- [ ] (Optional) Port forwarding setup
- [ ] (Optional) Dynamic DNS configured
- [ ] (Optional) Authentication added
- [ ] (Optional) HTTPS enabled

---

## [PARTY] You're Done!

Your Mac Mini is now a FORAY backend server!

**Test it:**
```bash
# From Mac Mini
curl http://localhost:3001/health

# From phone/computer on same network
# (in browser) http://192.168.1.150:3001/health

# Generate a transaction
curl -X POST http://192.168.1.150:3001/api/generate-foray \
 -H "Content-Type: application/json" \
 -d -> {
 "transactionName": "Test Loan",
 "transactionDescription": "A $50,000 loan at 5% interest for 12 months"
 }'
```

**Estimated Cost:**
- Mac Mini: Already owned [OK]
- Electricity: ~$2-5/month (Mac Mini is very efficient)
- API Usage: ~$0.06 per transaction
- Total: Very affordable! [TARGET]

---

## Next Steps

1. **Update your React frontend** to point to Mac Mini IP
2. **Test transaction generation** from the web interface
3. **Setup monitoring** (optional - PM2 dashboard)
4. **Configure backups** (recommended)
5. **Add more features** (rate limiting, logging, etc.)

**Questions?** Check the troubleshooting section above!

---

## [SOS] Quick Help Commands

```bash
# Check if server is running
pm2 status

# View server logs
pm2 logs foray-api

# Restart server
pm2 restart foray-api

# Check Mac Mini's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Check public IP
curl ifconfig.me

# Test server locally
curl http://localhost:3001/health
```

---

**You now have a professional FORAY backend running on your Mac Mini!** [ROCKET]
