# OTP Model Documentation

## Overview
The OTP (One-Time Password) model stores temporary verification codes used for email verification, password reset, and other authentication-related operations. OTPs are automatically expired after a set time period.

## Model Name
`Otp` (collection name in MongoDB)

## Schema Fields

### `email` (String, Required)
- **Type**: String
- **Required**: Yes
- **Purpose**: Email address of the user requesting the OTP. Used to:
  - Identify which user the OTP belongs to
  - Send the OTP via email
  - Validate OTP requests
  - Prevent OTP abuse (rate limiting per email)
- **Example**: `"john.doe@example.com"`
- **Why Required**: Essential for associating OTPs with users and sending verification codes. Without email, the OTP cannot be delivered or validated.

### `otp` (String, Required)
- **Type**: String (hashed)
- **Required**: Yes
- **Purpose**: The actual one-time password code. **Should always be hashed** before storage for security. Never store plain text OTPs.
- **Example**: `"$2b$10$hashedotpstring..."` (hashed)
- **Why Required**: The core verification code. Required for OTP validation. Must be hashed using a secure hashing algorithm (bcrypt, argon2, etc.).

### `createdAt` (Date, Auto-generated, Auto-expires)
- **Type**: Date
- **Auto-generated**: Yes
- **Default**: `Date.now`
- **Expires**: 300 seconds (5 minutes)
- **Purpose**: 
  - Timestamp when the OTP was created
  - Used for automatic expiration via MongoDB TTL (Time To Live) index
  - OTPs expire 5 minutes after creation for security
- **Example**: `2024-01-15T10:30:00.000Z`
- **Why Required**: Essential for OTP expiration. The `expires: 300` option automatically deletes the document after 5 minutes, ensuring OTPs cannot be used after expiration.

## Indexes
- `createdAt`: Automatically indexed with TTL (Time To Live) for auto-expiration
- Consider adding index on `email` for faster lookups if needed

## Security Considerations

### OTP Hashing
- **Never** store OTPs in plain text
- Always hash OTPs before saving to database
- Use strong hashing algorithms (bcrypt recommended)
- Recommended: bcrypt with salt rounds >= 10

### OTP Generation
- Generate cryptographically secure random OTPs
- Use appropriate length (typically 4-6 digits for user-friendly, 6-8 for higher security)
- Consider alphanumeric OTPs for better security

### Expiration
- OTPs expire after 5 minutes (300 seconds)
- This is enforced by MongoDB TTL index
- Expired OTPs are automatically deleted
- Consider shorter expiration for sensitive operations

### Rate Limiting
- Implement rate limiting per email address
- Prevent OTP spam/abuse
- Consider maximum OTP requests per hour/day per email

### Single Use
- OTPs should be single-use only
- Delete OTP after successful verification
- Prevent replay attacks

## Usage Examples

### Creating an OTP
```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Generate 6-digit OTP
const otpCode = crypto.randomInt(100000, 999999).toString();

// Hash the OTP
const hashedOtp = await bcrypt.hash(otpCode, 10);

// Create OTP record
const otp = new Otp({
  email: 'user@example.com',
  otp: hashedOtp
});
await otp.save();

// Send plain OTP via email (not stored)
await sendEmail(user.email, `Your OTP is: ${otpCode}`);
```

### Verifying an OTP
```javascript
const otpRecord = await Otp.findOne({ 
  email: 'user@example.com' 
});

if (!otpRecord) {
  throw new Error('OTP not found or expired');
}

const isValid = await bcrypt.compare(enteredOtp, otpRecord.otp);

if (isValid) {
  // Delete OTP after successful verification
  await Otp.deleteOne({ _id: otpRecord._id });
  // Proceed with verification
} else {
  throw new Error('Invalid OTP');
}
```

### Checking OTP Existence
```javascript
const otpExists = await Otp.findOne({ 
  email: 'user@example.com' 
});

if (otpExists) {
  // OTP exists and is not expired (MongoDB TTL handles expiration)
  console.log('OTP found');
} else {
  // OTP doesn't exist or has expired
  console.log('OTP not found or expired');
}
```

## Expiration Behavior
- MongoDB automatically deletes documents where `createdAt` is older than 300 seconds
- This happens via TTL (Time To Live) index
- No manual cleanup needed
- Expired OTPs are permanently deleted (not soft deleted)

## Best Practices

### OTP Generation
1. Use cryptographically secure random number generator
2. Generate appropriate length (6 digits recommended)
3. Store only hashed version

### OTP Delivery
1. Send OTP via secure channel (email, SMS)
2. Include expiration time in message
3. Warn users about security (don't share OTP)

### OTP Validation
1. Check if OTP exists
2. Verify OTP hash matches
3. Check if OTP is expired (MongoDB handles this)
4. Delete OTP after successful verification
5. Implement rate limiting

### Security
1. Hash all OTPs before storage
2. Use HTTPS for OTP transmission
3. Implement rate limiting
4. Log failed OTP attempts
5. Consider CAPTCHA for OTP requests

## Notes
- OTPs are automatically deleted after 5 minutes
- Only one OTP per email can exist at a time (consider this in implementation)
- Always hash OTPs before storing
- Delete OTP immediately after successful verification
- Consider implementing OTP attempt limits (max 3-5 attempts)
- The model is simple by design - expiration is handled automatically by MongoDB

## Common Use Cases
1. **Email Verification**: Send OTP to verify email address during registration
2. **Password Reset**: Send OTP to verify identity before password reset
3. **Two-Factor Authentication**: Additional security layer for login
4. **Account Recovery**: Verify identity for account recovery
5. **Sensitive Operations**: Verify identity before allowing sensitive actions
