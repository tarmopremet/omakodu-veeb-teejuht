# Zone.ee Deployment Guide

## 1. Build the project locally

```bash
# Clone the GitHub repo (if connected) or download project files
git clone [your-github-repo-url]
cd [project-folder]

# Install dependencies
npm install

# Build for production
npm run build
```

## 2. Files to upload to zone.ee

After `npm run build`, you'll get a `dist/` folder with these files:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other static files]
```

## 3. Zone.ee upload steps

1. **Login to zone.ee control panel**
2. **Go to File Manager** (Failihaldur)
3. **Navigate to public_html/** folder
4. **Upload ALL contents from dist/ folder** (not the dist folder itself)
   - Upload index.html to public_html/
   - Upload assets/ folder to public_html/assets/
   - Upload any other files from dist/

## 4. Database setup

Your app uses Supabase. Two options:

### Option A: Keep Supabase (Recommended)
- No changes needed
- Supabase URLs in the code will work from zone.ee
- Keep all authentication and data features

### Option B: Migrate to zone.ee database
- Create PostgreSQL database in zone.ee
- Export data from Supabase
- Update database connection URLs in the code

## 5. Domain setup

1. **In zone.ee panel**: Point your domain to the public_html folder
2. **If using subdomain**: Create subdomain pointing to same location
3. **SSL**: Enable in zone.ee panel for HTTPS

## 6. Environment variables

If keeping Supabase, these are already in the code:
- SUPABASE_URL: https://sfismionwystqhsmytjq.supabase.co
- SUPABASE_KEY: [already in client.ts]

## 7. Test the deployment

1. Visit your domain
2. Test login/registration
3. Test booking functionality
4. Check all pages work

## Notes:
- The app is a Single Page Application (SPA)
- Make sure your zone.ee hosting supports SPA routing
- If routes don't work, you may need .htaccess file for Apache

## Need help?
- Check zone.ee documentation for SPA hosting
- Contact zone.ee support if routing issues occur