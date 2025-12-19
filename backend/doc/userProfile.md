# User Profile Model Documentation

## Overview
The User Profile model stores public-facing profile information for users. This includes display name, bio, location, passion, and profile image. This data is separate from authentication data and is used for public profile pages and search features.

## Model Name
`userinfo` (collection name in MongoDB)

## Schema Fields

### `username` (String, Required, Unique)
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Ref**: `user`
- **Purpose**: Foreign key reference to the User model. Links the profile to the user account. Used as the primary identifier for profile lookups.
- **Example**: `"johndoe"`, `"jane_smith"`
- **Why Required**: Essential for linking profile data to user accounts. Must be unique (one profile per user). Used in URL generation for public profiles.

### `name` (String, Optional)
- **Type**: String
- **Required**: No
- **Default**: `""` (empty string)
- **Purpose**: User's display name or full name. Shown on public profile pages and in search results. Can differ from the username.
- **Example**: `"John Doe"`, `"Jane Smith"`, `"Dr. Sarah Johnson"`
- **Why Optional**: Users may want to set up their account first and add their name later. Empty string allows the field to exist but be empty.

### `passion` (String, Optional)
- **Type**: String
- **Required**: No
- **Default**: `""` (empty string)
- **Purpose**: A short description of what the user is passionate about or their profession. Used for:
  - Profile personalization
  - Search keywords
  - Display on public profiles
- **Example**: `"Software Engineer"`, `"Digital Artist"`, `"Entrepreneur"`
- **Why Optional**: Not all users may want to share this information. Can be added later.

### `bio` (String, Optional)
- **Type**: String
- **Required**: No
- **Default**: `""` (empty string)
- **Purpose**: Longer description about the user. Can include:
  - Professional background
  - Interests
  - Personal information
  - Links to other profiles
- **Example**: `"Full-stack developer passionate about creating beautiful web experiences. Love open source and coffee."`
- **Why Optional**: Users may not want to write a bio immediately. Can be a longer text field (consider textarea in UI).

### `location` (String, Optional)
- **Type**: String
- **Required**: No
- **Default**: `""` (empty string)
- **Purpose**: User's location. Can be:
  - City and country
  - Just city
  - Just country
  - Any location format
- **Example**: `"New York, USA"`, `"London, UK"`, `"Mumbai, India"`
- **Why Optional**: Privacy concerns - some users may not want to share their location.

### `image` (String, Optional)
- **Type**: String
- **Required**: No
- **Default**: `"profile.jpg"`
- **Purpose**: URL or path to the user's profile picture. Can be:
  - Relative path to uploaded image
  - Full URL to external image
  - Default placeholder image
- **Example**: `"profile.jpg"`, `"/uploads/profiles/user123.jpg"`, `"https://example.com/avatar.jpg"`
- **Why Optional**: Users may not have a profile picture initially. Default value provides a fallback.

### `deletedAt` (Date, Optional)
- **Type**: Date
- **Required**: No
- **Default**: `null`
- **Purpose**: Soft delete field. When a profile is deleted, this field is set to the deletion timestamp instead of removing the record. Allows for:
  - Profile recovery
  - Data retention
  - Audit trails
- **Example**: `2024-01-15T10:30:00.000Z` or `null`
- **Why Optional**: Profiles are active by default. Only set when a profile is deleted.

### `createdAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the profile was created. Usually matches the user account creation time.
- **Example**: `2024-01-15T10:30:00.000Z`

### `updatedAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the profile was last modified. Updated whenever profile information is changed.
- **Example**: `2024-01-15T10:30:00.000Z`

## Indexes
- `username`: Automatically indexed due to `unique: true`
- Consider adding index on `deletedAt` for soft delete queries

## Relationships
- **Belongs to**: User (via `username`)
- **Related to**: UserSettings (controls profile visibility)

## Privacy Considerations
- Profile visibility is controlled by the UserSettings model
- Some fields may be hidden based on user privacy settings
- Consider GDPR compliance for profile data

## Usage Examples

### Creating a Profile
```javascript
const profile = new UserProfile({
  username: 'johndoe',
  name: 'John Doe',
  passion: 'Software Engineer',
  bio: 'Full-stack developer passionate about creating beautiful web experiences.',
  location: 'New York, USA',
  image: 'profile.jpg'
});
await profile.save();
```

### Updating Profile
```javascript
const profile = await UserProfile.findOne({ username: 'johndoe' });
profile.name = 'John A. Doe';
profile.bio = 'Updated bio text';
await profile.save();
```

### Finding Public Profiles
```javascript
// Note: Actual visibility should be checked against UserSettings
const profiles = await UserProfile.find({ 
  deletedAt: null 
});
```

### Soft Delete Profile
```javascript
profile.deletedAt = new Date();
await profile.save();
```

## Notes
- Always filter by `deletedAt: null` when querying active profiles
- Profile visibility should be checked against UserSettings model
- The `image` field should handle both relative and absolute URLs
- Consider image validation and size limits for uploaded images
- Profile data can be synced with User model's `name` field for consistency
- Empty strings are used instead of null to ensure fields exist in the document
