import React, { useState } from "react";
import { ChevronRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../../../src/assets/images/qatrat-7ayat-logo.jpg";
import AuthService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    AuthService.login(email, password)
      .then(() => {
        navigate('/'); 
      })
      .catch(err => {
        setError(
          err.response?.data?.message || 
          "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      <div
        className="relative min-h-screen flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-7/12 p-8 lg:p-12 relative">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-primary-600 text-shadow-sm font-kufi mb-4">
                مرحباً بعودتك
              </h2>
              <p className="text-neutral-600 font-cairo mb-8">
                واصل رحلتك في إنقاذ الحياة معنا
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1/4 bg-primary-500 opacity-10 -z-10"></div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700 font-cairo block">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-11 font-cairo placeholder:text-neutral-400"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                    <Mail className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700 font-cairo block">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-11 pl-11 font-cairo placeholder:text-neutral-400"
                      placeholder="أدخل كلمة المرور"
                    />
                    <Lock className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
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
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-primary-500 
                        focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="mr-2 text-sm text-neutral-600 font-cairo">
                      تذكرني
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium font-cairo"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl
                    font-medium transition-all duration-200 flex items-center justify-center gap-2 
                    disabled:opacity-70 disabled:cursor-not-allowed font-kufi"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>

                <p className="text-center text-neutral-600 font-cairo">
                  ليس لديك حساب؟{" "}
                  <a
                    href="/register"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    انضم إلى الأبطال
                  </a>
                </p>
              </form>
            </div>
          </div>

          <div className="hidden lg:block lg:w-5/12 relative">
            <div className="absolute inset-0 bg-primary-500">
              <div className="absolute inset-0 flex justify-center items-center">
                <img
                  src={logo} 
                  alt="Logo"
                  className="w-auto h-auto max-w-full max-h-full opacity-20"
                  style={{
                    transform: "rotate(-15deg)", 
                    filter: "drop-shadow(4px 4px 10px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
