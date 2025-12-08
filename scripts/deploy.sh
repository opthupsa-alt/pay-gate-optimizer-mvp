#!/bin/bash

# PayGate Optimizer - Deployment Script
# =====================================

echo "🚀 Starting PayGate Optimizer Deployment..."

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version OK: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile
elif command -v npm &> /dev/null; then
    npm ci
else
    echo "❌ Error: npm or pnpm is required"
    exit 1
fi
echo "✅ Dependencies installed"

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️ Warning: NEXTAUTH_SECRET not set. Generating one..."
    export NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
    echo "⚠️ Please save this secret!"
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "⚠️ Warning: NEXTAUTH_URL not set. Using default..."
    export NEXTAUTH_URL="http://localhost:3000"
fi

# Set demo mode if not configured
export DEMO_MODE=${DEMO_MODE:-true}
export NODE_ENV=production

echo "✅ Environment configured"
echo "   DEMO_MODE: $DEMO_MODE"
echo "   NEXTAUTH_URL: $NEXTAUTH_URL"

# Build the project
echo "🔨 Building project..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build completed successfully"

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting with PM2..."
    pm2 delete paygate 2>/dev/null || true
    pm2 start npm --name "paygate" -- start
    pm2 save
    echo "✅ Application started with PM2"
else
    echo "ℹ️ PM2 not found. Starting directly..."
    echo "Run 'npm start' or 'pnpm start' to start the server"
fi

echo ""
echo "🎉 Deployment completed!"
echo "================================"
echo "📌 Admin Login:"
echo "   Email: admin@paygate.com"
echo "   Password: admin123"
echo ""
echo "🌐 Access your app at: $NEXTAUTH_URL"
echo "================================"

