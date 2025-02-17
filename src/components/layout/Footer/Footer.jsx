import React from 'react';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  ArrowUp
} from 'lucide-react';
import logo from '../../../assets/images/qatrat-7ayat-logo.jpg';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer dir="rtl" className="bg-white relative pt-16 overflow-hidden">
      {/* Blood drop background pattern */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-50 opacity-60"></div>
        <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-primary-50 opacity-40"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-primary-50 opacity-50"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 rounded-full bg-primary-50 opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-5">
            <div className="flex items-center">
              <img src={logo} alt="قطرة حياة" className="w-14 h-14 rounded-full object-cover" />
              <div className="mr-3">
                <h3 className="text-xl font-bold font-cairo text-neutral-800">قطرة حياة</h3>
                <p className="text-sm text-neutral-600 font-kufi">معاً لإنقاذ الأرواح</p>
              </div>
            </div>
            
            <p className="text-neutral-700 font-ibm text-sm leading-relaxed">
              مبادرة وطنية مغربية تهدف لتشجيع التبرع بالدم وتوعية المجتمع بأهميته في إنقاذ الأرواح، تحت الرعاية الملكية السامية.
            </p>
            
            <div className="flex space-x-3 space-x-reverse">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-500 flex items-center justify-center transition-colors duration-300"
                aria-label="facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-500 flex items-center justify-center transition-colors duration-300"
                aria-label="x"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-500 flex items-center justify-center transition-colors duration-300"
                aria-label="instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-500 flex items-center justify-center transition-colors duration-300"
                aria-label="youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-lg font-bold font-cairo text-neutral-800 flex items-center">
              <Heart className="w-5 h-5 text-primary-500 ml-2" fill="#FFE8E8" />
              روابط سريعة
            </h3>
            
            <ul className="space-y-3">
              {[
                { title: "الصفحة الرئيسية", href: "#" },
                { title: "التبرع بالدم", href: "#" },
                { title: "مراكز التبرع", href: "#" },
                { title: "حجز موعد", href: "#" },
                { title: "الأسئلة الشائعة", href: "#" },
                { title: "من نحن", href: "#" },
                { title: "اتصل بنا", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-neutral-700 hover:text-primary-500 font-kufi text-sm flex items-center transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300 ml-2"></span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-lg font-bold font-cairo text-neutral-800 flex items-center">
              <Phone className="w-5 h-5 text-primary-500 ml-2" />
              اتصل بنا
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-primary-400 ml-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-neutral-900 font-cairo font-bold text-sm">الخط الساخن</span>
                  <a href="tel:0800123456" className="text-primary-500 hover:text-primary-600 font-kufi transition-colors duration-200">0800-123-456</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary-400 ml-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-neutral-900 font-cairo font-bold text-sm">البريد الإلكتروني</span>
                  <a href="mailto:info@qatrahayat.ma" className="text-primary-500 hover:text-primary-600 font-kufi text-sm transition-colors duration-200">info@qatrahayat.ma</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 ml-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-neutral-900 font-cairo font-bold text-sm">المقر الرئيسي</span>
                  <address className="text-neutral-700 font-ibm text-sm not-italic">
                    شارع محمد الخامس، الرباط، المملكة المغربية
                  </address>
                </div>
              </li>
              
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-primary-400 ml-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-neutral-900 font-cairo font-bold text-sm">ساعات العمل</span>
                  <p className="text-neutral-700 font-ibm text-sm">
                    الإثنين - السبت: 8:00 صباحاً - 6:00 مساءً
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-lg font-bold font-cairo text-neutral-800 flex items-center">
              <Mail className="w-5 h-5 text-primary-500 ml-2" />
              النشرة الإخبارية
            </h3>
            
            <p className="text-neutral-700 font-ibm text-sm">
              اشترك في نشرتنا البريدية للحصول على آخر أخبار وفعاليات التبرع بالدم
            </p>
            
            <form className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800 font-ibm text-sm"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-cairo font-bold rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <span>اشتراك</span>
                <ArrowUp className="w-4 h-4 mr-2 transform rotate-45" />
              </button>
            </form>
            
            <p className="text-neutral-500 text-xs font-ibm">
              لن نقوم بمشاركة بريدك الإلكتروني مع أي جهة أخرى.
              بالاشتراك، أنت توافق على <a href="#" className="text-primary-500 hover:underline">سياسة الخصوصية</a> الخاصة بنا.
            </p>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="text-neutral-600 font-ibm text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} قطرة حياة. جميع الحقوق محفوظة.
          </div>
          
          <div className="flex items-center space-x-6 space-x-reverse">
            <a href="#" className="text-neutral-600 hover:text-primary-500 text-sm font-ibm transition-colors duration-200">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-neutral-600 hover:text-primary-500 text-sm font-ibm transition-colors duration-200">
              الشروط والأحكام
            </a>
            <a href="#" className="text-neutral-600 hover:text-primary-500 text-sm font-ibm transition-colors duration-200">
              إخلاء المسؤولية
            </a>
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="absolute bottom-16 left-8 w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        aria-label="back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-primary-50"
          style={{ fill: 'currentColor' }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;