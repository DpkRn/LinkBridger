const UserSettings = require("../model/userSettingsModel");
const User = require("../model/userModel");

// Get user settings
const getSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Get user info if username not provided
        let userData = null;
        if (!username) {
            userData = await User.findById(userId);
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        }

        // Use the static method to get or create settings
        const settings = await UserSettings.getUserSettings(
            username || userId,
            userData
        );

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully",
            settings
        });
    } catch (err) {
        console.log("Get settings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

// Update user settings
const updateSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, ...settingsData } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Get user info
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get or create settings
        let settings = await UserSettings.getUserSettings(userId, userData);

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        // Update template if provided
        if (settingsData.template !== undefined) {
            // Validate template name
            const validTemplates = ['default', 'minimal', 'modern', 'dark', 'light', 'hacker', 'glass', 'neon', 'gradient', 'cards', 'particles', '3d', 'retro'];
            if (validTemplates.includes(settingsData.template)) {
                settings.template = settingsData.template;
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Invalid template. Valid options are: ${validTemplates.join(', ')}`
                });
            }
        }
        
        // Update settings - use Object.assign and markModified for nested objects
        if (settingsData.profile) {
            Object.assign(settings.profile, settingsData.profile);
            settings.markModified('profile');
        }
        if (settingsData.links) {
            Object.assign(settings.links, settingsData.links);
            settings.markModified('links');
        }
        if (settingsData.search) {
            // Handle searchKeywords array separately
            if (settingsData.search.searchKeywords !== undefined) {
                settings.search.searchKeywords = settingsData.search.searchKeywords;
            }
            // Update other search fields
            if (settingsData.search.allowSearch !== undefined) {
                settings.search.allowSearch = settingsData.search.allowSearch;
            }
            if (settingsData.search.showInFeatured !== undefined) {
                settings.search.showInFeatured = settingsData.search.showInFeatured;
            }
            settings.markModified('search');
        }
        if (settingsData.privacy) {
            Object.assign(settings.privacy, settingsData.privacy);
            settings.markModified('privacy');
        }
        if (settingsData.notifications) {
            Object.assign(settings.notifications, settingsData.notifications);
            settings.markModified('notifications');
        }

        await settings.save();

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings
        });
    } catch (err) {
        console.error("Update settings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
