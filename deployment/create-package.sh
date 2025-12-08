#!/bin/bash

# ==========================================
# Create Deployment Package
# إنشاء ملف ZIP للرفع
# ==========================================

echo "Creating deployment package..."

# Package name with date
PACKAGE_NAME="paygate-optimizer-$(date +%Y%m%d-%H%M%S).zip"

# Create package excluding unnecessary files
zip -r "$PACKAGE_NAME" . \
    -x "node_modules/*" \
    -x ".next/*" \
    -x ".git/*" \
    -x ".env" \
    -x ".env.local" \
    -x "*.log" \
    -x "logs/*" \
    -x ".DS_Store" \
    -x "Thumbs.db" \
    -x "*.zip" \
    -x ".cursor/*"

echo ""
echo "✅ Package created: $PACKAGE_NAME"
echo ""
echo "📦 Package size: $(du -h "$PACKAGE_NAME" | cut -f1)"
echo ""
echo "Upload this file to your hosting and extract it."
echo ""

