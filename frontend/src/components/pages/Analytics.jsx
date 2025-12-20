import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaDesktop,
  FaMobileAlt,
  FaLink,
  FaCalendarAlt,
  FaGlobe,
} from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = [
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
];

const graphTypes = [
  { value: 'line', label: 'Line Chart', icon: FaChartLine },
  { value: 'bar', label: 'Bar Chart', icon: FaChartBar },
  { value: 'area', label: 'Area Chart', icon: FaChartLine },
  { value: 'pie', label: 'Pie Chart', icon: FaChartPie },
];

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

const Analytics = () => {
  const username = useSelector((store) => store.admin.user?.username);
  const links = useSelector((store) => store.admin.links);
  const darkMode = useSelector((store) => store.page.darkMode);

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedGraphType, setSelectedGraphType] = useState('line');
  const [xAxisType, setXAxisType] = useState('date');
  const [yAxisType, setYAxisType] = useState('count');

  // Analytics data states
  const [profileVisits, setProfileVisits] = useState([]);
  const [clickCounts, setClickCounts] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [linkData, setLinkData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [username, timeRange]);

  const fetchAnalytics = async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        '/analytics/get',
        { username, timeRange },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        const data = res.data.analytics;
        setProfileVisits(data.profileVisits || []);
        setClickCounts(data.clickCounts || []);
        setLocationData(data.locationData || []);
        setOsData(data.osData || []);
        setPlatformData(data.platformData || []);
        setLinkData(data.linkData || []);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Use mock data if API fails
      generateMockData();
      toast.error('Using simulated data. Analytics API unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock data based on actual links
    const mockDates = generateDateRange(timeRange);
    const mockProfileVisits = mockDates.map((date) => ({
      date,
      visits: Math.floor(Math.random() * 50) + 10,
    }));

    const mockClickCounts = mockDates.map((date) => ({
      date,
      clicks: Math.floor(Math.random() * 100) + 20,
    }));

    const mockLocationData = [
      { name: 'United States', value: 45 },
      { name: 'India', value: 30 },
      { name: 'United Kingdom', value: 15 },
      { name: 'Canada', value: 10 },
    ];

    const mockOsData = [
      { name: 'Windows', value: 40 },
      { name: 'macOS', value: 25 },
      { name: 'Linux', value: 15 },
      { name: 'iOS', value: 12 },
      { name: 'Android', value: 8 },
    ];

    const mockPlatformData = links.map((link) => ({
      name: link.source,
      clicks: link.clicked || Math.floor(Math.random() * 100),
    }));

    const mockLinkData = links.map((link) => ({
      name: link.source,
      clicks: link.clicked || 0,
      visits: Math.floor((link.clicked || 0) * 1.2),
    }));

    setProfileVisits(mockProfileVisits);
    setClickCounts(mockClickCounts);
    setLocationData(mockLocationData);
    setOsData(mockOsData);
    setPlatformData(mockPlatformData);
    setLinkData(mockLinkData);
  };

  const generateDateRange = (range) => {
    const dates = [];
    const today = new Date();
    let days = 7;

    switch (range) {
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
        days = 365; // Match backend behavior for 'all' time range
        break;
      default:
        days = 30;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    return dates;
  };

  const getChartData = () => {
    switch (selectedMetric) {
      case 'profileVisits':
        return profileVisits;
      case 'clicks':
        return clickCounts;
      case 'location':
        return locationData;
      case 'os':
        return osData;
      case 'platform':
        return platformData;
      case 'link':
        return linkData;
      default:
        return clickCounts;
    }
  };

  const renderChart = () => {
    const data = getChartData();
    const xKey = xAxisType === 'date' ? 'date' : 'name';
    
    // Determine the correct Y-axis key based on metric type and axis type
    let yKey;
    if (yAxisType === 'value' || yAxisType === 'percentage') {
      // For 'value' or 'percentage', use 'value' field (works for location, os)
      yKey = 'value';
    } else {
      // For 'count', map each metric to its appropriate field
      switch (selectedMetric) {
        case 'profileVisits':
          yKey = 'visits';
          break;
        case 'clicks':
          yKey = 'clicks';
          break;
        case 'location':
        case 'os':
          // Location and OS data use 'value' field even for count
          yKey = 'value';
          break;
        case 'platform':
        case 'link':
          // Platform and link data use 'clicks' field
          yKey = 'clicks';
          break;
        default:
          yKey = 'value';
      }
    }

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FaChartLine className="text-6xl mx-auto mb-4 opacity-50" />
            <p className="text-xl">No data available for the selected time range</p>
          </div>
        </div>
      );
    }

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (selectedGraphType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={xKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={xKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Bar dataKey={yKey} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={xKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={yKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const metrics = [
    { value: 'profileVisits', label: 'Profile Visits', icon: FaGlobe },
    { value: 'clicks', label: 'Click Counts', icon: FaChartLine },
    { value: 'location', label: 'Location Based', icon: FaMapMarkerAlt },
    { value: 'os', label: 'OS Based', icon: FaDesktop },
    { value: 'platform', label: 'Platform Based', icon: FaLink },
    { value: 'link', label: 'Link Based', icon: FaLink },
  ];

  if (!username) {
    return (
      <div className="w-full min-h-screen py-8 px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <FaChartLine className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-700 dark:text-gray-400">
            Please log in to view analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg">
            Track and analyze your link performance with detailed insights
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Graph Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Graph Type
              </label>
              <select
                value={selectedGraphType}
                onChange={(e) => setSelectedGraphType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {graphTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* X-Axis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                X-Axis
              </label>
              <select
                value={xAxisType}
                onChange={(e) => setXAxisType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Y-Axis Control */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Y-Axis
            </label>
            <select
              value={yAxisType}
              onChange={(e) => setYAxisType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="count">Count</option>
              <option value="value">Value</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
        >
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-700 dark:text-gray-400">Loading analytics...</p>
              </div>
            </div>
          ) : (
            renderChart()
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
        >
          <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {links.reduce((sum, link) => sum + (link.clicked || 0), 0)}
                </p>
              </div>
              <FaChartLine className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Links</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {links.length}
                </p>
              </div>
              <FaLink className="text-4xl text-pink-500" />
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Clicks/Link</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {links.length > 0
                    ? Math.round(
                        links.reduce((sum, link) => sum + (link.clicked || 0), 0) / links.length
                      )
                    : 0}
                </p>
              </div>
              <FaChartBar className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Top Platform</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {links.length > 0
                    ? links.reduce((max, link) =>
                        (link.clicked || 0) > (max.clicked || 0) ? link : max
                      ).source
                    : 'N/A'}
                </p>
              </div>
              <FaGlobe className="text-4xl text-green-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

