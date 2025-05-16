import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Droplet,
  Building,
  User,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import DonorService from "../../services/donorService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

const BloodDonorsSection = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const response = await DonorService.getAllDonors(0, 100);

        if (!response.data || !response.data.content) {
          throw new Error("Invalid API response structure");
        }

        const sortedDonors = response.data.content.sort(
          (a, b) =>
            new Date(b.profile.createdAt) - new Date(a.profile.createdAt)
        );

        const lastThreeDonors = sortedDonors.slice(0, 3);

        const formattedDonors = lastThreeDonors.map((donor) => ({
          id: donor.donor.id,
          location: donor.profile.city.cityName,
          availability: donor.donor.availabilityPeriod,
          timePosted: new Date(donor.profile.createdAt).toLocaleDateString(),
          contactNumber: donor.profile.phone,
          firstName: donor.profile.firstName,
          lastName: donor.profile.lastName,
          pseudoName: donor.profile.psudoName,
          phone: donor.profile.phone,
          bloodType: mapBloodType(donor.profile.bloodType),
          hospital: donor.donor.hospital.name,
          message: donor.donor.message,
          userId: donor.donor.id,
        }));

        setDonors(formattedDonors);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
        <p className="mt-4 font-kufi text-neutral-600">
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  if (donors.length === 0) {
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
    <div className="bg-neutral-60 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-right mb-10">
          <h1 className="text-4xl font-cairo font-bold text-neutral-800 mb-3">
            آخر التبرعات
          </h1>
          <p className="text-neutral-600 font-kufi">
            استعرض آخر التبرعات بالدم المقدمة من المتبرعين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                <div className="flex items-center space-x-2 space-x-reverse rtl">
                  <Droplet className="w-5 h-5 text-primary-500" />
                  <span className="font-bold text-lg text-primary-500">
                    {donor.bloodType}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <User className="w-5 h-5 text-neutral-500 mr-2" />
                    <p className="text-neutral-700 font-kufi">
                      {donor.pseudoName ||
                        `${donor.firstName} ${donor.lastName}`}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <MapPin className="w-5 h-5 text-neutral-500 mr-2" />
                    <p className="text-neutral-700 font-kufi">
                      {donor.location}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Building className="w-5 h-5 text-neutral-500 mr-2" />
                    <p className="text-neutral-700 font-kufi">
                      {donor.hospital}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5 text-neutral-500 mr-2" />
                    <span className="text-neutral-600 text-sm">
                      {donor.timePosted}
                    </span>
                  </div>
                  <p className="text-neutral-700 font-kufi mt-2 line-clamp-3">
                    {donor.message}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={`tel:${donor.contactNumber}`}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-kufi flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {donor.phone}
                  </a>
                  <div className="flex space-x-2 space-x-reverse">
                    {user?.id === donor.userId ? (
                      <button className="p-2 hover:bg-neutral-100 rounded-lg" title="طلبك">
                        <UserCircle className="w-5 h-5 text-primary-500" />
                      </button>
                    ) : (
                      <>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg" title="مراسلة">
                          <MessageCircle className="w-5 h-5 text-neutral-600" />
                        </button>
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

        <div className="text-center mt-8">
          <Link
            to="/all-blood-donors"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-kufi transition-colors duration-200"
          >
            جميع عروض التبرع بالدم
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodDonorsSection;
