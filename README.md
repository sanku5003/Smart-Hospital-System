# MedPulse CityNet

MedPulse CityNet is a smart hospital and city-health coordination platform designed to reduce patient waiting times, improve hospital resource visibility, and support emergency routing across multiple hospitals and cities. It combines a patient-facing kiosk, hospital operations dashboard, district-level city analytics, and AI-assisted symptom triage into a single system.

The project is split into:
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB with automatic fallback to MongoMemoryServer for local/demo usage
- AI: Google Gemini integration with a heuristic fallback triage engine

---

## Project Overview

The system is built around a real-world hospital coordination scenario:

1. A patient arrives and enters symptoms at the patient kiosk.
2. The app classifies urgency using AI-powered triage logic or a built-in rule-based fallback.
3. The patient receives guidance on the correct hospital department or queue route.
4. Hospital staff can update bed availability, doctor load, diagnostics queue, and blood bank stock in real time.
5. CMO and super-admin users can view citywide status, allocate or redirect patients, and manage hospital provisioning.
6. The platform continuously updates stakeholders through live dashboard and socket events.

This makes the solution useful for:
- public hospitals
- district health systems
- rural health outreach
- emergency response coordination
- queue management in busy healthcare networks

---

## How the System Works

### 1. Patient-facing flow
The patient portal lets users:
- generate a token / queue number
- select symptoms for triage
- view recommended departments or urgency categories
- check hospital availability
- scan a QR code for queue status and check-in
- submit feedback after service

This flow is powered by the backend token and triage APIs and is surfaced in the frontend patient kiosk and queue tracker screens.

### 2. Hospital operations flow
Each hospital can manage:
- bed occupancy and emergency allocation
- doctor workload and specialist availability
- diagnostics appointments like CT, MRI, ultrasound, and X-ray
- blood stock updates and reserved units
- disaster mode and emergency redistribution

These updates are stored in the database and pushed to connected clients through Socket.IO events, so dashboards refresh in real time.

### 3. City and district flow
The city dashboard aggregates hospital and area data across locations such as Jhansi, Kanpur, Lucknow, Agra, Gwalior, and Delhi NCR. It includes:
- hospital maps
- bed and ICU counts
- symptom-based hospital filtering
- area health summaries
- predictive analytics for demand and resource stress
- ambulance and disaster response coordination

This is useful for district health officers who need a quick operational view of where capacity is available.

### 4. Admin and provisioning flow
The app supports role-based access for:
- patient users
- village health representatives
- hospital administrators
- district CMO officers
- super admins

Protected routes use JWT-based authentication and provide provisioning endpoints for creating or configuring hospitals, CMOs, and field/mitra users.

---

## Key Features

### Patient and Queue Management
- token generation and queue tracking
- symptom-driven triage recommendation
- hospital and department routing
- QR-based patient check-in and tracking
- patient feedback collection

### Hospital Resource Monitoring
- live bed status updates
- ICU, general ward, emergency, and ventilator tracking
- doctor load balancing
- diagnostics queue booking
- blood bank reservation records

### City-Wide Health Intelligence
- multi-city hospital map and summary data
- symptom-based filter across hospitals
- predictive analytics using a local forecasting engine
- ambulance reservation / dispatch support
- disaster redistribution logic for overloaded hospitals

### AI-Assisted Triage
- optional Google Gemini AI triage using the `GEMINI_API_KEY`
- fallback intelligent keyword-based triage engine when no API key is configured
- urgency tags such as EMERGENCY, VULNERABLE, and GENERAL
- specialized route suggestions like Cardiology, Orthopedics, Pulmonology, Neurology, and Emergency

### Role-Based Access
- Patient Portal: open access
- Gram Swasthya Mitra: rural health representative workflow
- Hospital Staff: authenticated dashboard access
- CMO Admin: district oversight and emergency decisions
- Super Admin: system provisioning and authority controls

### Real-Time Updates
- WebSocket-based updates using Socket.IO
- live hospital changes broadcast to users
- reactive UI behavior across hospital and city dashboards

---

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Leaflet / react-leaflet for map view
- Recharts for analytics graphics
- Socket.IO client for real-time updates
- QR and scanner utilities

### Backend
- Node.js
- Express.js
- Mongoose
- Socket.IO
- JWT for authentication
- CORS and dotenv support

### Data & AI
- MongoDB or MongoMemoryServer
- Google Generative AI (Gemini) integration
- built-in heuristic predictive and triage logic

---

## Project Structure

```text
smart-hospital-system/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/
│       ├── context/
│       └── utils/
├── README.md
└── .gitignore
```

---

## Local Setup

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Configure environment variables
Create a `.env` file in the `backend` folder with values like:

```env
PORT=5000
JWT_SECRET=your_secure_secret_here
GEMINI_API_KEY=your_gemini_key_here
MONGODB_URI=mongodb://localhost:27017/medpulse
USE_MEMORY_DB=true
```

Notes:
- If `MONGODB_URI` is missing or the DB connection fails, the app automatically falls back to a local in-memory MongoDB instance via `mongodb-memory-server`.
- `GEMINI_API_KEY` is optional; the system still works with the built-in fallback triage engine.

### 3. Start the backend

```bash
cd backend
npm run dev
```

Or:

```bash
cd backend
npm start
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Then open the Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

---

## Backend API Highlights

The backend exposes REST endpoints under `/api/v1`.

Key route groups include:
- `/auth/*` for super admin, hospital, and CMO login
- `/tokens/*` for token creation, check-in, status updates, and feedback
- `/hospital/*` for bed, doctor, diagnostics, and blood bank management
- `/city/*` for city feed, area stats, symptom matching, ambulance reservation, and disaster control
- `/admin/*` for provisioning and system overview
- `/analytics/*` for predictive insights

You can health-check the API with:

```bash
curl http://localhost:5000/health
```

---

## Demo Credentials

The system includes demo accounts for quick testing:

### Super Admin
- username: `superadmin`
- password: `superadmin123`

### Hospital Admin
- username: `mlb_admin`
- password: `hospital123`

### CMO
- username: `cmo_jhansi`
- password: `cmojhansi123`

These values are defined in the authentication controller and are intended for local demo use.

---

## Typical Use Cases

- A patient arrives with chest pain and is routed to emergency or cardiology triage.
- A hospital updates bed occupancy in real time as patients are admitted and discharged.
- A district health officer checks citywide capacity and redistributes emergency load.
- A rural healthcare worker assists citizens using the village mitra interface.
- A super admin provisions new hospital or CMO accounts securely with JWT auth.

---

## Notes

This project is designed as a prototype and demonstration platform for smart healthcare operations. It focuses on functional workflow coverage, live UI simulation, and realistic healthcare coordination patterns rather than a production-grade enterprise system.

That said, the architecture is extensible and can be evolved into a full production deployment by adding:
- proper authentication services
- role-based database permissions
- audit logs and patient data compliance controls
- external hospital EMR integration
- real GIS / mapping services
- secure production database configuration

---

## Summary

MedPulse CityNet is a smart hospital management and city health coordination platform that blends patient care, hospital operations, administrative control, and AI-assisted intelligence into one integrated experience. It is designed to help hospitals and district health systems act faster, allocate resources smarter, and reduce pressure on overloaded facilities.
