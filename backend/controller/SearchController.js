const User = require("../model/userModel");
const UserSettings = require("../model/userSettingsModel");
const UserProfile = require("../model/userProfile");

// Search for users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const searchQuery = query.trim().toLowerCase();

        // Find users whose username or name matches the search query
        // Only include users that are not deleted
        const users = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { name: { $regex: searchQuery, $options: 'i' } }
            ],
            deletedAt: null
        }).select('username name email').limit(20);

        if (!users || users.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found",
                results: []
            });
        }

        // Filter users based on their search settings
        const searchableUsers = [];
        
        for (const user of users) {
            try {
                const settings = await UserSettings.findOne({
                    userId: user._id,
                    deletedAt: null
                });

                // Check if user is searchable
                // User must have isPublic=true and allowSearch=true
                if (settings && settings.isSearchable()) {
                    // Get profile for image
                    const profile = await UserProfile.findOne({
                        username: user.username
                    }).select('image');

                    searchableUsers.push({
                        username: user.username,
                        name: user.name || user.username,
                        image: profile?.image || null
                    });
                }
            } catch (err) {
                // If settings don't exist or error, skip this user
                // (default settings make profile not searchable)
                continue;
            }
        }

        return res.status(200).json({
            success: true,
            message: "Search completed",
            results: searchableUsers
        });
    } catch (err) {
        console.log("Search users error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

module.exports = {
    searchUsers
};
