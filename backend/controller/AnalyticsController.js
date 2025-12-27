const mongoose = require('mongoose');
const Link = require('../model/linkModel');
const LinkAnalytics = require('../model/linkAnalyticsModel');

const getAnalytics = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, timeRange } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Get all links for the user (excluding deleted links)
        const links = await Link.find({ 
            username, 
            userId,
            deletedAt: null 
        }, {
            source: 1,
            destination: 1,
            clicked: 1,
            notSeen: 1,
            visibility: 1
        });

        if (!links || links.length === 0) {
            return res.status(200).json({
                success: true,
                analytics: {
                    profileVisits: [],
                    clickCounts: [],
                    locationData: [],
                    osData: [],
                    platformData: [],
                    linkData: []
                }
            });
        }

        // Calculate date range
        const today = new Date();
        let days = 30;
        switch (timeRange) {
            case '7d':
                days = 7;
                break;
            case '30d':
                days = 30;
                break;
            case '90d':
                days = 90;
                break;
            case '1y':
                days = 365;
                break;
            case 'all':
                days = 365; // For all time, show last year
                break;
            default:
                days = 30;
        }

        // Generate date range for time series data
        const generateDateRange = () => {
            const dates = [];
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    fullDate: date
                });
            }
            return dates;
        };

        const dateRange = generateDateRange();

        // Profile Visits (simulated based on total clicks)
        const totalClicks = links.reduce((sum, link) => sum + (link.clicked || 0), 0);
        const avgDailyClicks = totalClicks / days;
        const profileVisits = dateRange.map(({ date, fullDate }) => {
            // Simulate profile visits (usually higher than individual link clicks)
            const baseVisits = Math.floor(avgDailyClicks * 1.2);
            const variation = Math.floor(Math.random() * baseVisits * 0.3);
            return {
                date,
                visits: Math.max(0, baseVisits + variation - Math.floor(baseVisits * 0.15))
            };
        });

        // Click Counts (simulated daily distribution)
        const clickCounts = dateRange.map(({ date, fullDate }) => {
            const baseClicks = Math.floor(avgDailyClicks);
            const variation = Math.floor(Math.random() * baseClicks * 0.4);
            return {
                date,
                clicks: Math.max(0, baseClicks + variation - Math.floor(baseClicks * 0.2))
            };
        });

        // Location Data (simulated based on common distribution)
        const locationData = [
            { name: 'United States', value: Math.floor(totalClicks * 0.35) },
            { name: 'India', value: Math.floor(totalClicks * 0.25) },
            { name: 'United Kingdom', value: Math.floor(totalClicks * 0.15) },
            { name: 'Canada', value: Math.floor(totalClicks * 0.10) },
            { name: 'Australia', value: Math.floor(totalClicks * 0.08) },
            { name: 'Germany', value: Math.floor(totalClicks * 0.07) }
        ].filter(item => item.value > 0);

        // OS Data (simulated)
        const osData = [
            { name: 'Windows', value: Math.floor(totalClicks * 0.40) },
            { name: 'macOS', value: Math.floor(totalClicks * 0.25) },
            { name: 'Linux', value: Math.floor(totalClicks * 0.15) },
            { name: 'iOS', value: Math.floor(totalClicks * 0.12) },
            { name: 'Android', value: Math.floor(totalClicks * 0.08) }
        ].filter(item => item.value > 0);

        // Platform Data (real data from links)
        const platformData = links
            .map(link => ({
                name: link.source.charAt(0).toUpperCase() + link.source.slice(1),
                clicks: link.clicked || 0
            }))
            .sort((a, b) => b.clicks - a.clicks);

        // Link Data (real data from links)
        const linkData = links.map(link => ({
            name: link.source.charAt(0).toUpperCase() + link.source.slice(1),
            clicks: link.clicked || 0,
            visits: Math.floor((link.clicked || 0) * 1.2) // Simulated visits
        }));

        return res.status(200).json({
            success: true,
            analytics: {
                profileVisits,
                clickCounts,
                locationData,
                osData,
                platformData,
                linkData
            }
        });

    } catch (err) {
        console.error('Error fetching analytics:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

const saveAnalytics = async ({
  linkId,
  userId,
  username,
  req
}) => {
    if (req.skipAnalytics) {
        return;
    }
      
  try {
    const payload = req?.analyticsPayload || {};
    const details = req?.details || {}; // Keep for backward compatibility

    const analytics = new LinkAnalytics({
      linkId,
      userId,
      username,

      // Location
      location: {
        country: payload?.location?.country || details?.country || null,
        city: payload?.location?.city || details?.city || null,
        region: payload?.location?.region || null,
        ipAddress: payload?.location?.ipAddress || details?.ip || null
      },

      // Device
      device: {
        type: payload?.device?.type || null,
        brand: payload?.device?.brand || null,
        model: payload?.device?.model || null
      },

      // OS
      os: {
        name: payload?.os?.name || null,
        version: payload?.os?.version || null
      },

      // Browser
      browser: {
        name: payload?.browser?.name || details?.browser || null,
        version: payload?.browser?.version || null
      },

      // Referrer
      referrer: payload?.referrer || 'direct',

      // User Agent
      userAgent: payload?.userAgent || null,

      // clickDate is auto-set
      // clickedTime is auto-derived in pre-save hook
    });
    // console.log(analytics)

    await analytics.save();
  } catch (err) {
    console.error('❌ Failed to save analytics:', err);
  }
};

const getClickDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            username,
            linkId,
            page = 1,
            limit = 50,
            search = '',
            startDate,
            endDate
        } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Build match conditions
        const matchConditions = {
            userId: new mongoose.Types.ObjectId(userId),
            username,
            deletedAt: null
        };

        // Filter by specific link if provided
        if (linkId) {
            matchConditions.linkId = new mongoose.Types.ObjectId(linkId);
        }

        // Date range filter
        if (startDate || endDate) {
            matchConditions.clickDate = {};
            if (startDate) {
                matchConditions.clickDate.$gte = new Date(startDate);
            }
            if (endDate) {
                matchConditions.clickDate.$lte = new Date(endDate);
            }
        }

        // Search filter (search in referrer, userAgent, browser.name, os.name, device info)
        if (search) {
            matchConditions.$or = [
                { 'referrer': { $regex: search, $options: 'i' } },
                { 'userAgent': { $regex: search, $options: 'i' } },
                { 'browser.name': { $regex: search, $options: 'i' } },
                { 'os.name': { $regex: search, $options: 'i' } },
                { 'device.brand': { $regex: search, $options: 'i' } },
                { 'device.model': { $regex: search, $options: 'i' } },
                { 'location.country': { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalCount = await LinkAnalytics.countDocuments(matchConditions);

        // Get paginated results
        const clicks = await LinkAnalytics.find(matchConditions)
            .populate('linkId', 'source destination')
            .sort({ clickDate: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Format the response
        const formattedClicks = clicks.map(click => ({
            _id: click._id,
            linkId: click.linkId?._id || "linkhub" ,
            linkSource: click.linkId?.source || 'Unknown',
            linkDestination: click.linkId?.destination || 'linkhub',
            clickDate: click.clickDate,
            clickedTime: click.clickedTime,
            location: click.location,
            device: click.device,
            os: click.os,
            browser: click.browser,
            referrer: click.referrer,
            userAgent: click.userAgent,
            seen: click.seen
        }));

        return res.status(200).json({
            success: true,
            data: {
                clicks: formattedClicks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalClicks: totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            }
        });

    } catch (err) {
        console.error('❌ Failed to get click details:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

const getClickDetailsV1 = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Get all clicks for the user (no pagination, return all for mock format)
        const clicks = await LinkAnalytics.find({
            userId: new mongoose.Types.ObjectId(userId),
            username,
            deletedAt: null
        })
        .populate('linkId', 'source destination')
        .sort({ clickDate: -1 }) // Most recent first
        .lean();

        // Transform data to match the original mock format
        const mockFormattedClicks = clicks.map(click => ({
            _id: click._id.toString(),
            linkId: click.linkId?._id?.toString() || "undefined",
            linkSource: click.linkId?.source || 'linkhub',
            shortUrl: `/${click.linkId?.source || 'unknown'}`,
            linkDestination: click.linkId?.destination || `${username}.clickly.cv`,
            clickDate: click.clickDate,
            clickedTime: click.clickedTime,
            location: click.location,
            device: click.device,
            os: click.os,
            browser: click.browser,
            referrer: click.referrer,
            userAgent: click.userAgent,
            seen: click.seen
        }));

        return res.status(200).json({
            success: true,
            data: mockFormattedClicks
        });

    } catch (err) {
        console.error('❌ Failed to get click details v1:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

const markReadNotification = async (req, res) => {
    try {
        const { clickId } = req.body;
        const userId = req.userId;

        if (!clickId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Click ID is required'
            });
        }

        // Update the specific click to mark as seen
        const updatedClick = await LinkAnalytics.findOneAndUpdate(
            { _id: clickId, userId: userId },
            { $set: { seen: true } },
            { new: true }
        );

        if (!updatedClick) {
            return res.status(404).json({
                success: false,
                message: 'Click not found or access denied'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: updatedClick
        });

    } catch (err) {
        console.error('❌ Failed to mark notification as read:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

module.exports = {
    getAnalytics,
    getClickDetails,
    getClickDetailsV1,
    markReadNotification,
    saveAnalytics,
};

