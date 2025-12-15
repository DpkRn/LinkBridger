# Changelog

All notable changes to the backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-19
- **Edit Link Endpoint**: New API endpoint for editing existing links
  - Added `editLink` function in `LinkController.js`
  - Endpoint: `POST /source/editlink`
  - Validates user ownership before allowing edits
  - Supports updating both `source` and `destination` fields
  - Returns updated link object in response
  - Proper error handling for unauthorized access and missing links

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

