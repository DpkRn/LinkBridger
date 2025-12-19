# Backend Integration Summary

This document summarizes all the backend endpoints and integrations that have been implemented to support the frontend features.

## ✅ Completed Integrations

### 1. Settings Page (`/settings`)

**Backend Endpoints:**
- `POST /settings/get` - Get user settings
- `POST /settings/update` - Update user settings

**Controller:** `SettingsController.js`
- `getSettings()` - Retrieves or creates default settings for user
- `updateSettings()` - Updates user settings with validation

**Route:** `SettingsRoute.js`
- Protected routes (requires authentication via `verifyToken`)

**Frontend Integration:**
- `Settings.jsx` already uses these endpoints
- Loads settings on mount
- Saves settings on button click

---

### 2. Search Functionality (Navbar)

**Backend Endpoint:**
- `POST /search/users` - Search for users

**Controller:** `SearchController.js`
- `searchUsers()` - Searches users by username or name
- Filters results based on user settings (isPublic + allowSearch)
- Returns only searchable profiles
- Includes profile images

**Route:** `SearchRoute.js`
- Public route (no authentication required)

**Frontend Integration:**
- `Nav.jsx` already uses `/search/users` endpoint
- Debounced search (300ms)
- Shows results in dropdown
- Click to visit profile

---

### 3. Profile Preview (`/profile/:username`)

**Backend Endpoint:**
- `POST /profile/getpublicprofile` - Get public profile data

**Controller:** `ProfileController.js`
- `getPublicProfile()` - Returns public profile with:
  - Profile information (filtered by settings)
  - Only public links
  - Settings for display control
  - Stats (if enabled)

**Route:** `ProfileRoute.js`
- Public route (no authentication required)

**Frontend Integration:**
- `ProfilePreview.jsx` already uses `/profile/getpublicprofile`
- Respects all visibility settings
- Shows only public links
- Displays stats based on settings

---

### 4. Link Visibility Controls

**Backend Endpoint:**
- `POST /source/updatevisibility` - Update link visibility

**Controller:** `LinkController.js`
- `updateVisibility()` - Updates link visibility (public/unlisted/private)
- Handles password hashing for unlisted links
- Validates user ownership
- Clears password for public/private links

**Route:** `LinkRoute.js`
- Protected route (requires authentication)

**Frontend Integration:**
- `Linkcard.jsx` already uses `/source/updatevisibility`
- Dropdown menu for visibility selection
- Updates Redux state on success
- Visual indicators for visibility status

---

### 5. Link Model Enhancements

**Changes:**
- Added `linkId` field (unique, required) - Generated automatically
- Added `visibility` field (enum: public/unlisted/private)
- Added `password` field (for unlisted links)
- Added `deletedAt` field (soft delete)
- Pre-save hook to generate `linkId` if missing

**Controller Updates:**
- `addNewSource()` - Generates `linkId` when creating links
- `getAllSource()` - Returns `visibility` and `linkId` fields
- Filters out deleted links (`deletedAt: null`)

---

## 📋 API Endpoints Reference

### Settings Endpoints

```
POST /settings/get
Body: { username?: string }
Response: { success: boolean, settings: UserSettings }
Auth: Required

POST /settings/update
Body: { username, profile?, links?, search?, privacy?, notifications? }
Response: { success: boolean, settings: UserSettings }
Auth: Required
```

### Search Endpoints

```
POST /search/users
Body: { query: string }
Response: { success: boolean, results: User[] }
Auth: Not required (public)
```

### Profile Endpoints

```
POST /profile/getpublicprofile
Body: { username: string }
Response: { success: boolean, profile, links, settings, stats }
Auth: Not required (public)
```

### Link Endpoints

```
POST /source/updatevisibility
Body: { id: string, visibility: 'public'|'unlisted'|'private', password?: string }
Response: { success: boolean, link: Link }
Auth: Required
```

---

## 🔒 Security Features

1. **Authentication**: All user-specific endpoints require JWT token
2. **Authorization**: Users can only modify their own data
3. **Password Hashing**: Unlisted link passwords are hashed with bcrypt
4. **Input Validation**: All endpoints validate required fields
5. **Privacy Controls**: Profile visibility respects user settings

---

## 🗄️ Database Models Used

1. **UserSettings** - Privacy and visibility settings
2. **User** - User authentication and basic info
3. **UserProfile** - Extended profile information
4. **Link** - Link data with visibility controls

---

## 🔄 Data Flow

### Settings Flow
1. User opens Settings page
2. Frontend calls `GET /settings/get`
3. Backend returns or creates default settings
4. User modifies settings
5. Frontend calls `POST /settings/update`
6. Backend updates and saves settings

### Search Flow
1. User types in search box
2. Frontend debounces and calls `POST /search/users`
3. Backend searches users and filters by settings
4. Backend returns searchable profiles
5. Frontend displays results in dropdown

### Profile Preview Flow
1. Visitor navigates to `/profile/:username`
2. Frontend calls `POST /profile/getpublicprofile`
3. Backend checks if profile is public
4. Backend returns profile data with only public links
5. Frontend displays based on visibility settings

### Link Visibility Flow
1. User clicks visibility button on link card
2. User selects new visibility (public/unlisted/private)
3. Frontend calls `POST /source/updatevisibility`
4. Backend validates ownership and updates
5. Frontend updates Redux state

---

## 🐛 Error Handling

All endpoints include proper error handling:
- 400: Bad Request (missing/invalid data)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

## 📝 Notes

1. **linkId Generation**: Automatically generated using crypto.randomBytes()
2. **Default Settings**: Created automatically on first access
3. **Search Privacy**: Only shows profiles with `isPublic=true` AND `allowSearch=true`
4. **Link Visibility**: Default is 'public' for new links
5. **Soft Deletes**: All models support soft deletes via `deletedAt` field

---

## ✅ Testing Checklist

- [x] Settings page loads and saves correctly
- [x] Search functionality works with privacy settings
- [x] Profile preview respects all visibility settings
- [x] Link visibility can be changed
- [x] Only public links show in profile preview
- [x] Authentication required for protected endpoints
- [x] Error handling works correctly
- [x] linkId is generated for new links

---

**Last Updated**: 2024-12-XX
**Status**: ✅ All endpoints implemented and wired up
