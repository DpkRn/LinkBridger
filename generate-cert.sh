#!/bin/bash

# Script to generate SSL certificates for clickly.cv
# 
# IMPORTANT: For subdomain routing (e.g., dpkrn.clickly.cv), you MUST use a wildcard certificate.
# This script generates a wildcard certificate by default to support all dynamic subdomains.
#
# Usage: 
#   ./generate-cert.sh              # Generate wildcard certificate (recommended for subdomains)
#   ./generate-cert.sh --standard    # Generate standard certificate (main domain only, no subdomains)

CERT_PATH="/etc/letsencrypt/live/clickly.cv/fullchain.pem"
WILDCERT_PATH="/etc/letsencrypt/live/clickly.cv-0001/fullchain.pem"
EMAIL="your-email@example.com"  # Change this to your email
USE_WILDCARD=true  # Default to wildcard for subdomain support

# Check for standard flag (non-wildcard)
if [[ "$1" == "--standard" ]]; then
    USE_WILDCARD=false
    echo "⚠️  WARNING: Standard certificate will NOT work for subdomains!"
    echo "   Subdomains like dpkrn.clickly.cv will show SSL warnings."
    echo "   Use wildcard certificate (default) for subdomain support."
    echo ""
    read -p "Continue with standard certificate? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Use ./generate-cert.sh (without --standard) for wildcard certificate."
        exit 0
    fi
fi

echo "=========================================="
echo "SSL Certificate Generation Script"
echo "=========================================="
echo ""

# Check if certificate already exists
if [ "$USE_WILDCARD" = true ]; then
    # Check multiple possible locations for wildcard cert
    if [ -f "$CERT_PATH" ]; then
        # Verify it's actually a wildcard cert
        WILDCARD_CHECK=$(openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -o "*.clickly.cv" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            echo "✓ Wildcard certificate already exists at $CERT_PATH"
            echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)"
            echo ""
            echo "Certificate covers:"
            openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "  *.clickly.cv, clickly.cv"
            exit 0
        else
            echo "⚠️  Certificate exists but does NOT include wildcard (*.clickly.cv)"
            echo "   This certificate will NOT work for subdomains!"
            echo ""
            read -p "Do you want to generate a new wildcard certificate? (y/n) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "Aborted."
                exit 0
            fi
        fi
    elif [ -f "$WILDCERT_PATH" ]; then
        echo "✓ Wildcard certificate already exists at $WILDCERT_PATH"
        echo "Certificate expires on: $(openssl x509 -enddate -noout -in $WILDCERT_PATH 2>/dev/null | cut -d= -f2)"
        exit 0
    fi
else
    if [ -f "$CERT_PATH" ]; then
        echo "✓ Certificate already exists at $CERT_PATH"
        echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)"
        echo ""
        echo "⚠️  Note: Standard certificate does NOT cover subdomains (*.clickly.cv)"
        echo "   Subdomains will show SSL warnings."
        echo "   Run without --standard flag to generate wildcard certificate."
        exit 0
    fi
fi

if [ "$USE_WILDCARD" = true ]; then
    echo "Generating WILDCARD certificate for subdomain support..."
else
    echo "Generating standard certificate (main domain only)..."
