#!/bin/bash

# Run scripts sequentially
python ./seed/teachers.py ./seed/teachers.csv http://localhost:5500/api/v1/auth/register
python ./seed/journal.py http://localhost:5500/api/v1/journal/seed http://localhost:5500/api/v1/conference/seed 
python ./seed/patent.py ./hello.csv http://localhost:5500/api/v1/patent/seed