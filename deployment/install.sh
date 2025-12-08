#!/bin/bash

# ==========================================
# PayGate Optimizer - Installation Script
# سكريبت التثبيت الكامل
# ==========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║   PayGate Optimizer - Installation Script        ║"
echo "║   سكريبت تثبيت مقارن بوابات الدفع               ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print step
print_step() {
    echo -e "\n${GREEN}[✓] $1${NC}"
}

# Function to print error
print_error() {
    echo -e "\n${RED}[✗] $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "\n${YELLOW}[!] $1${NC}"
}

# Check Node.js
print_step "Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current: $(node -v)"
    exit 1
fi
echo "Node.js $(node -v) ✓"

# Check npm
print_step "Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi
echo "npm $(npm -v) ✓"

# Create logs directory
print_step "Creating logs directory..."
mkdir -p logs
echo "Done ✓"

# Install dependencies
print_step "Installing dependencies..."
npm install --production=false
echo "Done ✓"

# Setup environment file
print_step "Setting up environment..."
if [ ! -f .env ]; then
    if [ -f deployment/env-production.txt ]; then
        cp deployment/env-production.txt .env
        print_warning "Created .env from template. Please edit it!"
    else
        cat > .env << 'EOF'
NODE_ENV=production
DEMO_MODE=true
NEXTAUTH_SECRET=change-this-to-random-32-character-key
NEXTAUTH_URL=http://localhost:3000
EOF
        print_warning "Created default .env. Please update NEXTAUTH_SECRET and NEXTAUTH_URL!"
    fi
else
    echo ".env already exists ✓"
fi

# Generate Prisma client
print_step "Generating Prisma client..."
npx prisma generate 2>/dev/null || true
echo "Done ✓"

# Build the project
print_step "Building project..."
npm run build
echo "Done ✓"

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    print_step "PM2 detected. Setting up..."
    if [ -f deployment/ecosystem.config.js ]; then
        cp deployment/ecosystem.config.js ecosystem.config.js
    fi
    echo "PM2 configured ✓"
fi

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║   ✅ Installation Complete!                       ║"
echo "║                                                   ║"
echo "║   Next Steps:                                     ║"
echo "║   1. Edit .env file with your settings           ║"
echo "║   2. Run: npm start                               ║"
echo "║   3. Or with PM2: pm2 start ecosystem.config.js  ║"
echo "║                                                   ║"
echo "║   Admin Login:                                    ║"
echo "║   📧 admin@paygate.com                            ║"
echo "║   🔑 admin123                                     ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

