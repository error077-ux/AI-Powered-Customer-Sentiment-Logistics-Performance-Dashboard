import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// -----------------------------------------------------------------------------
// USER AUTHENTICATION CONTEXT AND COMPONENTS
// -----------------------------------------------------------------------------

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const Login = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (userId === 'admin' && password === 'adminpass') {
        login({ role: 'editor', name: 'Admin User' });
      } else if (userId === 'guest' && password === 'guestpass') {
        login({ role: 'viewer', name: 'Guest User' });
      } else {
        setError('Invalid user ID or password. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handlePasswordKeyDown = e => {
    if (e.getModifierState('CapsLock')) setCapsLockOn(true);
    else setCapsLockOn(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <span role="img" aria-label="lock" style={{ fontSize: 38 }}>🔒</span>
        </div>
        <form className={`login-form ${error ? 'shake' : ''}`} onSubmit={handleSubmit} autoComplete="off">
          <h2 className="login-title">Sign In</h2>
          <div className="input-group">
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
              autoFocus
              className={`login-input ${userId ? 'filled' : ''}`}
            />
            <label htmlFor="userId" className={userId ? 'floating' : ''}>User ID</label>
          </div>
          <div className="input-group">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
              required
              className={`login-input ${password ? 'filled' : ''}`}
              autoComplete="off"
            />
            <label htmlFor="password" className={password ? 'floating' : ''}>Password</label>
            <span
              className="toggle-password"
              onClick={() => setShowPassword(s => !s)}
              title={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {capsLockOn && (
            <div className="caps-lock-warning">
              Caps Lock is ON
            </div>
          )}
          <div className="login-actions">
            <button
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              type="submit"
            >
              {isLoading
                ? <span className="spinner"></span>
                : 'Login'
              }
            </button>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="login-hint">
            Use <b>admin/adminpass</b> for editor or <b>guest/guestpass</b> for view access.
          </div>
        </form>
      </div>
    </div>
  );
};


// -----------------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// -----------------------------------------------------------------------------

function Dashboard() {
  const { user, logout } = useAuth();
  
  // State to hold the data, initially set to null
  const [data, setData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    dateRange: 'last-week',
    region: 'all',
    product: 'all',
    shipmentType: 'all',
  });

  // State for alerts
  const [alerts, setAlerts] = useState([]);

  // State for drill-down functionality
  const [filteredFeedback, setFilteredFeedback] = useState([]);

  // Mock data for filter options
  const regions = ['All', 'North America', 'Europe', 'Asia'];
  const products = ['All', 'Electronics', 'Apparel', 'Home Goods'];
  const shipmentTypes = ['All', 'Standard', 'Express', 'Freight'];

  // Refs for the chart canvas elements
  const logisticsChartRef = useRef(null);
  const shipmentChartRef = useRef(null);
  const logisticsChartInstance = useRef(null);
  const shipmentChartInstance = useRef(null);
  
  // Define the mock data with a corrected structure
  const mockData = {
    performanceMetrics: {
      onTimeRate: 88,
      avgDeliveryTime: 3.1,
      costEfficiency: '$1.25/mile',
      shipmentDelays: 12,
    },
    deliveryTimeTrend: [
      { day: 'Mon', value: 2.5 }, { day: 'Tue', value: 2.4 }, { day: 'Wed', value: 2.6 },
      { day: 'Thu', value: 3.1 }, { day: 'Fri', value: 2.2 }, { day: 'Sat', value: 2.4 },
      { day: 'Sun', value: 3.2 }
    ],
    shipmentVolume: [
      { day: 'Mon', value: 120 }, { day: 'Tue', value: 150 }, { day: 'Wed', value: 135 },
      { day: 'Thu', value: 170 }, { day: 'Fri', value: 165 }, { day: 'Sat', value: 180 },
      { day: 'Sun', value: 155 }
    ],
    recentFeedback: [
      {
        id: 1,
        source: 'Email',
        text: 'The delivery was faster than expected. Very happy with the service!',
        sentiment: 'Positive',
        advancedSentiment: 'Satisfied',
        topics: ['Delivery Speed'],
        day: 'Mon',
      },
      {
        id: 2,
        source: 'Review',
        text: 'My package was delayed by two days without any communication. Disappointed.',
        sentiment: 'Negative',
        advancedSentiment: 'Frustrated',
        topics: ['Shipment Delays', 'Communication'],
        day: 'Wed',
      },
      {
        id: 3,
        source: 'Survey',
        text: 'Overall, a good experience. The tracking information was accurate.',
        sentiment: 'Positive',
        advancedSentiment: 'Pleased',
        topics: ['Tracking'],
        day: 'Fri',
      },
      {
        id: 4,
        source: 'Email',
        text: 'The product arrived damaged. This is unacceptable.',
        sentiment: 'Negative',
        advancedSentiment: 'Angry',
        topics: ['Product Damage'],
        day: 'Wed',
      },
      {
        id: 5,
        source: 'Email',
        text: 'The delivery speed was great, but the packaging was poor.',
        sentiment: 'Mixed',
        advancedSentiment: 'Mixed',
        topics: ['Delivery Speed', 'Packaging Issues'],
        day: 'Thu',
      },
      {
        id: 6,
        source: 'Review',
        text: 'Customer service was unhelpful when I called about my late delivery.',
        sentiment: 'Negative',
        advancedSentiment: 'Disappointed',
        topics: ['Customer Service', 'Shipment Delays'],
        day: 'Sat',
      },
    ],
    aiRecommendations: [
      'Optimize route planning for the "Western Region" to reduce average delivery time.',
      'Analyze the impact of recent fuel price changes on overall cost efficiency.',
      'Investigate the root cause of on-time delivery rate drops on weekends.',
      'Implement a proactive communication system for shipment delays via SMS.',
    ],
    predictiveAnalytics: {
      predictedOnTimeRate: 96,
      forecastPeriod: 'Next Month',
    },
    causalAnalysis: {
      title: 'Fuel Costs and Delivery Speed',
      insight: 'Causal analysis suggests that the 10% increase in fuel costs over the last quarter is a significant driver of the 5% decrease in average delivery speed.',
    },
    topicModeling: [
      { topic: 'Delivery Speed', count: 18, sentiment: 'Mixed' },
      { topic: 'Packaging Issues', count: 7, sentiment: 'Negative' },
      { topic: 'Customer Service', count: 5, sentiment: 'Neutral' },
    ],
    dataPipelineStatus: [
      { source: 'Email API', status: 'Healthy', lastSync: 'Just now' },
      { source: 'SurveyMonkey API', status: 'Healthy', lastSync: '2 minutes ago' },
      { source: 'Logistics Provider API', status: 'Degraded', lastSync: '15 minutes ago' },
    ]
  };

  // Function to simulate loading data
  const loadData = (sourceData = mockData) => {
    setIsLoadingData(true);
    // In a real application, you would make an API call here.
    setTimeout(() => {
      setData(sourceData);
      setIsLoadingData(false);
    }, 1500); // Simulate a 1.5 second network delay
  };

  // Function to check for and create alerts based on predefined thresholds
  const checkThresholds = () => {
    // Only run if data is available and has the necessary properties
    if (!data || !data.performanceMetrics) return;

    const newAlerts = [];
    const avgDeliveryThreshold = 3;
    const onTimeRateThreshold = 90;

    if (data.performanceMetrics.avgDeliveryTime > avgDeliveryThreshold) {
      newAlerts.push({
        id: 'avg-delivery-time',
        message: `Alert: Average delivery time has exceeded ${avgDeliveryThreshold} days, currently at ${data.performanceMetrics.avgDeliveryTime} days.`,
        type: 'warning',
      });
    }

    if (data.performanceMetrics.onTimeRate < onTimeRateThreshold) {
      newAlerts.push({
        id: 'on-time-rate',
        message: `Alert: The on-time delivery rate has dropped below ${onTimeRateThreshold}%, currently at ${data.performanceMetrics.onTimeRate}%.`,
        type: 'warning',
      });
    }

    setAlerts(newAlerts);
  };

  // Function to dismiss an alert by its ID
  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Function to filter feedback based on a day (for drill-down)
  const handleDrillDown = (day) => {
    if (!data || !data.recentFeedback) return;
    const drillDownData = data.recentFeedback.filter(feedback => feedback.day === day);
    setFilteredFeedback(drillDownData);
  };
  
  // This useEffect now runs when the component mounts to load the initial data
  useEffect(() => {
    loadData();
  }, []);

  // useEffect hook to handle data streaming and chart rendering
  useEffect(() => {
    if (!data) return;

    // Simulate streaming data updates
    const intervalId = setInterval(() => {
      const newFeedbackId = data.recentFeedback.length + 1;
      const newFeedback = {
        id: newFeedbackId,
        source: 'Chatbot',
        text: `New feedback received: delivery was ${Math.random() > 0.5 ? 'fast' : 'slow'}.`,
        sentiment: Math.random() > 0.5 ? 'Positive' : 'Negative',
        advancedSentiment: Math.random() > 0.5 ? 'Satisfied' : 'Frustrated',
        topics: ['Delivery Speed', 'Customer Service'],
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(Math.random() * 7)],
      };

      const newPipelineStatus = data.dataPipelineStatus.map(pipeline => {
          const statuses = ['Healthy', 'Degraded', 'Offline'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
              ...pipeline,
              status: Math.random() > 0.8 ? newStatus : pipeline.status,
              lastSync: newStatus === 'Healthy' ? 'Just now' : pipeline.status === 'Degraded' ? '15 minutes ago' : '1 hour ago'
          }
      });
      
      const newData = {
        ...data,
        performanceMetrics: {
          ...data.performanceMetrics,
          onTimeRate: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
          avgDeliveryTime: (Math.random() * (3.5 - 2.0) + 2.0).toFixed(1),
          shipmentDelays: Math.floor(Math.random() * 20),
        },
        deliveryTimeTrend: data.deliveryTimeTrend.map(d => ({ ...d, value: (Math.random() * (4.0 - 2.0) + 2.0) })),
        shipmentVolume: data.shipmentVolume.map(d => ({ ...d, value: Math.floor(Math.random() * (200 - 100 + 1)) + 100 })),
        recentFeedback: [newFeedback, ...data.recentFeedback].slice(0, 6),
        dataPipelineStatus: newPipelineStatus,
      };

      setData(newData);
    }, 5000);

    if (logisticsChartRef.current && data.deliveryTimeTrend) {
      if (logisticsChartInstance.current) {
        logisticsChartInstance.current.destroy();
      }

      const logisticsCtx = logisticsChartRef.current.getContext('2d');
      logisticsChartInstance.current = new Chart(logisticsCtx, {
        type: 'bar',
        data: {
          labels: data.deliveryTimeTrend.map(d => d.day),
          datasets: [
            {
              label: 'Avg. Delivery Time (Days)',
              data: data.deliveryTimeTrend.map(d => d.value),
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgb(255, 159, 64)',
              borderWidth: 1,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Weekly Average Delivery Time',
              font: { size: 18, weight: 'bold' },
              color: '#374151',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time (Days)',
                font: { size: 14 },
              },
              grid: {
                color: '#e5e7eb',
              },
            },
            x: {
              grid: {
                color: '#e5e7eb',
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const clickedIndex = elements[0].index;
              const day = data.deliveryTimeTrend[clickedIndex].day;
              handleDrillDown(day);
            }
          },
        },
      });
    }

    if (shipmentChartRef.current && data.shipmentVolume) {
      if (shipmentChartInstance.current) {
        shipmentChartInstance.current.destroy();
      }

      const shipmentCtx = shipmentChartRef.current.getContext('2d');
      shipmentChartInstance.current = new Chart(shipmentCtx, {
        type: 'line',
        data: {
          labels: data.shipmentVolume.map(d => d.day),
          datasets: [
            {
              label: 'Shipment Volume',
              data: data.shipmentVolume.map(d => d.value),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Weekly Shipment Volume',
              font: { size: 18, weight: 'bold' },
              color: '#374151',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Shipments',
                font: { size: 14 },
              },
              grid: {
                color: '#e5e7eb',
              },
            },
            x: {
              grid: {
                color: '#e5e7eb',
              },
            },
          },
        },
      });
    }

    return () => {
      clearInterval(intervalId);
      if (logisticsChartInstance.current) {
        logisticsChartInstance.current.destroy();
      }
      if (shipmentChartInstance.current) {
        shipmentChartInstance.current.destroy();
      }
    };
  }, [data]);

  // useEffect to check for alerts when data changes
  useEffect(() => {
    checkThresholds();
  }, [data]);

  // useEffect to log filter changes
  useEffect(() => {
    console.log('Filters updated:', filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  
  // Conditionally render a loading screen or the dashboard
  if (isLoadingData || !data) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8 font-sans antialiased">
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl">
                <div className="spinner-border text-blue-500" role="status">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <p className="mt-4 text-gray-600 text-lg font-medium">Loading dashboard data...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased">
      <div className="w-full mx-auto">
        {/* Dashboard Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
              <span className="bg-blue-600 text-white rounded-full p-3 mr-4 shadow-lg">
                <i className="fas fa-shipping-fast"></i>
              </span>
              Logistics Performance Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Hello, {user.name} ({user.role})</span>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                >
                    <i className="fas fa-sign-out-alt mr-2"></i> Log Out
                </button>
            </div>
          </div>
          <p className="mt-4 text-lg text-gray-600 border-l-4 border-blue-500 pl-4">
            A comprehensive overview of key logistics metrics with AI-powered recommendations for operational excellence.
          </p>
        </header>

        {/* Alerts and Notifications Section */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-center justify-between"
                role="alert"
              >
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 mr-3 text-xl"></i>
                  <p className="font-semibold">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Dismiss alert"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Filters Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Date Range Filter */}
            <div className="flex-1 w-full">
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                name="dateRange"
                id="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex-1 w-full">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                name="region"
                id="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map((region, index) => (
                  <option key={index} value={region.toLowerCase().replace(' ', '-')}>{region}</option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div className="flex-1 w-full">
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                name="product"
                id="product"
                value={filters.product}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {products.map((product, index) => (
                  <option key={index} value={product.toLowerCase().replace(' ', '-')}>{product}</option>
                ))}
              </select>
            </div>

            {/* Shipment Type Filter */}
            <div className="flex-1 w-full">
              <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700 mb-1">Shipment Type</label>
              <select
                name="shipmentType"
                id="shipmentType"
                value={filters.shipmentType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {shipmentTypes.map((type, index) => (
                  <option key={index} value={type.toLowerCase().replace(' ', '-')}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* On-Time Delivery Rate Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">On-Time Delivery Rate</h3>
              <i className="fas fa-check-circle text-green-500 text-3xl"></i>
            </div>
            <p className="text-5xl font-bold text-gray-900">{data.performanceMetrics.onTimeRate}%</p>
            <p className="text-green-600 mt-2 flex items-center">
              <i className="fas fa-arrow-up mr-2"></i> +1.2% from last week
            </p>
          </div>

          {/* Average Delivery Time Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Avg. Delivery Time</h3>
              <i className="fas fa-truck text-blue-500 text-3xl"></i>
            </div>
            <p className="text-5xl font-bold text-gray-900">{data.performanceMetrics.avgDeliveryTime} days</p>
            <p className="text-red-600 mt-2 flex items-center">
              <i className="fas fa-arrow-down mr-2"></i> -0.1 days from last week
            </p>
          </div>

          {/* Cost Efficiency Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Cost Efficiency</h3>
              <i className="fas fa-dollar-sign text-green-500 text-3xl"></i>
            </div>
            <p className="text-5xl font-bold text-gray-900">{data.performanceMetrics.costEfficiency}</p>
            <p className="text-green-600 mt-2 flex items-center">
              <i className="fas fa-arrow-down mr-2"></i> -5% from last month
            </p>
          </div>

          {/* Predicted On-Time Rate Card (Predictive Analytics) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Predicted On-Time Rate</h3>
              <i className="fas fa-chart-line text-purple-500 text-3xl"></i>
            </div>
            <p className="text-5xl font-bold text-gray-900">{data.predictiveAnalytics.predictedOnTimeRate}%</p>
            <p className="text-gray-500 mt-2 flex items-center">
              <i className="fas fa-calendar-alt mr-2"></i> Forecast for {data.predictiveAnalytics.forecastPeriod}
            </p>
          </div>
        </section>

        {/* Charts & Recommendations Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Avg. Delivery Time Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200 cursor-pointer">
            <canvas ref={logisticsChartRef}></canvas>
            <p className="text-center text-sm text-gray-500 mt-4">Click on a bar to view feedback for that day.</p>
          </div>

          {/* AI Recommendations Card (Only visible to 'editor' role) */}
          {user.role === 'editor' && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform transform hover:scale-[1.01] hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-robot mr-3 text-blue-200"></i> AI-Powered Recommendations
              </h3>
              <ul className="space-y-4">
                {data.aiRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-white bg-blue-700 bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
                    <span className="flex-shrink-0 text-blue-300 mr-4 mt-1">
                      <i className="fas fa-lightbulb"></i>
                    </span>
                    <p className="text-lg leading-relaxed">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Drill-down View Section */}
        {filteredFeedback.length > 0 && (
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-search-plus mr-3 text-blue-500"></i> Detailed Feedback
              </h3>
              <button
                onClick={() => setFilteredFeedback([])}
                className="bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-times mr-2"></i> Close View
              </button>
            </div>
            <ul className="space-y-4">
              {filteredFeedback.map((feedback) => (
                <li key={feedback.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span
                        className={`font-semibold mr-3 px-4 py-1 rounded-full text-sm uppercase ${
                          feedback.sentiment === 'Positive'
                            ? 'bg-green-100 text-green-700'
                            : feedback.sentiment === 'Negative'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feedback.advancedSentiment}
                      </span>
                      <span className="text-base text-gray-500">
                        <i className="fas fa-at mr-1"></i> {feedback.source}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feedback.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Advanced Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Causal Analysis Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-project-diagram mr-3 text-cyan-500"></i> Causal Analysis
            </h3>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">{data.causalAnalysis.title}</h4>
            <p className="text-gray-600 leading-relaxed">{data.causalAnalysis.insight}</p>
          </div>

          {/* Topic Modeling Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-tags mr-3 text-pink-500"></i> Topic Modeling
            </h3>
            <ul className="space-y-4">
              {data.topicModeling.map((topic, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className={`font-semibold mr-3 px-3 py-1 rounded-full text-xs uppercase ${
                      topic.sentiment === 'Positive' ? 'bg-green-200 text-green-800' :
                      topic.sentiment === 'Negative' ? 'bg-red-200 text-red-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {topic.sentiment}
                    </span>
                    <span className="text-lg font-medium text-gray-800">{topic.topic}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-600">{topic.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Pipeline Status Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-database mr-3 text-teal-500"></i> Data Pipeline Status
            </h3>
            <ul className="space-y-4">
              {data.dataPipelineStatus.map((pipeline, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className={`font-semibold mr-3 px-3 py-1 rounded-full text-xs uppercase ${
                      pipeline.status === 'Healthy' ? 'bg-green-200 text-green-800' :
                      pipeline.status === 'Degraded' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {pipeline.status}
                    </span>
                    <span className="text-sm text-gray-500">Last Sync: {pipeline.lastSync}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shipment Trend & Recent Feedback Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipment Volume Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200">
            <canvas ref={shipmentChartRef}></canvas>
          </div>

          {/* Recent Customer Feedback List (with Advanced Sentiment Filters) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col transition-transform transform hover:scale-[1.01] hover:shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-comment-dots mr-3"></i> Recent Customer Feedback
            </h3>
            <ul className="space-y-4 overflow-auto max-h-96 pr-4">
              {data.recentFeedback.map((feedback) => (
                <li key={feedback.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span
                        className={`font-semibold mr-3 px-4 py-1 rounded-full text-sm uppercase ${
                          feedback.sentiment === 'Positive'
                            ? 'bg-green-100 text-green-700'
                            : feedback.sentiment === 'Negative'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feedback.advancedSentiment}
                      </span>
                      <span className="text-base text-gray-500">
                        <i className="fas fa-at mr-1"></i> {feedback.source}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center">
                      {feedback.topics.map((topic, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full ml-2">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feedback.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TOP-LEVEL APPLICATION COMPONENT
// -----------------------------------------------------------------------------

export default function App() {
  const [user, setUser] = useState(null);
  const login = (userData) => { setUser(userData); };
  const logout = () => { setUser(null); };

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <style>
          {`
            * { box-sizing: border-box; }
            html, body { height: 100%; margin: 0; padding: 0; }
            .login-container {
              height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;
              background: linear-gradient(120deg, #c1dfc4 0%, #deecdd 100%);
              font-family: 'Segoe UI', sans-serif;
              min-height: 100vh; min-width: 100vw; box-sizing: border-box; position: fixed; top: 0; left: 0;
            }
            .login-box {
              background: #fff; border-radius: 22px; box-shadow: 0 6px 32px 0 rgba(32,40,47,0.12);
              padding: 2.5rem 2rem 2rem 2rem; min-width: 330px; max-width: 370px;
              display: flex; flex-direction: column; align-items: center;
            }
            .login-logo { margin-bottom: 1rem; }
            .login-title { font-size: 1.6rem; font-weight: 600; color: #276c38; margin-bottom: 1.2rem; text-align: center; }
            .input-group { position: relative; margin-bottom: 1.5rem; }
            .login-input {
              width: 100%; padding: 1.1rem 2.8rem 1.1rem 1rem; border: 1.8px solid #cadfdc;
              border-radius: 12px; font-size: 1.06rem; outline: none; transition: border-color 0.2s, box-shadow 0.22s; background: #f9fafb;
            }
            .login-input.filled, .login-input:focus { border-color: #65b686; box-shadow: 0 0 0 2px #caebd4; }
            .input-group label {
              position: absolute; left: 1rem; top: 1.1rem; color: #999; font-size: 1rem;
              pointer-events: none; transition: all 0.22s;
            }
            .input-group label.floating, .login-input:focus + label {
              top: -0.64rem; left: 0.87rem; font-size: 0.84rem; color: #276c38;
              background: #fff; padding: 0 0.22rem; border-radius: 6px;
            }
            .toggle-password {
              position: absolute; right: 1rem; top: 1.1rem; cursor: pointer; font-size: 1.18rem;
              color: #7bb47a; transition: color 0.2s; user-select: none;
            }
            .toggle-password:focus { outline: 2px solid #276c38; }
            .caps-lock-warning {
              color: #b1362a; background: #f7ddd8; padding: 0.28rem 0.6rem; border-radius: 7px;
              font-size: 0.92rem; margin-bottom: 0.65rem; letter-spacing: 0.02em; text-align: center; animation: fadeIn 0.6s;
            }
            .login-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
            .login-btn {
              background: #67c088; color: #fff; font-weight: 600; padding: 0.9rem 2.1rem;
              border-radius: 14px; border: none; font-size: 1.10rem; cursor: pointer;
              box-shadow: 0 2px 6px rgba(32,40,47,0.08); transition: background 0.2s, box-shadow 0.28s, transform 0.22s;
            }
            .login-btn:hover:not(:disabled) { background: #53a672; box-shadow: 0 4px 24px rgba(32,40,47,0.13); transform: translateY(-2px); }
            .login-btn:disabled { background: #b8e5ca; cursor: wait; }
            .loading .spinner {
              border: 3px solid #67c088; border-top: 3px solid #fff; border-radius: 50%;
              width: 22px; height: 22px; animation: spin 0.84s linear infinite;
              display: inline-block; vertical-align: middle;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0;} to { opacity: 1; } }
            .login-form.shake { animation: shake 0.38s linear; }
            @keyframes shake {
              15% { transform: translateX(-9px); } 30% { transform: translateX(6px); } 45% { transform: translateX(-5px); }
              60% { transform: translateX(3px); } 75% { transform: translateX(-2px); } 90% { transform: translateX(1px); }
              100% { transform: translateX(0); }
            }
            .forgot-link {
              font-size: 0.98rem; color: #54955b; text-decoration: underline; background: none; border: none;
              cursor: pointer; transition: color 0.18s;
            }
            .forgot-link:hover { color: #276c38; }
            .divider {
              text-align: center; color: #b5c9bb; margin: 1.1rem 0 0.8rem 0; letter-spacing: 0.14em;
              position: relative;
            }
            .divider:before, .divider:after {
              content: ''; display: inline-block; height: 1.3px; width: 32px;
              background: #e1eee5; vertical-align: middle; margin: 0 8px;
            }
            .social-login { display: flex; gap: 0.9rem; justify-content: center; }
            .social-btn {
              background: #f2fff7; color: #276c38; border: none; border-radius: 10px;
              font-size: 1.02rem; padding: 0.75rem 1.1rem; min-width: 110px;
              box-shadow: 0 1px 5px rgba(32,40,47,0.06); cursor: pointer; transition: background 0.18s;
              display: flex; align-items: center; gap: 0.6em;
            }
            .social-btn.google { background: #eafbf2; }
            .social-btn.facebook { background: #e6f2fb; }
            .social-btn:hover { background: #cdf6e1; }
            .social-icon { font-size: 1.14em; }
            .error-message {
              background: #fbeaea; color: #b1362a; border-radius: 7px; padding: 0.5rem;
              margin-top: 0.88rem; font-size: 1.02rem; text-align: center; animation: fadeIn 0.6s;
            }
            .login-hint {
              margin-top: 0.82rem; font-size: 0.93rem; color: #8ba19a; text-align: center;
              background: #f6f8f7; border-radius: 8px; padding: 0.33rem 0.5rem;
            }
            @media (max-width: 480px) { .login-box { min-width: 95vw; padding: 1.5rem 1.2rem; } }
          `}
        </style>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans antialiased">
          <Login />
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased">
        <Dashboard />
      </div>
    </AuthContext.Provider>
  );
}
