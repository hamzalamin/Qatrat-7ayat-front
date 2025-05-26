import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  UserCircle,
  Droplet,
  Building,
  User,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";
import RequestService from "../../services/requestService";
import CityService from "../../services/cityService";
import HospitalService from "../../services/hospitalService";
import AuthService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import ChatButton from "../shared/ChatButton";

const mapBloodType = (bloodType) => {
  const bloodTypeMap = {
    O_PLUS: "O+",
    O_MOINS: "O-",
    A_PLUS: "A+",
    A_MOINS: "A-",
    B_PLUS: "B+",
    B_MOINS: "B-",
    AB_PLUS: "AB+",
    AB_MOINS: "AB-",
  };
  return bloodTypeMap[bloodType] || bloodType;
};

const reverseMapBloodType = (bloodType) => {
  const reverseBloodTypeMap = {
    "O+": "O_PLUS",
    "O-": "O_MOINS",
    "A+": "A_PLUS",
    "A-": "A_MOINS",
    "B+": "B_PLUS",
    "B-": "B_MOINS",
    "AB+": "AB_PLUS",
    "AB-": "AB_MOINS",
  };
  return reverseBloodTypeMap[bloodType] || bloodType;
};

const AllBloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    bloodType: "",
    location: "",
    urgency: "",
  });
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  const { user } = useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pseudoName: "",
    phone: "",
    bloodType: "",
    cityId: "",
    hospitalId: "",
    message: "",
    bloodVolume: "",
    urgencyLevel: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const mapUrgencyLevel = (urgency) => {
    const urgencyMap = {
      URGENCY_LOW: "عادي",
      URGENCY_MEDIUM: "متوسط",
      URGENCY_HIGH: "عاجل",
    };
    return urgencyMap[urgency] || urgency;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await RequestService.getAllRequests(pageNumber, size);
        console.log("API Response:", response);

        if (!response.data || !response.data.content) {
          throw new Error("Invalid API response structure");
        }

        const requests = response.data.content.map((request) => ({
          id: request.request.id,
          location: request.profile.city.cityName,
          cityId: request.profile.city.id,
          timePosted: new Date(request.profile.createdAt).toLocaleDateString(),
          contactNumber: request.profile.phone,
          description: request.request.message,
          firstName: request.profile.firstName,
          lastName: request.profile.lastName,
          pseudoName: request.profile.psudoName,
          phone: request.profile.phone,
          bloodType: mapBloodType(request.profile.bloodType),
          hospital: request.request.hospital.name,
          hospitalId: request.request.hospital.id,
          message: request.request.message,
          bloodVolume: request.request.bloodVolume,
          urgencyLevel: mapUrgencyLevel(request.request.urgencyLevel),
          status: "active",
          userId: request.profile.id,
        }));

        setRequests(requests);
        setFilteredRequests(requests);

        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
        setFilteredRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [pageNumber, size, formSuccess]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities(0, 100);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await HospitalService.getHospitals(0, 100);
        setHospitals(response.data);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (searchTerm) {
      result = result.filter(
        (request) =>
          request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.firstName &&
            request.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.lastName &&
            request.lastName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.pseudoName &&
            request.pseudoName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.bloodType) {
      result = result.filter(
        (request) => request.bloodType === filters.bloodType
      );
    }

    if (filters.location) {
      result = result.filter(
        (request) =>
          request.cityId === filters.location ||
          request.location.includes(filters.location)
      );
    }

    if (filters.urgency) {
      result = result.filter(
        (request) => request.urgencyLevel === filters.urgency
      );
    }

    setFilteredRequests(result);
  }, [searchTerm, filters, requests]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      bloodType: "",
      location: "",
      urgency: "",
    });
    setSearchTerm("");
  };

  useEffect(() => {
    if (showPopup && AuthService.isAuthenticated()) {
      const fetchUserProfile = async () => {
        try {
          const profile = await AuthService.getUserProfile();
          if (profile) {
            setFormData((prevData) => ({
              ...prevData,
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              pseudoName: profile.pseudoName || "",
              phone: profile.phone || "",
              bloodType: mapBloodType(profile.bloodType) || "",
              cityId: profile.city?.id || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [showPopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      if (
        !formData.bloodType ||
        !formData.cityId ||
        !formData.hospitalId ||
        !formData.phone ||
        !formData.bloodVolume ||
        !formData.urgencyLevel
      ) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      const user = AuthService.getCurrentUser();
      const requestData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          psudoName: formData.pseudoName,
          phone: formData.phone,
          bloodType: reverseMapBloodType(formData.bloodType),
          cityId: formData.cityId,
          userId: user?.id,
        },
        request: {
          message: formData.message,
          hospitalId: formData.hospitalId,
          bloodVolume: formData.bloodVolume,
          urgencyLevel: formData.urgencyLevel,
        },
      };

      await RequestService.createRequest(requestData);

      setFormData({
        firstName: "",
        lastName: "",
        pseudoName: "",
        phone: "",
        bloodType: "",
        cityId: "",
        hospitalId: "",
        message: "",
        bloodVolume: "",
        urgencyLevel: "",
      });
      setFormSuccess(true);

      setTimeout(() => {
        setShowPopup(false);
        setFormSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating request:", error);
      setFormError(error.message || "حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const urgencyLevels = ["URGENCY_LOW", "URGENCY_MEDIUM", "URGENCY_HIGH"];

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-kufi flex items-center transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            إضافة طلب جديد
          </button>

          <div className="text-right">
            <h1 className="text-4xl font-cairo font-bold text-neutral-800 mb-3">
              جميع طلبات التبرع بالدم
            </h1>
            <p className="text-neutral-600 font-kufi">
              استعرض جميع طلبات التبرع بالدم المتاحة وابحث حسب فصيلة الدم
              والموقع
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 shadow-md">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-2/5 mb-1">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pr-10 pl-4 py-3 font-kufi border border-neutral-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-right shadow-sm"
                    placeholder="ابحث عن موقع، مستشفى، أو وصف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/4">
                <select
                  className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={filters.bloodType}
                  onChange={(e) =>
                    handleFilterChange("bloodType", e.target.value)
                  }
                >
                  <option value="">جميع الفصائل</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/4">
                <select
                  className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                >
                  <option value="">جميع المواقع</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="text-primary-600 hover:text-primary-700 py-3 px-4 font-kufi rounded-lg transition-colors duration-200 flex items-center whitespace-nowrap"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-4 font-kufi text-neutral-600">
              جاري تحميل البيانات...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
            <div className="mx-auto w-16 h-16 text-neutral-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-cairo font-bold text-neutral-700 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-neutral-600 font-kufi max-w-md mx-auto">
              لم يتم العثور على طلبات تبرع بالدم تطابق معايير البحث، يرجى تعديل
              الفلتر وإعادة المحاولة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-kufi ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.urgencyLevel}
                  </span>
                  <div className="flex items-center space-x-2 space-x-reverse rtl">
                    <Droplet className="w-5 h-5 text-primary-500" />
                    <span className="font-bold text-lg text-primary-500">
                      {request.bloodType}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <User className="w-5 h-5 text-neutral-500 mr-2" />
                      <p className="text-neutral-700 font-kufi">
                        {request.pseudoName ||
                          `${request.firstName} ${request.lastName}`}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <MapPin className="w-5 h-5 text-neutral-500 mr-2" />
                      <p className="text-neutral-700 font-kufi">
                        {request.location}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <Building className="w-5 h-5 text-neutral-500 mr-2" />
                      <p className="text-neutral-700 font-kufi">
                        {request.hospital}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-5 h-5 text-neutral-500 mr-2" />
                      <span className="text-neutral-600 text-sm">
                        {request.timePosted}
                      </span>
                    </div>
                    <p className="text-neutral-700 font-kufi mt-2 line-clamp-3">
                      {request.description || request.message}
                    </p>
                    <p className="text-neutral-700 font-kufi">
                      <span className="font-bold">حجم الدم المطلوب:</span>{" "}
                      {request.bloodVolume} لتر
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-kufi flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {request.phone}
                    </button>
                    <div className="flex space-x-2 space-x-reverse">
                      {user?.id === request.userId ? (
                        <button className="p-2 hover:bg-neutral-100 rounded-lg" title="طلبك">
                          <UserCircle className="w-5 h-5 text-primary-500" />
                        </button>
                      ) : (
                        <>
                          <ChatButton />
                          <button className="p-2 hover:bg-neutral-100 rounded-lg" title="الملف الشخصي">
                            <UserCircle className="w-5 h-5 text-neutral-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                disabled={pageNumber === 0}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                السابق
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => {
                const pageToShow = i + 1;
                const pagesToShow = 5; // Number of pages to display
                const startPage = Math.max(
                  1,
                  pageNumber + 1 - Math.floor(pagesToShow / 2)
                );
                const endPage = Math.min(
                  totalPages,
                  startPage + pagesToShow - 1
                );

                if (pageToShow >= startPage && pageToShow <= endPage) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPageNumber(i)}
                      className={`px-4 py-2 rounded-md ${i === pageNumber
                          ? "bg-primary-500 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                    >
                      {pageToShow}
                    </button>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={pageNumber === totalPages - 1}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                التالي
              </button>
            </nav>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-1 hover:bg-neutral-100 rounded-full"
                >
                  <X className="w-6 h-6 text-neutral-600" />
                </button>
                <h2 className="text-2xl font-cairo font-bold text-neutral-800 text-right">
                  إضافة طلب تبرع بالدم
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      disabled={AuthService.isAuthenticated()}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      disabled={AuthService.isAuthenticated()}
                    />
                  </div>
                </div>

                {/* Pseudo Name */}
                <div>
                  <label className="block text-neutral-700 font-kufi text-right mb-2">
                    الاسم المستعار (اختياري)
                  </label>
                  <input
                    type="text"
                    name="pseudoName"
                    value={formData.pseudoName}
                    onChange={handleInputChange}
                    className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                    placeholder="سيظهر بدلاً من اسمك الحقيقي"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-neutral-700 font-kufi text-right mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                    required
                    disabled={AuthService.isAuthenticated()}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Type */}
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      فصيلة الدم <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={AuthService.isAuthenticated()}
                    >
                      <option value="">اختر فصيلة الدم</option>
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      المدينة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={AuthService.isAuthenticated()}
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hospital */}
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      المستشفى <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">اختر المستشفى</option>
                      {hospitals.map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Blood Volume */}
                  <div>
                    <label className="block text-neutral-700 font-kufi text-right mb-2">
                      حجم الدم المطلوب (لتر){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bloodVolume"
                      value={formData.bloodVolume}
                      onChange={handleInputChange}
                      className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-neutral-700 font-kufi text-right mb-2">
                    مستوى الاستعجال <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                    className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">اختر مستوى الاستعجال</option>
                    {urgencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-neutral-700 font-kufi text-right mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi focus:ring-primary-500 focus:border-primary-500 h-32"
                    placeholder="...معلومات إضافية أو توضيحات حول طلبك"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-8 rounded-lg font-kufi font-bold text-lg transition-colors duration-200 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      "إضافة الطلب"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBloodRequests;
