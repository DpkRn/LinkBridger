const Link = require('../model/linkModel');

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

module.exports = {
    getAnalytics
};

