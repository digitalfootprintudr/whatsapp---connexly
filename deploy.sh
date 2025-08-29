#!/bin/bash

# WhatsApp Connexly Platform Deployment Script
# This script deploys the entire platform to production

set -e

echo "🚀 Starting WhatsApp Chat Platform Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "Please copy env.production.example to .env.production and fill in your values."
    exit 1
fi

# Load environment variables
source .env.production

echo "📦 Building and starting services..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start services
echo "🔨 Building services..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec web pnpm db:migrate

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is now running at:"
echo "   - HTTP: http://connexly.digitalfootprint.cloud (redirects to HTTPS)"
echo "   - HTTPS: https://connexly.digitalfootprint.cloud"
echo ""
echo "📱 WhatsApp webhook URL:"
echo "   https://connexly.digitalfootprint.cloud/api/webhooks/whatsapp/${VENDOR_ID:-your-vendor-id}"
echo ""
echo "📊 To view logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose.prod.yml down"
