const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true, // ensures only one record per device
    },
    passKey: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: null, // will be set after first login
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Optional: update `updatedAt` automatically before save
deviceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
