#!/bin/bash

# Run scripts sequentially
python3 ./seed/teachers.py ./seed/teachers.csv http://localhost:5500/api/v1/auth/register
python3 ./seed/journal.py http://localhost:5500/api/v1/journal/seed http://localhost:5500/api/v1/conference/seed 
python3 ./seed/journal_2023.py http://localhost:5500/api/v1/journal/seed http://localhost:5500/api/v1/conference/seed 
python3 ./seed/patent.py ./hello.csv http://localhost:5500/api/v1/patent/seed
python3 ./seed/student.py http://localhost:5500/api/v1/studentEntranceExam http://localhost:5500/api/v1/studentHigherStudies http://localhost:5500/api/v1/interSports http://localhost:5500/api/v1/intraSports
python3 ./seed/department.py http://localhost:5500/api/v1/departmentAttendedActivity/seed http://localhost:5500/api/v1/departmentConductedActivity/seed



