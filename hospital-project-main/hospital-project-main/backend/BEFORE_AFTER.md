# Before & After: Fixing MONGODB_URI Error

## The Problem

### ❌ BEFORE (Broken)
```javascript
// backend/src/server.js

require('dotenv').config();  // ← PROBLEM: No path specified

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // ...
```

**Why it fails:**
- `require('dotenv').config()` looks for `.env` in the **current working directory**
- If you run from anywhere other than `backend/`, it won't find `backend/.env`
- Result: `process.env.MONGODB_URI` is `undefined`

---

## The Solution

### ✅ AFTER (Fixed)
```javascript
// backend/src/server.js

const path = require('path');

// ← SOLUTION: Explicit path relative to this file's location
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

// ← BONUS: Debug logs to verify variables are loaded
console.log(`[DEBUG] Looking for .env at: ${path.resolve(__dirname, '../.env')}`);
console.log(`[DEBUG] MONGODB_URI defined: ${!!process.env.MONGODB_URI}`);
console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();
```

**Why it works:**
- `path.resolve(__dirname, '../.env')` creates an **absolute path** to `.env`
- `__dirname` = folder where `server.js` is located = `backend/src`
- `../` = go up one folder
- Result: Always finds `backend/.env` regardless of working directory

---

## Error Handling: Before & After

### ❌ BEFORE (Generic error)
```javascript
// backend/src/config/db.js

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  // ...
};
```

**Result:** User sees generic error, doesn't know what to do

---

### ✅ AFTER (Helpful error)
```javascript
// backend/src/config/db.js

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌ MONGODB_URI is not defined');
    console.error('Steps to fix:');
    console.error('  1. Check if backend/.env exists');
    console.error('  2. Verify MONGODB_URI=mongodb+srv://... is in the .env file');
    console.error('  3. Make sure there are no spaces around the = sign');
    console.error('  4. Restart the server after updating .env\n');
    throw new Error('MONGODB_URI environment variable is required but not set');
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};
```

**Result:** User gets clear steps to fix the problem

---

## File Structure: Visual Guide

```
Before (Fragile):
─────────────────────────────────────
backend/
├── .env
├── src/
│   ├── server.js         ← Looks in CURRENT WD (fragile!)
│   └── config/
│       └── db.js
└── package.json


require('dotenv').config()
↓
Looks here: process.cwd() = ???
May or may not find .env depending on where script runs


After (Robust):
─────────────────────────────────────
backend/
├── .env                   ← server.js knows exact path
├── src/
│   ├── server.js          ← Uses: path.resolve(__dirname, '../.env')
│   └── config/
│       └── db.js
└── package.json


path.resolve(__dirname, '../.env')
↓
__dirname = /full/path/to/backend/src
↓
../. = /full/path/to/backend
↓
../. + .env = /full/path/to/backend/.env  ← Found!
```

---

## Execution Flow Comparison

### ❌ Before (May fail)
```
$ npm run dev
  ↓
Start server.js
  ↓
require('dotenv').config()  ← Look where? CWD is unknown
  ↓
Can't find .env
  ↓
process.env.MONGODB_URI = undefined
  ↓
❌ Error: MONGODB_URI is not defined
```

### ✅ After (Always works)
```
$ npm run dev
  ↓
Start server.js
  ↓
const path = require('path')
  ↓
__dirname = /full/path/to/backend/src
  ↓
path.resolve(__dirname, '../.env') = /full/path/to/backend/.env
  ↓
require('dotenv').config({ path: /full/path/to/backend/.env })
  ↓
Found .env ✅
  ↓
process.env.MONGODB_URI = mongodb+srv://...
  ↓
✅ Connects to MongoDB
```

---

## Key Concepts

### `__dirname`
- Built-in Node variable
- Contains absolute path to folder containing current file
- Changes based on file location

Example:
```
If server.js is at: /Users/dev/hospital/backend/src/server.js
Then __dirname = /Users/dev/hospital/backend/src
```

### `path.resolve()`
- Resolves relative paths to absolute paths
- `path.resolve(__dirname, '../.env')`
- = Go to current file's folder, then up 1 level, then find .env

### `path.resolve()` vs hardcoding
```javascript
// ❌ Hardcoded (breaks on different machines)
require('dotenv').config({ path: '/Users/myname/backend/.env' });

// ✅ Dynamic (works on any machine)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
```

---

## Testing the Fix

### Step 1: Add debug logs
```javascript
console.log('[DEBUG] __dirname:', __dirname);
console.log('[DEBUG] .env path:', path.resolve(__dirname, '../.env'));
console.log('[DEBUG] MONGODB_URI:', process.env.MONGODB_URI);
```

### Step 2: Run server
```bash
npm run dev
```

### Step 3: Check output
```
[DEBUG] __dirname: /path/to/backend/src
[DEBUG] .env path: /path/to/backend/.env
[DEBUG] MONGODB_URI: mongodb+srv://...
✅ Server running
```

---

## Summary Table

| Aspect | Before ❌ | After ✅ |
|--------|-----------|---------|
| dotenv config | `require('dotenv').config()` | `require('dotenv').config({ path: path.resolve(__dirname, '../.env') })` |
| .env lookup | Current working directory (fragile) | Absolute path relative to file (robust) |
| Errors | Generic messages | Step-by-step debugging guide |
| Works everywhere | ❌ Only if cwd is correct | ✅ Always works |
| Debug logs | None | Shows env vars loaded at startup |

---

## Remember

The key change:
```javascript
+ const path = require('path');
- require('dotenv').config();
+ require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
```

This tiny change moves from "fragile" to "robust" dotenv loading. 🚀
