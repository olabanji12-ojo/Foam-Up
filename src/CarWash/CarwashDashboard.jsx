import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { baseURL } from "../utils/environments";
import axios from "axios";
import 'uikit/dist/css/uikit.min.css';

const CarwashDashboard = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    services: [],
    earnings: 0,
    is_active: true,
  });
  const [carwash, setCarwash] = useState({ name: "My Car Wash", is_active: true });
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Bookings tab specific state
  const [bookingsFilter, setBookingsFilter] = useState({
    status: "all",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });
  const [allBookings, setAllBookings] = useState([]);
  const [updatingBooking, setUpdatingBooking] = useState(null);

  // Services tab specific state
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    is_active: true
  });

  // Availability tab specific state  
  const [availability, setAvailability] = useState({
    working_days: [],
    working_hours: { start: "09:00", end: "18:00" },
    holidays: [],
    is_open: true
  });
  const [editingAvailability, setEditingAvailability] = useState(false);

  // Slots tab specific state
  const [slots, setSlots] = useState([]);
  const [selectedSlotDate, setSelectedSlotDate] = useState(new Date().toISOString().split("T")[0]);
  const [slotForm, setSlotForm] = useState({
    date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "10:00",
    capacity: 1,
    is_available: true
  });
  const [showSlotModal, setShowSlotModal] = useState(false);

  // Settings tab specific state
  const [settings, setSettings] = useState({
    name: "",
    description: "",
    address: "",
    state: "",
    country: "",
    lga: "",
    email: "",
    phone: "",
    is_active: true,
    auto_confirm_bookings: false,
    advance_booking_days: 1,
    max_cars_per_slot: 1,
    service_range_minutes: 30,
    home_service: false,
    delivery_radius_km: 0,
    latitude: "",
    longitude: "",
    open_hours: {
      mon: { start: "", end: "" },
      tue: { start: "", end: "" },
      wed: { start: "", end: "" },
      thu: { start: "", end: "" },
      fri: { start: "", end: "" },
      sat: { start: "", end: "" },
      sun: { start: "", end: "" },
    },
  });

  const [updatingSettings, setUpdatingSettings] = useState(false);

  const carwashId = user?.carwash_id;

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("🔍 AUTH CHECK:");
    console.log("carwashId exists:", !!carwashId);
    
    if (!carwashId) {
      console.log("❌ No carwashId found, redirecting to login");
      // navigate("/login");
    }
  }, [carwashId, navigate]);
  
  // Fetch carwash details
  useEffect(() => {
    const fetchCarwash = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/carwashes/${carwashId}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        
        setCarwash({
          name: res.data.name || "My Car Wash",
          is_active: res.data.is_active || true,
        });
        
        console.log("Updated carwash state:", {
          name: res.data.name || "My Car Wash",
          is_active: res.data.is_active || true,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch carwash details");
      } finally {
        setLoading(false);
      }
    };

    if (carwashId) {
      console.log("🚀 Starting carwash fetch...");
      fetchCarwash();
    } else {
      console.log("⏸️ Skipping carwash fetch - no carwashId");
    }
  }, [carwashId, token]);

  // Fetch bookings & services
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Fetch bookings for the selected date
        const bookingsURL = `${baseURL}/bookings/carwash/${carwashId}/date?date=${slotDate}`;
        const bookingsRes = await axios.get(bookingsURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        // Fetch services for the carwash
        const servicesURL = `${baseURL}/carwashes/services/carwash/${carwashId}`;
        console.log("🛠️ SERVICES REQUEST:");
        console.log("Full services URL:", servicesURL);
        
        const servicesRes = await axios.get(servicesURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const processedBookings = Array.isArray(bookingsRes.data.data) ? bookingsRes.data.data : [];
        const processedServices = Array.isArray(servicesRes.data.data) ? servicesRes.data.data : [];
        
        setDashboardData({
          bookings: processedBookings,
          services: processedServices,
          earnings: 0,
          is_active: carwash.is_active,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (carwashId) {
      console.log("🚀 Starting dashboard fetch...");
      fetchDashboard();
    } else {
      console.log("⏸️ Skipping dashboard fetch - no carwashId");
    }
  }, [carwashId, slotDate, token, carwash.is_active]);

  // Bookings Tab Functions 
  // Fetch all bookings for bookings tab
  const fetchAllBookings = async () => {
    try {
      console.log("🔍 FETCHING ALL BOOKINGS:");
      console.log("Filter:", bookingsFilter);
      
      setLoading(true);
      const res = await axios.get(
        `${baseURL}/bookings/carwash/${carwashId}/filter?status=${bookingsFilter.status}&from=${bookingsFilter.dateFrom}&to=${bookingsFilter.dateTo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );  
      
      console.log("✅ ALL BOOKINGS RESPONSE:");
      console.log("Response:", res.data.data);
      
      setAllBookings(Array.isArray(res.data.data) ? res.data.data : res.data || []);
    } catch (err) {
      console.error("❌ ALL BOOKINGS FETCH ERROR:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingBooking(bookingId);
      const res = await axios.patch(
        `${baseURL}/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ UPDATE BOOKING RESPONSE:", res.data);
      
      if (activeTab === "bookings") {
        fetchAllBookings();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("❌ UPDATE BOOKING ERROR:", err);
      setError(err.response?.data?.message || "Failed to update booking");
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === "bookings" && carwashId) {
      fetchAllBookings();
    }
  }, [activeTab, bookingsFilter, carwashId]);

  // Services Tab Functions
  const fetchServices = async () => {
    try {
      console.log("🔍 FETCHING SERVICES:");
      setLoading(true);
      const res = await axios.get(`${baseURL}/carwashes/services/carwash/${carwashId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log("✅ SERVICES RESPONSE:", res.data);
      setServices(Array.isArray(res.data.data) ? res.data.data : res.data || []);
    } catch (err) {
      console.error("❌ SERVICES FETCH ERROR:", err);
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const saveService = async () => {
    try {
      console.log("💾 SAVING SERVICE:", serviceForm);
      setLoading(true);
      
      if (editingService) {
        const payload = {
          ...serviceForm,
          price: parseFloat(serviceForm.price),
          duration: parseInt(serviceForm.duration, 10),
          carwash_id: carwashId,
        };
        const res = await axios.put(
          `${baseURL}/carwashes/services/${carwashId}?service_id=${editingService.id}`,
          payload,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        console.log("✅ SERVICE UPDATE RESPONSE:", res.data);
      } else {
        const payload = {
          ...serviceForm,
          price: parseFloat(serviceForm.price),
          duration: parseInt(serviceForm.duration, 10),
          carwash_id: carwashId,
        };
        const res = await axios.post(
          `${baseURL}/carwashes/services/${carwashId}`,
          payload,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        console.log("✅ SERVICE CREATE RESPONSE:", res.data);
      }
      
      setShowServiceModal(false); 
      setEditingService(null);
      setServiceForm({ name: "", description: "", price: "", duration: "", is_active: true });
      fetchServices();
    } catch (err) {
      console.error("❌ SAVE SERVICE ERROR:", err);
      setError(err.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      console.log("🗑️ DELETING SERVICE:", serviceId);
      setLoading(true);
      await axios.delete(`${baseURL}/carwashes/services/${carwashId}?service_id=${serviceId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error("❌ DELETE SERVICE ERROR:", err);
      setError(err.response?.data?.message || "Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  // Settings Tab Functions
  const fetchSettings = async () => {
    try {
      console.log("🔍 FETCHING SETTINGS:");
      setLoading(true);
      const res = await axios.get(`${baseURL}/carwashes/${carwashId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log("✅ SETTINGS RESPONSE:", res.data.data);
      setSettings({
        name: res.data.data.name || "",
        phone: res.data.data.phone || "",
        email: res.data.data.email || "",
        is_active: res.data.data.is_active ?? false,
        address: res.data.data.address || "",
        description: res.data.data.description || "",
        state: res.data.data.state || "",
        country: res.data.data.lga || "",
        lga: res.data.data.lga || "",
        max_cars_per_slot: res.data.data.max_cars_per_slot || 0,
        service_range_minutes: res.data.data.service_range_minutes || 0,
        home_service: res.data.data.home_service ?? false,
        delivery_radius_km: res.data.data.delivery_radius_km || 0,
        latitude: res.data.data.latitude || "",
        longitude: res.data.data.longitude || "",
        open_hours: {
          mon: { start: res.data.data.open_hours?.mon?.start || "", end: res.data.data.open_hours?.mon?.end || "" },
          tue: { start: res.data.data.open_hours?.tue?.start || "", end: res.data.data.open_hours?.tue?.end || "" },
          wed: { start: res.data.data.open_hours?.wed?.start || "", end: res.data.data.open_hours?.wed?.end || "" },
          thu: { start: res.data.data.open_hours?.thu?.start || "", end: res.data.data.open_hours?.thu?.end || "" },
          fri: { start: res.data.data.open_hours?.fri?.start || "", end: res.data.data.open_hours?.fri?.end || "" },
          sat: { start: res.data.data.open_hours?.sat?.start || "", end: res.data.data.open_hours?.sat?.end || "" },
          sun: { start: res.data.data.open_hours?.sun?.start || "", end: res.data.data.open_hours?.sun?.end || "" },
        },
      });
    } catch (err) {
      console.error("❌ SETTINGS FETCH ERROR:", err);
      setError(err.response?.data?.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      console.log("💾 SAVING SETTINGS:", settings);
      const payload = {
        ...settings,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(settings.longitude) || 0,
            parseFloat(settings.latitude) || 0,
          ],
        },
      };
      setUpdatingSettings(true);
      const res = await axios.put(
        `${baseURL}/carwashes/${carwashId}`,
        payload,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      console.log("✅ SETTINGS SAVE RESPONSE:", res.data);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("❌ SAVE SETTINGS ERROR:", err);
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setUpdatingSettings(false);
    }
  };

  // Load data when tabs become active
  useEffect(() => {
    if (activeTab === "services" && carwashId) {
      fetchServices();
    } else if (activeTab === "settings" && carwashId) {
      fetchSettings();
    }
  }, [activeTab, carwashId]);

  // Debug state changes
  useEffect(() => {
    console.log("🔄 STATE CHANGE - dashboardData updated:");
    console.log("Current dashboardData:", dashboardData);
  }, [dashboardData]);

  useEffect(() => {
    console.log("🔄 STATE CHANGE - slotDate updated:");
    console.log("New slotDate:", slotDate);
  }, [slotDate]);
  
  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="container mx-auto p-4 sm:p-6 max-w-full sm:max-w-4xl " uk-scrollspy="cls: uk-animation-slide-bottom-small; target: .card; delay: 200">
        {/* Tabs Navigation */}
        <nav className="mb-6 mt-30 ">
          <ul className="flex flex-wrap gap-2 border-b border-gray-200">
            {["dashboard", "bookings", "services", "settings"].map((tab) => (
              <li key={tab}>  
                <button
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    console.log(`🔄 TAB CHANGE: ${activeTab} -> ${tab}`);
                    setActiveTab(tab);
                  }}
                >
                  <span uk-icon={`icon: ${tab === 'dashboard' ? 'grid' : tab === 'bookings' ? 'calendar' : tab === 'services' ? 'cog' : 'settings'}; ratio: 1`} className="mr-2"></span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>

            {loading && (
              <div className="text-center">
                <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Today's Earnings</h3>
                    <p className="text-2xl font-bold text-gray-900">₦{Number(dashboardData.earnings || 0).toFixed(2)}</p>
                  </div>
                  <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Today's Bookings</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.bookings.length || 0}</p>
                  </div>
                  <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Status</h3>
                    <p className={`text-2xl font-bold ${dashboardData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {dashboardData.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="card bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => {
                      console.log("📅 DATE CHANGE:");
                      console.log("Old date:", slotDate);
                      console.log("New date:", e.target.value);
                      setSlotDate(e.target.value);
                    }}
                    className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  />
                </div>

                {/* Bookings Table */}
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Today's Bookings</h3>
                  {dashboardData.bookings.length === 0 ? (
                    <p className="text-center text-gray-600">No bookings for {slotDate}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dashboardData.bookings.map((booking, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 text-sm text-gray-900">{booking.id}</td>
                              <td className="p-3 text-sm text-gray-900">{booking.service_name || "N/A"}</td>
                              <td className="p-3 text-sm text-gray-900">{booking.time || "N/A"}</td>
                              <td className="p-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Services Section */}
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Services</h3>
                  {dashboardData.services.length === 0 ? (
                    <p className="text-center text-gray-600">No services available</p>
                  ) : (
                    <ul className="space-y-2">
                      {dashboardData.services.map((service, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-900">
                          <span uk-icon="icon: cog; ratio: 1" className="mr-2 text-blue-600"></span>
                          {service.name} — ₦{service.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Manage Bookings</h2>

            {/* Filters */}
            <div className="card bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Bookings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={bookingsFilter.status}
                    onChange={(e) => setBookingsFilter({...bookingsFilter, status: e.target.value})}
                    className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={bookingsFilter.dateFrom}
                    onChange={(e) => setBookingsFilter({...bookingsFilter, dateFrom: e.target.value})}
                    className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={bookingsFilter.dateTo}
                    onChange={(e) => setBookingsFilter({...bookingsFilter, dateTo: e.target.value})}
                    className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchAllBookings}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all"
                  >
                    <span uk-icon="icon: search; ratio: 1" className="mr-2"></span>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center">
                <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
                <p className="text-gray-600 mt-2">Loading bookings...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
                {error}
              </div>
            )}

            {/* Bookings Table */}
            {!loading && !error && (
              <div className="card bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
                {allBookings.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">
                    <p className="text-xl font-semibold mb-2">No bookings found</p>
                    <p>Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(Array.isArray(allBookings) ? allBookings : []).map((booking, index) => (
                        <tr key={booking.id || index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-900">#{booking.id || 'N/A'}</td>
                          <td className="p-3">
                            <div className="text-sm font-medium text-gray-900">{booking.customer_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{booking.customer_phone || 'N/A'}</div>
                          </td>
                          <td className="p-3 text-sm text-gray-900">{booking.service_name || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-900">
                            <div>{booking.booking_date || 'N/A'}</div>
                            <div className="text-gray-500">{booking.booking_time || 'N/A'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-900">₦{booking.amount || booking.price || 'N/A'}</td>
                          <td className="p-3 text-sm font-medium space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  disabled={updatingBooking === booking.id}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  <span uk-icon="icon: check; ratio: 1" className="mr-1"></span>
                                  {updatingBooking === booking.id ? 'Updating...' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  disabled={updatingBooking === booking.id}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  <span uk-icon="icon: close; ratio: 1" className="mr-1"></span>
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                disabled={updatingBooking === booking.id}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              >
                                <span uk-icon="icon: check-circle; ratio: 1" className="mr-1"></span>
                                {updatingBooking === booking.id ? 'Updating...' : 'Complete'}
                              </button>
                            )}
                            {(booking.status === 'completed' || booking.status === 'cancelled') && (
                              <span className="text-gray-400">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Summary Stats for Bookings */}
            {!loading && !error && allBookings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{allBookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-gray-600">Pending</p>
                </div>
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{allBookings.filter(b => b.status === 'confirmed').length}</p>
                  <p className="text-gray-600">Confirmed</p>
                </div>
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{allBookings.filter(b => b.status === 'completed').length}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{allBookings.filter(b => b.status === 'cancelled').length}</p>
                  <p className="text-gray-600">Cancelled</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Manage Services</h2>

            {/* Add Service Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowServiceModal(true);
                  setEditingService(null);
                  setServiceForm({ name: "", description: "", price: "", duration: "", is_active: true });
                }}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md transition-all flex items-center"
              >
                <span uk-icon="icon: plus; ratio: 1" className="mr-2"></span>
                Add New Service
              </button>
            </div>

            {loading && (
              <div className="text-center">
                <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
                <p className="text-gray-600 mt-2">Loading services...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
                {error}
              </div>
            )}

            {/* Services Table */}
            {!loading && !error && (
              <div className="card bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
                {(Array.isArray(services) && services.length === 0) ? (
                  <div className="p-8 text-center text-gray-600">
                    <p className="text-xl font-semibold mb-2">No services found</p>
                    <p>Add your first service to get started</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(Array.isArray(services) ? services : []).map((service, index) => (
                        <tr key={service.id || index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm font-medium text-gray-900">{service.name}</td>
                          <td className="p-3 text-sm text-gray-900">{service.description || 'N/A'}</td>
                          <td className="p-3 text-sm text-gray-900">₦{service.price}</td>
                          <td className="p-3 text-sm text-gray-900">{service.duration || 'N/A'} mins</td>
                          <td className="p-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setEditingService(service);
                                setServiceForm({
                                  name: service.name,
                                  description: service.description || "",
                                  price: service.price.toString(),
                                  duration: service.duration?.toString() || "",
                                  is_active: service.is_active !== false
                                });
                                setShowServiceModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <span uk-icon="icon: pencil; ratio: 1" className="mr-1"></span>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this service?')) {
                                  deleteService(service.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <span uk-icon="icon: trash; ratio: 1" className="mr-1"></span>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                      <input
                        type="text"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="e.g., Basic Wash"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        rows="2"
                        placeholder="Service description..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                        <input
                          type="number"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                          className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                          placeholder="2000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                        <input
                          type="number"
                          value={serviceForm.duration}
                          onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                          className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                          placeholder="60"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={serviceForm.is_active}
                        onChange={(e) => setServiceForm({...serviceForm, is_active: e.target.checked})}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 flex items-center">
                        Service is active
                        <span uk-icon="icon: check; ratio: 1" className="ml-2 text-blue-600"></span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={saveService}
                      disabled={!serviceForm.name || !serviceForm.price}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md disabled:opacity-50 flex items-center justify-center"
                    >
                      <span uk-icon="icon: check; ratio: 1" className="mr-2"></span>
                      {editingService ? 'Update Service' : 'Add Service'}
                    </button>
                    <button
                      onClick={() => setShowServiceModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:shadow-md flex items-center justify-center"
                    >
                      <span uk-icon="icon: close; ratio: 1" className="mr-2"></span>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Business Settings</h2>

            {loading && (
              <div className="text-center">
                <span uk-spinner="ratio: 1.5" className="text-blue-600"></span>
                <p className="text-gray-600 mt-2">Loading settings...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
                {error}
              </div>
            )}

            {!loading && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="My Car Wash"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="+234 123 456 7890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="info@mycarwash.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={settings.is_active ? "active" : "inactive"}
                        onChange={(e) => setSettings({ ...settings, is_active: e.target.value === "active" })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={settings.state || ""}
                        onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={settings.country || ""}
                        onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="Enter country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
                      <input
                        type="text"
                        value={settings.lga || ""}
                        onChange={(e) => setSettings({ ...settings, lga: e.target.value })}
                        className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        placeholder="Enter LGA"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      rows="2"
                      placeholder="123 Main Street, City, State"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      rows="3"
                      placeholder="Describe your car wash business..."
                    />
                  </div>
                </div>

                {/* Booking Settings */}
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="auto_confirm"
                        checked={settings.auto_confirm_bookings}
                        onChange={(e) => setSettings({ ...settings, auto_confirm_bookings: e.target.checked })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="auto_confirm" className="ml-2 text-sm text-gray-700 flex items-center">
                        Automatically confirm new bookings
                        <span uk-icon="icon: check; ratio: 1" className="ml-2 text-blue-600"></span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Advance Booking Days</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settings.advance_booking_days}
                          onChange={(e) => setSettings({ ...settings, advance_booking_days: parseInt(e.target.value) })}
                          className="p-3 w-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                        />
                        <span className="ml-2 text-gray-600">days</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Cars Per Slot</label>
                      <input
                        type="number"
                        value={settings.max_cars_per_slot || 1}
                        onChange={(e) => setSettings({ ...settings, max_cars_per_slot: parseInt(e.target.value) })}
                        className="p-3 w-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Range (Minutes)</label>
                      <input
                        type="number"
                        value={settings.service_range_minutes || 30}
                        onChange={(e) => setSettings({ ...settings, service_range_minutes: parseInt(e.target.value) })}
                        className="p-3 w-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (KM)</label>
                      <input
                        type="number"
                        value={settings.delivery_radius_km || 0}
                        onChange={(e) => setSettings({ ...settings, delivery_radius_km: parseInt(e.target.value) })}
                        className="p-3 w-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="home_service"
                        checked={settings.home_service}
                        onChange={(e) => setSettings({ ...settings, home_service: e.target.checked })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="home_service" className="ml-2 text-sm text-gray-700 flex items-center">
                        Offer Home Service
                        <span uk-icon="icon: home; ratio: 1" className="ml-2 text-blue-600"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="card bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <button
                    onClick={saveSettings}
                    disabled={updatingSettings || !settings.name}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md disabled:opacity-50 flex items-center justify-center"
                  >
                    <span uk-icon="icon: check; ratio: 1" className="mr-2"></span>
                    {updatingSettings ? "Saving..." : "Save Settings"}
                  </button>
                </div>

                {/* Current Settings Summary */}
                <div className="card bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Current Configuration</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>
                      Business Status: <span className="font-medium">{settings.is_active ? "Active" : "Inactive"}</span>
                    </li>
                    <li>
                      Auto-confirm Bookings: <span className="font-medium">{settings.auto_confirm_bookings ? "Yes" : "No"}</span>
                    </li>
                    <li>
                      Advance Booking: <span className="font-medium">{settings.advance_booking_days} days</span>
                    </li>
                    <li>
                      Max Cars Per Slot: <span className="font-medium">{settings.max_cars_per_slot}</span>
                    </li>
                    <li>
                      Service Range: <span className="font-medium">{settings.service_range_minutes} mins</span>
                    </li>
                    <li>
                      Delivery Radius: <span className="font-medium">{settings.delivery_radius_km} km</span>
                    </li>
                    <li>
                      Home Service: <span className="font-medium">{settings.home_service ? "Yes" : "No"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarwashDashboard;