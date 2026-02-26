# Smart Hostel Room Allocation System (SHMS)

A full-stack web application that manages hostel room inventory and automatically allocates rooms to students based on capacity and facility requirements.

## 🧠 Allocation Algorithm

The core logic follows a **"smallest suitable room first"** strategy:

1. **Filter** rooms where `capacity >= students` and required facilities match (AC, washroom)
2. **Sort** filtered rooms by capacity ascending
3. **Pick first** — the smallest room that satisfies all constraints
4. If no match → return `"No room available"`

This prevents waste of larger rooms and maintains efficient utilization.

## 📊 Database Schema (MongoDB)

### Room
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary Key |
| roomNo | String | Unique room number |
| capacity | Number | Maximum students (min: 1) |
| hasAC | Boolean | AC availability |
| hasAttachedWashroom | Boolean | Attached washroom |
| createdAt / updatedAt | Date | Timestamps |

### Allocation
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary Key |
| roomId | ObjectId | Reference → Room |
| studentsCount | Number | Students allocated |
| needsAC | Boolean | Required AC |
| needsWashroom | Boolean | Required washroom |
| allocatedAt | Date | Allocation timestamp |

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS v3 + React Router v6 + Axios
- **Backend**: Node.js + Express.js + Mongoose
- **Database**: MongoDB Atlas

## 🚀 Setup Instructions

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection string
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms` | Add a new room |
| GET | `/api/rooms` | List all rooms (with optional filters) |
| GET | `/api/rooms?capacity=3&ac=true&washroom=true` | Search rooms |
| DELETE | `/api/rooms/:id` | Delete a room |
| POST | `/api/allocate` | Allocate best room |
| GET | `/api/allocations` | List all allocations |

## 🌐 Deployment

- **Frontend** → Vercel (set `VITE_API_URL` env var to backend URL)
- **Backend** → Render (set `MONGO_URI` env var)
- **Database** → MongoDB Atlas
