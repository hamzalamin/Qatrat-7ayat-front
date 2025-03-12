import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Error401 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4 font-kufi">
      <div className="animate-float text-primary-500 mb-6">
        <AlertTriangle size={80} />
      </div>
      
      <h1 className="text-3xl font-bold text-primary-500 mb-4 text-center">401 - غير مصرح</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center border-t-4 border-primary-500">
        <p className="text-neutral-800 mb-6">
          عذراً، يجب تسجيل الدخول للوصول إلى هذه الصفحة. يرجى تسجيل الدخول للمتابعة.
        </p>
        
        <div className="space-y-4">
          <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded-md transition-colors w-full">
            تسجيل الدخول
          </button>
          
          <button className="bg-neutral-100 hover:bg-neutral-200 text-secondary-700 py-2 px-6 rounded-md transition-colors w-full">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-neutral-600 text-center max-w-md">
        <p>إذا كنت تعتقد أن هناك خطأ، يرجى التواصل مع فريق الدعم الفني الخاص بنا</p>
        <p className="mt-2 text-accent-400">support@blooddonation.com</p>
      </div>
    </div>
  );
};

export default Error401;