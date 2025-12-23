#!/bin/bash

# Script to generate SSL certificates for clickly.cv
# Supports both regular and wildcard certificates
# Usage: ./generate-cert.sh [--wildcard]

CERT_PATH="/etc/letsencrypt/live/clickly.cv/fullchain.pem"
WILDCERT_PATH="/etc/letsencrypt/live/clickly.cv-0001/fullchain.pem"
EMAIL="your-email@example.com"  # Change this to your email
USE_WILDCARD=false

# Check for wildcard flag
if [[ "$1" == "--wildcard" ]]; then
    USE_WILDCARD=true
fi

echo "=========================================="
echo "SSL Certificate Generation Script"
echo "=========================================="

# Check if certificate already exists
if [ "$USE_WILDCARD" = true ]; then
    CERT_PATH="$WILDCERT_PATH"
    if [ -f "$CERT_PATH" ]; then
        echo "✓ Wildcard certificate already exists at $CERT_PATH"
        echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)"
        exit 0
    fi
else
    if [ -f "$CERT_PATH" ]; then
        echo "✓ Certificate already exists at $CERT_PATH"
        echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)"
        echo ""
        echo "Note: For subdomain support, you may need a wildcard certificate."
        echo "Run with --wildcard flag to generate wildcard certificate."
        exit 0
    fi
fi

echo "Certificate not found. Generating new certificate..."

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Stop nginx container temporarily to free up ports 80 and 443
echo "Stopping nginx container..."
cd "$(dirname "$0")"
docker-compose stop nginx 2>/dev/null || true

# Create necessary directories
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt

if [ "$USE_WILDCARD" = true ]; then
    echo ""
    echo "=========================================="
    echo "Generating WILDCARD certificate"
    echo "This requires DNS-01 challenge (manual DNS verification)"
    echo "=========================================="
    echo ""
    echo "You will need to add a TXT record to your DNS:"
    echo "  Name: _acme-challenge.clickly.cv"
    echo "  Value: (will be provided by certbot)"
    echo ""
    echo "Press Enter when ready to continue..."
    read
    
    # Generate wildcard certificate using DNS-01 challenge
    echo "Generating wildcard certificate for *.clickly.cv and clickly.cv..."
    sudo certbot certonly --manual \
        --preferred-challenges dns \
        --agree-tos \
        --email "$EMAIL" \
        -d "*.clickly.cv" \
        -d "clickly.cv" \
        --server https://acme-v02.api.letsencrypt.org/directory
    
    # Check for wildcard cert in different possible locations
    if [ -f "$WILDCERT_PATH" ]; then
        CERT_PATH="$WILDCERT_PATH"
    elif [ -f "/etc/letsencrypt/live/clickly.cv-0002/fullchain.pem" ]; then
        CERT_PATH="/etc/letsencrypt/live/clickly.cv-0002/fullchain.pem"
    fi
else
    echo ""
    echo "=========================================="
    echo "Generating standard certificate"
    echo "This will cover: clickly.cv and www.clickly.cv"
    echo "=========================================="
    echo ""
    
    # Generate certificate using HTTP-01 challenge (standalone mode)
    echo "Generating certificate for clickly.cv and www.clickly.cv..."
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d clickly.cv \
        -d www.clickly.cv
fi

# Check if certificate was generated successfully
if [ -f "$CERT_PATH" ]; then
    echo ""
    echo "=========================================="
    echo "✓ Certificate generated successfully!"
    echo "=========================================="
    echo "Certificate location: $CERT_PATH"
    echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH | cut -d= -f2)"
    echo ""
    
    # Show certificate details
    echo "Certificate details:"
    openssl x509 -in "$CERT_PATH" -noout -subject -issuer 2>/dev/null || true
    echo ""
    
    # Restart nginx
    echo "Restarting nginx container..."
    docker-compose up -d nginx
    
    echo ""
    echo "✓ Setup complete! Your site should now work with HTTPS."
    if [ "$USE_WILDCARD" = false ]; then
        echo ""
        echo "⚠️  Note: This certificate does NOT cover subdomains (*.clickly.cv)"
        echo "   For subdomain support, run: ./generate-cert.sh --wildcard"
    else
        echo ""
        echo "✓ Wildcard certificate installed! All subdomains are now covered."
    fi
else
    echo ""
    echo "=========================================="
    echo "✗ Certificate generation failed!"
    echo "=========================================="
    echo "Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "  1. DNS not pointing to this server"
    echo "  2. Ports 80/443 not accessible"
    echo "  3. For wildcard: DNS TXT record not added correctly"
    echo ""
    echo "Restarting nginx container..."
    docker-compose up -d nginx
    exit 1
fi

echo ""
echo "Next steps:"
echo "  1. Update nginx.conf if using wildcard cert with different path"
echo "  2. Test SSL: openssl s_client -connect clickly.cv:443 -servername clickly.cv"
echo "  3. Set up auto-renewal: sudo certbot renew --dry-run"

