# Link Analytics Model Documentation

## Overview
The Link Analytics model stores detailed information about every click on user links. This includes timestamp data, device information, location, browser details, and more. Used for comprehensive analytics and reporting.

## Model Name
`linkAnalytics` (collection name in MongoDB)

## Schema Fields

### `linkId` (String, Required)
- **Type**: String
- **Required**: Yes
- **Indexed**: Yes
- **Ref**: `link`
- **Purpose**: Foreign key reference to the Link model. Identifies which link was clicked. Used to aggregate all clicks for a specific link.
- **Example**: `"linkedin"`, `"github"`
- **Why Required**: Essential for linking analytics data to specific links and querying click history for a link.

### `userId` (ObjectId, Required)
- **Type**: mongoose.Schema.Types.ObjectId
- **Required**: Yes
- **Indexed**: Yes
- **Ref**: `user`
- **Purpose**: Foreign key reference to the User model. Identifies which user owns the link that was clicked. Used for user-level analytics aggregation.
- **Example**: `ObjectId("507f1f77bcf86cd799439011")`
- **Why Required**: Enables efficient user-based analytics queries and reporting.

### `username` (String, Required)
- **Type**: String
- **Required**: Yes
- **Indexed**: Yes
- **Purpose**: Username of the link owner. Stored redundantly for faster queries without joins. Used for filtering analytics by username.
- **Example**: `"johndoe"`
- **Why Required**: Allows quick username-based queries without joining the User collection.

### `clickDate` (Date, Required)
- **Type**: Date
- **Required**: Yes
- **Default**: `Date.now`
- **Indexed**: Yes
- **Purpose**: The exact date and time when the click occurred. Primary timestamp for all analytics queries. Stored with millisecond precision.
- **Example**: `2024-01-15T14:30:45.123Z`
- **Why Required**: Core field for time-based analytics, sorting, and filtering clicks by date/time.

### `timestamp` (Object, Auto-generated)
- **Type**: Object containing detailed timestamp information
- **Auto-generated**: Yes (via pre-save middleware)
- **Purpose**: Provides multiple formatted versions of the click timestamp for easy display and querying without date manipulation.

#### `timestamp.date` (String)
- **Format**: `YYYY-MM-DD`
- **Example**: `"2024-01-15"`
- **Purpose**: Date-only string for date-based grouping and filtering.

#### `timestamp.time` (String)
- **Format**: `HH:MM:SS`
- **Example**: `"14:30:45"`
- **Purpose**: Time-only string for time-based analysis.

#### `timestamp.datetime` (String)
- **Format**: `YYYY-MM-DD HH:MM:SS`
- **Example**: `"2024-01-15 14:30:45"`
- **Purpose**: Human-readable full datetime string.

#### `timestamp.unixTimestamp` (Number)
- **Format**: Unix timestamp in milliseconds
- **Example**: `1705332645123`
- **Purpose**: Numeric timestamp for calculations and comparisons.

#### `timestamp.timezone` (String)
- **Example**: `"America/New_York"`, `"UTC"`, `"Asia/Tokyo"`
- **Purpose**: Detected timezone of the server/environment when click was recorded.

#### `timestamp.timezoneOffset` (Number)
- **Format**: Minutes offset from UTC
- **Example**: `300` (UTC-5), `-60` (UTC+1)
- **Purpose**: Timezone offset for accurate time conversion.

### `location` (Object, Optional)
- **Type**: Object
- **Required**: No
- **Purpose**: Geographic information about where the click originated.

#### `location.country` (String, Optional)
- **Example**: `"United States"`, `"India"`, `"United Kingdom"`
- **Purpose**: Country where the click originated. Useful for geographic analytics.

#### `location.city` (String, Optional)
- **Example**: `"New York"`, `"Mumbai"`, `"London"`
- **Purpose**: City where the click originated. Provides more granular location data.

#### `location.region` (String, Optional)
- **Example**: `"New York"`, `"Maharashtra"`, `"England"`
- **Purpose**: State/province/region information.

#### `location.ipAddress` (String, Optional)
- **Example**: `"192.168.1.1"`, `"2001:0db8:85a3:0000:0000:8a2e:0370:7334"`
- **Purpose**: IP address of the clicker. Used for location detection and fraud prevention. Should be handled according to privacy regulations.

### `device` (Object, Optional)
- **Type**: Object
- **Required**: No
- **Purpose**: Information about the device used to click the link.

#### `device.type` (String, Optional)
- **Enum Values**: `'mobile'`, `'desktop'`, `'tablet'`, `'unknown'`
- **Default**: `'unknown'`
- **Purpose**: Type of device. Used for device-based analytics and responsive design insights.

#### `device.brand` (String, Optional)
- **Example**: `"Apple"`, `"Samsung"`, `"Google"`
- **Purpose**: Device manufacturer/brand.

#### `device.model` (String, Optional)
- **Example**: `"iPhone 14 Pro"`, `"Galaxy S23"`, `"Pixel 7"`
- **Purpose**: Specific device model.

### `os` (Object, Optional)
- **Type**: Object
- **Required**: No
- **Purpose**: Operating system information.

