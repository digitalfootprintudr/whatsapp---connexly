#!/bin/bash

# Generate Self-Signed SSL Certificates for Local Testing
# This script creates SSL certificates for HTTPS testing

echo "🔐 Generating self-signed SSL certificates..."

# Create SSL directory if it doesn't exist
mkdir -p nginx/ssl

# Generate private key
echo "📝 Generating private key..."
openssl genrsa -out nginx/ssl/key.pem 2048

# Generate certificate signing request
echo "📝 Generating certificate signing request..."
openssl req -new -key nginx/ssl/key.pem -out nginx/ssl/cert.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=connexly.digitalfootprint.cloud"

# Generate self-signed certificate
echo "📝 Generating self-signed certificate..."
openssl x509 -req -days 365 -in nginx/ssl/cert.csr -signkey nginx/ssl/key.pem -out nginx/ssl/cert.pem

# Clean up CSR file
rm nginx/ssl/cert.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates saved to: nginx/ssl/"
echo ""
echo "⚠️  Note: These are self-signed certificates for testing only."
echo "   For production, use certificates from a trusted CA like Let's Encrypt."
echo ""
echo "🔐 Certificate files:"
echo "   - Private Key: nginx/ssl/key.pem"
echo "   - Certificate: nginx/ssl/cert.pem"
