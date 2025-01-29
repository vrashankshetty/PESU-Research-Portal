


import sys
import os
import pandas as pd
import requests
from datetime import datetime
import numpy as np
import json


if len(sys.argv) != 5:
    print("Usage: python seed.py <api_url1> <api_url2> <api_url3> <api_url4>")
    sys.exit(1)

studentEntranceExam_api_url = sys.argv[1]
studentHigherStudies_api_url = sys.argv[2]
studentInterSports_api_url = sys.argv[3]
studentIntraSports_api_url = sys.argv[4]

studentEntranceExam=[
  {
    "year": "2024",
    "registrationNumber": "2373223",
    "studentName": "Charitha Nandepu",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1vcyESwflPiEdcBIqThG2btoozzdpvEp4/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "4643110239035910",
    "studentName": "Shreyas Sai Raman",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": True,
    "documentLink": "https://drive.google.com/file/d/13sGWyUwG5BB5ty-JwET-vkkOEo7L5nP3/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "2198923",
    "studentName": "Aditya Shenoy",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1MW5yattYcw1QuHDC5RzvBDQuzzD60-T4/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "W3536116",
    "studentName": "V Nimish Bhasu",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": True,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1Zp5RbvlDgtYaSEgkjlWRmh-ZkVkWzbTj/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "2308573, 531699, Y6666274",
    "studentName": "Ananya Prabhakar",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": True,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1iwDKd3KZDY3ms1dkHObahdMnHxvlQRUo/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "4255 6082 3877 4262",
    "studentName": "Nishanth S",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": True,
    "documentLink": "https://drive.google.com/file/d/1dd-t3t23gSEUUNCy-Q7V4stdpcgavkQq/view?usp=drive_link"
  },
  {
    "year": "2024",
    "registrationNumber": "750805933",
    "studentName": "Vijay Reddy",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": True,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1vXysAAw1s-RT4WergNegcXfrR_M7APeH/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "507914",
    "studentName": "Nawaz Fateen Khan",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": True,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1pQNs1pG3zuuHcdOfCwwcpdrVQrBPbcE0/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "2439 7092 3896 3521",
    "studentName": "Sidharth S",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": True,
    "documentLink": "https://drive.google.com/file/d/1kXrZkdnnt7VWOyv6x9R6gexbt6rhaGTO/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "V4990168",
    "studentName": "Harshitha Chowdappa",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": True,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1KwwIVm3KC4l3QEQhGJUqTDovl8svasPo/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "511965",
    "studentName": "Bharath D",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": True,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1JP44D5_tfS31NtIyEJrhygrDZREaxqPF/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "2066284",
    "studentName": "Pranav Anne",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1yGmnFA-kJsK0-Ai8hRNiT45ulDC1ZKWr/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "2515319",
    "studentName": "Arav Babu",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1t-3BgyyqUOZoO3l7Aw52VPrDFmCf2k5y/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "CS23S11214341",
    "studentName": "N R Ramith",
    "isNET": False,
    "isSLET": False,
    "isGATE": True,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1WSFIfaXQ8S3ZXlODPL-hQFHae3VluRou/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "CS23S11215105",
    "studentName": "Vighnesh M S",
    "isNET": False,
    "isSLET": False,
    "isGATE": True,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": False,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1tVgzh01amd6YFhWGmCjlXrtvYxJ34n5x/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "1965603",
    "studentName": "Anish R Khatavkar",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1hO5hxOKaj55GQm-RqTUiLgTSfb5iZcov/view?usp=drive_link"
  },
  {
    "year": "2023",
    "registrationNumber": "2386155",
    "studentName": "Anish Cherekar",
    "isNET": False,
    "isSLET": False,
    "isGATE": False,
    "isGMAT": False,
    "isCAT": False,
    "isGRE": True,
    "isJAM": False,
    "isIELTS": False,
    "isTOEFL": False,
    "documentLink": "https://drive.google.com/file/d/1zzA8Qw9AyqDghYmy0ow8LEHXigO-mAFV/view?usp=drive_link"
  }
]


