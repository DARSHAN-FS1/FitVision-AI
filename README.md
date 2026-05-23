# ⚡ FitVision AI

**Production-grade AI-powered fitness coach app built with React Native (Expo) + FastAPI.**

Real-time posture analysis · Rep counting · Nutrition tracking · AI insights

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo SDK 51 |
| Language | TypeScript (strict) |
| Styling | NativeWind (Tailwind for RN) |
| Navigation | React Navigation v6 |
| State | Zustand |
| AI / CV | MediaPipe Pose Landmarker |
| Backend | FastAPI + Python 3.11 |
| Auth | Firebase Authentication |
| Database | Firestore + Firebase Storage |
| Validation | Pydantic v2 |

---

## Project Structure

```
fitvision-ai/
├── App.tsx                    # Entry point
├── src/
│   ├── ai/                    # Pose detection, form analysis, rep counting
│   ├── components/            # Reusable UI components
│   ├── constants/             # Theme, exercises, nutrition data
│   ├── hooks/                 # usePoseDetection, useWorkoutTimer, useHaptics
│   ├── navigation/            # Root, Auth, Main, Tab navigators
│   ├── screens/
│   │   ├── auth/              # Splash, Onboarding, Login, Signup, ForgotPassword
│   │   ├── main/              # Home, Workout, AIScan, ScanReport, Nutrition, Profile
│   │   └── modals/            # Routine, Gyms
│   ├── services/              # API, Firebase, Auth, Workout, Scan, Nutrition
│   ├── store/                 # Zustand stores (Auth, Workout, Scan, Nutrition, Profile)
│   ├── types/                 # TypeScript types
│   └── utils/                 # BMI, TDEE, formatters
└── backend/
    ├── app/
    │   ├── main.py            # FastAPI app entry
    │   ├── routers/           # auth, profile, workouts, nutrition, scan, analytics
    │   ├── schemas/           # Pydantic models
    │   └── services/          # Firebase Admin, auth dependency
    └── requirements.txt
```

---

## Quick Start

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore Database** → Start in production mode
4. Enable **Storage**
5. Go to Project Settings → Add Android + iOS app → Download config
6. Generate a **Service Account Key** (Project Settings → Service Accounts → Generate new private key) → save as `backend/serviceAccountKey.json`

### 2. Frontend Setup

```bash
# Clone and install
cd fitvision-ai
npm install

# Set Firebase config in app.json → extra section
# Replace all YOUR_* placeholders with your Firebase values

# Start development server
npx expo start

# Run on device
npx expo start --ios        # iOS simulator
npx expo start --android    # Android emulator
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Add serviceAccountKey.json to backend/ directory
# OR set environment variables (for production):
# FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, etc.

# Run development server
uvicorn app.main:app --reload --port 8000

# API docs available at:
# http://localhost:8000/docs
```

### 4. Connect Frontend to Backend

In `app.json`, update the `API_BASE_URL`:

```json
"extra": {
  "API_BASE_URL": "http://YOUR_LOCAL_IP:8000"
}
```

Use your machine's local IP (not localhost) when testing on a physical device.

---

## AI Scan — How It Works

```
Camera Frame (30fps)
        ↓
MediaPipe Pose Landmarker
        ↓ 33 landmarks (x, y, z, visibility)
Joint Angle Calculation (jointAngles.ts)
        ↓ knee°, hip°, back°, shoulder°
Form Analysis Rules Engine (formAnalyzer.ts)
        ↓ score 0–100, corrections[], state
Rep Counter State Machine (repCounter.ts)
        ↓ UP → DOWN → UP = 1 rep
Feedback Engine (feedbackEngine.ts)
        ↓ Haptics + Audio
UI Update → ScanStore → AIScanScreen
```

---

## Key Screens

| Screen | Description |
|---|---|
| **Splash** | Animated logo, auth check |
| **Onboarding** | 3-slide intro with fitness explanation |
| **Login / Signup** | 2-step signup with body stats |
| **Home** | Live dashboard — calories, recovery, streak, quick actions |
| **Workout** | Tabbed exercise browser with AI-Ready badges |
| **AI Scan** | Full-screen camera + real-time skeleton + form scoring |
| **Scan Report** | Post-session posture score, joint angles, AI suggestions |
| **Nutrition** | Calorie ring, macro tracking, AI meal suggestions, food scan |
| **Profile** | BMI, body stats, goal, settings, logout |
| **Routine** | Weekly workout planner with reminders |
| **Gyms** | Nearby gyms list (Google Maps ready) |

---

## API Endpoints

```
GET  /health
POST /auth/verify
GET  /profile/{user_id}
PATCH /profile/{user_id}
GET  /workouts/plans
POST /workouts/log
GET  /workouts/history/{user_id}
GET  /workouts/stats/{user_id}
POST /scan/start
POST /scan/result
GET  /scan/history/{user_id}
GET  /nutrition/foods/search?q=
POST /nutrition/log-meal
GET  /nutrition/daily/{user_id}
GET  /nutrition/ai-suggestions/{user_id}
POST /nutrition/water/{user_id}
GET  /analytics/daily/{user_id}
GET  /analytics/weekly/{user_id}
GET  /analytics/summary/{user_id}
GET  /analytics/home/{user_id}
```

All endpoints require `Authorization: Bearer <firebase_id_token>` header.

---

## Production Deployment

### Backend (Render / Railway)

```bash
# Set environment variables on your platform:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...

# Start command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios      # App Store
eas build --platform android  # Play Store
```

---

## MediaPipe Integration (Production)

Replace the simulation in `src/ai/poseDetector.ts` with:

```typescript
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const vision = await FilesetResolver.forVisionTasks(
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
);
this.landmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'pose_landmarker_lite.task',
    delegate: 'GPU',
  },
  runningMode: 'LIVE_STREAM',
  numPoses: 1,
});
```

---

## License

MIT — Built with ❤️ by the FitVision AI team.
