import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FaSearch,
  FaFilter,
  FaLink,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const LinkClickDetails = () => {
  const { username } = useSelector((store) => store.admin.user);
  const darkMode = useSelector((store) => store.page.darkMode);

  // State management
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLink, setSelectedLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClicks, setTotalClicks] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [links, setLinks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch click details
  const fetchClickDetails = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.post('/analytics/click-details', {
        username: username,
        linkId: selectedLink || undefined,
        page,
        limit: 50,
        search: searchTerm,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      if (response.data.success) {
        setClicks(response.data.data.clicks);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalClicks(response.data.data.pagination.totalClicks);
        setCurrentPage(response.data.data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching click details:', error);
      toast.error('Failed to load click details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's links for filter dropdown
  const fetchUserLinks = async () => {
    try {
      const response = await api.post('/source/getallsource', { username }, { withCredentials: true });
      if (response.status === 200 && response.data.success) {
        setLinks(response.data.sources);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  // Effect to fetch data when component mounts
  useEffect(() => {
    if (username) {
      fetchUserLinks();
      fetchClickDetails();
    }
  }, [username]);

  // Effect to fetch data when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (username) {
        fetchClickDetails(1);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedLink, startDate, endDate, username]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchClickDetails(page);
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setClicks([...clicks].reverse());
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Get device icon
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return <FaMobileAlt className="text-blue-500" />;
      case 'tablet':
        return <FaTabletAlt className="text-green-500" />;
      case 'desktop':
        return <FaDesktop className="text-purple-500" />;
      default:
        return <FaDesktop className="text-gray-500" />;
    }
  };

  // Get browser icon
  const getBrowserIcon = (browserName) => {
    const name = browserName?.toLowerCase() || '';
    if (name.includes('chrome')) return <FaChrome className="text-green-500" />;
    if (name.includes('firefox')) return <FaFirefox className="text-orange-500" />;
    if (name.includes('safari')) return <FaSafari className="text-blue-500" />;
    if (name.includes('edge')) return <FaEdge className="text-blue-600" />;
    return <FaGlobe className="text-gray-500" />;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Click Details
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Detailed analytics for every click on your links
          </p>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-sm border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FaFilter className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              Filters & Search
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`hover:text-blue-600 transition-colors text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Link Filter */}
              <div className="relative">
                <FaLink className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <select
                  value={selectedLink}
                  onChange={(e) => setSelectedLink(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Links</option>
                  {links.map((link) => (
                    <option key={link._id} value={link._id}>
                      {link.source} → {link.destination.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="relative">
                <FaCalendarAlt className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* End Date */}
              <div className="relative">
                <FaCalendarAlt className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Sort and Clear */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={handleSortToggle}
              className={`flex items-center gap-2 hover:text-blue-600 transition-colors text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLink('');
                setStartDate('');
                setEndDate('');
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className={`rounded-lg p-4 border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalClicks.toLocaleString()}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Clicks</div>
          </div>
          <div className={`rounded-lg p-4 border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{clicks.length}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Showing</div>
          </div>
          <div className={`rounded-lg p-4 border shadow-sm sm:col-span-2 lg:col-span-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPage} / {totalPages}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Page</div>
          </div>
        </div>

        {/* Click Details Table */}
        <div className={`rounded-lg shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : clicks.length === 0 ? (
            <div className="text-center py-12">
              <FaLink className={`mx-auto text-4xl mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No clicks found</h3>
              <p className={`text-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Link</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date & Time</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Device</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Browser</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>OS</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Referrer</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {clicks.map((click, index) => (
                    <tr key={click._id || index} className={`transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      {/* Link */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FaLink className={`flex-shrink-0 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                          <div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{click.linkSource}</div>
                            <div className={`text-xs truncate max-w-32 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} title={click.linkDestination}>
                              {click.linkDestination}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-4">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDate(click.clickDate)}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {click.clickedTime?.time}
                        </div>
                      </td>

                      {/* Device */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(click.device?.type)}
                          <div>
                            <div className={`text-sm capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {click.device?.type || 'Unknown'}
                            </div>
                            {click.device?.brand && (
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {click.device.brand} {click.device.model}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Browser */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {getBrowserIcon(click.browser?.name)}
                          <div>
                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {click.browser?.name || 'Unknown'}
                            </div>
                            {click.browser?.version && (
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                v{click.browser.version}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* OS */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {click.os?.name || 'Unknown'}
                        </div>
                        {click.os?.version && (
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            v{click.os.version}
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                          <div>
                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {click.location?.city || 'Unknown'}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {click.location?.country}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-4 py-4">
                        <div className={`text-sm max-w-32 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={click.referrer}>
                          {click.referrer === 'direct' ? (
                            <span className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Direct</span>
                          ) : click.referrer ? (
                            <div className="flex items-center gap-1">
                              <span>{click.referrer}</span>
                              <button
                                onClick={() => copyToClipboard(click.referrer)}
                                className={`transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Copy referrer URL"
                              >
                                <MdContentCopy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unknown</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {click.seen ? (
                            <>
                              <FaEye className="text-green-500" />
                              <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Seen</span>
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unseen</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {clicks.map((click, index) => (
            <div key={click._id || index} className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaLink className={`flex-shrink-0 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{click.linkSource}</div>
                    <div className={`text-xs truncate max-w-48 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} title={click.linkDestination}>
                      {click.linkDestination}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {click.seen ? (
                    <>
                      <FaEye className="text-green-500 w-4 h-4" />
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Seen</span>
                    </>
                  ) : (
                    <>
                      <FaEyeSlash className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unseen</span>
                    </>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="mb-3">
                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(click.clickDate)}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {click.clickedTime?.time}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Device */}
                <div>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Device</div>
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getDeviceIcon(click.device?.type)}
                    <span className="capitalize">{click.device?.type || 'Unknown'}</span>
                  </div>
                  {click.device?.brand && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {click.device.brand} {click.device.model}
                    </div>
                  )}
                </div>

                {/* Browser */}
                <div>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Browser</div>
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getBrowserIcon(click.browser?.name)}
                    <span>{click.browser?.name || 'Unknown'}</span>
                  </div>
                  {click.browser?.version && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      v{click.browser.version}
                    </div>
                  )}
                </div>

                {/* OS */}
                <div>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>OS</div>
                  <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {click.os?.name || 'Unknown'}
                  </div>
                  {click.os?.version && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      v{click.os.version}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</div>
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FaMapMarkerAlt className="text-red-500 w-3 h-3 flex-shrink-0" />
                    <span>{click.location?.city || 'Unknown'}</span>
                  </div>
                  {click.location?.country && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {click.location.country}
                    </div>
                  )}
                </div>
              </div>

              {/* Referrer */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className={`font-medium mb-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Referrer</div>
                <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {click.referrer === 'direct' ? (
                    <span className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Direct</span>
                  ) : click.referrer ? (
                    <div className="flex items-center gap-1">
                      <span className="truncate">{click.referrer}</span>
                      <button
                        onClick={() => copyToClipboard(click.referrer)}
                        className={`transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Copy referrer URL"
                      >
                        <MdContentCopy className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unknown</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaChevronLeft />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      page === currentPage
                        ? 'bg-blue-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkClickDetails;
