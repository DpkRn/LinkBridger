const mongoose = require('mongoose');

const linkAnalyticsSchema = new mongoose.Schema(
  {
    /* =========================
       Core References
    ========================= */
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'link',
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
      index: true
    },
    username: {
      type: String,
      required: true,
      index: true
    },

    /* =========================
       Click Date (SOURCE OF TRUTH)
    ========================= */
    clickDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },

    /* =========================
       Clicked Time (DERIVED)
    ========================= */
    clickedTime: {
      iso: {
        type: String, // 2025-01-27T12:34:56.789Z
        default: () => new Date().toISOString()
      },
      date: {
        type: String, // YYYY-MM-DD
        default: () => new Date().toISOString().split('T')[0]
      },
      time: {
        type: String, // HH:MM:SS
        default: () => new Date().toTimeString().split(' ')[0]
      },
      datetime: {
        type: String, // YYYY-MM-DD HH:MM:SS
        default: () => {
          const now = new Date();
          return `${now.toISOString().split('T')[0]} ${now
            .toTimeString()
            .split(' ')[0]}`;
        }
      },
      unixTimestamp: {
        type: Number,
        default: () => Date.now()
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      timezoneOffset: {
        type: Number,
        default: () => new Date().getTimezoneOffset()
      }
    },

    /* =========================
       Location
    ========================= */
    location: {
      country: { type: String, default: null },
      city: { type: String, default: null },
      region: { type: String, default: null },
      ipAddress: { type: String, default: null }
    },

    /* =========================
       Device
    ========================= */
    device: {
      type: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown'
      },
      brand: { type: String, default: null },
      model: { type: String, default: null }
    },

    /* =========================
       OS
    ========================= */
    os: {
      name: { type: String, default: null },
      version: { type: String, default: null }
    },

    /* =========================
       Browser
    ========================= */
    browser: {
      name: { type: String, default: null },
      version: { type: String, default: null }
    },

    /* =========================
       Meta
    ========================= */
    referrer: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },

    seen: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

/* =========================
   Indexes
========================= */
linkAnalyticsSchema.index({ linkId: 1, clickDate: -1 });
linkAnalyticsSchema.index({ userId: 1, clickDate: -1 });
linkAnalyticsSchema.index({ username: 1, clickDate: -1 });
linkAnalyticsSchema.index({ linkId: 1, deletedAt: 1 });
linkAnalyticsSchema.index({ userId: 1, deletedAt: 1 });

/* =========================
   Pre-save Hook
========================= */
linkAnalyticsSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  const now = this.clickDate || new Date();

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {}

  this.clickedTime = {
    iso: now.toISOString(), // ⭐ REQUIRED FORMAT
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    datetime: `${now.toISOString().split('T')[0]} ${now
      .toTimeString()
      .split(' ')[0]}`,
    unixTimestamp: now.getTime(),
    timezone,
    timezoneOffset: now.getTimezoneOffset()
  };

  next();
});

/* =========================
   Virtuals
========================= */
linkAnalyticsSchema.virtual('formattedDate').get(function () {
  if (!this.clickDate) return null;
  return this.clickDate.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
});

linkAnalyticsSchema.virtual('isoString').get(function () {
  return this.clickDate ? this.clickDate.toISOString() : null;
});

/* =========================
   Instance Method
========================= */
linkAnalyticsSchema.methods.getFullTimestamp = function () {
  const date = this.clickDate || new Date();

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {}

  return {
    iso: date.toISOString(),
    unix: date.getTime(),
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0],
    timezone,
    offset: date.getTimezoneOffset()
  };
};

const LinkAnalytics = mongoose.model('linkAnalytics', linkAnalyticsSchema);

module.exports = LinkAnalytics;
