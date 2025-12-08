#!/bin/bash

# ==========================================
# PayGate Optimizer - Start Script
# سكريبت التشغيل السريع
# ==========================================

echo ""
echo "Starting PayGate Optimizer..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating default .env..."
    cat > .env << 'EOF'
NODE_ENV=production
DEMO_MODE=true
NEXTAUTH_SECRET=default-secret-change-me
NEXTAUTH_URL=http://localhost:3000
EOF
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .next exists
if [ ! -d ".next" ]; then
    echo "🔨 Building project..."
    npm run build
fi

# Start with PM2 if available, otherwise npm
if command -v pm2 &> /dev/null; then
    echo "🚀 Starting with PM2..."
    pm2 start ecosystem.config.js --env production 2>/dev/null || pm2 start npm --name "paygate" -- start
else
    echo "🚀 Starting with npm..."
    npm start
fi

