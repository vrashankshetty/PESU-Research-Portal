


import sys
import os
import pandas as pd
import requests
from datetime import datetime
import numpy as np
import json


if len(sys.argv) != 3:
    print("Usage: python seed.py <api_url1> <api_url2>")
    sys.exit(1)

attend_api_url = sys.argv[1]
conduct_api_url = sys.argv[2]




departmentAttended=[
     {
    "name": "Rohith Vaidya K",
    "programTitle": "“CyberTEA : Cybersecurity Trends and Emerging Applications”, a workshop on the latest \ntrends, challenges, and emerging applications in the field of cybersecurity, at Indian Institute of Information Technology Sri City",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1PEtHrgbKIh7BUu2MixsLHktIjispwanD/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Deepti Chandrasekharan",
    "programTitle": "AI and Machine Learning with Python",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1HxCu19OOsnKhbNwReAnrKExlb0fa3gFo/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Rohith Vaidya K",
    "programTitle": "National Conference on 'Viksit BHARAT@2047' Festival of sharing knowledge by Leaders \nand Ideas by the Youth, organized Vedant Knowledge System Pvt.Ltd.",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/13vEl8txKRtQWN1Kux3330gf6-11u2sDW/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Dr. M.Farida Begam",
    "programTitle": "Resource Person for the FDP titled \"Exploring Next Generation Smart Solutions (ENGSS 2024)\" conducted by the Department of Information Technology, SSN College of Engineering, Chennai and conducted the online session on the topic of \"Text Analytics using Python\"",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/19oTa7_pTNMyTpcQ9L5RvjRjsJ5S-Uns3/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Suja C M",
    "programTitle": "Google Cloud Coursera certification on Introduction to Generative AI and Introduction to Large Language Models",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1BUKdDMSVlIKdHJ82e7_ElPFlsl4nmonJ/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Lenish Pramiee",
    "programTitle": "“Cloud Computing”, conducted by IIT Madras NPTEL-AICTE FDP",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/drive/folders/1U3jYUlsCA5_IwkOWk0YFANOlh3Tz-C9w?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Lenish Pramiee",
    "programTitle": "Women in CyberSecurity-world wide resilience",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/124mrVu4OcmoaDpzQamZIYPv2vJgr19cR/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Deepti Chandrasekharan",
    "programTitle": "“Deep Learning ”, conducted by IIT Ropar NPTEL-AICTE FDP",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1imZRAvUDji-DAv6cQe7Hbs3C-Dj4_PKU/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Dr. Prajwala Ranganath talanki",
    "programTitle": "Applications of AI Tools in Education & Research",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1nc_lYZ4HFpaHMxDvw0Rcdl-7Yw5IMykB/view?usp=drive_link",
    "year": "2023"
  },
  {
    "name": "Dr. Charu Kathuria",
    "programTitle": "1 day Seminar on Innovations of healthtecha and Medtech i.e \"MedTech Conclave 2024\" organized by EAST POINT College of Engineering & Technology & EAST POINT College of Medical Sciences & Research Center",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1Eawi6F3EvXg4rbrRTy8vhtm6Hq3oiewx/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Charu Kathuria",
    "programTitle": "5 days Faculty Enablement Program (FEP) Phase 3 on Machine Learning & NLP using Python through  Infosys Springboard platform",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1S0-eL_Kq7ffpx4mqwltwU1MBDOkG0k4o/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Gokul Kannan Sadasivam",
    "programTitle": "MEDTECH CONCLAVE 2024, East Point Medical Sciences & Research Centre (Bangalore)",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/17PKImHjG4tLr2NR-yfpYTFzSkJZ8sRM8",
    "year": "2024"
  },
  {
    "name": "Dr. Gokul Kannan Sadasivam",
    "programTitle": "Machine Learning and NLP Using Python, Infosys Springboard",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/18wvcw6IE4JzP2-ShWEehPg26b7Bss2yI",
    "year": "2024"
  },
  {
    "name": "Deepti Chandrasekharan",
    "programTitle": "Coursera certification on Cybersecurity and the Internet of Things",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1x6RwBzQTdVEDY48sOVMH7zSI_QCH-iFb/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Deepti Chandrasekharan",
    "programTitle": "MEDTECH CONCLAVE 2024, East Point Medical Sciences & Research Centre (Bangalore)",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1wkr7uqp4jkSQ1gyBJLRRSf_1r4LBAKGN/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Dr. Jeny Jijo",
    "programTitle": "Faculty Development Programme on “Unlocking Industry Insights in Data Science”, Department of Computer Science & Engineering (Data Science), \nMadanapalle Institute of Technology & Science, Madanapalle",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1wD_zzJ4icrW0fJNsCs8vl1hawVE1Lv7A/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Lenish Pramiee",
    "programTitle": "National workshop on hands on training program on useful tools to efficiently create research summary",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1HXi-BiGaFGLaaeEFKJKfmlrNVu3VZZ1z/view?usp=sharing",
    "year": "2024"
  },
  {
    "name": "Dr. Gauri Sameer Rapate",
    "programTitle": "FDP on Drone Perception",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1PDvNyazB0TEwAA0f2B2CoqInMJ6zeaMf/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Kokila P",
    "programTitle": "Lay Counsellors Training Program - 2024",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/160frBAo9BePuwTQBkcHzrfXPqKhbNWCx/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Kokila P",
    "programTitle": "AWS_Builder online series",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/16zz2AUOuxFTt0fhT9RIg1SYKgJf1SOJp/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Pavithra S",
    "programTitle": "Deep Learning with MATLAB",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1adicpElU_niDHqifa_4-JpMztv0PC8Ov/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Pavithra S",
    "programTitle": "Machine Learning with MATLAB",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1GArpVl3FzRvJ2HaDlS_tqhLHnrMxto6m/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Pavithra S",
    "programTitle": "MATLAB Fundamentals",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1d2gdk0tQQwsHnynULIe3IDoUGuIQXuO1/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "J Ruby Dinakar",
    "programTitle": "5 days FDP on 'Drone Perception' organized by IISC and Department of ECE PES university",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/17HOAIMi4dVtia-LoXAyNc7uy_KI9b7xM/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Nazmin Begum",
    "programTitle": "5 days FDP on 'Drone Perception' organized by Department of ECE PES university",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1er8E6ssGY6OUVibhUPb8cyIZk207Vk43/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Lenish Pramiee",
    "programTitle": "MATLAB Fundamentals",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1KBvIzGGdpYWL3Afy6D0W4kXRSzHJS5kx/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Lenish Pramiee",
    "programTitle": "Machine Learning with MATLAB",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/19L9wyeDWCPQFy_ADf235AO_Q0yHvsqBg/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Gokul Kannan Sadasivam",
    "programTitle": "Machine Learning with MATLAB",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1lnlc4DQP7Xj6HsgWLytTGjNJOLm5q7qL/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Gokul Kannan Sadasivam",
    "programTitle": "Deep Learning with MATLAB",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1egZNfYIdXqH-jxtNdTEFUhLweNYBp4z_/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Gokul Kannan Sadasivam",
    "programTitle": "Faculty Enablement Program on Python Programming",
    "durationStartDate": "2025-01-28T05:44:38.488Z",
    "durationEndDate": "2025-01-28T05:44:38.488Z",
    "documentLink": "https://drive.google.com/file/d/1bGIk1gdDmatbTZk05v6dbya_ZzVtC-ou/view?usp=drive_link",
    "year": "2024"
  }
]

