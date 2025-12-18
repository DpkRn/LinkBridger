# Changelog

All notable changes to the backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-20
- **Welcome Email System**: Added automated welcome email functionality
  - New `sendWelcomeEmail` function in `mail.js` that sends personalized welcome emails to new users
  - Email includes user's personalized link, platform benefits, and getting started instructions
  - Integrated into user registration flow in `AuthController.js`
  - Uses `Welcome_Email_Template` from `emailTemplate.js`
  - Automatically sent after successful user registration

- **New User Onboarding Email**: Added admin notification email for new user registrations
  - New `sendNewUserOnboardingEmail` function in `mail.js` that notifies admin of new user signups
  - Includes new user's username, name, and profile link
  - Integrated into user registration flow in `AuthController.js`
  - Uses `Onboarding_Email_Template` from `emailTemplate.js`
  - Helps track user growth and engagement

### Changed - 2024-12-20
- **Email Service Configuration**: Migrated email credentials to environment variables
  - Changed hardcoded email credentials to use `process.env.EMAIL_USER` and `process.env.EMAIL_PASS`
  - Updated all email sending functions to use environment variables with fallback values
  - Improved security by removing credentials from source code
  - Updated `sendOtpVerification`, `sendEmailVerification`, `sendVisitEmail`, `sendWelcomeEmail`, and `sendNewUserOnboardingEmail` functions

- **Email Sender Address**: Standardized email sender addresses
  - All emails now use `process.env.EMAIL_USER` for sender address
  - Replaced hardcoded developer email with configurable email address
  - Support email now configurable via `process.env.SUPPORT_EMAIL` environment variable
  - Updated email templates to use configurable support email address

- **Email Function Naming**: Renamed email function for clarity
  - Renamed `sendNotificationEmail` to `sendVisitEmail` for better semantic clarity
  - Updated all references in `index.js` and route handlers
  - Function now clearly indicates it sends visit notification emails

### Fixed - 2024-12-20
- **User Registration Name Parameter**: Fixed missing `name` parameter in user registration
  - Added `name` extraction from `req.body` in `signUpController` function
  - Added fallback to use `username` if `name` is not provided
  - Prevents `undefined` values being passed to email functions
  - Ensures email templates render correctly with proper user information

- **Email Template Support Email**: Fixed hardcoded developer email in email templates
  - Replaced hardcoded `d.wizard.techno@gmail.com` with configurable `support@linkbridger.com`
  - Added support email replacement logic in `sendWelcomeEmail` function
  - Updated `emailTemplate.js` to use new support email address
  - Support email now configurable via environment variable

### Security - 2024-12-20
- **Email Credentials Security**: Enhanced security by moving credentials to environment variables
  - Removed hardcoded email credentials from `mail.js`
  - Email credentials now stored in environment variables (`EMAIL_USER`, `EMAIL_PASS`)
  - Prevents accidental exposure of credentials in version control
  - Added fallback values for development environments
  - Updated all email functions to use secure credential management

### Added - 2024-12-19
- **Edit Link Endpoint**: New API endpoint for editing existing links
  - Added `editLink` function in `LinkController.js`
  - Endpoint: `POST /source/editlink`
  - Validates user ownership before allowing edits
  - Supports updating both `source` (platform) and `destination` fields
  - Added duplicate source validation when changing platform name
  - Prevents creating duplicate platforms for the same user
  - Uses link ID to identify and update links (flexible and safe)
  - Returns updated link object in response
  - Proper error handling for unauthorized access, missing links, and duplicate sources

- **Route Configuration**: Added edit link route
  - Registered `/editlink` route in `LinkRoute.js`
  - Protected with `verifyToken` middleware
  - Follows same authentication pattern as other routes

### Changed - 2024-12-19
- **Token Verification**: Improved token handling
  - Updated `verifyToken.js` middleware to use optional chaining (`req.cookies?.token`)
  - Added console logging for debugging token issues
  - More robust error handling for missing tokens

- **Error Handling**: Enhanced error responses
  - Improved error messages for better user feedback
  - Better handling of edge cases in user profile routes
  - More descriptive error messages for missing resources

- **Root Route**: Updated root endpoint behavior
  - Changed root route (`/`) to redirect to frontend instead of returning text
  - Redirects to `https://clickly.cv/app/` with 307 status code
  - Added console logging for debugging

- **CORS Configuration**: Updated allowed origins
  - Added `http://localhost:5173` to allowed origins for local development
  - Maintained existing production origins

- **Content Security Policy**: Updated CSP headers
  - Added `https://clickly.cv/*` to `connectSrc` directive
  - Maintained existing security policies

### Fixed - 2024-12-19
- **User Profile Routes**: Fixed error handling for non-existent users
  - Added null checks for user lookup in `/:username` route
  - Added null checks for user lookup in `/:username/:source` route
  - Returns proper 404 page instead of crashing when user doesn't exist
  - Improved error messages and fallback behavior

- **Link Source Routes**: Enhanced error handling
  - Better handling when link source doesn't exist
  - Returns user-friendly error page with available link information
  - Improved error messages for missing links

- **View Templates**: Updated error page template
  - Enhanced `not_exists.ejs` with better styling
  - Added flexbox layout for better centering
  - Added support for displaying available link information
  - Improved visual presentation of 404 errors

### Security - 2024-12-19
- **Authentication**: Enhanced token verification
  - More robust token extraction with optional chaining
  - Better error handling for expired or invalid tokens
  - Improved security for protected routes

- **Authorization**: Added ownership validation
  - Edit link endpoint verifies user owns the link before allowing edits
  - Prevents unauthorized access to other users' links
  - Returns 403 Forbidden for unauthorized edit attempts

## [Previous Versions]

### Initial Release
- User authentication system with JWT tokens
- Link creation and management
- User profile management
- Email notifications for link clicks
- Device information extraction
- Cookie-based session management
- CORS configuration for frontend access
- Helmet.js security headers
- MongoDB integration with Mongoose

