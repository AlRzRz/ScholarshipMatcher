# ScholarshipMatcher

An AI-powered platform that helps students discover and apply for scholarships tailored to their unique profiles. ScholarshipMatcher uses intelligent matching algorithms and AI-generated essays to streamline the scholarship application process.

## 🎯 Features

- **Intelligent Scholarship Matching**: AI-powered analysis matches students with scholarships based on their profiles
- **Comprehensive Filtering**: Filter scholarships by status, amount, tags, and search queries
- **AI Scholarship Analysis**: Deep analysis of each scholarship to understand what committees value most
- **Compatibility Scoring**: Visual compatibility scores with detailed reasoning
- **Dual Essay Generation**: 
  - General essays (Common App style) based on student profiles
  - Scholarship-specific essays tailored to individual opportunities
- **Modern UI**: Sleek, minimalistic design with a blue/cyan/green color scheme
- **Profile Management**: Select and manage student profiles to view personalized matches

## 🏗️ Project Structure

```
ScholarshipMatcher/
├── backend/                 # FastAPI backend
│   ├── lib/                # Core logic and API
│   │   ├── api.py         # FastAPI endpoints
│   │   ├── helpers.py     # AI helper functions
│   │   └── schemas.py     # Pydantic models and prompts
│   ├── data/              # Data files
│   │   ├── scholarships.json  # 25 pre-generated scholarships
│   │   └── students.json      # 5 pre-generated student profiles
│   ├── requirements.txt   # Python dependencies
│   └── venv/              # Python virtual environment
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Landing page
│   │   ├── auth/          # Authentication page
│   │   ├── scholarships/  # Scholarship pages
│   │   └── contexts/      # React contexts
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## 📋 Prerequisites

- **Node.js** (v18 or higher) and **npm**
- **Python** (v3.8 or higher)
- **Anthropic API Key** - Get one from [Anthropic Console](https://console.anthropic.com/)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ScholarshipMatcher
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment (if not already created):

```bash
python3 -m venv venv
```

Activate the virtual environment:

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add your Anthropic API key to the `.env` file:

```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Frontend Setup

Navigate to the frontend directory (from project root):

```bash
cd frontend
```

Install Node dependencies:

```bash
npm install
```

## ▶️ Running the Application

The application requires two separate terminals - one for the backend and one for the frontend.

### Terminal 1: Backend Server

From the `backend` directory (with virtual environment activated):

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn lib.api:app --reload
```

The backend API will be available at `http://localhost:8000`

You can verify it's running by visiting `http://localhost:8000` in your browser, which should return:
```json
{"status": "API is running"}
```

### Terminal 2: Frontend Development Server

From the `frontend` directory:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000` to see the application.

## 📊 Datasets

The project includes pre-generated datasets for demonstration:

### Scholarships Dataset
- **Location**: `backend/data/scholarships.json`
- **Content**: 25 pre-generated scholarship entries
- **Format**: JSON array of scholarship objects
- **Fields**: `id`, `name`, `amount`, `deadline`, `description`, `criteria_text`, `tags`

### Student Profiles Dataset
- **Location**: `backend/data/students.json`
- **Content**: 5 pre-generated student profiles
- **Format**: JSON array of student objects
- **Fields**: Includes basic info, background, goals, work experience, extracurriculars, achievements, stories, and target universities

**Note**: These datasets were pre-generated using Claude (Anthropic's AI). In production, these would be replaced with:
- Real scholarship data from actual providers
- User-created student profiles

## 🔧 Configuration Files

### Backend Configuration

- **`backend/requirements.txt`**: Python package dependencies
- **`backend/.env`**: Environment variables (create this file)
  - Required: `ANTHROPIC_API_KEY`

### Frontend Configuration

- **`frontend/package.json`**: Node.js dependencies and scripts
- **`frontend/next.config.ts`**: Next.js configuration
- **`frontend/tsconfig.json`**: TypeScript configuration
- **`frontend/postcss.config.mjs`**: PostCSS configuration for Tailwind CSS
- **`frontend/eslint.config.mjs`**: ESLint configuration

## 🔌 API Endpoints

The backend exposes the following endpoints:

- `GET /` - Health check
- `POST /api/analyze-scholarship` - Analyze a scholarship and extract weights/themes
- `POST /api/match-student` - Match a student to a scholarship
- `POST /api/essay/general` - Generate a general Common App style essay
- `POST /api/essay/specific` - Generate a scholarship-specific essay

## 🎨 Technology Stack

### Frontend
- **Next.js 16** - React framework
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Context API** - State management

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Anthropic SDK** - AI integration (Claude)
- **Pydantic** - Data validation
- **Python-dotenv** - Environment variable management

## 🔄 Application Flow

1. **Landing Page** (`/`) - Introduction and call-to-action
2. **Authentication** (`/auth`) - Login/Registration
3. **Scholarships Dashboard** (`/scholarships`) - Browse and filter scholarships
4. **Scholarship Detail** (`/scholarships/[id]`) - View details, AI analysis, and compatibility score
5. **Essay Generation** (`/scholarships/[id]/essay`) - Generate and compare essays
6. **Submission** - Choose essay and submit (currently redirects to dashboard)

## ⚠️ Current Limitations & Future Improvements

### Current Implementation Notes

- **Synchronous Code**: The current implementation uses synchronous API calls. This was a deliberate choice during rapid development to prioritize getting a working prototype. Future refactoring will make the code fully asynchronous for improved performance.

- **Pre-generated Data**: All scholarships and student profiles are pre-generated using Claude. This allows demonstration of the full system capabilities but will be replaced in production.

### Planned Improvements

1. **Real Scholarship Integration**: Replace pre-generated data with real scholarship listings from actual providers
2. **User Profile Creation**: Allow users to create and manage their own profiles instead of using sample data
3. **Automatic Essay Submission**: Implement automatic submission to scholarship provider websites with proof of submission (receipts/confirmations)
4. **Asynchronous Refactoring**: Convert synchronous code to async for better performance and scalability
5. **Database Integration**: Replace JSON file storage with a proper database
6. **User Authentication**: Implement real authentication and user accounts
7. **Application Tracking**: Track submitted applications and their status

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError` when running uvicorn
- **Solution**: Ensure you're in the `backend` directory and the virtual environment is activated. Install dependencies with `pip install -r requirements.txt`

**Issue**: `ANTHROPIC_API_KEY missing` warning
- **Solution**: Create a `.env` file in the `backend` directory and add your API key: `ANTHROPIC_API_KEY=your_key_here`

**Issue**: CORS errors
- **Solution**: The backend is configured to allow all origins. If issues persist, check that the backend is running on port 8000 and the frontend is configured to call `http://localhost:8000`

### Frontend Issues

**Issue**: `npm install` fails
- **Solution**: Ensure you have Node.js v18+ installed. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Issue**: Frontend can't connect to backend
- **Solution**: Verify the backend is running on `http://localhost:8000`. Check browser console for specific error messages

**Issue**: Port 3000 already in use
- **Solution**: Kill the process using port 3000 or run Next.js on a different port: `npm run dev -- -p 3001`

## 📝 Development Notes

- The backend API uses Claude Sonnet 4.5 with structured outputs for reliable parsing
- All AI prompts are defined in `backend/lib/schemas.py`
- The frontend uses React Context for global state management (student profile selection)
- Local storage is used to persist selected student profiles across page refreshes

For questions or issues, please open an issue in the repository.
