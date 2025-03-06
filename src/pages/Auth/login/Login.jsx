import React, { useState } from "react";
import { 
  ChevronLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
} from "lucide-react";
import logo from "../../../../src/assets/images/qatrat-7ayat-logo.jpg";
import AuthService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const CreativeLoginPage = () => {
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
    <div 
      dir="rtl" 
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4 relative overflow-hidden"
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
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-100 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 p-4 rounded-full">
                <img src={logo} className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-red-600 font-cairo">
              مرحباً بعودتك
            </h2>
            <p className="text-neutral-500 font-kufi">
              كن بطلاً. أنقذ حياة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-red-50/50 
                    border border-red-100 focus:outline-none 
                    focus:ring-2 focus:ring-red-300 
                    text-right font-cairo"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-red-50/50 
                    border border-red-100 focus:outline-none 
                    focus:ring-2 focus:ring-red-300 
                    text-right font-cairo"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  className="text-red-500 rounded focus:ring-red-300"
                />
                <span className="text-sm text-neutral-600 font-cairo">تذكرني</span>
              </label>
              <a href="#" className="text-sm text-red-500 hover:text-red-600 font-cairo">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl 
                transition-colors duration-300 flex items-center justify-center 
                space-x-2 rtl:space-x-reverse font-cairo"
            >
              {isLoading ? (
                <div className="animate-pulse">جاري تسجيل الدخول...</div>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ChevronLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-neutral-600 font-cairo">
              ليس لديك حساب؟{" "}
              <a 
                href="/register" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                انضم إلينا الآن
              </a>
            </p>
          </div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-l from-red-500 to-pink-500"></div>
      </div>
    </div>
  );
};

export default CreativeLoginPage;