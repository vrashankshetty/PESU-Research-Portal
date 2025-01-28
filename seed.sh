#!/bin/bash
Set the base URL
base_url="http://localhost:5500"

# Run scripts sequentially


python3 ./seed/teachers.py ./seed/teachers.csv "$base_url/api/v1/auth/register"
python3 ./seed/journal.py "$base_url/api/v1/journal/seed" "$base_url/api/v1/conference/seed"
python3 ./seed/journal_2023.py "$base_url/api/v1/journal/seed" "$base_url/api/v1/conference/seed"
python3 ./seed/patent.py ./hello.csv "$base_url/api/v1/patent/seed"
python3 ./seed/student.py "$base_url/api/v1/studentEntranceExam" "$base_url/api/v1/studentHigherStudies" "$base_url/api/v1/interSports" "$base_url/api/v1/intraSports"
python3 ./seed/department.py "$base_url/api/v1/departmentAttendedActivity/seed" "$base_url/api/v1/departmentConductedActivity/seed"