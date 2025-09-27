#!/bin/bash

set -e

echo "🚀 Deploying EcoSui to Sui Blockchain..."

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Please install it first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "Move.toml" ]; then
    echo "❌ Move.toml not found. Please run from project root."
    exit 1
fi

# Build the package
echo "📦 Building Move package..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Run tests
echo "🧪 Running tests..."
sui move test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi

echo "✅ All tests passed!"

# Deploy to network
echo "🌐 Deploying to Sui network..."
DEPLOY_RESULT=$(sui client publish --gas-budget 100000000 --skip-fetch-latest-git-deps --json)

if [ $? -eq 0 ]; then
    PACKAGE_ID=$(echo $DEPLOY_RESULT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
    echo "✅ Deployment successful!"
    echo "📦 Package ID: $PACKAGE_ID"
    echo "📝 Update your frontend with this package ID"
    
    # Save package ID to file
    echo "PACKAGE_ID=$PACKAGE_ID" > .deployment
    echo "DEPLOYMENT_DATE=$(date)" >> .deployment
    
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 EcoSui is now live on Sui!"
echo ""
echo "Next steps:"
echo "1. Update src/utils/suiIntegration.ts with the package ID above"
echo "2. Initialize the contracts by calling init() functions"
echo "3. Register your first oracle and community"
echo "4. Start minting carbon credits!"