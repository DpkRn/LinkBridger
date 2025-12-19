const mongoose=require('mongoose')
const linkSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'user'
    },
    linkId: {
        type: String,
        unique: true,
        required: true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    notSeen:{
        type:Number,
        default:0
    },
    clicked:{
        type:Number,
        default:0
    },
    visibility: {
        type: String,
        enum: ['public', 'unlisted', 'private'],
        default: 'public',
        required: true,
        index: true
        // public: visible in profile preview, searches by other users, and link hub
        // unlisted: not in link hub, not in profile, but accessible via direct URL with password protection
        // private: not visible anywhere, show "link protected" if accessed directly
    },
    password: {
        type: String,
        default: null,
        // Hashed password for unlisted links (required when visibility is 'unlisted')
        // Should be hashed using bcrypt before storing
        // Only used when visibility is 'unlisted'
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
})

// Index for visibility queries
linkSchema.index({ userId: 1, visibility: 1, deletedAt: 1 });
linkSchema.index({ username: 1, visibility: 1, deletedAt: 1 });

// Pre-save hook to generate linkId if missing
linkSchema.pre('save', async function(next) {
    if (!this.linkId) {
        const crypto = require('crypto');
        let newLinkId;
        let exists = true;
        // Ensure uniqueness
        while (exists) {
            newLinkId = crypto.randomBytes(16).toString('hex');
            const existing = await this.constructor.findOne({ linkId: newLinkId });
            exists = !!existing;
        }
        this.linkId = newLinkId;
    }
    next();
});

// Method to check if link is accessible
linkSchema.methods.isAccessible = function(requirePassword = false) {
    if (this.deletedAt) return false;
    
    if (this.visibility === 'public') {
        return true;
    }
    
    if (this.visibility === 'unlisted') {
        // Unlisted links are accessible but may require password
        return !requirePassword || this.password !== null;
    }
    
    // private links are not accessible
    return false;
};

// Method to check if link should be shown in profile/hub
linkSchema.methods.shouldShowInProfile = function() {
    return this.visibility === 'public' && !this.deletedAt;
};

// Method to check if link should be shown in search
linkSchema.methods.shouldShowInSearch = function() {
    return this.visibility === 'public' && !this.deletedAt;
};

const Link=mongoose.model('link',linkSchema)
module.exports=Link