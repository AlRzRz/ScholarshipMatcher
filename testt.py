import os
import json
from dotenv import load_dotenv
import anthropic

# ---------- ENV + CLIENT SETUP ----------

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    raise RuntimeError("ANTHROPIC_API_KEY is missing. Put it in a .env file or env var.")

client = anthropic.Anthropic(api_key=API_KEY)

# Try these models in order until one works
KNOWN_MODELS = [
    "claude-3-5-sonnet-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
]

def find_working_model():
    """
    Try a list of known Anthropic models and return the first one
    that doesn't throw a NotFoundError.
    """
    print("Detecting working Claude model...")
    for model in KNOWN_MODELS:
        try:
            _ = client.messages.create(
                model=model,
                max_tokens=5,
                messages=[{"role": "user", "content": "test"}],
            )
            print(f"✓ Using model: {model}")
            return model
        except anthropic.NotFoundError:
            print(f"✗ Model not found: {model}")
        except Exception as e:
            print(f"✗ Model {model} failed with {type(e).__name__}")
    raise RuntimeError("No known models are available for this API key.")

MODEL = find_working_model()

# ---------- PROFILE + SYSTEM PROMPT ----------

EMPTY_USER_PROFILE = {
    "name": None,
    "country": None,
    "citizenship": None,
    "degree_level": None,        # "high_school", "undergraduate", "graduate"
    "year_of_study": None,
    "field_of_study": None,
    "target_countries": [],
    "target_universities": [],
    "gpa": None,
    "financial_need": None,      # True / False / None
    "work_experience": [],       # list of {role, company, details[]}
    "extracurriculars": [],      # list of {role, organization, details[]}
    "goals": ""
}

SYSTEM_PROMPT = """
You are a Scholarship Application Assistant.

Your job:
- Talk to students who want scholarships.
- Ask simple questions (1–2 at a time) to understand their background and preferences.
- Maintain and update a structured USER PROFILE in JSON form.
- Later, another part of the system may ask you to help with scholarship search or essay writing.

You MUST ALWAYS respond with ONE JSON object ONLY, with this exact shape:

{
  "assistant_reply": "string",
  "user_profile": { ... },
  "action": "none" | "search_scholarships" | "generate_essay"
}

Rules:
- Do NOT add any keys other than assistant_reply, user_profile, and action.
- Do NOT wrap the JSON in backticks or natural language.
- The "assistant_reply" value MUST be a single-line string with no raw line breaks.
  - Do NOT include literal newline characters inside the string.
  - If you want to separate ideas, just use sentences with spaces.
- assistant_reply:
  - Friendly, concise chat response shown to the user.
  - Ask at most one or two questions at a time.
- user_profile:
  - Always return the FULL profile as a JSON object.
  - Start from the JSON provided under USER_PROFILE and update/merge fields based on USER_MESSAGE.
  - Do not invent things the user never said.
  - If the user corrects something, overwrite the old value.

The user_profile fields:

{
  "name": string or null,
  "country": string or null,
  "citizenship": string or null,
  "degree_level": string or null,
  "year_of_study": int or null,
  "field_of_study": string or null,
  "target_countries": [strings],
  "target_universities": [strings],
  "gpa": number or null,
  "financial_need": true | false | null,
  "work_experience": [
    {
      "role": string,
      "company": string,
      "details": [string, ...]
    }
  ],
  "extracurriculars": [
    {
      "role": string,
      "organization": string,
      "details": [string, ...]
    }
  ],
  "goals": string
}

When the user mentions jobs or activities, store them in work_experience or extracurriculars as simple bullet points in details.

About the action field:
- Use "none" when just continuing the conversation and asking more questions.
- Use "search_scholarships" when you think you have enough profile info that the backend should look up scholarships.
- Use "generate_essay" ONLY after the user explicitly says they are ready to write or refine an essay for a specific scholarship.

You will receive context like this in the user message:

USER_PROFILE:
<JSON here>

USER_MESSAGE:
<student's latest message here>

Use USER_PROFILE as your starting point, then update it based on USER_MESSAGE, and respond with the strict JSON object described above.
"""

# ---------- HELPER: BUILD PAYLOAD FOR CLAUDE ----------

def build_payload(user_message: str, user_profile: dict) -> str:
    """
    Build the text we send to Claude as the 'user' message.
    It includes the existing profile plus the latest user message.
    """
    return f"""USER_PROFILE:
{json.dumps(user_profile, indent=2)}

USER_MESSAGE:
{user_message}
"""

