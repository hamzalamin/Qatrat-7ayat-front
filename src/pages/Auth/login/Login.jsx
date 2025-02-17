import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Heart,
  Users,
  Calendar,
} from "lucide-react";
import logo from "../../../../src/assets/icons/qatrat-7ayat-logo.ico";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 py-20">
      <div className="max-w-6xl mx-auto px-4 flex gap-8 items-center">
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img src={logo} alt="" className="w-16 h-16" />
              <span className="mr-3 text-2xl font-bold font-cairo text-neutral-800">
                قطرة حياة
              </span>
            </div>
            <h1 className="text-3xl font-bold font-cairo text-neutral-800 mb-2">
              مرحباً بعودتك
            </h1>
            <p className="text-neutral-600 font-ibm">
              سجل دخولك للمتابعة في رحلة إنقاذ الأرواح وصنع الفرق في مجتمعنا
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold font-cairo text-neutral-700"
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                  <Mail className="w-5 h-5 text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold font-cairo text-neutral-700"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm"
                    placeholder="********"
                  />
                  <Lock className="w-5 h-5 text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-500 focus:ring-primary-200 border-neutral-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-neutral-600 font-ibm">
                    تذكرني
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-primary-500 hover:text-primary-600 font-ibm transition-colors duration-200"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 space-x-reverse focus:outline-none focus:ring-4 focus:ring-primary-200 font-cairo"
              >
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-600 font-ibm">
                ليس لديك حساب؟{" "}
                <a
                  href="#"
                  className="text-primary-500 hover:text-primary-600 font-bold transition-colors duration-200"
                >
                  سجل الآن
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/2 mt-48">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl h-full">
              <img
                src="https://lareleve.ma/wp-content/uploads/2023/09/75182346-52603698.jpg"
                alt="التبرع بالدم"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent mb-24">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-white text-2xl font-bold font-cairo mb-6">
                    تبرعك بالدم يصنع الفرق
                  </h2>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <Heart
                        className="w-8 h-8 text-primary-300 mx-auto mb-2"
                        fill="#FFE8E8"
                      />
                      <div className="text-2xl font-bold text-white font-cairo">
                        3
                      </div>
                      <div className="text-sm text-white/80 font-kufi">
                        أرواح تنقذها
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 text-primary-300 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white font-cairo">
                        16K+
                      </div>
                      <div className="text-sm text-white/80 font-kufi">
                        متبرع نشط
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <Calendar className="w-8 h-8 text-primary-300 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white font-cairo">
                        500+
                      </div>
                      <div className="text-sm text-white/80 font-kufi">
                        تبرع يومي
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-primary-500">
                <p className="text-lg font-cairo font-bold">
                  وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا
                  عَلَى الْإِثْمِ وَالْعُدْوَانِ
                </p>
                <p className="text-sm text-primary-500/80 font-kufi mt-2">
                  (سورة المائدة ٢)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
