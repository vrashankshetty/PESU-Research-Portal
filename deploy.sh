#!/bin/bash


print_header() {
    echo -e "\n\033[1;34m==== $1 ====\033[0m"
}

print_success() {
    echo -e "\033[1;32m✓ $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m✗ $1\033[0m"
}

print_progress() {
    echo -e "\033[1;33m⟳ $1\033[0m"
}


clear
echo -e "\033[1;36m╔════════════════════════════════════╗"
echo -e "║     PESU Research Portal Deploy    ║"
echo -e "╚════════════════════════════════════╝\033[0m"



print_header "Task 1: Git Pull"
print_progress "Pulling latest changes from main branch..."
if ! git pull origin main --no-ff; then
    print_error "Git pull failed due to conflicts"
    exit 1
fi
print_success "Git pull completed successfully"



print_header "Task 2: Frontend Build"
cd frontend_new || { print_error "Frontend directory not found"; exit 1; }
print_progress "Building frontend..."
if ! npm run build; then
    print_error "Frontend build failed"
    exit 1
fi
print_success "Frontend build completed"



print_header "Task 3: Backend Build"
cd ../backend_new || { print_error "Backend directory not found"; exit 1; }
print_progress "Building backend..."
if ! npm run build; then
    print_error "Backend build failed"
    exit 1
fi
print_success "Backend build completed"

# PM2 check and restart
print_header "Task 4: Service Restart"
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed"
    exit 1
fi

print_progress "Restarting services..."
pm2 restart pesu-research-portal
pm2 restart pesu-research-portal-frontend
print_success "Services restarted successfully"

echo -e "\n\033[1;32m╔════════════════════════════════════╗"
echo -e "║         Deployment Complete!        ║"
echo -e "╚════════════════════════════════════╝\033[0m"