# [x] Generate schema and preload a file of 25 different scholarships
# [x] Generate schema and preload a file of 5 different scholarship profiles
# [x] Analyze_scholarship function that analyzes a single scholarship entity
# [x] Match function that matches a student entity with a scholarship entity and provides a score and reasoning
# [ ] General essay generator function that generates a scholarship essay purely based off a student entity's data
# [ ] Custom essay generator function generates a scholarship essay based off the student entity, scholarship entity, as well as their match analysis


import os
from anthropic import Anthropic, transform_schema
from dotenv import load_dotenv
from pydantic import BaseModel
from schemas import Scholarship, ScholarshipAnalysis, Student, StudentScholarshipMatch, MATCHING_SYSTEM_PROMPT, GENERAL_UNI_ESSAY_SYSTEM_PROMPT, SPECIFIC_SCHOLARSHIP_ESSAY_SYSTEM_PROMPT
import json
from pathlib import Path


def analyze_scholarship(client, scholarship_data: Scholarship) -> ScholarshipAnalysis:
    
    response = client.beta.messages.parse(
        max_tokens=1024,
        model="claude-sonnet-4-5",
        betas=["structured-outputs-2025-11-13"],
        messages=[
            {
                "role": "user",
                "content": f"Analyze the following scholarship:\n{scholarship_data.model_dump_json()}"
            }
        ],
        output_format=ScholarshipAnalysis

    )
    return response.parsed_output


def match_student_scholarship(client, student: Student, scholarship: Scholarship, scholarship_analysis: ScholarshipAnalysis) -> StudentScholarshipMatch:
    
    response = client.beta.messages.parse(
        max_tokens=1024,
        model="claude-sonnet-4-5",
        betas=["structured-outputs-2025-11-13"],
        system=MATCHING_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    "Evaluate the match between the following STUDENT and SCHOLARSHIP, using the "
                    "SCHOLARSHIP_ANALYSIS to guide what matters most.\n\n"
                    "Return only the structured match result.\n\n"
                    f"SCHOLARSHIP (raw):\n{scholarship.model_dump_json()}\n\n"
                    f"SCHOLARSHIP_ANALYSIS:\n{scholarship_analysis.model_dump_json()}\n\n"
                    f"STUDENT:\n{student.model_dump_json()}\n"
                ),
            },
        ],
        output_format=StudentScholarshipMatch,
    )

    return response.parsed_output


def generate_general_essay(client, student: Student) -> str:
    response = client.beta.messages.parse(
        model="claude-sonnet-4-5",
        max_tokens=1800,
        betas=["structured-outputs-2025-11-13"],
        system=GENERAL_UNI_ESSAY_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    "Using the STUDENT profile below, write a general-purpose university "
                    "application essay suitable for a Common App-style personal statement.\n\n"
                    "Return ONLY the final essay text, with no explanation or commentary.\n\n"
                    f"STUDENT PROFILE (JSON):\n{student.model_dump_json()}"
                ),
            },
        ]
    )

    return response.content[0].text


def generate_specific_essay(
    client,
    student: Student,
    scholarship: Scholarship,
    scholarship_analysis: ScholarshipAnalysis,
    match_analysis: StudentScholarshipMatch,
) -> str:
    response = client.beta.messages.parse(
        model="claude-sonnet-4-5",
        max_tokens=1800,
        betas=["structured-outputs-2025-11-13"],
        system=SPECIFIC_SCHOLARSHIP_ESSAY_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    "Using the provided STUDENT, SCHOLARSHIP, SCHOLARSHIP_ANALYSIS, and "
                    "MATCH_ANALYSIS, write a scholarship application essay from the student's "
                    "perspective that is tailored to this specific scholarship.\n\n"
                    "Return ONLY the final essay text, with no explanation or commentary.\n\n"
                    f"STUDENT (JSON):\n{student.model_dump_json()}\n\n"
                    f"SCHOLARSHIP (JSON):\n{scholarship.model_dump_json()}\n\n"
                    f"SCHOLARSHIP_ANALYSIS (JSON):\n{scholarship_analysis.model_dump_json()}\n\n"
                    f"MATCH_ANALYSIS (JSON):\n{match_analysis.model_dump_json()}\n"
                ),
            },
        ],
    )

    return response.content[0].text



if __name__ == '__main__':

    # Testing Stuff Below

    load_dotenv()
    client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

    script_dir = os.path.dirname(os.path.abspath(__file__))
    scholarship_file_path = os.path.join(script_dir, '..', 'data', 'scholarships.json')
    students_file_path = os.path.join(script_dir, '..', 'data', 'students.json')


    try:
        with open(scholarship_file_path, 'r') as file:
            scholarship_data = json.load(file)
    except Exception as e:
        print(f'Error: {e}')

    try:
        with open(students_file_path, 'r') as file:
            student_data = json.load(file)
    except Exception as e:
        print(f'Error: {e}')
    

    first_scholarship = scholarship_data[0]
    first_student = student_data[0]

    scholarship: Scholarship = Scholarship(**first_scholarship)
    student: Student = Student(**first_student)


    

    try:
        print('Getting Scholarship Analysis...\n')
        scholarship_analysis = analyze_scholarship(client=client, scholarship_data=scholarship)
        print('Received Scholarship Analysis...\n')
        print(scholarship_analysis)

        print('Matching Student & Scholarship (including the prev. analysis)\n')
        matched_data = match_student_scholarship(client=client, student=student, scholarship=scholarship, scholarship_analysis=scholarship_analysis)
        print('Match Data Received...\n')
        print(matched_data)

        print('\n\nTYPES:\n\n')
        print(type(matched_data))
        print(type(scholarship_analysis))

    except Exception as e:
        print(f"ERROR Happened: {e}")

    print('\n\nSPECIFIC ESSAY GENERATED BELOW\n\n')

    try:
        print(generate_specific_essay(client, student=student, scholarship=scholarship, scholarship_analysis=scholarship_analysis, match_analysis=matched_data))
    except Exception as e:
        print(f'ERORR HAPPENED: {e}')

    print('\n\nGENERAL ESSAY GENERATED BELOW\n\n')

    try:
        print(generate_general_essay(client, student=student))
    except Exception as e:
        print(f'ERORR HAPPENED: {e}')
    


    # script_dir = os.path.dirname(os.path.abspath(__file__))
    # data_file_path = os.path.join(script_dir, '..', 'data', 'scholarships.json')


    # try:
    #     with open(data_file_path, 'r') as file:
    #         data = json.load(file)
    # except Exception as e:
    #     print(f'Error: {e}')

   
    

    # first_scholarship = data[0]
    # # print(first_scholarship)
    # scholarship_data: Scholarship = Scholarship(**first_scholarship)
    # # print(scholarship_data.model_json_schema())

    # print(analyze_scholarship(client=client, scholarship_data=scholarship_data))