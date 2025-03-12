import React, { useState, useEffect } from "react";
import {
  DropletIcon,
  Clock,
  MapPin,
  User,
  Phone,
  UserCircle,
  Share2,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import RequestService from "../../services/requestService";

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

const mapUrgencyLevel = (urgency) => {
  const urgencyMap = {
    URGENCY_LOW: "عادي",
    URGENCY_MEDIUM: "متوسط",
    URGENCY_HIGH: "عاجل",
  };
  return urgencyMap[urgency] || urgency;
};

const BloodRequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastThreeRequests = async () => {
      setLoading(true);
      try {
        const response = await RequestService.getAllRequests(0, 100);
        if (!response.data || !response.data.content) {
          throw new Error("Invalid API response structure");
        }

        const allRequests = response.data.content;
        const lastThreeRequests = allRequests.slice(-3);

        const formattedRequests = lastThreeRequests.map((request) => ({
          id: request.request.id,
          type: "request",
          bloodType: mapBloodType(request.profile.bloodType),
          location: request.profile.city.cityName,
          urgency: mapUrgencyLevel(request.request.urgencyLevel),
          timePosted: new Date(request.profile.createdAt).toLocaleDateString(),
          contactNumber: request.profile.phone,
          description: request.request.message,
          hospital: request.request.hospital.name,
          hospitalId: request.request.hospital.id,
          message: request.request.message,
          firstName: request.profile.firstName,
          lastName: request.profile.lastName,
          pseudoName: request.profile.psudoName,
          status: "active",
        }));

        setRequests(formattedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setError("فشل في تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchLastThreeRequests();
  }, []);

  const getStatusColor = (status, type) => {
    if (type === "request") {
      return status === "active"
        ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-600";
    }
    return status === "available"
      ? "bg-blue-100 text-blue-600"
      : "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
        <p className="mt-4 font-kufi text-neutral-600">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (requests.length === 0 || error) {
    return (
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
          لم يتم العثور على تبرعات حديثة.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-neutral-50 py-12 md:py-16 px-4 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-right mb-8">
          <h2 className="text-3xl font-cairo font-bold text-neutral-800 mb-2">
            طلبات التبرع بالدم
          </h2>
          <p className="text-neutral-600 font-kufi">
            آخر طلبات وعروض التبرع بالدم في منطقتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
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
                  {request.urgency}
                </span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <DropletIcon className="w-5 h-5 text-primary-500" />
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
                  <p className="text-neutral-700 font-kufi mt-2 line-clamp-2">
                    {request.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={`tel:${request.contactNumber}`}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-kufi flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {request.contactNumber}
                  </a>
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

        <div className="text-center mt-8">
          <Link
            to="/all-blood-requests"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-kufi transition-colors duration-200"
          >
            عرض جميع الطلبات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BloodRequestsSection;