fi
echo ""

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
    echo "Generating WILDCARD Certificate"
    echo "This will cover: *.clickly.cv and clickly.cv"
    echo "=========================================="
    echo ""
    echo "This certificate will work for ALL dynamic subdomains:"
    echo "  ✓ dpkrn.clickly.cv"
    echo "  ✓ username.clickly.cv (any username)"
    echo "  ✓ clickly.cv (main domain)"
    echo ""
    echo "This requires DNS-01 challenge (manual DNS verification)"
    echo ""
    echo "You will need to add a TXT record to your DNS:"
    echo "  Name: _acme-challenge"
    echo "  Value: (will be provided by certbot)"
    echo "  TTL: Automatic (or 300)"
    echo ""
    echo "DNS Provider Instructions:"
    echo "  - Namecheap: Advanced DNS → Add TXT Record"
    echo "  - GoDaddy: DNS Management → Add TXT Record"
    echo "  - Cloudflare: DNS → Add Record (Type: TXT)"
    echo ""
    read -p "Press Enter when ready to continue..."
    echo ""
    
    # Generate wildcard certificate using DNS-01 challenge
    echo "Starting certificate generation..."
    echo ""
    echo "⚠️  IMPORTANT: Certbot will prompt you to add a DNS TXT record."
    echo "   When it shows the TXT record value, you MUST:"
    echo "   1. Add it to your DNS provider (Namecheap, GoDaddy, etc.)"
    echo "   2. Host/Name should be: _acme-challenge (NOT _acme-challenge.clickly.cv)"
    echo "   3. Wait 2-5 minutes for DNS propagation"
    echo "   4. Verify with: dig _acme-challenge.clickly.cv TXT +short"
    echo "   5. Then press Enter in certbot"
    echo ""
    read -p "Press Enter to start certbot..."
    echo ""
    
    sudo certbot certonly --manual \
        --preferred-challenges dns \
        --agree-tos \
        --email "$EMAIL" \
        -d "*.clickly.cv" \
        -d "clickly.cv" \
        --server https://acme-v02.api.letsencrypt.org/directory
    
    # Check for wildcard cert in different possible locations
    # Certbot may store it in different locations depending on existing certs
    if [ -f "/etc/letsencrypt/live/clickly.cv/fullchain.pem" ]; then
        # Verify it's actually a wildcard cert
        WILDCARD_CHECK=$(sudo openssl x509 -in "/etc/letsencrypt/live/clickly.cv/fullchain.pem" -text -noout 2>/dev/null | grep -o "*.clickly.cv" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            CERT_PATH="/etc/letsencrypt/live/clickly.cv/fullchain.pem"
        fi
    fi
    
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
    
    if [ "$USE_WILDCARD" = true ]; then
        echo "Certificate covers:"
        openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "  *.clickly.cv, clickly.cv"
        echo ""
        echo "✅ This wildcard certificate will work for:"
        echo "   • Main domain: https://clickly.cv"
        echo "   • All subdomains: https://username.clickly.cv (any username)"
        echo "   • Examples: https://dpkrn.clickly.cv, https://john.clickly.cv, etc."
    else
        echo "⚠️  This certificate only covers:"
        echo "   • Main domain: https://clickly.cv"
        echo "   • www: https://www.clickly.cv"
        echo "   • Does NOT cover subdomains (*.clickly.cv)"
    fi
    echo ""
    
    # Restart nginx
    echo "Restarting nginx container..."
    cd "$(dirname "$0")"
    docker compose up -d nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || true
    
    echo ""
    echo "✓ Setup complete! Your site should now work with HTTPS."
    if [ "$USE_WILDCARD" = true ]; then
        echo ""
        echo "✅ Wildcard certificate installed! All dynamic subdomains are now secured."
        echo ""
        echo "Next steps:"
        echo "  1. Test main domain: curl -I https://clickly.cv"
        echo "  2. Test subdomain: curl -I https://dpkrn.clickly.cv"
        echo "  3. Verify SSL: openssl s_client -connect dpkrn.clickly.cv:443 -servername dpkrn.clickly.cv"
    else
        echo ""
        echo "⚠️  WARNING: This certificate does NOT cover subdomains!"
        echo "   Subdomains will show SSL warnings."
        echo "   Run without --standard flag to generate wildcard certificate."
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
    echo ""
    echo "=========================================="
    echo "Troubleshooting Steps"
    echo "=========================================="
    echo ""
    echo "1. Verify DNS TXT record exists:"
    echo "   Run: ./verify-dns.sh"
    echo "   Or manually: dig _acme-challenge.clickly.cv TXT +short"
    echo ""
    echo "2. Check certbot logs:"
    echo "   Run: ./check-certbot-logs.sh"
    echo "   Or manually: sudo cat /var/log/letsencrypt/letsencrypt.log"
    echo ""
    echo "3. Common DNS issues:"
    echo "   • Host name should be: _acme-challenge (NOT _acme-challenge.clickly.cv)"
    echo "   • Wait 5-10 minutes after adding the record"
    echo "   • Verify in your DNS provider dashboard"
    echo "   • Check the value matches exactly what certbot showed"
    echo ""
    echo "4. Retry after fixing DNS:"
    echo "   sudo ./generate-cert.sh"
    echo ""
    echo "Restarting nginx container..."
    cd "$(dirname "$0")"
    docker-compose up -d nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || true
    exit 1
fi

if [ "$USE_WILDCARD" = true ]; then
    echo ""
    echo "Additional notes:"
    echo "  • This wildcard certificate works for ALL dynamic subdomains automatically"
    echo "  • No need to generate separate certificates for each username"
    echo "  • Certificate auto-renewal may require manual DNS verification"
    echo "  • Set up auto-renewal: sudo certbot renew --dry-run"
else
    echo ""
    echo "Additional notes:"
    echo "  • Update nginx.conf if using cert with different path"
    echo "  • Test SSL: openssl s_client -connect clickly.cv:443 -servername clickly.cv"
    echo "  • Set up auto-renewal: sudo certbot renew --dry-run"
fi

