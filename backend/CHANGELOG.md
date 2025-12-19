# Backend Changelog

All notable changes to the backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-XX

- **Link Model Enhancements**: Added visibility and password fields
  - Added `visibility` field with enum: 'public', 'unlisted', 'private'
  - Default value: 'public'
  - Added `password` field for unlisted link protection (hashed)
  - Added `linkId` field (unique string) for foreign key relationships
  - Added `deletedAt` field for soft deletes
  - Added `createdAt` and `updatedAt` via timestamps
  - Added indexes: `{ userId: 1, visibility: 1, deletedAt: 1 }`
  - Added helper methods: `isAccessible()`, `shouldShowInProfile()`, `shouldShowInSearch()`

- **LinkAnalytics Model**: Comprehensive click tracking model
  - Tracks every click with full timestamp information
  - Location data (country, city, region, IP address)
  - Device information (type, brand, model)
  - Operating system (name, version)
  - Browser information (name, version)
  - Referrer and user agent
  - Full timestamp object with multiple formats
  - Helper method: `getFullTimestamp()` for formatted timestamps
  - Compound indexes for efficient queries
  - Soft delete support

- **UserSettings Model**: Privacy and visibility controls
  - Profile visibility settings (8 toggle options)
  - Link display settings (show count, show stats)
  - Search & discovery settings (allow search, featured, keywords)
  - Privacy settings (analytics, last updated, require auth)
  - Notification settings (email on click, profile view, weekly report)
  - Helper method: `isSearchable()` for profile search
  - Static method: `getUserSettings()` for easy access
  - Automatic settings creation on first access

- **Model Timestamps**: Added to all models
  - `createdAt`: Auto-generated timestamp
  - `updatedAt`: Auto-updated timestamp
  - `deletedAt`: Soft delete timestamp (optional)

- **Model Documentation**: Comprehensive documentation
  - Created `/backend/doc/` folder
  - One markdown file per model
  - Field descriptions with examples
  - Enum values documented
  - Required/optional explanations
  - Usage examples
  - Index information
  - Relationship documentation
  - README.md as index

### Changed - 2024-12-XX

- **Link Model**: Enhanced with visibility controls
  - Changed default visibility from 'private' to 'public'
  - Added password field for unlisted links
  - Added linkId for foreign key relationships

- **User Model**: Added soft delete support
  - Added `deletedAt` field
  - Maintains timestamps (already had)

- **UserProfile Model**: Added soft delete and public profile support
  - Added `deletedAt` field
  - Removed `isPublic` field (moved to UserSettings)
  - Maintains timestamps (already had)

- **UserSettings Model**: Refactored link visibility
  - Removed `links.defaultVisibility`
  - Removed `links.publicLinks` array
  - Removed `links.unlistedLinks` array
  - Removed link visibility methods
  - Kept only display settings (showLinkCount, showClickStats)
  - Link visibility now managed in Link model

### API Endpoints Needed

The following endpoints need to be implemented:

1. **Settings Endpoints**:
   - `POST /settings/get` - Get user settings
   - `POST /settings/update` - Update user settings

2. **Link Visibility Endpoint**:
   - `POST /source/updatevisibility` - Update link visibility

3. **Search Endpoint**:
   - `POST /search/users` - Search for users (returns searchable profiles)

4. **Public Profile Endpoint**:
   - `POST /profile/getpublicprofile` - Get public profile data with settings and public links only

### Notes

- All models now support soft deletes
- Timestamps are automatically managed by Mongoose
- Link visibility is per-link, not global
- UserSettings provides granular privacy controls
- LinkAnalytics provides comprehensive click tracking
