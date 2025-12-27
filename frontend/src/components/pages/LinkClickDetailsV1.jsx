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

  const [clicks, setClicks] = useState([]);
  const [filteredClicks, setFilteredClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLink, setSelectedLink] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClick, setSelectedClick] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClicks, setTotalClicks] = useState(0);

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

  // Fetch click details from API
  const fetchClickDetails = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.post('/analytics/click-details', {
        username: username,
        linkId: selectedLink !== 'all' ? selectedLink : undefined,
        page,
        limit: 50,
        search: searchQuery,
      });

      if (response.data.success) {
        const apiClicks = response.data.data.clicks;
        setClicks(apiClicks);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalClicks(response.data.data.pagination.totalClicks);
        setCurrentPage(response.data.data.pagination.currentPage);
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

  // Debounced effect for search and filter
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (username) {
        fetchClickDetails(1);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedLink]);

  // Set filtered clicks to all clicks (API handles filtering)
  useEffect(() => {
    setFilteredClicks(clicks);
  }, [clicks]);

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading click details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6 border border-gray-700/50">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center gap-2 mb-1">
                <FaChartLine className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Total Clicks</span>
              </div>
                  <p className="text-2xl font-bold text-white">{allClicksCount}</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center gap-2 mb-1">
                <FaUsers className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-gray-400">Unique Visitors</span>
              </div>
              <p className="text-2xl font-bold text-white">{uniqueVisitors}</p>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center gap-2 mb-1">
                <FaGlobe className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-400">Top Country</span>
              </div>
              <p className="text-2xl font-bold text-white">{topCountryName}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by link, location, device, browser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" />
              Filter by Link
              <FaChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLink('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLink === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  All Links ({totalClicks})
                </button>
                {uniqueLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => setSelectedLink(link.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedLink === link.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    {link.title} ({clicks.filter(c => c.linkId === link.id).length})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Showing {filteredClicks.length} of {totalClicks} clicks
          </p>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => fetchClickDetails(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaChevronDown className="w-4 h-4 rotate-90" />
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages} ({totalClicks} total clicks)
            </span>
            <button
              onClick={() => fetchClickDetails(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              Next
              <FaChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="max-h-[800px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {filteredClicks.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center border border-gray-700/50">
                <FaMousePointer className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No clicks found</h3>
                <p className="text-gray-400">Try adjusting your filters or search query</p>
              </div>
            ) : (
              filteredClicks.map((click) => (
                <div
                  key={click._id}
                  onClick={() => setSelectedClick(click)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedClick?._id === click._id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                      {getDeviceIcon(click.device.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                            {click.linkSource || 'Unknown Link'}
                            {!click.seen && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FaLink className="w-3 h-3" />
                            /{click.linkSource || 'unknown'}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getRelativeTime(click.clickDate)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{click.location.city}, {click.location.country}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <FaDesktop className="w-3 h-3" />
                          <span>{click.device.type} • {click.os.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <FaChrome className="w-3 h-3" />
                          <span>{click.browser.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
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
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50 sticky top-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaEye className="w-5 h-5 text-purple-400" />
                  Click Details
                </h2>

                <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Link</h3>
                  <p className="text-white font-medium mb-1">{selectedClick.linkSource || 'Unknown Link'}</p>
                  <p className="text-xs text-gray-400 mb-2">/{selectedClick.linkSource || 'unknown'}</p>
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
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Timestamp</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Date</span>
                      <span className="text-xs text-white font-medium">{selectedClick.clickedTime.date}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Time</span>
                      <span className="text-xs text-white font-medium">{selectedClick.clickedTime.time}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Timezone</span>
                      <span className="text-xs text-white font-medium">{selectedClick.clickedTime.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-purple-400" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Country</span>
                      <span className="text-xs text-white font-medium">{selectedClick.location.country}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">City</span>
                      <span className="text-xs text-white font-medium">{selectedClick.location.city}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Region</span>
                      <span className="text-xs text-white font-medium">{selectedClick.location.region}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">IP Address</span>
                      <span className="text-xs text-white font-medium">{selectedClick.location.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    {getDeviceIcon(selectedClick.device.type)}
                    <span className="text-purple-400">Device</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Type</span>
                      <span className="text-xs text-white font-medium capitalize">{selectedClick.device.type}</span>
                    </div>
                    {selectedClick.device.brand && (
                      <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                        <span className="text-xs text-gray-400">Brand</span>
                        <span className="text-xs text-white font-medium">{selectedClick.device.brand}</span>
                      </div>
                    )}
                    {selectedClick.device.model && (
                      <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                        <span className="text-xs text-gray-400">Model</span>
                        <span className="text-xs text-white font-medium">{selectedClick.device.model}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <FaDesktop className="w-4 h-4 text-purple-400" />
                    Operating System
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Name</span>
                      <span className="text-xs text-white font-medium">{selectedClick.os.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Version</span>
                      <span className="text-xs text-white font-medium">{selectedClick.os.version}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <FaChrome className="w-4 h-4 text-purple-400" />
                    Browser
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Name</span>
                      <span className="text-xs text-white font-medium">{selectedClick.browser.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <span className="text-xs text-gray-400">Version</span>
                      <span className="text-xs text-white font-medium">{selectedClick.browser.version}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <FaGlobe className="w-4 h-4 text-purple-400" />
                    Referrer
                  </h3>
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
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
                        return <span className="text-xs text-gray-400">{selectedClick.referrer}</span>;
                      }
                    })() : (
                      <span className="text-xs text-gray-400">Direct Traffic</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">User Agent</h3>
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <p className="text-xs text-gray-400 break-all font-mono">
                      {selectedClick.userAgent}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center border border-gray-700/50 sticky top-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                  <FaMousePointer className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a click
                </h3>
                <p className="text-gray-400 text-sm">
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