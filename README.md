# Dutch Transcript App

Nederlandse transcriptie-app voor studenten. Upload een audiobestand of neem rechtstreeks op in de browser — de app transcribeert via OpenAI en slaat het resultaat op in je account.

## Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + Supabase JS
- **Backend**: Python 3.12 + FastAPI + OpenAI Python client
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Transcriptie**: OpenAI `gpt-4o-mini-transcribe`, `language="nl"`

## Lokaal draaien

### Vereisten

- Node.js 20+
- Python 3.12+
- Een Supabase project met de `transcripts` tabel (zie migratie in `supabase/`)
- Een OpenAI API key

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
# Vul OPENAI_API_KEY in .env in
uvicorn app.main:app --reload --port 8000
```

Verificeer: `curl http://localhost:8000/health` → `{"status":"ok"}`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Vul .env.local in (zie hieronder)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Omgevingsvariabelen frontend

| Variabele | Waarde |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL van je Supabase project |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key (JWT) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **nooit publiek maken** |
| `NEXT_PUBLIC_API_URL` | URL van de FastAPI backend (standaard `http://localhost:8000`) |
| `FASTAPI_INTERNAL_TOKEN` | Shared secret met FastAPI (optioneel, aanbevolen in productie) |

## Deployen op Vercel

Beide projecten worden apart gedeployed als Vercel-project vanuit dezelfde repository.

### 1. Backend deployen

1. Maak een nieuw Vercel-project aan
2. Kies de repository en stel **Root Directory** in op `backend`
3. Voeg environment variables toe in het Vercel-dashboard:
   - `OPENAI_API_KEY`
   - `ALLOWED_ORIGINS` → `["https://jouw-frontend.vercel.app"]`
   - `X_INTERNAL_TOKEN` → genereer met `openssl rand -hex 32`
4. Deploy — de backend URL is bijv. `https://dutch-transcript-backend.vercel.app`

> **Let op:** Vercel serverless functies hebben standaard een timeout van 10s (Pro: 5 min). Lange opnames kunnen de gratis timeout raken. Overweeg de Pro plan voor productiegebruik.

### 2. Frontend deployen

1. Maak een tweede Vercel-project aan (zelfde repo)
2. Stel **Root Directory** in op `frontend`
3. Voeg environment variables toe:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_API_URL` → de backend Vercel URL uit stap 1
   - `FASTAPI_INTERNAL_TOKEN` → dezelfde waarde als `X_INTERNAL_TOKEN` in de backend

### 3. Supabase CORS

Voeg de frontend Vercel URL toe aan de toegestane URLs in het Supabase-dashboard onder **Authentication → URL Configuration**.

## Limieten

- Max bestandsgrootte: 25 MB
- Max opnameduur: 10 minuten
- Ondersteunde formaten: MP3, MP4, WAV, WebM, OGG, M4A

## Architectuur

```text
Browser
  ├─→ Supabase JS (direct)        ← login / signup
  └─→ Next.js API Routes (BFF)
        ├─→ FastAPI  POST /transcribe   ← audio → OpenAI → tekst
        └─→ Supabase (service role)     ← transcript opslaan
```

FastAPI heeft geen kennis van users of Supabase — puur een transcriptiedienst.
