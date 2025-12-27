import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Archive, Clock, Filter, Search, X, Calendar, TrendingUp, MapPin, Monitor, Smartphone, Tablet, Globe, Chrome, Link2 } from 'lucide-react';

// Mock links data (replace with your actual data source)
const mockLinks = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Summer Sale Campaign',
    destination: 'https://example.com/summer-sale',
    shortUrl: 'mylink.io/summer',
    source: 'instagram',
    notSeen: 5
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Product Launch',
    destination: 'https://example.com/product',
    shortUrl: 'mylink.io/product',
    source: 'twitter',
    notSeen: 3
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'Newsletter Signup',
    destination: 'https://example.com/newsletter',
    shortUrl: 'mylink.io/news',
    source: 'email',
    notSeen: 8
  }
];

// Mock analytics data based on your schema
const mockAnalyticsData = {
  '507f1f77bcf86cd799439011': [
    {
      _id: 'click1',
      linkId: '507f1f77bcf86cd799439011',
      clickDate: new Date('2024-12-27T10:30:00Z'),
      location: { country: 'India', city: 'Mumbai', region: 'Maharashtra', ipAddress: '192.168.1.1' },
      device: { type: 'mobile', brand: 'Samsung', model: 'Galaxy S21' },
      os: { name: 'Android', version: '13' },
      browser: { name: 'Chrome', version: '120.0' },
      referrer: 'https://instagram.com',
      seen: false
    },
    {
      _id: 'click2',
      linkId: '507f1f77bcf86cd799439011',
      clickDate: new Date('2024-12-27T11:15:00Z'),
      location: { country: 'India', city: 'Delhi', region: 'Delhi', ipAddress: '192.168.1.2' },
      device: { type: 'desktop', brand: null, model: null },
      os: { name: 'Windows', version: '11' },
      browser: { name: 'Firefox', version: '121.0' },
      referrer: 'https://google.com',
      seen: false
    },
    {
      _id: 'click3',
      linkId: '507f1f77bcf86cd799439011',
      clickDate: new Date('2024-12-27T12:00:00Z'),
      location: { country: 'India', city: 'Bangalore', region: 'Karnataka', ipAddress: '192.168.1.3' },
      device: { type: 'mobile', brand: 'Apple', model: 'iPhone 14' },
      os: { name: 'iOS', version: '17.1' },
      browser: { name: 'Safari', version: '17.0' },
      referrer: 'https://twitter.com',
      seen: false
    }
  ],
  '507f1f77bcf86cd799439012': [
    {
      _id: 'click4',
      linkId: '507f1f77bcf86cd799439012',
      clickDate: new Date('2024-12-27T09:00:00Z'),
      location: { country: 'USA', city: 'New York', region: 'NY', ipAddress: '192.168.1.4' },
      device: { type: 'tablet', brand: 'Apple', model: 'iPad Pro' },
      os: { name: 'iOS', version: '17.2' },
      browser: { name: 'Safari', version: '17.1' },
      referrer: null,
      seen: false
    }
  ]
};

