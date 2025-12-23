# Quick SSL Fix - You Already Have the Certificate!

## ✅ Good News

You already have a **wildcard certificate** that covers all subdomains:
- **Certificate Name**: `clickly.cv-0001`
- **Covers**: `*.clickly.cv` and `clickly.cv`
- **Location**: `/etc/letsencrypt/live/clickly.cv-0001/`
- **Expires**: 2026-03-23 (89 days valid)

## What You Need to Do

### 1. Verify Nginx Configuration

Check that nginx is using the correct certificate for subdomains:

```bash
# Check subdomain server block
grep -A 5 "server_name \*\.clickly\.cv" nginx/nginx.conf
```

**Should show:**
```
ssl_certificate /etc/letsencrypt/live/clickly.cv-0001/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/clickly.cv-0001/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/clickly.cv-0001/chain.pem;
```

### 2. If Nginx Config is Wrong, Update It

If nginx is pointing to the wrong certificate, update `nginx/nginx.conf`:

**For subdomain server block (around line 134):**
```nginx
ssl_certificate /etc/letsencrypt/live/clickly.cv-0001/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/clickly.cv-0001/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/clickly.cv-0001/chain.pem;
```

**For main domain server block (around line 63):**
You can use either certificate, but `clickly.cv-0001` is recommended:
```nginx
ssl_certificate /etc/letsencrypt/live/clickly.cv-0001/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/clickly.cv-0001/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/clickly.cv-0001/chain.pem;
```

### 3. Test and Reload Nginx

```bash
# Test nginx configuration
docker exec nginx nginx -t

# If test passes, reload nginx
docker exec nginx nginx -s reload

# Or if using docker-compose
docker-compose restart nginx
```

### 4. Test SSL

```bash
# Test main domain
curl -I https://clickly.cv

# Test subdomain (this should work now!)
curl -I https://dpkrn.clickly.cv

# Check SSL certificate details
openssl s_client -connect dpkrn.clickly.cv:443 -servername dpkrn.clickly.cv < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A 1 "Subject Alternative Name"
```

**Expected output should show:**
```
DNS:*.clickly.cv, DNS:clickly.cv
```

## Quick Verification Script

Run this to verify everything:

```bash
./verify-certificate.sh
```

This will:
- ✅ Confirm certificate exists
- ✅ Verify it's a wildcard certificate
- ✅ Check if nginx config matches

## Summary

| Certificate | Covers | Use For |
|------------|--------|---------|
| `clickly.cv-0001` | `*.clickly.cv`, `clickly.cv` | ✅ **Subdomains** (dpkrn.clickly.cv, etc.) |
| `clickly.cv` | `clickly.cv`, `www.clickly.cv` | ❌ Main domain only (no subdomains) |

**Use `clickly.cv-0001` for subdomain server block!**

## Troubleshooting

### If subdomain still shows SSL warning:

1. **Check nginx is using correct cert:**
   ```bash
   docker exec nginx nginx -T | grep -A 3 "server_name \*\.clickly\.cv" | grep ssl_certificate
   ```

2. **Verify certificate is accessible:**
   ```bash
   sudo ls -la /etc/letsencrypt/live/clickly.cv-0001/
   ```

3. **Check nginx error logs:**
   ```bash
   docker logs nginx | tail -50
   ```

4. **Restart nginx container:**
   ```bash
   docker-compose restart nginx
   ```

## Next Steps After Fix

Once SSL is working:
- ✅ `https://dpkrn.clickly.cv/` should work without warnings
- ✅ `https://dpkrn.clickly.cv/github` should work
- ✅ All subdomains will be secured automatically

