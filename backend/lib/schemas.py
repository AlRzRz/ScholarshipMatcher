# File that shows schema and structure of data models
from pydantic import BaseModel, Field
from typing import List
from enum import Enum


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


class ToneStyle(str, Enum):
    formal = "formal"
    conversational = "conversational"
    impact_focused = "impact-focused"
    inspirational = "inspirational"
    technical = "technical"
    concise = "concise"


class ScholarshipWeights(BaseModel):
    academics: float = Field(..., description="Importance of academic performance")
    leadership: float = Field(..., description="Importance of leadership experience")
    community_service: float = Field(..., description="Importance of service impact")
    financial_need: float = Field(..., description="Importance of financial need")
    innovation: float = Field(..., description="Importance of creative/technical innovation")


class ScholarshipAnalysis(BaseModel):
    scholarship_id: str = Field(..., description="The ID of the analyzed scholarship")
    weights: ScholarshipWeights = Field(..., description="Adaptive weight profile for this scholarship")
    tone: list[ToneStyle] = Field(..., description="List of tones recommended for drafting this scholarship")
    priority_summary: str = Field(..., description="High-level explanation of what this scholarship values most")
    evidence_snippets: list[str] = Field(
        ..., 
        description="Direct excerpts or paraphrases from the scholarship description that support the weight choices"
    )


class StudentScholarshipMatch(BaseModel):
    student_id: str
    scholarship_id: str
    match_score: int
    top_reasons: list[str]