const NotificationV1 = () => {
  const [links] = useState(mockLinks); // Replace with useSelector for Redux
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all link analytics on mount
  useEffect(() => {
    const fetchAllAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with actual fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const notificationsData = [];
        
        links.filter(link => link.notSeen > 0).forEach(link => {
          const analytics = mockAnalyticsData[link._id] || [];
          
          // Group by date
          const clicksByDate = {};
          analytics.forEach(click => {
            const date = new Date(click.clickDate).toISOString().split('T')[0];
            if (!clicksByDate[date]) {
              clicksByDate[date] = [];
            }
            clicksByDate[date].push(click);
          });

          // Create notification for each day's clicks
          Object.entries(clicksByDate).forEach(([date, clicks]) => {
            const unseenClicks = clicks.filter(c => !c.seen);
            if (unseenClicks.length === 0) return;

            // Get location stats
            const locations = unseenClicks.reduce((acc, click) => {
              const loc = `${click.location.city || 'Unknown'}, ${click.location.country || 'Unknown'}`;
              acc[loc] = (acc[loc] || 0) + 1;
              return acc;
            }, {});

            // Get device stats
            const devices = unseenClicks.reduce((acc, click) => {
              acc[click.device.type] = (acc[click.device.type] || 0) + 1;
              return acc;
            }, {});

            notificationsData.push({
              id: `${link._id}-${date}`,
              type: 'link_click',
              linkId: link._id,
              linkTitle: link.title || link.destination,
              linkSource: link.source,
              shortUrl: link.shortUrl,
              clickDate: new Date(date),
              clickCount: unseenClicks.length,
              clicks: unseenClicks,
              locations,
              devices,
              read: false,
              archived: false,
              createdAt: new Date(unseenClicks[0].clickDate)
            });
          });
        });

        notificationsData.sort((a, b) => b.createdAt - a.createdAt);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, [links]);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const markAsRead = async (id) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    // Simulate API call to mark clicks as seen
    // Replace with actual API call: await fetch(`/api/analytics/${click._id}/mark-seen`, { method: 'PATCH' })
    
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    // Simulate API call
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleArchive = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, archived: !n.archived } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read && !n.archived);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read && !n.archived);
    } else if (filter === 'archived') {
      filtered = filtered.filter(n => n.archived);
    } else if (filter === 'all') {
      filtered = filtered.filter(n => !n.archived);
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.linkTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="p-8 text-center min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Bell className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-1">
              No New Activity
            </p>
            <p className="text-gray-400 text-sm">
              You're all caught up! Check back later for new clicks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-gray-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {['all', 'unread', 'read', 'archived'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => {
                  setSelectedNotification(notification);
                  if (!notification.read) markAsRead(notification.id);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                  selectedNotification?.id === notification.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50'
                } ${!notification.read ? 'border-l-4 !border-l-purple-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">
                        {notification.clickCount} {notification.clickCount === 1 ? 'New Click' : 'New Clicks'}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs flex items-center gap-2 mb-1">
                      <Link2 className="w-3 h-3" />
                      <span className="truncate">{notification.linkTitle}</span>
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-xs font-bold text-purple-300 border border-purple-400/30">
                      {notification.linkSource.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(notification.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notification Detail Panel */}
          <div className="lg:col-span-2">
            {selectedNotification ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {selectedNotification.clickCount} New Click{selectedNotification.clickCount !== 1 ? 's' : ''}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedNotification.clickDate.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedNotification.createdAt.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleArchive(selectedNotification.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title={selectedNotification.archived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteNotification(selectedNotification.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Link Details */}
                <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-purple-400" />
                    Link Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-white">{selectedNotification.linkTitle}</p>
                      <p className="text-sm text-gray-400">{selectedNotification.shortUrl}</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-xs font-bold text-purple-300 border border-purple-400/30">
                      {selectedNotification.linkSource.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-400">Total Clicks</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedNotification.clickCount}</p>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-pink-400" />
                      <span className="text-sm text-gray-400">Locations</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{Object.keys(selectedNotification.locations).length}</p>
                  </div>
                </div>

                {/* Top Locations */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    Top Locations
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedNotification.locations)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                          <span className="text-sm text-gray-300">{location}</span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                            {count} click{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-400" />
                    Device Types
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(selectedNotification.devices).map(([device, count]) => (
                      <div key={device} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 text-center">
                        <div className="flex justify-center mb-2 text-purple-400">
                          {getDeviceIcon(device)}
                        </div>
                        <p className="text-xs text-gray-400 capitalize mb-1">{device}</p>
                        <p className="text-lg font-bold text-white">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedNotification.archived
                          ? 'bg-gray-700 text-gray-300'
                          : selectedNotification.read
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {selectedNotification.archived ? (
                          <>
                            <Archive className="w-3 h-3 mr-1" />
                            Archived
                          </>
                        ) : selectedNotification.read ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Read
                          </>
                        ) : (
                          <>
                            <Bell className="w-3 h-3 mr-1" />
                            Unread
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center border border-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                  <Bell className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a notification
                </h3>
                <p className="text-gray-400">
                  Choose a notification from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationV1;