# User Settings Model Documentation

## Overview
The User Settings model stores privacy and visibility preferences for users. It controls what information is visible to other users, which links appear in search results, and various privacy settings. This model is essential for the search and public profile features.

## Model Name
`userSettings` (collection name in MongoDB)

## Schema Fields

### `userId` (ObjectId, Required, Unique)
- **Type**: mongoose.Schema.Types.ObjectId
- **Required**: Yes
- **Unique**: Yes
- **Ref**: `user`
- **Indexed**: Yes
- **Purpose**: Foreign key reference to the User model. Links settings to a specific user account. One settings document per user.
- **Example**: `ObjectId("507f1f77bcf86cd799439011")`
- **Why Required**: Essential for associating settings with users. Must be unique to ensure one settings document per user.

### `username` (String, Required, Unique)
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Ref**: `user`
- **Indexed**: Yes
- **Purpose**: Username of the user. Stored redundantly for faster queries without joins. Used for username-based settings lookups.
- **Example**: `"johndoe"`
- **Why Required**: Allows quick username-based queries. Must match the User model's username.

## Profile Visibility Settings

### `profile.isPublic` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Master switch for profile visibility. When `true`, the profile can be viewed by others (subject to other settings). When `false`, profile is private.
- **Why Optional**: Defaults to private for user privacy. Users must explicitly opt-in to make profiles public.

### `profile.showInSearch` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether the profile appears in search results. Even if `isPublic` is true, the profile won't appear in search unless this is also `true`.
- **Why Optional**: Users may want public profiles but not in search results. Provides granular control.

### `profile.allowProfileView` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Allows other users to view the full profile page. When `false`, even if profile is public, it may not be fully accessible.
- **Why Optional**: Additional privacy layer. Users can control profile page access separately from search visibility.

### `profile.showEmail` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether email is visible on public profile. Should default to false for privacy.
- **Why Optional**: Email is sensitive information. Should be hidden by default.

### `profile.showLocation` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether location is shown on public profile.
- **Why Optional**: Some users may want to hide location for privacy.

### `profile.showBio` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether bio is shown on public profile.
- **Why Optional**: Users may want to hide bio while keeping other info public.

### `profile.showPassion` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether passion/profession is shown on public profile.
- **Why Optional**: Granular control over profile information visibility.

### `profile.showProfileImage` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether profile image is shown on public profile.
- **Why Optional**: Some users may want to hide their profile picture.

## Link Visibility Settings

### `links.defaultVisibility` (String, Optional)
- **Type**: String
- **Enum Values**: `'public'`, `'private'`, `'unlisted'`
- **Default**: `'private'`
- **Purpose**: Global default visibility for all links. Can be overridden per link.
  - `'public'`: Visible to everyone in search and on profile
  - `'private'`: Only visible to the owner
  - `'unlisted'`: Visible via direct link but not in search or on profile
- **Why Optional**: Defaults to private for privacy. Users must explicitly make links public.

### `links.publicLinks` (Array, Optional)
- **Type**: Array of Strings (linkIds)
- **Ref**: `link`
- **Default**: `[]`
- **Purpose**: Array of `linkId`s that are explicitly set to public. These links will be visible in search and on public profiles, regardless of `defaultVisibility`.
- **Example**: `["linkedin", "github", "twitter"]`
- **Why Optional**: Not all links need to be public. Empty array means no links are explicitly public.

### `links.unlistedLinks` (Array, Optional)
- **Type**: Array of Strings (linkIds)
- **Ref**: `link`
- **Default**: `[]`
- **Purpose**: Array of `linkId`s that are unlisted. These links are accessible via direct URL but won't appear in search results or on public profiles.
- **Example**: `["personal-blog", "private-portfolio"]`
- **Why Optional**: Not all links need special handling. Empty array by default.

### `links.showLinkCount` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether the total number of links is shown on public profile.
- **Why Optional**: Some users may want to hide link count for privacy.

### `links.showClickStats` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether click statistics are shown on public profile. Should default to false for privacy.
- **Why Optional**: Click statistics are sensitive business metrics. Should be private by default.

## Search & Discovery Settings

### `search.allowSearch` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Master switch for search visibility. When `true` and `profile.isPublic` is true, the profile can appear in search results.
- **Why Optional**: Users must explicitly opt-in to search visibility.

### `search.showInFeatured` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether profile appears in "featured" or "popular" sections. Typically requires admin approval.
- **Why Optional**: Featured status is usually curated, not user-controlled.

### `search.searchKeywords` (Array, Optional)
- **Type**: Array of Strings
- **Default**: `[]`
- **Purpose**: Custom keywords/tags for better searchability. Helps users find profiles by topics, skills, or interests.
- **Example**: `["developer", "javascript", "react", "open-source"]`
- **Why Optional**: Not required for basic search. Enhances discoverability.

