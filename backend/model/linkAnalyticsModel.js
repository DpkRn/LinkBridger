const mongoose = require('mongoose');

const linkAnalyticsSchema = new mongoose.Schema({
    linkId: {
        type: String,
        required: true,
        ref: 'link',
        index: true // Index for faster queries
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        index: true // Index for faster queries
    },
    username: {
        type: String,
        required: true,
        index: true // Index for faster queries
    },
    clickDate: {
        type: Date,
        required: true,
        default: Date.now,
        index: true // Index for date-based queries
    },
    // Detailed timestamp information
    timestamp: {
        date: {
            type: String, // ISO date string (YYYY-MM-DD)
            default: function() {
                return new Date().toISOString().split('T')[0];
            }
        },
        time: {
            type: String, // Time string (HH:MM:SS)
            default: function() {
                const now = new Date();
                return now.toTimeString().split(' ')[0];
            }
        },
        datetime: {
            type: String, // Full datetime string (YYYY-MM-DD HH:MM:SS)
            default: function() {
                const now = new Date();
                const date = now.toISOString().split('T')[0];
                const time = now.toTimeString().split(' ')[0];
                return `${date} ${time}`;
            }
        },
        unixTimestamp: {
            type: Number, // Unix timestamp in milliseconds
            default: Date.now
        },
        timezone: {
            type: String, // Timezone (e.g., "UTC", "America/New_York")
            default: 'UTC'
        },
        timezoneOffset: {
            type: Number, // Timezone offset in minutes
            default: function() {
                return new Date().getTimezoneOffset();
            }
        }
    },
    // Location information
    location: {
        country: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        region: {
            type: String,
            default: null
        },
        ipAddress: {
            type: String,
            default: null
        }
    },
    // Device information
    device: {
        type: {
            type: String, // mobile, desktop, tablet
            enum: ['mobile', 'desktop', 'tablet', 'unknown'],
            default: 'unknown'
        },
        brand: {
            type: String, // Apple, Samsung, etc.
            default: null
        },
        model: {
            type: String,
            default: null
        }
    },
    // Operating System information
    os: {
        name: {
            type: String, // Windows, macOS, iOS, Android, Linux
            default: null
        },
        version: {
            type: String,
            default: null
        }
    },
    // Browser information
    browser: {
        name: {
            type: String, // Chrome, Firefox, Safari, Edge
            default: null
        },
        version: {
            type: String,
            default: null
        }
    },
    // Additional metadata
    referrer: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

// Compound indexes for common query patterns
linkAnalyticsSchema.index({ linkId: 1, clickDate: -1 }); // Get clicks for a link ordered by date
linkAnalyticsSchema.index({ userId: 1, clickDate: -1 }); // Get clicks for a user ordered by date
linkAnalyticsSchema.index({ linkId: 1, deletedAt: 1 }); // Soft delete queries
linkAnalyticsSchema.index({ userId: 1, deletedAt: 1 }); // Soft delete queries for user

// Pre-save middleware to update timestamp fields when document is created
linkAnalyticsSchema.pre('save', function(next) {
    if (this.isNew) {
        const now = new Date();
        
        // Update clickDate if not set
        if (!this.clickDate) {
            this.clickDate = now;
        }
        
        // Get timezone (with fallback for environments that don't support Intl)
        let timezone = 'UTC';
        try {
            if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
                timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            }
        } catch (e) {
            timezone = 'UTC';
        }
        
        // Update timestamp fields
        this.timestamp = {
            date: now.toISOString().split('T')[0], // YYYY-MM-DD
            time: now.toTimeString().split(' ')[0], // HH:MM:SS
            datetime: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`, // YYYY-MM-DD HH:MM:SS
            unixTimestamp: now.getTime(), // Unix timestamp in milliseconds
            timezone: timezone,
            timezoneOffset: now.getTimezoneOffset() // Offset in minutes
        };
    }
    next();
});

// Virtual for formatted date display
linkAnalyticsSchema.virtual('formattedDate').get(function() {
    if (!this.clickDate) return null;
    return this.clickDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
});

// Virtual for ISO string
linkAnalyticsSchema.virtual('isoString').get(function() {
    if (!this.clickDate) return null;
    return this.clickDate.toISOString();
});

// Virtual for total clicks count (can be used for aggregation)
// TODO: Fix this when implementing analytics functionality
// Issue: countDocuments is a model method, not available on document instances
// Should use: this.constructor.countDocuments() or implement as static method
// linkAnalyticsSchema.virtual('totalClicks').get(function() {
//     return this.constructor.countDocuments({ linkId: this.linkId, deletedAt: null });
// });

// Method to get full timestamp information
linkAnalyticsSchema.methods.getFullTimestamp = function() {
    const date = this.clickDate || new Date();
    
    // Get timezone (with fallback)
    let timezone = 'UTC';
    try {
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        }
    } catch (e) {
        timezone = 'UTC';
    }
    
    return {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0],
        datetime: `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`,
        unixTimestamp: date.getTime(),
        isoString: date.toISOString(),
        formatted: date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }),
        timezone: timezone,
        timezoneOffset: date.getTimezoneOffset(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
        // Additional formatted versions
        dateOnly: date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        }),
        timeOnly: date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        }),
        // UTC versions
        utcDate: date.toUTCString(),
        utcISO: date.toISOString()
    };
};

const LinkAnalytics = mongoose.model('linkAnalytics', linkAnalyticsSchema);

module.exports = LinkAnalytics;
