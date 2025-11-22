# [x] Generate schema and preload a file of 25 different scholarships
# [x] Generate schema and preload a file of 5 different scholarship profiles
# [ ] Analyze_scholarship function that analyzes a single scholarship entity
# [ ] Match function that matches a student entity with a scholarship entity and provides a score and reasoning
# [ ] General essay generator function that generates a scholarship essay purely based off a student entity's data
# [ ] Custom essay generator function generates a scholarship essay based off the student entity, scholarship entity, as well as their match analysis


import os
from anthropic import Anthropic
from dotenv import load_dotenv
from pydantic import BaseModel
from schemas import Scholarship, ScholarshipAnalysis



def analyze_scholarship(client: Anthropic, scholarship_data: Scholarship) -> ScholarshipAnalysis:
    
    response = client.messages.create(

    )








if __name__ == '__main__':

    load_dotenv()
    client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))











    # message = client.messages.create(
    #     max_tokens=1024,
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": "Hello, Claude",
    #         }
    #     ],
    #     model="claude-sonnet-4-5-20250929",
    # )
    # print(message)