studentHigherStudies=[
     {
    "studentName": "Sushanth Kashyap",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Arizona State University",
    "programmeAdmittedTo": "Masters in Information Technology and Management",
    "documentLink": "https://drive.google.com/file/d/1gkvTrqIY7siP0oIuckbGjtymlUz5B4xg/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Ritvik Wuyyuru",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Dalhousie University, Halifax, NS, Canada",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1X8PWmOrZUr-GxcWmUgPtm6NOwt3P5anY/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Pranav Shankar",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "University of Southern California",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1XUSeHV9Al4E05OYUxix5MJtXUFnEqVM7/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Kamalesh Singaravelan",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "New Jersey Institute of Technology",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/18RteePs_7ah9oINRAFnSHvV3MkJhQUlw/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Shreyas Sai Raman",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Northeastern University in Boston",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1tTUtiyKUvpX2F791uu6q0QATDRoF65nX/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Niranjan Rao S S",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "San Jose State University, California.",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1PC8VzXHTkZPBF91HKTuXYxF14p42cMLA/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Aditya Shenoy",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Northeastern University",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1qs_-FHtlb8hn7G7FfZg_6_HbhJ8CUWwe/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "V Nimish Bhasu",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "University of Arizona",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1rThbK-GAy1Qr-2vFNkoyVUdPLEFUsZoD/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Ananya Prabhakar",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "San Jose State University",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1G1ge8ONj-nUJwyL7_9a1RD_JXIWTouV4/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Udit B",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "The University of Texas at Arlington",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/17KJzdwkRqiceDcwb_Lh8gpdjbI3s5w2Q/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Sanjana S",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Uni of Buffalo",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1KJZ1vUyUowt9XNeIXnDPoobdFTwaVuNh/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Sharanya Mishra",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "George Washington University, Illinois Institute of Technology, Northeastern University-Silicon Valley",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/130PKOdUoBQHdBPz_fzd8TGA7mGKsoFb-/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Diesha Singh S",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Northeastern University, College of Engneering",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/15xMnqW0MrUJBZlYlJcLq87nn0peK5E2J/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Anirudh Joshi",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Carnegie Mellon University",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1gYLcGdBDPu_x8uQ1FC_9D6o8gVnsnDfL/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Manaswini Rathore",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Purdue University",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1cOfvWct1qKTmAi4o9DPkN6GRlqbh-ERf/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Jigya Singh",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Carnegie Mellon University",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1YDh5HRz7mA1nl5FRFMadiTnYMcQPgezo/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Ghana Gokul Gabburu",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "University of Colorado Boulder",
    "programmeAdmittedTo": "Master of Science in DataScience",
    "documentLink": "https://drive.google.com/file/d/1MRWs8XRXkA29MplJs-R-ZXJyb9N9VZYr/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Dedeepya Vasangi",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "SJSU",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/167Aly8pNCyasZ0VdIBxmanmWz95IiUeR/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Manikya Bardhan",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "University of Michigan",
    "programmeAdmittedTo": "Master of Science in DataScience",
    "documentLink": "https://drive.google.com/file/d/1r4XEYeDNRK8mnmFA240rpjKuqyQ9LM8L/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Pramath Rao",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "George Mason University",
    "programmeAdmittedTo": "Master of Science in DataScience",
    "documentLink": "https://drive.google.com/file/d/1OPqlif6KHYCV2jBsZC_nCAoOU-gA1ftL/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Sakshi Vattikutti",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "Carnegie Mellon University",
    "programmeAdmittedTo": "Master of Science in Information Networking",
    "documentLink": "https://drive.google.com/file/d/1FxlnDBVgA9lqrBstdP86eriW0pnUQrFF/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Sanchit Kaul",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "University of Californaia",
    "programmeAdmittedTo": "Master of Science in Information Networking",
    "documentLink": "https://drive.google.com/file/d/1fg2bwbLNykoyExisz-ksFoEdwIMjjgoc/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Shishir Dongre",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "SJSU",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/1Da5HK5AC9cJEONEwvuYH8J7n0eB8D1FU/view?usp=drive_link",
    "year": "2023"
  },
  {
    "studentName": "Ujjwal Tiku",
    "programGraduatedFrom": "B.Tech",
    "institutionAdmittedTo": "CalStateFullerton",
    "programmeAdmittedTo": "Master of Science in Computer Science",
    "documentLink": "https://drive.google.com/file/d/10zHsREo_cBO8vh1yhJYTMVorDmBYSY9k/view?usp=drive_link",
    "year": "2023"
  }
]


studentInterSports=[
    {
    "nameOfStudent": "Prajwal M Joshi",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1MphF0jaCqtg-nLIR9lIAkQFzrBgkmEju/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Runner-Up",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Archit Saigal",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1fkxqxsJ7tHHRoy-2ccOLEsJHmZPwiwOM/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Runner-Up",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Pratyush Sinha",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1c0CBvuMmsOK7HIDKbndcjN937yNS4KCM/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Runner-Up",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Tejas",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1fVpsmd9rAu1vus-jkZd2TxEmjJTapX2m/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Runner-Up",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Prajwal M Joshi",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1ax26MUfkKWTXhM-XJ7tOSOCPtmehbX87/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Runner-Up",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Archit Saigal",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1XRqvp6d467fz2dV7e8-VLxi7QKNcwlly/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Nishanth S R",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/12oxRbCVXHOZQhmHsxTzk6xLIdrAQQwwJ/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Tejas",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1f-DoGenEWPlh-epO77nSjK-760cMz1bQ/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Pratyush Sinha",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1dBn9FBQQ0cKL3vYRzblp5b3yJ2RrXbkR/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Prajwal M Joshi",
    "nameOfEvent": "Chess",
    "link": "https://drive.google.com/file/d/1OXJ8bilDzfaqphFHj4NX1r427VCDByXh/view?usp=sharing",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  },
  {
    "nameOfStudent": "Sinchana Hebbar",
    "nameOfEvent": "Sygnite '24, SCMS Symbiosis Institute of Business Management Bengaluru",
    "link": "https://drive.google.com/file/d/1mfKTc9cscQteBLcNHNEADsgoOPEgORfw/view?usp=drive_link",
    "yearOfEvent": "2023-24",
    "teamOrIndi": "Team",
    "level": "Inter-University",
    "nameOfAward": "Winners",
    "nameOfUniv": "PES University"
  }
]



studentIntraSports=[]



print("start...")

print("Inserting studentEntranceExam data...")
for record in studentEntranceExam:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
            studentEntranceExam_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        
        
print("Inserting studentHigherStudies data...")
for record in studentHigherStudies:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
           studentHigherStudies_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        
  
print("Inserting studentInterSports data...")       
for record in studentInterSports:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
           studentInterSports_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        

print("Inserting studentIntraSports data...")
for record in studentIntraSports:
    try:
        # Use custom JSON dumps to handle serialization
        response = requests.post(
           studentIntraSports_api_url, 
            data=json.dumps(record),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print(f"successfully.")
        else:
            print(f"Failed : {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        