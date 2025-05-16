import React, { useState, useEffect } from "react";
import {
  Droplet,
  Map,
  Users,
  Edit,
  Save,
  X,
  Heart,
  Award,
  Clock,
  Lock,
  Phone,
  User,
  Calendar,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";
import ProfileService from "../../services/profileService";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import CityService from "../../services/cityService";
import { useAuth } from "../../context/AuthContext";

const bloodTypeOptions = [
  { value: "A_PLUS", label: "A+", color: "text-primary-500" },
  { value: "A_MOINS", label: "A-", color: "text-primary-400" },
  { value: "B_PLUS", label: "B+", color: "text-primary-600" },
  { value: "B_MOINS", label: "B-", color: "text-primary-500" },
  { value: "AB_PLUS", label: "AB+", color: "text-secondary-500" },
  { value: "AB_MOINS", label: "AB-", color: "text-secondary-400" },
  { value: "O_PLUS", label: "O+", color: "text-accent-500" },
  { value: "O_MOINS", label: "O-", color: "text-accent-400" },
];

const DonationBadge = ({ donationCount }) => {
  const getBadgeLevel = (count) => {
    if (count < 5)
      return {
        level: "متبرع مبتدئ",
        icon: <Heart className="w-10 h-10 text-primary-400" />,
        bgColor: "bg-primary-50",
        textColor: "text-primary-700",
        borderColor: "border-primary-300",
      };
    if (count < 10)
      return {
        level: "متبرع بطل",
        icon: <Award className="w-10 h-10 text-secondary-500" />,
        bgColor: "bg-secondary-50",
        textColor: "text-secondary-700",
        borderColor: "border-secondary-300",
      };
    return {
      level: "متبرع محترف",
      icon: <Clock className="w-10 h-10 text-accent-500" />,
      bgColor: "bg-accent-50",
      textColor: "text-accent-700",
      borderColor: "border-accent-300",
    };
  };

  const badge = getBadgeLevel(donationCount);

  return (
    <div
      className={`flex items-center gap-4 ${badge?.bgColor} rounded-xl p-5 shadow-md border ${badge?.borderColor} transition-all hover:shadow-lg`}
    >
      {badge?.icon}
      <div className="text-right">
        <p className={`font-kufi font-bold text-xl ${badge.textColor}`}>
          {badge.level}
        </p>
        <p className="text-sm text-neutral-600 font-ibm mt-1">
          {donationCount} تبرعات
        </p>
      </div>
    </div>
  );
};

const UserProfile = () => {
  console.log("UserProfile component is mounting");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { authChecked } = useAuth();
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ProfileService.getProfile();
        setUser(profileData);
        setIsLoading(false);
      } catch (err) {
        console.error("Response:", err.response);
        setError("فشل في تحميل الملف الشخصي");
        setIsLoading(false);
        if (err.response && err.response.status === 401) {
          navigate("/401");
        }
      }
    };
  
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities(0, 100);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
  
    if (authChecked && !user) {
      fetchProfile();
      fetchCities();
    }
  }, [navigate, authChecked, user]);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-primary-100 rounded-full mb-4"></div>
          <div className="h-6 w-64 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-40 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-primary-50 text-primary-700 p-6 rounded-xl shadow-md border border-primary-200 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-bold font-kufi">خطأ</h2>
          </div>
          <p className="font-ibm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-kufi"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const selectedBloodType = user?.bloodType
    ? bloodTypeOptions.find((bt) => bt.value === user?.bloodType) || {
        label: "غير معروف",
        color: "text-neutral-500",
      }
    : {
        label: "غير معروف",
        color: "text-neutral-500",
      };

  const handleEdit = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      psudoName: user.psudoName || "",
      phone: user.phone,
      bloodType: user.bloodType,
      cityId: user.city?.id || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedUser && user) {
      try {
        setIsLoading(true);
        const updatedProfile = await ProfileService.updateProfile(
          user.id,
          editedUser
        );
        setUser(updatedProfile.data);
        setIsEditing(false);
      } catch (err) {
        setError("فشل في تحديث الملف الشخصي");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("كلمات المرور غير متطابقة");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      return;
    }

    try {
      await ProfileService.changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess("تم تغيير كلمة المرور بنجاح");
    } catch (err) {
      setPasswordError("كلمة المرور القديمة غير صحيحة");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "هل أنت متأكد من رغبتك في حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      try {
        await ProfileService.deleteProfile(user.id);
        AuthService.clearAuth();
        navigate("/login");
      } catch (err) {
        setError("فشل في حذف الحساب");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 py-8 px-4 font-cairo">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-kufi text-primary-700 mb-2">
            الملف الشخصي للمتبرع
          </h1>
          <p className="text-neutral-600 font-ibm">
            مرحباً بك في رحلتك لإنقاذ الأرواح
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-200">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Droplet className={`w-8 h-8 ${selectedBloodType?.color}`} />
                  </div>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-white text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-colors ml-2"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold font-kufi">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-white/80 mt-1 font-ibm">
                  {selectedBloodType?.label} فصيلة الدم
                </p>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg mb-3">
                  <span className="font-bold text-secondary-600">
                    {user.city?.cityName}
                  </span>
                  <span className="text-neutral-600">المدينة</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <span className="font-bold text-secondary-600">
                    {user?.phone}
                  </span>
                  <span className="text-neutral-600">رقم الهاتف</span>
                </div>

                {user?.email && (
                  <div className="flex justify-between items-center p-3 mt-3 bg-neutral-50 rounded-lg">
                    <span className="font-bold text-secondary-600 text-sm">
                      {user?.email}
                    </span>
                    <span className="text-neutral-600">البريد الإلكتروني</span>
                  </div>
                )}

                {user.psudoName && (
                  <div className="flex justify-between items-center p-3 mt-3 bg-neutral-50 rounded-lg">
                    <span className="font-bold text-secondary-600">
                      {user?.psudoName}
                    </span>
                    <span className="text-neutral-600">الاسم المستعار</span>
                  </div>
                )}
              </div>
            </div>

            <DonationBadge donationCount={user?.donationCount || 0} />

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-200">
              <div className="bg-gradient-to-r from-accent-600 to-accent-500 p-4 text-white">
                <h3 className="font-bold text-lg font-kufi">التبرع القادم</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-accent-500" />
                    <span className="font-bold text-accent-700">
                      {user?.nextEligibleDonationDate
                        ? new Date(
                            user?.nextEligibleDonationDate
                          ).toLocaleDateString("ar-EG")
                        : "غير متاح حالياً"}
                    </span>
                  </div>
                  <span className="text-neutral-600">تاريخ الأهلية</span>
                </div>
                {user?.nextEligibleDonationDate && (
                  <div className="mt-4 text-sm text-neutral-600 bg-accent-50 p-3 rounded-lg border border-accent-100">
                    <p>
                      يرجى الانتظار حتى هذا التاريخ للتبرع مرة أخرى للحفاظ على
                      صحتك وسلامة المتلقين.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 text-sm text-neutral-600 flex justify-between items-center border border-neutral-200">
              <span>تاريخ إنشاء الحساب:</span>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-200">
              <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold font-kufi">
                  البيانات الشخصية
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors text-sm font-ibm flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        الاسم الأول
                      </label>
                      <div className="relative">
                        <User className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={editedUser?.firstName || ""}
                          onChange={handleInputChange}
                          placeholder="الاسم الأول"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        الاسم الأخير
                      </label>
                      <div className="relative">
                        <User className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={editedUser?.lastName || ""}
                          onChange={handleInputChange}
                          placeholder="الاسم الأخير"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        المدينة
                      </label>
                      <div className="relative">
                        <Map className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <select
                          name="cityId"
                          value={editedUser?.cityId || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none"
                        >
                          <option value="" disabled>
                            اختر المدينة
                          </option>
                          {cities.map((city) => (
                            <option key={city?.id} value={city?.id}>
                              {city?.cityName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="w-5 h-5 text-neutral-400 rotate-180" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        رقم الهاتف
                      </label>
                      <div className="relative">
                        <Phone className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          name="phone"
                          value={editedUser?.phone || ""}
                          onChange={handleInputChange}
                          placeholder="رقم الهاتف"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        الاسم المستعار
                      </label>
                      <div className="relative">
                        <User className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          name="psudoName"
                          value={editedUser?.psudoName || ""}
                          onChange={handleInputChange}
                          placeholder="الاسم المستعار (اختياري)"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        فصيلة الدم
                      </label>
                      <div className="relative">
                        <Droplet className="absolute top-3 right-3 w-5 h-5 text-primary-500" />
                        <select
                          name="bloodType"
                          value={editedUser?.bloodType || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none"
                        >
                          {bloodTypeOptions.map((option) => (
                            <option key={option?.value} value={option?.value}>
                              {option?.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="w-5 h-5 text-neutral-400 rotate-180" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4 gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700 font-ibm"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors font-ibm"
                      >
                        حفظ التغييرات
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-6">
                      <div className="flex-1 flex flex-col items-center p-5 bg-secondary-50 rounded-xl">
                        <Users className="w-8 h-8 text-secondary-500 mb-2" />
                        <h3 className="text-secondary-700 font-semibold">
                          الاسم الكامل
                        </h3>
                        <p className="font-kufi text-lg mt-1">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center p-5 bg-primary-50 rounded-xl">
                        <Droplet
                          className={`w-8 h-8 ${selectedBloodType?.color} mb-2`}
                        />
                        <h3 className="text-primary-700 font-semibold">
                          فصيلة الدم
                        </h3>
                        <p className="font-kufi text-lg mt-1">
                          {selectedBloodType?.label}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center p-5 bg-accent-50 rounded-xl">
                        <Map className="w-8 h-8 text-accent-500 mb-2" />
                        <h3 className="text-accent-700 font-semibold">
                          المدينة
                        </h3>
                        <p className="font-kufi text-lg mt-1">
                          {user?.city?.cityName}
                        </p>
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl text-center mx-auto max-w-md">
                      <p className="text-sm text-neutral-600 font-ibm">
                        يمكنك تعديل بياناتك الشخصية في أي وقت بالنقر على زر
                        تعديل أعلاه
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-200">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 text-white">
                <h3 className="font-bold text-xl font-kufi">
                  تغيير كلمة المرور
                </h3>
              </div>

              <div className="p-6">
                {passwordError && (
                  <div className="bg-primary-50 text-primary-700 p-4 rounded-lg mb-4 flex items-center gap-2 border border-primary-200">
                    <AlertTriangle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <p className="text-sm">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-accent-50 text-accent-700 p-4 rounded-lg mb-4 flex items-center gap-2 border border-accent-200">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <p className="text-sm">{passwordSuccess}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 font-ibm">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData?.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="كلمة المرور الحالية"
                        className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData?.newPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="كلمة المرور الجديدة"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 font-ibm">
                        تأكيد كلمة المرور
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-3 right-3 w-5 h-5 text-neutral-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData?.confirmPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="تأكيد كلمة المرور"
                          className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors font-kufi"
                  >
                    تغيير كلمة المرور
                  </button>

                  <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                    <p>
                      ملاحظة: يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.
                      يفضل استخدام مزيج من الأحرف والأرقام والرموز للحصول على
                      كلمة مرور أكثر أماناً.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-200">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
                <h3 className="font-bold text-xl font-kufi">حذف الحساب</h3>
              </div>

              <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-3 border border-red-200">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-ibm">
                    حذف الحساب إجراء دائم ولا يمكن التراجع عنه. سيتم حذف جميع
                    بياناتك الشخصية والتبرعات المرتبطة بحسابك.
                  </p>
                </div>

                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-kufi flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  حذف الحساب
                </button>

                <div className="mt-4 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                  <p className="font-ibm">
                    إذا كنت تواجه مشكلة أو تحتاج إلى مساعدة، يرجى الاتصال بفريق
                    الدعم قبل حذف حسابك.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
