#!/bin/bash

# Script to generate SSL certificates if they don't exist
# Usage: ./generate-cert.sh

CERT_PATH="/etc/letsencrypt/live/clickly.cv/fullchain.pem"
DOMAINS="clickly.cv www.clickly.cv"
EMAIL="your-email@example.com"  # Change this to your email

echo "Checking for existing certificates..."

# Check if certificate already exists
if [ -f "$CERT_PATH" ]; then
    echo "✓ Certificate already exists at $CERT_PATH"
    echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH | cut -d= -f2)"
    exit 0
fi

echo "Certificate not found. Generating new certificate..."

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Stop nginx container temporarily to free up ports 80 and 443
echo "Stopping nginx container..."
cd "$(dirname "$0")"
docker-compose stop nginx

# Create necessary directories
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt

# Generate certificate using standalone mode
echo "Generating certificate for $DOMAINS..."
sudo certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d clickly.cv \
    -d www.clickly.cv

# Check if certificate was generated successfully
if [ -f "$CERT_PATH" ]; then
    echo "✓ Certificate generated successfully!"
    echo "Certificate location: $CERT_PATH"
    
    # Restart nginx
    echo "Restarting nginx container..."
    docker-compose up -d nginx
    
    echo "✓ Setup complete! Your site should now work with HTTPS."
else
    echo "✗ Certificate generation failed. Please check the error messages above."
    echo "Restarting nginx container..."
    docker-compose up -d nginx
    exit 1
fi

