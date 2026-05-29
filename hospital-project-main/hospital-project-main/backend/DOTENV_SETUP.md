# Environment Setup Guide - Fixing "MONGODB_URI is not defined"

## Problem Explanation

The error occurs because:
1. Your `server.js` is in `backend/src/server.js`
2. Your `.env` file is in `backend/.env`
3. When Node runs, it uses the **current working directory** to find `.env`, not the script's directory
4. `require('dotenv').config()` without a path looks for `.env` in the current working directory

### Example Scenario
```
Working Directory: backend/
├── .env                  ← dotenv looks here
├── src/
│   ├── server.js        ← script is here
│   └── config/db.js
└── package.json
```

When you run `npm start` or `node src/server.js` from `backend/`, it works.
But the path is fragile if the working directory changes.

---

## Solution: Explicit Path Configuration

### Step 1: Create `.env` file from `.env.example`

```bash
cd backend
cp .env.example .env
```

### Step 2: Update `.env` with real MongoDB credentials

```bash
# backend/.env

# Port for the server
PORT=5000

# MongoDB Connection String
# Example: mongodb+srv://myuser:mypassword@mycluster.mongodb.net/hospital?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### Step 3: Use Correct dotenv Configuration

**In `backend/src/server.js`:**

```javascript
const path = require('path');

// Load .env from parent directory (backend/.env)
// __dirname = backend/src
// __dirname + '/../.env' = backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

console.log('[DEBUG] MONGODB_URI defined:', !!process.env.MONGODB_URI);
console.log('[DEBUG] PORT:', process.env.PORT);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
```

**Key line:**
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
```

- `__dirname` = absolute path to `backend/src`
- `../` = go up one level to `backend/`
- `path.resolve()` = create an absolute path that works anywhere

---

## How dotenv Works

### Without path argument (FRAGILE):
```javascript
require('dotenv').config();
// Looks for .env in CURRENT WORKING DIRECTORY
// Only works if you cd to backend/ before running
```

### With absolute path (ROBUST):
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Looks for .env relative to this file's location
// Works from anywhere
```

---

## Debugging Steps

### Check 1: Verify the .env file exists

```bash
cd backend
ls -la .env          # macOS/Linux
dir .env             # Windows
```

Output should show the file, not "file not found"

### Check 2: Verify environment variables are loaded

Add this to `backend/src/server.js` before `connectDB()`:

```javascript
console.log('=== Environment Variables ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ defined' : '❌ NOT defined');
console.log('PORT:', process.env.PORT || 5000);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ defined' : '❌ NOT defined');
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### Check 3: Verify .env format is correct

Good ✅:
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=secret123
```

Bad ❌:
```
PORT = 5000           # Spaces around =
MONGODB_URI=...       # Value has quotes "mongodb+srv://..."
JWT_SECRET= secret123 # Leading space in value
```

### Check 4: Restart after changes

Always restart the server after updating .env:
```bash
npm run dev
# or
npm start
```

dotenv loads on startup, not on file watch.

---

## Common Mistakes

### ❌ Mistake 1: Wrong dotenv path

```javascript
// WRONG - looks in backend/src/.env (won't find it)
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// CORRECT - looks in backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
```

### ❌ Mistake 2: .env in the wrong location

```
❌ backend/src/.env          (too deep)
✅ backend/.env              (correct)

❌ .env                       (root of project)
✅ backend/.env              (backend level)
```

### ❌ Mistake 3: Don't restart after editing .env

```bash
# Edit .env
vim .env

# Restart server - dotenv only loads on startup
npm run dev
```

### ❌ Mistake 4: Spaces or quotes in values

```
# ❌ WRONG
MONGODB_URI = mongodb+srv://...    # Spaces
JWT_SECRET="secret"                 # Quotes

# ✅ CORRECT
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret
```

### ❌ Mistake 5: .env committed to git

Add to `.gitignore`:
```
backend/.env
frontend/.env
.env
*.local
```

Never commit .env files with real secrets!

---

## MongoDB Atlas Connection String

Get your connection string:

1. Go to MongoDB Atlas > Cluster > Connect
2. Choose "Connect with MongoDB Drivers"
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
4. Replace placeholders:
   - `<username>` = database user
   - `<password>` = database password (URL encoded)
   - `<cluster>` = cluster name
   - `<dbname>` = database name (e.g., "hospital")

Example:
```
MONGODB_URI=mongodb+srv://admin:Pass123!@hospital-db.mongodb.net/hospital?retryWrites=true&w=majority
```

---

## Full Working Example

### File Structure
```
backend/
├── .env                          (environment variables)
├── src/
│   ├── server.js                (entry point)
│   ├── app.js
│   └── config/
│       └── db.js                (MongoDB connection)
└── package.json
```

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb+srv://hospital_user:Pass123@hospital-db.mongodb.net/hospital?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### backend/src/server.js
```javascript
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server error:', error.message);
    process.exit(1);
  }
};

startServer();
```

### backend/src/config/db.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required but not set!');
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
```

---

## Testing

### Run with npm
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
[DEBUG] Looking for .env at: /path/to/backend/.env
[DEBUG] MONGODB_URI defined: true
[DEBUG] NODE_ENV: development
✅ MongoDB Connected: hospital-db.mongodb.net
✅ Server running on port 5000
```

### If you see this error:
```
❌ MONGODB_URI is not defined
```

- Check `.env` exists in `backend/`
- Check `MONGODB_URI=...` line is in `.env`
- Check for spaces or formatting issues
- Restart the server: `npm run dev`

---

## Summary

| Step | Action |
|------|--------|
| 1 | Copy `.env.example` to `.env` in `backend/` folder |
| 2 | Add your MongoDB URI to `.env` |
| 3 | Use `require('dotenv').config({ path: path.resolve(__dirname, '../.env') })` in `server.js` |
| 4 | Restart the server |
| 5 | Check debug logs to verify variables are loaded |

The key is using an **absolute path** so dotenv can find `.env` from anywhere.