# ---------- MAIN FUNCTION: CALL THE AGENT (PROFILE BUILDING) ----------

def call_scholarship_agent(user_message: str, user_profile: dict | None = None):
    """
    Call Claude with the current user message and profile.

    Inputs:
        user_message: latest message from the student (string)
        user_profile: stored profile dict from previous turns, or None

    Returns:
        assistant_reply (str),
        updated_user_profile (dict),
        action (str)
    """
    if user_profile is None:
        user_profile = EMPTY_USER_PROFILE.copy()

    payload = build_payload(user_message, user_profile)

    response = client.messages.create(
        model=MODEL,
        max_tokens=800,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": payload}],
    )

    # Anthropic SDK: response.content is a list of TextBlocks
    text_chunks = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            text_chunks.append(block.text)
    raw_text = "".join(text_chunks).strip()

    # Parse JSON
    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude did NOT return valid JSON:\n{raw_text}") from e

    assistant_reply = parsed.get("assistant_reply", "")
    updated_profile = parsed.get("user_profile", user_profile)
    action = parsed.get("action", "none")

    return assistant_reply, updated_profile, action

# ---------- ESSAY GENERATION ----------

ESSAY_SYSTEM_PROMPT = """
You are a Scholarship Essay Writer.

You will receive:
- USER_PROFILE: a JSON object describing the student.
- SCHOLARSHIP_TEXT: raw text describing a scholarship (including the prompt if available).

Your job:
1. Infer the scholarship's prompt and what it is looking for (leadership, financial need, STEM, community service, etc.).
2. Write a single, coherent essay answer that strongly fits both:
   - the scholarship's theme and requirements, and
   - the student's actual profile (do NOT invent facts).

Rules:
- Use only information that is plausible given the USER_PROFILE.
- You may professionally rephrase and slightly elaborate on experiences, but do NOT fabricate degrees, awards, or jobs that are not implied.
- If the scholarship text mentions a word limit (e.g., 250, 500 words), stay comfortably under it.
- Write in the first person ("I") as the student.
- Tone: clear, focused, authentic, and impact-oriented.

Output:
- Respond with ONLY the essay text. No JSON, no explanation, no headings.
"""

def generate_scholarship_essay(user_profile: dict, scholarship_text: str) -> str:
    """
    Ask Claude to write an essay for a given scholarship description,
    using the current user profile.

    Later, your backend can pass SCHOLARSHIP_TEXT scraped from the web
    when the database is empty or when a new posting is found.
    """
    payload = f"""
USER_PROFILE:
{json.dumps(user_profile, indent=2)}

SCHOLARSHIP_TEXT:
{scholarship_text}
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=800,
        system=ESSAY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": payload}],
    )

    # Take all text blocks as the essay
    text_chunks = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            text_chunks.append(block.text)
    essay = "".join(text_chunks).strip()
    return essay

# ---------- CLI TEST LOOP ----------

if __name__ == "__main__":
    print("Scholarship Agent CLI test.")
    print("Type your messages to build your profile.")
    print("Type '/essay' to generate an essay for a scholarship.")
    print("Type 'exit' to quit.\n")

    user_profile = None

    while True:
        msg = input("You: ")
        cmd = msg.lower().strip()

        if cmd in ("exit", "quit"):
            break

        # ----- ESSAY MODE -----
        if cmd == "/essay":
            if not user_profile:
                print("You don't have a profile yet. Say a few things about yourself first.\n")
                continue

            print("\nPaste the scholarship description / prompt below.")
            print("When you're done, type a single line with '/end' and press Enter.\n")

            lines = []
            while True:
                line = input()
                if line.strip().lower() == "/end":
                    break
                lines.append(line)
            scholarship_text = "\n".join(lines).strip()

            if not scholarship_text:
                print("No scholarship text provided.\n")
                continue

            try:
                essay = generate_scholarship_essay(user_profile, scholarship_text)
            except Exception as e:
                print("Error generating essay:", e)
                continue

            print("\n===== GENERATED ESSAY =====\n")
            print(essay)
            print("\n===========================\n")
            continue

        # ----- NORMAL CHAT / PROFILE BUILDING -----
        try:
            reply, user_profile, action = call_scholarship_agent(msg, user_profile)
        except Exception as e:
            print("Error calling agent:", e)
            # don't kill the session on one bad JSON turn
            continue

        print("\nAssistant:", reply)
        print("Action:", action)
        print("Current profile:")
        print(json.dumps(user_profile, indent=2))
        print("\n" + "-" * 40 + "\n")
