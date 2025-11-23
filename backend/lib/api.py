from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import Logic from the engine file
# Ensure scholarship_engine.py is in the same directory
from scholarship_engine import (
    Student, 
    Scholarship, 
    ScholarshipAnalysis, 
    StudentScholarshipMatch,
    analyze_scholarship, 
    match_student_scholarship, 
    generate_general_essay, 
    generate_specific_essay
)

app = FastAPI(title="Scholarship Backend API")

# CORS - Allow Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST BODIES ---

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

@app.post("/api/analyze", response_model=ScholarshipAnalysis)
async def api_analyze(scholarship: Scholarship):
    try:
        return analyze_scholarship(scholarship)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/match", response_model=StudentScholarshipMatch)
async def api_match(data: MatchRequest):
    try:
        return match_student_scholarship(data.student, data.scholarship, data.analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/essay/general")
async def api_general_essay(student: Student):
    try:
        return {"essay": generate_general_essay(student)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/essay/specific")
async def api_specific_essay(data: SpecificEssayRequest):
    try:
        return {"essay": generate_specific_essay(
            data.student, 
            data.scholarship, 
            data.analysis, 
            data.match
        )}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run command: uvicorn main:app --reload