## Privacy Settings

### `privacy.showAnalytics` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether analytics data is visible to public. Should default to false.
- **Why Optional**: Analytics are sensitive. Should be private by default.

### `privacy.showLastUpdated` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Controls whether "last updated" timestamp is shown on public profile.
- **Why Optional**: Some users may not want to reveal activity patterns.

### `privacy.requireAuth` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: When `true`, requires users to be logged in to view the profile. Adds an extra privacy layer.
- **Why Optional**: Most profiles are viewable without authentication. This is an advanced privacy option.

## Notification Settings

### `notifications.emailOnNewClick` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Sends email notification when a link receives a new click.
- **Why Optional**: Can be noisy. Users opt-in if they want notifications.

### `notifications.emailOnProfileView` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Sends email notification when profile is viewed.
- **Why Optional**: Can be very noisy. Should be opt-in only.

### `notifications.weeklyReport` (Boolean, Optional)
- **Type**: Boolean
- **Default**: `false`
- **Purpose**: Sends weekly analytics report via email.
- **Why Optional**: Users opt-in for weekly summaries.

### `deletedAt` (Date, Optional)
- **Type**: Date
- **Default**: `null`
- **Purpose**: Soft delete field. When settings are deleted, this field is set instead of removing the record.
- **Why Optional**: Settings are active by default.

### `createdAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes
- **Purpose**: Timestamp when settings were created.

### `updatedAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes
- **Purpose**: Timestamp when settings were last modified.

## Indexes

### Single Field Indexes
- `userId`: For fast user-based queries
- `username`: For fast username-based queries

### Compound Indexes
- `{ username: 1, deletedAt: 1 }`: For active settings queries
- `{ userId: 1, deletedAt: 1 }`: For active settings queries
- `{ 'profile.isPublic': 1, 'search.allowSearch': 1 }`: For finding searchable profiles

## Instance Methods

### `isLinkPublic(linkId)`
Checks if a specific link is visible to public.

**Parameters**:
- `linkId` (String): The linkId to check

**Returns**: Boolean

**Logic**:
1. If linkId is in `publicLinks` array → returns `true`
2. If `defaultVisibility` is `'public'` and linkId is not in `unlistedLinks` → returns `true`
3. Otherwise → returns `false`

### `isLinkUnlisted(linkId)`
Checks if a link is unlisted.

**Parameters**:
- `linkId` (String): The linkId to check

**Returns**: Boolean

### `isSearchable()`
Checks if profile should appear in search results.

**Returns**: Boolean

**Logic**: Returns `true` if:
- `profile.isPublic` is `true`
- `search.allowSearch` is `true`
- `deletedAt` is `null`

### `getPublicLinks(allLinks)`
Filters an array of links to return only public ones.

**Parameters**:
- `allLinks` (Array): Array of link objects

**Returns**: Array of public link objects

## Static Methods

### `getUserSettings(userIdOrUsername, userData)`
Gets or creates settings for a user.

**Parameters**:
- `userIdOrUsername` (String|ObjectId): User ID or username
- `userData` (Object, Optional): User object with `_id` or `username` to avoid extra queries

**Returns**: UserSettings document

**Behavior**:
- If settings exist, returns them
- If not, creates default settings
- Automatically fetches missing userId/username from User model if needed

## Usage Examples

### Getting User Settings
```javascript
const settings = await UserSettings.getUserSettings('johndoe');
// or
const settings = await UserSettings.getUserSettings(userId);
```

### Making Profile Public and Searchable
```javascript
const settings = await UserSettings.getUserSettings('johndoe');
settings.profile.isPublic = true;
settings.search.allowSearch = true;
await settings.save();
```

### Making Specific Links Public
```javascript
const settings = await UserSettings.getUserSettings('johndoe');
if (!settings.links.publicLinks.includes('linkedin')) {
  settings.links.publicLinks.push('linkedin');
}
await settings.save();
```

### Checking Link Visibility
```javascript
const settings = await UserSettings.getUserSettings('johndoe');
const isPublic = settings.isLinkPublic('linkedin');
```

### Finding Searchable Profiles
```javascript
const searchableProfiles = await UserSettings.find({
  'profile.isPublic': true,
  'search.allowSearch': true,
  deletedAt: null
});
```

## Notes
- Always use `getUserSettings()` to ensure settings exist
- Default visibility is private for security
- Link visibility can be controlled globally or per-link
- Settings are created automatically when first accessed
- Always filter by `deletedAt: null` when querying active settings
- Consider caching settings for frequently accessed users