#### `os.name` (String, Optional)
- **Example**: `"Windows"`, `"macOS"`, `"iOS"`, `"Android"`, `"Linux"`
- **Purpose**: Operating system name. Used for OS-based analytics.

#### `os.version` (String, Optional)
- **Example**: `"14.2"`, `"13.0"`, `"Windows 11"`
- **Purpose**: OS version for more detailed analytics.

### `browser` (Object, Optional)
- **Type**: Object
- **Required**: No
- **Purpose**: Browser information.

#### `browser.name` (String, Optional)
- **Example**: `"Chrome"`, `"Firefox"`, `"Safari"`, `"Edge"`
- **Purpose**: Browser name. Used for browser compatibility insights.

#### `browser.version` (String, Optional)
- **Example**: `"120.0.0.0"`, `"119.0"`
- **Purpose**: Browser version.

### `referrer` (String, Optional)
- **Type**: String
- **Required**: No
- **Purpose**: The URL of the page that referred the user to the link. Useful for understanding traffic sources.
- **Example**: `"https://twitter.com"`, `"https://google.com"`

### `userAgent` (String, Optional)
- **Type**: String
- **Required**: No
- **Purpose**: Full user agent string from the HTTP request. Used for parsing device, OS, and browser information.
- **Example**: `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."`

### `deletedAt` (Date, Optional)
- **Type**: Date
- **Required**: No
- **Default**: `null`
- **Purpose**: Soft delete field. When an analytics record is deleted, this field is set instead of removing the record. Allows for data retention and recovery.

### `createdAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp when the analytics record was created. Should match `clickDate` for new records.

### `updatedAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp when the record was last modified. Rarely changes after creation.

## Indexes

### Single Field Indexes
- `linkId`: For fast queries by link
- `userId`: For fast queries by user
- `username`: For fast queries by username
- `clickDate`: For date-based queries

### Compound Indexes
- `{ linkId: 1, clickDate: -1 }`: Get clicks for a link ordered by date (descending)
- `{ userId: 1, clickDate: -1 }`: Get clicks for a user ordered by date (descending)
- `{ linkId: 1, deletedAt: 1 }`: Soft delete queries for specific links
- `{ userId: 1, deletedAt: 1 }`: Soft delete queries for specific users

## Virtual Fields

### `formattedDate` (Virtual)
- **Type**: String
- **Format**: Human-readable formatted date
- **Example**: `"January 15, 2024, 02:30:45 PM"`
- **Purpose**: Easy-to-read date format for display in UI.

### `isoString` (Virtual)
- **Type**: String
- **Format**: ISO 8601 string
- **Example**: `"2024-01-15T14:30:45.123Z"`
- **Purpose**: Standard ISO format for API responses.

## Instance Methods

### `getFullTimestamp()`
Returns a comprehensive timestamp object with all formatted versions and components.

**Returns**:
```javascript
{
  date: "2024-01-15",
  time: "14:30:45",
  datetime: "2024-01-15 14:30:45",
  unixTimestamp: 1705332645123,
  isoString: "2024-01-15T14:30:45.123Z",
  formatted: "January 15, 2024, 02:30:45 PM",
  timezone: "America/New_York",
  timezoneOffset: 300,
  year: 2024,
  month: 1,
  day: 15,
  hour: 14,
  minute: 30,
  second: 45,
  millisecond: 123,
  dayOfWeek: "Monday",
  dateOnly: "01/15/2024",
  timeOnly: "02:30:45 PM",
  utcDate: "Mon, 15 Jan 2024 14:30:45 GMT",
  utcISO: "2024-01-15T14:30:45.123Z"
}
```

## Relationships
- **Belongs to**: Link (via `linkId`)
- **Belongs to**: User (via `userId`)

## Usage Examples

### Creating an Analytics Record
```javascript
const analytics = new LinkAnalytics({
  linkId: 'linkedin',
  userId: user._id,
  username: 'johndoe',
  clickDate: new Date(),
  location: {
    country: 'United States',
    city: 'New York',
    ipAddress: '192.168.1.1'
  },
  device: {
    type: 'mobile',
    brand: 'Apple',
    model: 'iPhone 14'
  },
  os: {
    name: 'iOS',
    version: '17.0'
  },
  browser: {
    name: 'Safari',
    version: '17.0'
  },
  referrer: 'https://twitter.com',
  userAgent: req.headers['user-agent']
});
await analytics.save();
```

### Querying Clicks for a Link
```javascript
const clicks = await LinkAnalytics.find({ 
  linkId: 'linkedin',
  deletedAt: null 
}).sort({ clickDate: -1 });
```

### Getting Full Timestamp Information
```javascript
const analytics = await LinkAnalytics.findById(id);
const timestamp = analytics.getFullTimestamp();
console.log(timestamp.formatted); // "January 15, 2024, 02:30:45 PM"
```

## Notes
- The `timestamp` object is automatically populated by pre-save middleware
- Always filter by `deletedAt: null` when querying active records
- IP addresses should be handled according to GDPR/privacy regulations
- Consider data retention policies for analytics records
- The model supports high-volume writes (many clicks per second)
