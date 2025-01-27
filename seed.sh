#!/bin/bash

# Run scripts sequentially
python3 ./seed/teachers.py ./seed/teachers.csv http://10.2.80.90:8081/api/v1/auth/register
python3 ./seed/journal.py http://10.2.80.90:8081/api/v1/journal/seed http://localhost:5500/api/v1/conference/seed 
python3 ./seed/patent.py ./hello.csv http://10.2.80.90:8081/api/v1/patent/seed