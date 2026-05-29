# Quick Fix Checklist: MONGODB_URI Error

## Quickstart (5 min)

### 1. ✅ Create .env from example
```bash
cd backend
cp .env.example .env
```

### 2. ✅ Add MongoDB credentials to .env
```bash
# Edit backend/.env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hospital?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=anysecretkey
NODE_ENV=development
```

### 3. ✅ Verify server.js has correct dotenv config
```javascript
// backend/src/server.js - FIRST 5 LINES

const path = require('path');

// ✅ This line is critical - it tells dotenv WHERE to find .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');
```

### 4. ✅ Restart server
```bash
npm run dev
```

### 5. ✅ Verify in console output
```
[DEBUG] Looking for .env at: /path/to/backend/.env
[DEBUG] MONGODB_URI defined: true
✅ MongoDB Connected: hospital-db.mongodb.net
✅ Server running on port 5000
```

---

## Troubleshooting

### Error: "MONGODB_URI is not defined"

**Check 1:** Does `.env` file exist?
```bash
ls backend/.env
# If "no such file" - run: cp backend/.env.example backend/.env
```

**Check 2:** Is `MONGODB_URI` in the .env file?
```bash
cat backend/.env | grep MONGODB_URI
# Should see: MONGODB_URI=mongodb+srv://...
```

**Check 3:** Is the dotenv path correct in server.js?
```javascript
// ✅ Correct (goes up 1 level)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ❌ Wrong (looks in same folder)
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// ❌ Wrong (no path specified)
require('dotenv').config();
```

**Check 4:** Did you restart the server after updating .env?
```bash
# Stop the current server (Ctrl+C)
npm run dev     # Start fresh
```

---

## How it Works

```
File Structure:
backend/
├── .env                    ← Your env file (created from .env.example)
├── src/
│   └── server.js          ← Your entry point

When server.js runs:
__dirname = /path/to/backend/src
__dirname/../.env = /path/to/backend/.env  ← Found!

path.resolve(__dirname, '../.env')
= Final absolute path to .env file
```

---

## Common Mistakes ❌

| Mistake | Problem | Fix |
|---------|---------|-----|
| `.env` in wrong folder | dotenv can't find it | Put it in `backend/` not `backend/src/` |
| Using `require('dotenv').config()` alone | Only works if cwd is `backend/` | Add path: `{ path: path.resolve(...) }` |
| Spaces in .env values | `PORT = 5000` has spaces | Remove: `PORT=5000` |
| Quotes around values | `MONGODB_URI="mongodb+srv://..."` | Remove quotes |
| Not restarting after .env edit | Changes don't load | Kill server, run `npm run dev` again |
| .env committed to git | Secrets exposed | Add `backend/.env` to `.gitignore` |

---

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create/login to cluster
3. Click **Connect** → **Drivers** → Copy connection string
4. Replace placeholders:
   - `<username>` = Your database username
   - `<password>` = Your database password (URL encoded if special chars)
   - `<cluster>` = Your cluster name
   - `<dbname>` = `hospital` (or your db name)

Example:
```
mongodb+srv://admin:MyPass123@hospital-prod.mongodb.net/hospital?retryWrites=true&w=majority
```

---

## Files Updated

✅ `backend/src/server.js` - Added explicit .env path + debug logs
✅ `backend/src/config/db.js` - Added helpful error messages
✅ `backend/DOTENV_SETUP.md` - Full guide with examples
✅ `backend/.env.example` - Template for .env

---

## Next Steps

1. Copy `.env.example` → `.env`
2. Add your MongoDB URI
3. Run `npm run dev`
4. See debug output confirming MongoDB is connected

Done! 🎉
