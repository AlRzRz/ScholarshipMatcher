# File that shows schema and structure of data models
from pydantic import BaseModel


class Scholarship(BaseModel):
    id: str
    name: str
    amount: int
    deadline: str
    description: str
    criteria_text: str
    tags: list[str]


class Student(BaseModel):
    id: str
    name: str
    gpa: float
    major: str
    year: str
    activities: list[str]
    achievements: list[str]
    background: str
    stories: list[str]


class ScholarshipAnalysis(BaseModel):
    scholarship_id: str
    weights: dict[str, float]
    tone: str
    priority_summary: str
    evidence_snippets: list[str]


class StudentScholarshipMatch(BaseModel):
    student_id: str
    scholarship_id: str
    match_score: int
    top_reasons: list[str]

