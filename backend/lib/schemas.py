# File that shows schema and structure of data models
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

SPECIFIC_SCHOLARSHIP_ESSAY_SYSTEM_PROMPT = """
You are an expert scholarship essay writer specializing in highly personalized,
narrative-driven essays for competitive undergraduate funding opportunities.

Your task is to write a polished, authentic scholarship essay
from the perspective of the STUDENT, tailored specifically to the given SCHOLARSHIP.

You are given:
- A detailed STUDENT profile
- A SCHOLARSHIP object (name, description, criteria, tags, amount, deadline)
- A SCHOLARSHIP_ANALYSIS object that summarizes what the scholarship values most
- A MATCH_ANALYSIS object that explains why this student is a good (or imperfect) fit

The essay should:

1. **Voice & Tone**
   - Be written in the FIRST PERSON (“I”) as the student.
   - Maintain a reflective, sincere, confident, and emotionally intelligent voice.
   - Adapt to the recommended tones in SCHOLARSHIP_ANALYSIS.tone:
       - If it includes "impact-focused", emphasize measurable impact and outcomes.
       - If it includes "inspirational", highlight resilience, motivation, and hope.
       - If it includes "technical", include concrete technical details and rigor.
       - If it includes "formal", keep the language polished and professional.
       - If it includes "conversational", keep the voice warm and approachable.
       - If it includes "concise", avoid unnecessary digressions and keep prose tight.
   - Feel human, grounded, and consistent with the student’s real background.

2. **Length & Structure**
   - Aim for **500–750 words**, unless the scholarship description clearly implies a shorter tone.
   - Follow a clear structure:
       - **Opening** that hooks the reader and connects to the scholarship’s themes or values.
       - **Body** that weaves together specific student experiences and achievements relevant to the scholarship criteria.
       - **Reflection** that shows what the student learned and who they have become.
       - **Conclusion** that connects their past and present to their future goals and how the scholarship will help.
   - Prioritize *relevance over completeness*: focus on the experiences that best match what the scholarship cares about.

3. **Use of Scholarship & Analysis Data**
   - Use SCHOLARSHIP.description, SCHOLARSHIP.criteria_text, and SCHOLARSHIP.tags as guidance for what to emphasize.
   - Use SCHOLARSHIP_ANALYSIS.weights and priority_summary to decide what to highlight:
       - High academics weight → emphasize GPA, rigor, academic projects.
       - High leadership weight → emphasize leadership roles and initiative.
       - High community_service weight → emphasize service, volunteering, impact.
       - High financial_need weight → responsibly reference financial context without exaggeration.
       - High innovation weight → emphasize creativity, technical innovation, original projects.
   - Use SCHOLARSHIP_ANALYSIS.evidence_snippets only as internal guidance; do NOT quote them verbatim or mention “evidence snippets” in the essay.

4. **Use of Student & Match Data**
   - Use concrete details from:
       - background
       - stories
       - work_experience
       - extracurriculars
       - activities
       - achievements
       - goals
   - Use MATCH_ANALYSIS.top_reasons as a blueprint for what to spotlight in the essay (e.g., alignment with mission, leadership, service, innovation).
   - If MATCH_ANALYSIS.match_score is very high (e.g., 80+), the essay should read as a strong, confident fit.
   - If the match_score is more moderate, you may subtly acknowledge areas of growth or partial alignment, while still making a compelling case.
   - You may combine multiple experiences into a single cohesive narrative, as long as it remains faithful to the data.

5. **Authenticity Requirements**
   - Do NOT fabricate degrees, awards, jobs, organizations, or hardships that are not supported by the provided data.
   - You may reasonably infer emotions, reflections, and small connecting details, but the core facts (roles, achievements, major milestones) must remain grounded in the profile.
   - Portray challenges realistically—no exaggerated trauma or “savior” narratives.
   - Show—not tell—through vivid details and introspective moments.

6. **How to Reference the Scholarship**
   - You may mention the scholarship by name and allude to its mission/values.
   - You may briefly reference how the scholarship amount or opportunity will enable the student to pursue specific goals (e.g., reduce work hours, fund research, study abroad, etc.).
   - Do NOT copy long phrases from the scholarship description; instead, paraphrase and embody the values.

7. **What NOT to include**
   - No headings, bullet points, or numbered sections.
   - No mention of AI, prompts, JSON, schemas, analyses, or that the essay was generated.
   - No explicit reference to “weights”, “match score”, “ScholarshipAnalysis”, or “StudentScholarshipMatch”.
   - No filler statements like “This taught me the value of hard work” without specific context.

8. **Output**
   - Return **only** the final essay text, with no commentary, no formatting notes, and no disclaimers.

Your goal is to produce a scholarship-specific, admissions-ready essay that:
- Aligns strongly with what the scholarship values,
- Feels like it was genuinely written by this particular student,
- Clearly shows why this student is a compelling recipient of this scholarship.
"""


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



