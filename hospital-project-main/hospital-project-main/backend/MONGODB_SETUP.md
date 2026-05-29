# MongoDB Setup Options - Fix Connection Error

## Option 1: Use MongoDB Atlas Cloud (RECOMMENDED - No installation needed)

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/GitHub

### Step 2: Create a Cluster
1. Click "Create a Deployment"
2. Choose "Free" tier
3. Select region (us-east-1 recommended)
4. Click "Create"
5. Wait 5-10 minutes for cluster to be ready

### Step 3: Create Database Credentials
1. Click "Database Access" (left menu)
2. Click "Add New Database User"
3. Enter:
   - Username: `hospitaluser`
   - Password: `HospitalPass123` (or generate one)
4. Click "Add User"

### Step 4: Whitelist IP Address
1. Click "Network Access" (left menu)
2. Click "Add IP Address"
3. Click "Add Current IP Address" (or use 0.0.0.0/0 for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Clusters" (left menu)
2. Click "Connect" button on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

### Step 6: Update .env
```bash
# backend/.env

MONGODB_URI=mongodb+srv://hospitaluser:HospitalPass123@hospital-cluster.mongodb.net/hospital?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 7: Restart Server
```bash
npm run dev
```

---

## Option 2: Use Local MongoDB (Development Only)

### Windows Installation
1. Download: https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Install MongoDB as a Service"
4. MongoDB starts automatically

### macOS Installation
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux Installation (Ubuntu)
```bash
curl https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
apt-get install -y mongodb-org
systemctl start mongod
```

### Update .env
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/hospital
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Restart Server
```bash
npm run dev
```

---

## Connection String Format Explained

### Cloud (MongoDB Atlas):
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
       ↑     ↑        ↑         ↑             ↑         ↑
       |     |        |         |             |         └─ Options
       |     |        |         |             └─────────── Database name
       |     |        |         └───────────────────────── Cluster domain
       |     |        └──────────────────────────────────── Password (URL encoded)
       |     └──────────────────────────────────────────── Username
       └──────────────────────────────────────────────── Connection type (srv)
```

### Local (MongoDB Community):
```
mongodb://127.0.0.1:27017/DATABASE
       ↑  ↑           ↑     ↑
       |  |           |     └─ Database name
       |  |           └─────── Default MongoDB port
       |  └───────────────────── Localhost
       └────────────────────── Connection type
```

---

## Verification

### Check .env is loaded
```bash
cd backend
node -e "require('dotenv').config({ path: './.env' }); console.log('MONGODB_URI:', process.env.MONGODB_URI)"
```

Should show your connection string.

### Start server and look for
```bash
npm run dev
```

Expected output:
```
[DEBUG] Looking for .env at: /path/to/backend/.env
[DEBUG] MONGODB_URI defined: true
[DEBUG] NODE_ENV: development
✅ MongoDB Connected: hospital-cluster.mongodb.net
✅ Server running on port 5000
```

### If error persists
1. Stop server (Ctrl+C)
2. Edit `.env` - verify credentials
3. Verify no spaces around `=` in .env
4. Restart: `npm run dev`

---

## Recommended: MongoDB Atlas

✅ Free tier (512MB storage)
✅ Cloud hosted - no installation
✅ Works from anywhere
✅ Easy backup/scaling
✅ Production-ready

---

## Current .env Configuration

Your current `.env` is set up with these credentials:
```
Username: hospitaluser
Password: HospitalPass123
Cluster: hospital-cluster
Database: hospital
```

**To use this, you need to:**
1. Create MongoDB Atlas cluster
2. Create user with same credentials
3. Whitelist your IP
4. Restart server

Or update `.env` with your own credentials from MongoDB Atlas.
