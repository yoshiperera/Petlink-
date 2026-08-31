# Petlink-
PetLink - AI Based Object Detection and dog Identification System
cd "petlink web app"
bun run dev


cd "petlink web app/petlink-ml"
venv\Scripts\activate
uvicorn main:app --reload --port 8000



## Features
- Owner registration and Lost Pet Report management
- Anonymous Found Pet Report submission (video upload)
- AI-based matching (YOLO detection + CNN embedding)
- Automated email notifications
- Happy Tails success stories

## Tech Stack
- Frontend: React 19, TypeScript, TanStack Router/Query, Tailwind CSS
- Backend: Supabase (Auth, PostgreSQL, Storage)
- ML Service: Python, FastAPI, PyTorch, YOLOv8

## Project Structure
petlink web app/
├── src/                  # Frontend source code
├── petlink-ml/           # ML matching service
│   ├── main.py           # FastAPI endpoints
│   ├── ml.py              # Matching logic
│   └── requirements.txt
└── README.md






## Setup Instructions

### 1. Install Dependencies
cd "petlink web app"
npm install

cd petlink-ml
pip install -r requirements.txt

### 2. Environment Variables
Create a `.env` file (see `.env.example` for required variables — 
do not commit real credentials)

### 3. Start the Development Servers

Frontend:
npm run dev

ML Service:
uvicorn main:app --reload

## API Endpoints
- POST /embed-lost/{report_id} — generate embedding for a Lost Pet Report
- POST /match-found/{report_id} — trigger matching for a Found Pet Report


