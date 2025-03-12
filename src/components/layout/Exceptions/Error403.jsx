import React from 'react';
import { ShieldX } from 'lucide-react';

const Error403 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4 font-kufi">
      <div className="animate-float text-secondary-500 mb-6">
        <ShieldX size={80} />
      </div>
      
      <h1 className="text-3xl font-bold text-secondary-500 mb-4 text-center">403 - محظور الوصول</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center border-t-4 border-secondary-500">
        <p className="text-neutral-800 mb-6">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى التواصل مع المسؤول إذا كنت تعتقد أنه يجب أن يكون لديك وصول.
        </p>
        
        <div className="flex flex-col space-y-4">
          <div className="bg-neutral-100 p-4 rounded-md text-neutral-800">
            <p className="font-bold text-secondary-700">للمساعدة:</p>
            <ul className="list-disc list-inside text-right mt-2">
              <li>تأكد من تسجيل الدخول بالحساب الصحيح</li>
              <li>تحقق من دورك ومستوى الوصول الخاص بك</li>
              <li>تواصل مع مسؤول النظام للحصول على المساعدة</li>
            </ul>
          </div>
          
          <button className="bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-6 rounded-md transition-colors">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-neutral-600 text-center max-w-md">
        <p>رقم المرجع: <span className="font-mono text-accent-500">ERR-403-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span></p>
        <p className="mt-2">الرجاء ذكر هذا الرقم عند التواصل مع الدعم الفني</p>
      </div>
    </div>
  );
};

export default Error403;