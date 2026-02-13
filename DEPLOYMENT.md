# NoteFlow Deployment Guide

## Hosting Recommendations

### Free Hosting Options (Good for Testing/Demo)

#### Frontend (Angular)
1. **Vercel** (Recommended)
   - Free tier available
   - Easy deployment from GitHub
   - Automatic HTTPS
   - Great for Angular apps
   - URL: https://vercel.com

2. **Netlify**
   - Free tier available
   - Simple drag-and-drop or Git integration
   - Automatic HTTPS
   - Good for static sites
   - URL: https://netlify.com

3. **GitHub Pages**
   - Free for public repositories
   - Simple setup
   - Limited features
   - URL: https://pages.github.com

#### Backend (Node.js/Express)
1. **Render** (Recommended)
   - Free tier available
   - Easy Node.js deployment
   - Automatic HTTPS
   - Good documentation
   - URL: https://render.com

2. **Railway**
   - Free tier with $5 credit/month
   - Easy deployment
   - Good for full-stack apps
   - URL: https://railway.app

3. **Heroku** (Limited free tier)
   - Well-known platform
   - Free tier is limited now
   - URL: https://heroku.com

### Paid Hosting Options (For Production)

1. **DigitalOcean**
   - $5-12/month for basic VPS
   - Full control
   - Good for learning

2. **AWS (Amazon Web Services)**
   - Pay-as-you-go
   - Frontend: S3 + CloudFront
   - Backend: EC2 or Elastic Beanstalk

3. **Google Cloud Platform**
   - Free tier available
   - Frontend: Firebase Hosting
   - Backend: Cloud Run or App Engine

### Domain Services

1. **Namecheap** - Affordable domains ($10-15/year)
2. **Google Domains** - Simple and reliable
3. **Cloudflare** - Good prices + free DNS/CDN
4. **GoDaddy** - Popular but more expensive

## What You Need to Change for Production

### 1. Backend Changes (`backend/server.js`)

#### Environment Variables
Create a `.env` file:
```env
PORT=3000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

Install dotenv:
```bash
npm.cmd install dotenv
```

Update `server.js`:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Update CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
```

#### Database Integration
Replace in-memory storage with a database:

**Option 1: MongoDB (MongoDB Atlas - Free tier)**
```bash
npm.cmd install mongoose
```

**Option 2: PostgreSQL (Free on Railway/Render)**
```bash
npm.cmd install pg
```

**Option 3: SQLite (Simple, file-based)**
```bash
npm.cmd install sqlite3
```

#### File Storage
- Use cloud storage (AWS S3, Cloudinary) instead of local `uploads/` folder
- Or use a database to store file metadata

### 2. Frontend Changes

#### Environment Configuration
Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api'
};
```

Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Update `src/app/services/auth.service.ts`:
```typescript
import { environment } from '../../environments/environment';

private apiUrl = environment.apiUrl;
```

#### Build for Production
```bash
ng build --configuration production
```

This creates optimized files in `dist/` folder.

### 3. Security Improvements

1. **Change JWT Secret** - Use a strong, random secret
2. **Add Input Validation** - Validate all inputs on backend
3. **Rate Limiting** - Prevent abuse
   ```bash
   npm.cmd install express-rate-limit
   ```
4. **Helmet** - Security headers
   ```bash
   npm.cmd install helmet
   ```
5. **HTTPS Only** - Force HTTPS in production
6. **Password Requirements** - Enforce strong passwords

### 4. Error Handling

- Add proper error logging
- Don't expose internal errors to users
- Add error monitoring (Sentry, etc.)

## Deployment Steps

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend on Vercel:
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set build command: `ng build --configuration production`
5. Set output directory: `dist/noteflow-frontend/browser`
6. Add environment variable: `API_URL=https://your-backend.onrender.com/api`
7. Deploy!

#### Backend on Render:
1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your repository
5. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
6. Add environment variables:
   - `JWT_SECRET=your-secret-key`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
7. Deploy!

### Option 2: Netlify (Frontend) + Railway (Backend)

Similar process but using Netlify for frontend and Railway for backend.

### Option 3: Full Stack on Railway

Railway can host both frontend and backend:
1. Create two services in Railway
2. One for frontend (static site)
3. One for backend (Node.js)
4. Configure environment variables
5. Deploy both

## Quick Deployment Checklist

### Before Deployment:
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update CORS to allow your frontend domain
- [ ] Set up environment variables
- [ ] Replace in-memory storage with database (recommended)
- [ ] Update API URLs in frontend
- [ ] Build frontend for production
- [ ] Test locally with production build
- [ ] Add error handling and logging
- [ ] Set up file storage (if using file uploads)

### After Deployment:
- [ ] Test registration and login
- [ ] Test all CRUD operations
- [ ] Test import/export functionality
- [ ] Verify HTTPS is working
- [ ] Check CORS is configured correctly
- [ ] Monitor error logs
- [ ] Set up domain (optional)

## Cost Estimate

### Free Tier:
- Frontend: Vercel/Netlify (Free)
- Backend: Render/Railway (Free tier)
- Domain: $10-15/year (optional)
- **Total: $0-15/year**

### Basic Paid:
- Frontend: Vercel Pro ($20/month) or keep free
- Backend: Railway ($5-10/month)
- Database: MongoDB Atlas (Free tier) or Railway PostgreSQL
- Domain: $10-15/year
- **Total: ~$15-30/month**

## Recommended Setup for Your Project

**For Course Submission/Demo:**
1. **Frontend**: Vercel (Free) - Easy deployment
2. **Backend**: Render (Free) - Reliable Node.js hosting
3. **Database**: MongoDB Atlas (Free tier) - Easy to set up
4. **Domain**: Optional - Can use provided subdomains

**Steps:**
1. Set up MongoDB Atlas (free)
2. Update backend to use MongoDB
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Update frontend API URL
6. Test everything

## Important Notes

1. **Free tiers have limitations:**
   - May sleep after inactivity (Render)
   - Limited bandwidth/storage
   - May require credit card for some services

2. **For course submission:**
   - You might want to keep it simple
   - Use free tiers
   - Document the deployment process
   - Include deployment instructions in your submission

3. **Security:**
   - Never commit `.env` files to Git
   - Use environment variables on hosting platform
   - Change default secrets
   - Enable HTTPS

4. **Testing:**
   - Test thoroughly after deployment
   - Check that all features work
   - Verify authentication works
   - Test import/export

## Need Help?

If you encounter issues:
1. Check hosting platform logs
2. Verify environment variables are set
3. Check CORS configuration
4. Verify API URLs are correct
5. Check database connection (if using)

Good luck with your deployment! 🚀
