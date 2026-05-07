# Dutch Transcript App

Nederlandse transcriptie-app voor studenten. Upload een audiobestand of neem rechtstreeks op in de browser — de app transcribeert via OpenAI en slaat het resultaat op in je account.

## Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + Supabase JS
- **Backend**: Python 3.13 + FastAPI + OpenAI Python client
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Transcriptie**: OpenAI `gpt-4o-mini-transcribe`, `language="nl"`

## Lokaal draaien

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -e ".[dev]"
cp .env.example .env
# Vul .env in met je keys
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Vul .env.local in met je Supabase publishable key en backend URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Omgevingsvariabelen

Zie `backend/.env.example` en `frontend/.env.local.example` voor alle benodigde keys.
