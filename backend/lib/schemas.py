# File that shows schema and structure of data models
from pydantic import BaseModel, Field
from typing import List
from enum import Enum


MATCHING_SYSTEM_PROMPT = """
You are a scholarship matching engine.

Your job is to evaluate how well a given student fits a specific scholarship, using:
1) The raw scholarship data
2) A structured ScholarshipAnalysis that tells you what this scholarship values
3) The student's profile

You MUST return a JSON object that matches the StudentScholarshipMatch schema
provided by the tool (student_id, scholarship_id, match_score, top_reasons).

Guidelines:
- match_score should be an integer from 0 to 100, where:
  - 0-20  = very poor fit or clearly ineligible
  - 21-40 = weak fit
  - 41-60 = moderate/okay fit
  - 61-80 = strong fit
  - 81-100 = excellent, near-ideal fit
- Use ScholarshipAnalysis.weights to weight different aspects (academics, leadership,
  community_service, financial_need, innovation). If a dimension has a higher weight,
  it should influence the score more.
- Use ScholarshipAnalysis.priority_summary and evidence_snippets to stay aligned with what
  the scholarship actually cares about.
- Use concrete details from the student's GPA, major, year, activities, achievements,
  background, and stories when explaining top_reasons.
- top_reasons should be a short list (typically 3-5 items) of clear, specific reasons
  for the match score, not generic phrases.
- If the student appears ineligible based on clear criteria (e.g., wrong major, year,
  or obviously below minimum academic standards implied by the scholarship), set a low
  match_score and explain why in top_reasons.
- If information is missing (e.g., financial need isn't described), do NOT assume it is
  satisfied; instead, mention the uncertainty in the reasons and avoid giving a perfect score.
- Be honest and discriminative; not every student should get a high score.
"""


class StudentScholarshipMatch(BaseModel):
    student_id: str = Field(..., description="The unique ID of the student being evaluated for this scholarship")
    scholarship_id: str = Field(..., description="The unique ID of the scholarship this match refers to")
    match_score: int = Field(..., description="Overall compatibility score between this student and scholarship, from 0 to 100, where higher means a stronger fit")
    top_reasons: list[str] = Field(..., description="Concise, human-readable explanations (3-5 recommended) describing why the student received this match_score (e.g., alignment with criteria, strengths, or gaps)")


class Scholarship(BaseModel):
    id: str = Field(..., description="Unique identifier for the scholarship (internal or external ID)")
    name: str = Field(..., description="Official name or title of the scholarship")
    amount: int = Field(..., description="Monetary value of the scholarship award, typically in the smallest currency unit or whole dollars")
    deadline: str = Field(..., description="Application deadline for the scholarship. Prefer an ISO-8601 date string (e.g., '2025-03-15') or another clearly parseable date format")
    description: str = Field(..., description="Full descriptive text for the scholarship, usually including purpose, background, and general information for applicants")
    criteria_text: str = Field(..., description="Detailed criteria or eligibility requirements for the scholarship (e.g., GPA thresholds, major, year, demographics, activities)")
    tags: list[str] = Field(..., description="List of high-level tags or keywords summarizing the scholarship (e.g., ['STEM', 'first-generation', 'community-service'])")


class Student(BaseModel):
    id: str = Field(..., description="Unique identifier for the student (internal user ID or external reference)")
    name: str = Field(..., description="Full name of the student")
    gpa: float = Field(..., description="Student's grade point average, typically on a 4.0 scale unless otherwise specified")
    major: str = Field(..., description="Student's primary field of study or academic major")
    year: str = Field(..., description="Student's academic standing or year (e.g., 'freshman', '2nd year', 'senior', 'graduate')")
    activities: list[str] = Field(..., description="List of extracurricular, professional, or campus activities the student is involved in (e.g., clubs, sports, organizations, jobs)")
    achievements: list[str] = Field(..., description="List of notable achievements, awards, honors, or accomplishments for this student")
    background: str = Field(..., description="Narrative summary of the student's personal, academic, or socio-economic background (e.g., family context, life challenges, identity, context relevant to scholarships)")
    stories: list[str] = Field(..., description="Short narrative anecdotes or story snippets the student might use in applications (e.g., impactful experiences, projects, personal growth moments)")


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