departmentConducted=[
{
    "name": "Dr. Bharathi R",
    "nameOfProgram": "Big Data Engineering in Industry",
    "noOfParticipants": 20,
    "durationStartDate": "2024-01-22T18:30:00.000Z",
    "durationEndDate": "2024-01-22T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1kW0Qu9HIcAiJ-8U1Ts3_DUjPnaNz-OYB/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Sarasvathi V",
    "nameOfProgram": "Federated Learning: Privacy- Preserving (Collaborative) Machine Learning",
    "noOfParticipants": 30,
    "durationStartDate": "2024-01-15T18:30:00.000Z",
    "durationEndDate": "2024-01-15T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1zzXtlp-7_ZWrAXhlyTBhaaw1naSssoJE/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Sarasvathi V",
    "nameOfProgram": "Hands on with cyber security and Industry Insights with networking",
    "noOfParticipants": 60,
    "durationStartDate": "2024-01-23T18:30:00.000Z",
    "durationEndDate": "2024-01-23T18:30:00.000Z",
    "documentLink": "https://docs.google.com/document/d/1R_Xe-ac-3onZZ9181k-jSNAblBXbUBix/edit?usp=drive_link&ouid=108480344074076956002&rtpof=true&sd=true",
    "year": "2024"
  },
  {
    "name": "Dr. Jeny Jijo",
    "nameOfProgram": "Optimizing DevOps: A Comprehensive Guide to AWS Services",
    "noOfParticipants": 58,
    "durationStartDate": "2024-02-20T18:30:00.000Z",
    "durationEndDate": "2024-02-20T18:30:00.000Z",
    "documentLink": "https://docs.google.com/document/d/1KjcFPauLxiRi9v6u-56aL4lr16tXi-je/edit?usp=drive_link&ouid=118233479903155915395&rtpof=true&sd=true",
    "year": "2024"
  },
  {
    "name": "Dr. Prajwala Ranganath talanki",
    "nameOfProgram": "Big Data Journey: Navigating Through Challenges & Tech Trends",
    "noOfParticipants": 25,
    "durationStartDate": "2024-03-12T18:30:00.000Z",
    "durationEndDate": "2024-03-12T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1MBSgJyMJTxdIyq4gJDoGU17PIDcSLRrG/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Prajwala Ranganath talanki",
    "nameOfProgram": ":Gemini API - Usage and Use Cases",
    "noOfParticipants": 25,
    "durationStartDate": "2024-03-19T18:30:00.000Z",
    "durationEndDate": "2024-03-19T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/16VU_MZe97XOdFOehZ31V3dhl_lRSpnhr/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Bharathi R",
    "nameOfProgram": "Navigating the Product Management Landscape: An Introductory Perspective",
    "noOfParticipants": 20,
    "durationStartDate": "2024-04-07T18:30:00.000Z",
    "durationEndDate": "2024-04-07T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1qK_Xz7YhkYiMPF-27Gv9cU6cBLC35g6T/view?usp=drive_link",
    "year": "2024"
  },
  {
    "name": "Dr. Prajwala Ranganath talanki",
    "nameOfProgram": "Exploring Apple Vision Pro: Unveiling the Future of Spatial Computing",
    "noOfParticipants": 50,
    "durationStartDate": "2024-04-17T18:30:00.000Z",
    "durationEndDate": "2024-04-17T18:30:00.000Z",
    "documentLink": "https://docs.google.com/document/d/1YaCcFiA4q67B8uKUYDUKU0rH8vTZD-Ao/edit?usp=drive_link&ouid=118233479903155915395&rtpof=true&sd=true",
    "year": "2024"
  },
  {
    "name": "Dr. Prajwala Ranganath talanki",
    "nameOfProgram": "guest lecture on Data Engineering",
    "noOfParticipants": 30,
    "durationStartDate": "2023-10-17T18:30:00.000Z",
    "durationEndDate": "2023-10-17T18:30:00.000Z",
    "documentLink": "https://docs.google.com/document/d/1j3GvaAGEFiwZnMAkzzVSaA8IRQgUDYgL/edit?usp=drive_link&ouid=118233479903155915395&rtpof=true&sd=true",
    "year": "2023"
  },
  {
    "name": "Dr. Geetha Dayalan",
    "nameOfProgram": "Guest Leture on Database Design Thinking",
    "noOfParticipants": 250,
    "durationStartDate": "2023-11-02T18:30:00.000Z",
    "durationEndDate": "2023-11-02T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1t51-TIyqXNXeIew6rMLl3sXiTb1RtHyB/view?usp=drive_link",
    "year": "2023"
  },
  {
    "name": "M Sheela Devi",
    "nameOfProgram": "Continous Integration and continous Deployment",
    "noOfParticipants": 420,
    "durationStartDate": "2023-11-19T18:30:00.000Z",
    "durationEndDate": "2023-11-19T18:30:00.000Z",
    "documentLink": "https://drive.google.com/file/d/1A6Ff9LsIfrn944D7JRkW4WnzO0u_hEGp/view?usp=drive_link",
    "year": "2023"
  }
]


print("Seeding Department Attended...")
for record in departmentAttended:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
            attend_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        
        
print("Seeding Department Conducted...")       
for record in departmentConducted:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
            conduct_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        