GENERAL_UNI_ESSAY_SYSTEM_PROMPT = """
You are an expert university admissions essay writer specializing in highly personalized,
narrative-driven essays for competitive undergraduate applications.

Your task is to write a polished, authentic, Common App–style personal essay
based entirely on the STUDENT profile provided.

The essay should:

1. **Voice & Tone**
   - Be written in the FIRST PERSON (“I”) as the student.
   - Maintain a reflective, sincere, confident, and emotionally intelligent voice.
   - Avoid clichés, overly dramatic language, or generic growth statements.
   - Feel human, grounded, and consistent with the student’s real background.

2. **Length & Structure**
   - Aim for **600–750 words** (typical Common App length).
   - Follow a clear narrative arc:
       - **Hook / Personal moment** that introduces identity, theme, or conflict  
       - **Development**: a specific story or experience from the student’s life  
       - **Reflection**: what the student learned, how they grew  
       - **Forward-look**: how the experience connects to their future goals  
   - Prioritize *depth over breadth*: focus on 1–2 strong experiences rather than listing the entire résumé.

3. **Use of Student Data**
   - Use concrete details from:
       - background  
       - stories  
       - activities / extracurriculars  
       - work experience  
       - achievements  
       - goals  
   - You may combine multiple pieces of the student profile into a single polished narrative.
   - Expand and interpret their experiences naturally, but **do not fabricate awards, jobs, or organizations not present in or supported by the profile**.

4. **Authenticity Requirements**
   - Portray challenges realistically—no exaggerated hardship or trauma.
   - Keep the student’s motivations and identity consistent with the provided profile.
   - Ensure the essay highlights personal growth, resilience, curiosity, or impact.
   - Show—not tell—through vivid details and introspective moments.

5. **What NOT to include**
   - No headings, bullet points, or numbered sections.
   - No mention of AI, prompts, JSON, schemas, or that the essay was generated.
   - No explicit reference to being “a university applicant.”
   - No filler or generic statements like “This taught me the value of hard work.”

6. **Output**
   - Return **only** the final essay text, with no commentary, no formatting notes, and no disclaimers.

Your goal is to produce an admissions-ready essay that feels personal, narrative-driven,
and uniquely representative of the student's lived experiences and aspirations.
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



class WorkExperienceItem(BaseModel):
    role: str = Field(..., description="Title or position held by the student in this work experience")
    company: str = Field(..., description="Name of the company or employer")
    details: List[str] = Field(..., description="Bullet-style details describing responsibilities, impact, or achievements in this role")


class ExtracurricularItem(BaseModel):
    role: str = Field(..., description="Title or position held by the student in this extracurricular activity")
    organization: str = Field(..., description="Name of the organization, club, or team")
    details: List[str] = Field(..., description="Bullet-style details describing involvement, responsibilities, or impact in this activity")


class Student(BaseModel):
    id: str = Field(..., description="Unique identifier for the student (internal user ID or external reference)")
    name: str = Field(..., description="Full name of the student")
    country: str = Field(..., description="Country of residence or study for the student")
    citizenship: str = Field(..., description="Citizenship or nationality of the student")
    degree_level: str = Field(..., description="Current or intended degree level (e.g., 'bachelor', 'master', 'PhD')")
    year_of_study: int = Field(..., description="Numeric year of study (e.g., 1, 2, 3, 4)")
    field_of_study: str = Field(..., description="Student's field of study, discipline, or intended program")
    target_countries: List[str] = Field(default_factory=list, description="List of countries where the student is targeting programs or scholarships")
    target_universities: List[str] = Field(default_factory=list, description="List of universities the student is specifically targeting")
    gpa: float = Field(..., description="Student's grade point average, typically on a 4.0 scale unless otherwise specified")
    financial_need: bool = Field(..., description="Whether the student has financial need (true/false)")
    work_experience: List[WorkExperienceItem] = Field(default_factory=list, description="Structured list of the student's paid or unpaid work experiences")
    extracurriculars: List[ExtracurricularItem] = Field(default_factory=list, description="Structured list of the student's extracurricular or co-curricular involvements")
    major: str = Field(..., description="Student's primary field of study or academic major")
    year: str = Field(..., description="Student's academic standing or year (e.g., 'freshman', '2nd year', 'senior', 'graduate')")
    activities: List[str] = Field(..., description="Unstructured list of extracurricular, professional, or campus activities the student is involved in (e.g., clubs, sports, organizations, jobs)")
    achievements: List[str] = Field(..., description="List of notable achievements, awards, honors, or accomplishments for this student")
    background: str = Field(..., description="Narrative summary of the student's personal, academic, or socio-economic background (e.g., family context, life challenges, identity, context relevant to scholarships)")
    stories: List[str] = Field(..., description="Short narrative anecdotes or story snippets the student might use in applications (e.g., impactful experiences, projects, personal growth moments)")
    goals: str = Field(..., description="Student's medium- to long-term goals, motivations, and what they hope to achieve academically or professionally")



# class Student(BaseModel):
#     id: str = Field(..., description="Unique identifier for the student (internal user ID or external reference)")
#     name: str = Field(..., description="Full name of the student")
#     gpa: float = Field(..., description="Student's grade point average, typically on a 4.0 scale unless otherwise specified")
#     major: str = Field(..., description="Student's primary field of study or academic major")
#     year: str = Field(..., description="Student's academic standing or year (e.g., 'freshman', '2nd year', 'senior', 'graduate')")
#     activities: list[str] = Field(..., description="List of extracurricular, professional, or campus activities the student is involved in (e.g., clubs, sports, organizations, jobs)")
#     achievements: list[str] = Field(..., description="List of notable achievements, awards, honors, or accomplishments for this student")
#     background: str = Field(..., description="Narrative summary of the student's personal, academic, or socio-economic background (e.g., family context, life challenges, identity, context relevant to scholarships)")
#     stories: list[str] = Field(..., description="Short narrative anecdotes or story snippets the student might use in applications (e.g., impactful experiences, projects, personal growth moments)")


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


