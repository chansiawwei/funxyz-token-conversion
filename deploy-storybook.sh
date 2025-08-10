#!/bin/bash

# Deploy Storybook to Vercel
# This script uses the vercel-storybook.json configuration

echo "🚀 Deploying Storybook to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Build Storybook first
echo "📦 Building Storybook..."
pnpm build-storybook

if [ $? -eq 0 ]; then
    echo "✅ Storybook build successful!"
    
    # Deploy using the custom Vercel config
    echo "🌐 Deploying to Vercel..."
    vercel --config vercel-storybook.json --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Storybook deployed successfully!"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Storybook build failed!"
    exit 1
fi