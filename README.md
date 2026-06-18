# 📊 FB Insights AI
 
A Facebook community analytics dashboard powered by AI. Upload your Facebook post data, visualize key metrics, and get AI-generated insights and recommendations.
 
## 🔗 Live Demo
 
[fb-insights-ai.vercel.app](https://fb-insights-ai.vercel.app)
 
---
 
## 📸 Screenshots
 
### Dashboard
<img src="./public/screenshots/Dashboard 1.png" width="800" alt="Dashboard" />
<img src="./public/screenshots/Dashboard 2.png" width="800" alt="Dashboard" />
 
### Manage Uploads
<img src="./public/screenshots/Manage Uploads - Upload.png" width="800" alt="Dashboard" />
<img src="./public/screenshots/Manage Uploads - Delete.png" width="800" alt="Dashboard" />
 
### AI Analysis
<img src="./public/screenshots/AI Analysis 1.png" width="800" alt="Dashboard" />
<img src="./public/screenshots/AI Analysis 2.png" width="800" alt="Dashboard" />
 
---
 
## ✨ Features
 
- 📂 **CSV Upload** — Upload Facebook post data exported from Meta Business Suite
- 📈 **Analytics Dashboard** — View all posts with calculated CTR% and Engagement Rate%
- 🃏 **Summary Cards** — At-a-glance overview of total posts, average impressions, CTR, and engagement
- 🤖 **AI Analysis** — Select a batch and get AI-generated performance summaries and actionable recommendations powered by OpenAI
- 🗂️ **Batch Management** — Upload, replace, and delete data batches from a single dialog
- 🔍 **Duplicate Detection** — Detects duplicate file uploads and prompts to replace existing data
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| UI Components | shadcn/ui + Tailwind CSS |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |
 
---
 
## 📋 CSV Format
 
The application expects a CSV file exported from Meta Business Suite with the following columns:
 
| Column | Type | Example |
|---|---|---|
| Date | MM/DD/YY | 1/1/21 |
| Time | HH:MM:SS | 13:03:00 |
| Post type | String | Photos, Videos, Links |
| Title | String | Post content text |
| Impressions | Integer | 1540 |
| Likes | Integer | 48 |
| Comments | Integer | 12 |
| Shares | Integer | 7 |
| Total clicks | Integer | 61 |
 
> 💡 A sample CSV file is available at [`/public/sample.csv`](./public/sample.csv) for testing.
 
---

## 📐 KPI Calculations
 
| Metric | Formula |
|---|---|
| CTR% | `(Total Clicks / Impressions) × 100` rounded to 2 decimal places |
| Engagement Rate% | `((Likes + Comments + Shares) / Impressions) × 100` rounded to 4 decimal places |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- PostgreSQL database (or a [Supabase](https://supabase.com) account)
- OpenAI API key
### Installation
 
1. Clone the repository
```bash
git clone https://github.com/tompopo777/fb-insights-ai.git
cd fb-insights-ai
```
 
2. Install dependencies
```bash
npm install
```
 
3. Set up environment variables by creating a `.env` file in the root directory
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```
 
4. Run database migrations
```bash
npx prisma migrate dev
```
 
5. Start the development server
```bash
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000) to view the app.
 
---
 
## 📁 Project Structure
 
```
fb-insights-ai/
├── app/
│   ├── page.tsx              # Home page (Server Component)
│   ├── analysis/
│   │   └── page.tsx          # AI analysis page
│   └── api/
│       ├── upload/
│       │   └── route.ts      # CSV upload endpoint
│       ├── upload/[id]/
│       │   └── route.ts      # Delete batch endpoint
│       └── analysis/
│           └── route.ts      # OpenAI analysis endpoint
├── components/
│   ├── Dashboard.tsx         # Main dashboard UI
│   ├── UploadCsv.tsx         # CSV upload component
│   └── AnalysisPage.tsx      # AI analysis UI
├── lib/
│   ├── db.ts                 # Prisma client
│   └── calculateMetrics.ts   # CTR and Engagement Rate calculations
└── prisma/
    └── schema.prisma         # Database schema
```
