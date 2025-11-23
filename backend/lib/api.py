import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
from pydantic import BaseModel

# 1. IMPORT MODELS FROM YOUR EXISTING SCHEMAS FILE
from schemas import (
    Student, 
    Scholarship, 
    ScholarshipAnalysis, 
    StudentScholarshipMatch
)

# 2. IMPORT LOGIC FROM YOUR EXISTING HELPERS FILE
from helpers import (
    analyze_scholarship, 
    match_student_scholarship, 
    generate_general_essay, 
    generate_specific_essay
)

# 3. SETUP CLIENT
load_dotenv()
API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    print("WARNING: ANTHROPIC_API_KEY missing.")

# Global client instance to pass to helpers
client = Anthropic(api_key=API_KEY)

app = FastAPI(title="Scholarship Backend API")

# 4. CORS SETUP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST BODY WRAPPERS ---
# These are necessary to bundle multiple objects into one POST request

class MatchRequest(BaseModel):
    student: Student
    scholarship: Scholarship
    analysis: ScholarshipAnalysis

class SpecificEssayRequest(BaseModel):
    student: Student
    scholarship: Scholarship
    analysis: ScholarshipAnalysis
    match: StudentScholarshipMatch

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.post("/api/analyze-scholarship", response_model=ScholarshipAnalysis)
async def api_analyze(scholarship: Scholarship):
    """
    Step 1: Analyzes the scholarship text to extract weights and themes.
    """
    try:
        return analyze_scholarship(client, scholarship)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/match-student", response_model=StudentScholarshipMatch)
async def api_match(data: MatchRequest):
    """
    Step 2: Matches a student to a scholarship using the analysis from Step 1.
    """
    try:
        return match_student_scholarship(client, data.student, data.scholarship, data.analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@app.post("/api/essay/general")
async def api_general_essay(student: Student):
    """
    Step 3a: Generates a general Common App style essay.
    """
    try:
        essay_text = generate_general_essay(client, student)
        return {"essay": essay_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"General essay generation failed: {str(e)}")

@app.post("/api/essay/specific")
async def api_specific_essay(data: SpecificEssayRequest):
    """
    Step 3b: Generates a specific scholarship essay using all prior data.
    """
    try:
        essay_text = generate_specific_essay(
            client,
            data.student, 
            data.scholarship, 
            data.analysis, 
            data.match
        )
        return {"essay": essay_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Specific essay generation failed: {str(e)}")

# To run: uvicorn api:app --reload