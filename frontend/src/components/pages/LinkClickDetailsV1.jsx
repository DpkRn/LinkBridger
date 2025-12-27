import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaMousePointer, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDesktop, FaMobileAlt,
  FaTabletAlt, FaGlobe, FaChrome, FaLink, FaSearch, FaTimes, FaFilter,
  FaChevronDown, FaExternalLinkAlt, FaChartLine, FaEye, FaUsers
} from 'react-icons/fa';
import api from '../../utils/api';

const LinkClickDetailsV1 = () => {
  const { username } = useSelector((store) => store.admin.user);
  const darkMode = useSelector((store) => store.page.darkMode);

  const [clicks, setClicks] = useState([]);
  const [filteredClicks, setFilteredClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLink, setSelectedLink] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClick, setSelectedClick] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get unique links for filter
  const uniqueLinks = [...new Set(clicks.map(c => c.linkId))].map(linkId => {
    const click = clicks.find(c => c.linkId === linkId);
    return {
      id: linkId,
      title: click.linkSource || 'Unknown Link',
      shortUrl: `/${click.linkSource || 'unknown'}`
    };
  });

  // Stats
  const allClicksCount = clicks.length;
  const uniqueVisitors = new Set(clicks.map(c => c.location?.ipAddress).filter(ip => ip)).size;
  const topCountry = clicks.reduce((acc, click) => {
    if (click.location?.country) {
    acc[click.location.country] = (acc[click.location.country] || 0) + 1;
    }
    return acc;
  }, {});
  const topCountryName = Object.keys(topCountry).sort((a, b) => topCountry[b] - topCountry[a])[0] || 'N/A';

  // Fetch click details from API (v1 format)
  const fetchClickDetails = async () => {
    try {
      setLoading(true);
      const response = await api.post('/analytics/click-details-v1', {
        username: username,
      });

      if (response.data.success) {
        const apiClicks = response.data.data;
        setClicks(apiClicks);
        setFilteredClicks(apiClicks);
      }
      } catch (error) {
      console.error('Error fetching click details:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (username) {
      fetchClickDetails();
    }
  }, [username]);

  // Client-side filtering and search
  useEffect(() => {
    let filtered = clicks;

    if (selectedLink !== 'all') {
      filtered = filtered.filter(c => c.linkId === selectedLink);
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.linkSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.browser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.os.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filtering
    if (startDate || endDate) {
      filtered = filtered.filter(c => {
        const clickDate = new Date(c.clickDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Set end date to end of day
        if (end) {
          end.setHours(23, 59, 59, 999);
        }

        if (start && clickDate < start) return false;
        if (end && clickDate > end) return false;

        return true;
      });
    }

    setFilteredClicks(filtered);
  }, [selectedLink, searchQuery, startDate, endDate, clicks]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile': return <FaMobileAlt className="w-4 h-4" />;
      case 'desktop': return <FaDesktop className="w-4 h-4" />;
      case 'tablet': return <FaTabletAlt className="w-4 h-4" />;
      default: return <FaDesktop className="w-4 h-4" />;
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const dateObj = new Date(date); // Ensure it's a Date object
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className={`text-gray-400 ${darkMode ? '' : 'text-gray-600'}`}>Loading click details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className={`backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6 border ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <FaMousePointer className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Click Analytics
                </h1>
                <p className="text-sm text-gray-400">
                  Detailed view of all link clicks
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <FaChartLine className="w-4 h-4 text-purple-400" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Clicks</span>
              </div>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{allClicksCount}</p>
            </div>
            <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <FaUsers className="w-4 h-4 text-pink-400" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unique Visitors</span>
              </div>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{uniqueVisitors}</p>
            </div>
            <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <FaGlobe className="w-4 h-4 text-cyan-400" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Country</span>
              </div>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topCountryName}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by link, location, device, browser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-white ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                darkMode
                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filter by Link
              <FaChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLink('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLink === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : darkMode
                      ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  All Links ({clicks.length})
                </button>
                {uniqueLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => setSelectedLink(link.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedLink === link.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : darkMode
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {link.title} ({clicks.filter(c => c.linkId === link.id).length})
                  </button>
                ))}
              </div>

              {/* Date Range Filter */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedLink !== 'all' || searchQuery || startDate || endDate) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedLink('all');
                      setSearchQuery('');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredClicks.length} of {clicks.length} clicks
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="max-h-[800px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {              filteredClicks.length === 0 ? (
              <div className={`backdrop-blur-sm rounded-xl shadow-xl p-12 text-center border ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <FaMousePointer className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No clicks found</h3>
                <p className={`text-gray-400 ${darkMode ? '' : 'text-gray-600'}`}>Try adjusting your filters or search query</p>
              </div>
            ) : (
              filteredClicks.map((click) => (
                <div
                  key={click._id}
                  onClick={() => setSelectedClick(click)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedClick?._id === click._id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : darkMode
                      ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                      {getDeviceIcon(click.device.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className={`font-semibold text-sm mb-1 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {click.linkSource || 'Unknown Link'}
                            {!click.seen && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30">
                                New
                              </span>
                            )}
                          </h3>
                          <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <FaLink className="w-3 h-3" />
                            {click.linkDestination || 'linkhub'}
                          </p>
                        </div>
                        <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          {getRelativeTime(click.clickDate)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{click.location.city}, {click.location.country}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FaDesktop className="w-3 h-3" />
                          <span>{click.device.type} • {click.os.name}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FaChrome className="w-3 h-3" />
                          <span>{click.browser.name}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FaGlobe className="w-3 h-3" />
                          <span className="truncate">
                            {click.referrer && click.referrer !== 'direct' ? (() => {
                              try {
                                return new URL(click.referrer).hostname;
                              } catch (e) {
                                return click.referrer; // If it's not a valid URL, just show the referrer as-is
                              }
                            })() : 'Direct'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          </div>

          <div className="lg:col-span-1">
            {selectedClick ? (
              <div className={`backdrop-blur-sm rounded-xl shadow-xl p-6 border sticky top-6 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FaEye className="w-5 h-5 text-purple-400" />
                  Click Details
                </h2>

                <div className={`mb-6 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Link</h3>
                  <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.linkSource || 'Unknown Link'}</p>
                  <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedClick.linkDestination || 'linkhub'}</p>
                  <a 
                    href={selectedClick.linkDestination || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View destination
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Timestamp</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.clickedTime.date}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.clickedTime.time}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timezone</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.clickedTime.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaMapMarkerAlt className="w-4 h-4 text-purple-400" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Country</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.location.country}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>City</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.location.city}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Region</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.location.region}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>IP Address</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.location.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getDeviceIcon(selectedClick.device.type)}
                    <span className="text-purple-400">Device</span>
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</span>
                      <span className={`text-xs font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.device.type}</span>
                    </div>
                    {selectedClick.device.brand && (
                      <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Brand</span>
                        <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.device.brand}</span>
                      </div>
                    )}
                    {selectedClick.device.model && (
                      <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model</span>
                        <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.device.model}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaDesktop className="w-4 h-4 text-purple-400" />
                    Operating System
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.os.name}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.os.version}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaChrome className="w-4 h-4 text-purple-400" />
                    Browser
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.browser.name}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedClick.browser.version}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaGlobe className="w-4 h-4 text-purple-400" />
                    Referrer
                  </h3>
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
                    {selectedClick.referrer && selectedClick.referrer !== 'direct' ? (() => {
                      try {
                        new URL(selectedClick.referrer); // Validate URL
                        return (
                      <a 
                        href={selectedClick.referrer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 break-all flex items-center gap-1"
                      >
                        {selectedClick.referrer}
                            <FaExternalLinkAlt className="w-3 h-3 flex-shrink-0" />
                          </a>
                        );
                      } catch (e) {
                        return <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedClick.referrer}</span>;
                      }
                    })() : (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Direct Traffic</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>User Agent</h3>
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-100 border-gray-300'}`}>
                    <p className={`text-xs break-all font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedClick.userAgent}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`backdrop-blur-sm rounded-xl shadow-xl p-12 text-center border sticky top-6 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                  <FaMousePointer className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Select a click
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a click from the list to view its complete details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkClickDetailsV1;