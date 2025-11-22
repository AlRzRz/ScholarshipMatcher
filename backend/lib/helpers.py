# [x] Generate schema and preload a file of 25 different scholarships
# [x] Generate schema and preload a file of 5 different scholarship profiles
# [ ] 


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
