# [x] Generate schema and preload a file of 25 different scholarships
# [x] Generate schema and preload a file of 5 different scholarship profiles
# [x] Analyze_scholarship function that analyzes a single scholarship entity
# [ ] Match function that matches a student entity with a scholarship entity and provides a score and reasoning
# [ ] General essay generator function that generates a scholarship essay purely based off a student entity's data
# [ ] Custom essay generator function generates a scholarship essay based off the student entity, scholarship entity, as well as their match analysis


import os
from anthropic import Anthropic, transform_schema
from dotenv import load_dotenv
from pydantic import BaseModel
from schemas import Scholarship, ScholarshipAnalysis
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





if __name__ == '__main__':

    # Testing Stuff Below
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_file_path = os.path.join(script_dir, '..', 'data', 'scholarships.json')


    try:
        with open(data_file_path, 'r') as file:
            data = json.load(file)
    except Exception as e:
        print(f'Error: {e}')

    load_dotenv()
    client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

    first_scholarship = data[0]
    # print(first_scholarship)
    scholarship_data: Scholarship = Scholarship(**first_scholarship)
    # print(scholarship_data.model_json_schema())

    print(analyze_scholarship(client=client, scholarship_data=scholarship_data))