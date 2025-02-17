import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Droplet,
  UserCircle,
} from "lucide-react";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  });
  const [errors, setErrors] = useState({});

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = [
    "الرباط",
    "الدار البيضاء",
    "فاس",
    "مراكش",
    "طنجة",
    "أكادير",
    "وجدة",
    "مكناس",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "اسم العائلة مطلوب";
    }
    if (!formData.pseudoName.trim()) {
      newErrors.pseudoName = "الاسم المستعار مطلوب";
    }
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }
    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^(06|07)\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!formData.bloodType) {
      newErrors.bloodType = "فصيلة الدم مطلوبة";
    }
    if (!formData.gender) {
      newErrors.gender = "الجنس مطلوب";
    }
    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted successfully:", formData);
    } catch (error) {
      setErrors({
        submit: "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50">
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-secondary-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="bg-white p-4 rounded-full w-24 h-24 mx-auto mb-6 shadow-lg">
            <Droplet className="w-full h-full text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 font-cairo mb-3">
            التسجيل في منصة التبرع بالدم
          </h1>
          <p className="text-neutral-600 text-lg max-w-md mx-auto font-kufi">
            انضم إلينا لإنقاذ حياة الآخرين من خلال التبرع بالدم
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                label="رقم الهاتف"
                name="phone"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
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

              <div className="space-y-2">
                <label className="block text-sm font-bold font-cairo text-neutral-700">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border ${
                      errors.password ? "border-red-500" : "border-neutral-200"
                    } focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm`}
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
                {errors.password && <ErrorMessage message={errors.password} />}
              </div>

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

              <SelectField
                label="المدينة"
                name="city"
                icon={<MapPin className="w-5 h-5" />}
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                options={cities}
                placeholder="اختر المدينة"
              />

              <div className="space-y-2">
                <label className="block text-sm font-bold font-cairo text-neutral-700">
                  الجنس
                </label>
                <div className="flex space-x-6">
                  <RadioButton
                    id="male"
                    name="gender"
                    value="male"
                    label="ذكر"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  <RadioButton
                    id="female"
                    name="gender"
                    value="female"
                    label="أنثى"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                </div>
                {errors.gender && <ErrorMessage message={errors.gender} />}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-500 text-white rounded-lg font-bold font-cairo hover:bg-primary-600 focus:ring-4 focus:ring-primary-100 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "جاري التسجيل..." : "إنشاء حساب متبرع"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InputField = ({ label, name, type = "text", icon, value, onChange, error }) => (
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
        className={`w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border ${
          error ? "border-red-500" : "border-neutral-200"
        } focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm`}
      />
      <span className="text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2">
        {icon}
      </span>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const SelectField = ({ label, name, icon, value, onChange, error, options, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold font-cairo text-neutral-700">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border ${
          error ? "border-red-500" : "border-neutral-200"
        } focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2">
        {icon}
      </span>
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
      className="w-4 h-4 text-primary-500 border-neutral-300 focus:ring-primary-500"
    />
    <span className="text-sm text-neutral-700 group-hover:text-neutral-900 font-ibm">
      {label}
    </span>
  </label>
);

const ErrorMessage = ({ message }) => (
  <p className="flex items-center text-red-500 text-sm mt-1 font-ibm">
    <AlertCircle className="w-4 h-4 ml-1" />
    {message}
  </p>
);

export default RegistrationForm;