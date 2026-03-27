# Environment Variables Setup

## Backend (.env) - For Render

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Frontend (.env.production) - For Vercel

```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

## Deployment Steps

### 1. Backend on Render
1. Go to https://render.com
2. Connect your GitHub repo
3. Create a new Web Service
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables from `.env`
6. Deploy

### 2. Frontend on Vercel
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
4. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://smart-assignment-api.onrender.com/api`)
5. Deploy

---

## After Deployment
1. Note your Vercel URL (e.g., `https://smart-answers-explainer.vercel.app`)
2. Update Render's `FRONTEND_URL` to your Vercel URL
3. Redeploy backend
