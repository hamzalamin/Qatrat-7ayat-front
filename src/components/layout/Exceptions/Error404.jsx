import React from 'react';
import { Search } from 'lucide-react';

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4 font-kufi">
      <div className="relative">
        <div className="text-accent-500 animate-float">
          <Search size={80} />
        </div>
        <div className="absolute top-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          !
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-accent-500 mb-2 text-center">404 - الصفحة غير موجودة</h1>
      <p className="text-neutral-600 mb-8 text-center max-w-md">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
      
      <div className="mt-8 flex items-center justify-center space-x-4 rtl:space-x-reverse">
        <div className="flex flex-col items-center">
          <span className="text-primary-500 font-bold text-lg">هل تحتاج للمساعدة؟</span>
          <span className="text-neutral-600">تواصل مع فريق الدعم الفني</span>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full transition-colors">
          اتصل بنا
        </button>
      </div>
    </div>
  );
};

export default Error404;