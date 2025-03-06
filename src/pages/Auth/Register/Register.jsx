import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Droplet,
  UserCircle,
  Check,
} from "lucide-react";
import CityService from "../../../services/cityService";
import AuthService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pseudoName: "",
    email: "",
    phone: "",
    password: "",
    bloodType: "",
    gender: "",
    city: "",
    lastDonation: "",
    hasChronicDiseases: false,
    isFirstTimeDonor: false,
  });
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
      if (!formData.lastName.trim()) newErrors.lastName = "اسم العائلة مطلوب";
      if (!formData.pseudoName.trim())
        newErrors.pseudoName = "الاسم المستعار مطلوب";
      if (!formData.email) {
        newErrors.email = "البريد الإلكتروني مطلوب";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "البريد الإلكتروني غير صالح";
      }
      if (!formData.password) {
        newErrors.password = "كلمة المرور مطلوبة";
      } else if (formData.password.length < 8) {
        newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
      }
    } else if (step === 2) {
      if (!formData.phone) {
        newErrors.phone = "رقم الهاتف مطلوب";
      } else if (!/^(06|07)\d{8}$/.test(formData.phone)) {
        newErrors.phone = "رقم الهاتف غير صالح";
      }
      if (!formData.bloodType) newErrors.bloodType = "فصيلة الدم مطلوبة";
      if (!formData.gender) newErrors.gender = "الجنس مطلوب";
      if (!formData.city) newErrors.city = "الجهة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const bloodTypeMap = {
      "A+": "A_PLUS",
      "A-": "A_MOINS",
      "B+": "B_PLUS",
      "B-": "B_MOINS",
      "AB+": "AB_PLUS",
      "AB-": "AB_MOINS",
      "O+": "O_PLUS",
      "O-": "O_MOINS",
    };

    const payload = {
      ...formData,
      bloodType: bloodTypeMap[formData.bloodType],
    };

    setIsLoading(true);
    setError("");

    AuthService.register(payload)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="absolute bg-red-100/50 rounded-full opacity-30 animate-blood-drop"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-600 font-cairo mb-3">
            التسجيل في منصة قطرات حياة
          </h1>
          <p className="text-neutral-500 text-lg max-w-md mx-auto font-kufi">
            كن بطلاً في قصة إنقاذ حياة - تبرعك بالدم يصنع الفرق
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between relative mb-4">
            <div className="w-full absolute top-1/2 h-1 bg-neutral-200 -translate-y-1/2"></div>
            <div
              className="w-full absolute top-1/2 h-1 bg-red-500 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full 
              ${
                step <= currentStep
                  ? "bg-red-500 text-white"
                  : "bg-white text-neutral-400 border-2 border-neutral-200"
              }
              transition-all duration-300`}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-cairo">
            <span className="text-neutral-600">المعلومات الشخصية</span>
            <span className="text-neutral-600">معلومات التبرع</span>
            <span className="text-neutral-600">المراجعة والتأكيد</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-red-100 relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="الاسم الأول"
                  name="firstName"
                  icon={<User className="w-5 h-5" />}
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <InputField
                  label="اسم العائلة"
                  name="lastName"
                  icon={<User className="w-5 h-5" />}
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                <InputField
                  label="الاسم المستعار"
                  name="pseudoName"
                  icon={<UserCircle className="w-5 h-5" />}
                  value={formData.pseudoName}
                  onChange={handleChange}
                  error={errors.pseudoName}
                />
                <InputField
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  icon={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-bold font-cairo text-neutral-700">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border 
                        ${
                          errors.password
                            ? "border-red-500"
                            : "border-neutral-200"
                        }
                        focus:ring-4 focus:ring-primary-100 focus:border-primary-500 
                        transition-all duration-200 font-ibm`}
                    />
                    <Lock className="w-5 h-5 text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <ErrorMessage message={errors.password} />
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="رقم الهاتف"
                  name="phone"
                  icon={<Phone className="w-5 h-5" />}
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <SelectField
                  label="فصيلة الدم"
                  name="bloodType"
                  icon={<Droplet className="w-5 h-5" />}
                  value={formData.bloodType}
                  onChange={handleChange}
                  error={errors.bloodType}
                  options={bloodTypes}
                  placeholder="اختر فصيلة الدم"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-bold font-cairo text-neutral-700">
                    الجهة
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-neutral-50 border ${
                      errors.city ? "border-red-500" : "border-neutral-200"
                    } focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200`}
                  >
                    <option value="">اختر الجهة</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs font-cairo mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold font-cairo text-neutral-700">
                    الجنس
                  </label>
                  <div className="flex space-x-6">
                    <RadioButton
                      id="male"
                      name="gender"
                      value="MALE"
                      label="ذكر"
                      checked={formData.gender === "MALE"}
                      onChange={handleChange}
                    />
                    <RadioButton
                      id="female"
                      name="gender"
                      value="FEMALE"
                      label="أنثى"
                      checked={formData.gender === "FEMALE"}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFirstTimeDonor"
                      name="isFirstTimeDonor"
                      checked={formData.isFirstTimeDonor}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="isFirstTimeDonor"
                      className="text-sm text-neutral-700 font-ibm"
                    >
                      هذه أول مرة أتبرع بالدم
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="hasChronicDiseases"
                      name="hasChronicDiseases"
                      checked={formData.hasChronicDiseases}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="hasChronicDiseases"
                      className="text-sm text-neutral-700 font-ibm"
                    >
                      لدي أمراض مزمنة
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold font-cairo 
                    focus:ring-2 focus:ring-red-300 transition-all duration-200 
                    mr-auto"
              >
                التالي
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl 
                    transition-colors duration-300 flex items-center justify-center 
                    space-x-2 rtl:space-x-reverse font-cairo
                    disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-pulse">جاري التسجيل...</div>
                ) : (
                  "تأكيد التسجيل"
                )}
              </button>
            )}
          </form>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-l from-red-500 to-pink-500"></div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  error,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold font-cairo text-neutral-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-red-50/50 
          border border-red-100 focus:outline-none 
          focus:ring-2 focus:ring-red-300 
          text-right font-cairo`}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {React.cloneElement(icon, { className: "w-5 h-5 text-red-400" })}
      </div>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const SelectField = ({
  label,
  name,
  icon,
  value,
  onChange,
  error,
  options,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold font-cairo text-neutral-700">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-red-50/50 
          border border-red-100 focus:outline-none 
          focus:ring-2 focus:ring-red-300 
          text-right font-cairo`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {React.cloneElement(icon, { className: "w-5 h-5 text-red-400" })}
      </div>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const RadioButton = ({ id, name, value, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center space-x-3 cursor-pointer group"
  >
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-red-500 border-neutral-300 focus:ring-red-300"
    />
    <span className="text-sm text-neutral-700 group-hover:text-neutral-900 font-ibm">
      {label}
    </span>
  </label>
);

const ErrorMessage = ({ message }) => (
  <p className="flex items-center text-red-500 text-sm mt-1 font-ibm">
    <AlertCircle className="w-4 h-4 ml-1 text-red-400" />
    {message}
  </p>
);

export default RegistrationForm;
