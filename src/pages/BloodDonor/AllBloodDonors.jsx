import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  UserCircle,
  Share2,
  Droplet,
  Building,
  User,
} from "lucide-react";
import DonorService from "../../services/donorService";
import CityService from "../../services/cityService";

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

const AllBloodDonors = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    bloodType: "",
    location: "",
    type: "",
    urgency: "",
  });
  const [cities, setCities] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const response = await DonorService.getAllDonors(totalPages, size);
        const donors = response.data.map((donor) => ({
          id: donor.donor.id,
          location: donor.profile.city.cityName,
          cityId: donor.profile.city.id,
          availability: donor.donor.availabilityPeriod,
          timePosted: new Date(donor.profile.createdAt).toLocaleDateString(),
          contactNumber: donor.profile.phone,
          description: donor.donor.message,
          firstName: donor.profile.firstName,
          lastName: donor.profile.lastName,
          pseudoName: donor.profile.psudoName,
          phone: donor.profile.phone,
          bloodType: mapBloodType(donor.profile.bloodType),
          hospital: donor.donor.hospital.name,
          hospitalId: donor.donor.hospital.id,
          message: donor.donor.message,
          status: "available", 
        }));

        setRequests(donors);
        setFilteredRequests(donors);

        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [pageNumber, size]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities(0, 20);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);


  useEffect(() => {
    let result = [...requests];

    if (searchTerm) {
      result = result.filter(
        (request) =>
          request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.firstName && request.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.lastName && request.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.pseudoName && request.pseudoName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.bloodType) {
      result = result.filter(
        (request) => request.bloodType === filters.bloodType
      );
    }

    if (filters.location) {
      result = result.filter((request) =>
        request.cityId === filters.location || request.location.includes(filters.location)
      );
    }

    if (filters.type) {
      result = result.filter((request) => request.type === filters.type);
    }

    if (filters.urgency) {
      result = result.filter(
        (request) =>
          (request.type === "request" && request.urgency === filters.urgency) ||
          (request.type === "offer" && request.availability === filters.urgency)
      );
    }

    setFilteredRequests(result);
  }, [searchTerm, filters, requests]);

  const getStatusColor = (status, type) => {
    if (type === "request") {
      switch (status) {
        case "active":
          return "bg-red-100 text-red-800";
        default:
          return "bg-neutral-100 text-neutral-800";
      }
    } else {
      return "bg-green-100 text-green-800";
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
      type: "",
      urgency: "",
    });
    setSearchTerm("");
  };

  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-right mb-10">
          <h1 className="text-4xl font-cairo font-bold text-neutral-800 mb-3">
            جميع عروض التبرع بالدم
          </h1>
          <p className="text-neutral-600 font-kufi">
            استعرض جميع عروض التبرع بالدم المتاحة وابحث حسب فصيلة الدم والموقع
          </p>
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
              لم يتم العثور على طلبات أو عروض تبرع بالدم تطابق معايير البحث،
              يرجى تعديل الفلتر وإعادة المحاولة.
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
                      request.status,
                      request.type
                    )}`}
                  >
                    {request.type === "request"
                      ? request.urgency
                      : request.availability}
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
                        {request.pseudoName || `${request.firstName} ${request.lastName}`}
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
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-kufi flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      اتصال {request.phone}
                    </button>
                    <div className="flex space-x-2 space-x-reverse">
                      <button className="p-2 hover:bg-neutral-100 rounded-lg">
                        <Share2 className="w-5 h-5 text-neutral-600" />
                      </button>
                      <button className="p-2 hover:bg-neutral-100 rounded-lg">
                        <UserCircle className="w-5 h-5 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRequests.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 0}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageToShow = i + 1;  
                const pagesToShow = 5;    
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
                      className={`px-4 py-2 rounded-md ${
                        i === pageNumber
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
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === totalPages - 1}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                التالي
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBloodDonors;