import React from 'react';
import { ArrowDownCircle, Heart, Map } from 'lucide-react';
import kingImage from '../../../src/assets/images/king-mohmmed-6.jpg'; 

const HeroSection = () => {
  return (
    <section dir="rtl" className="relative w-full bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('path-to-pattern.png')] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-3/5 space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-cairo text-neutral-800 leading-tight">
              <span className="text-primary-500">تبرّع بالدم</span>... أنقذ حياة
            </h1>
            
            <div className="bg-neutral-50 p-4 md:p-6 rounded-lg border-r-4 border-primary-500">
              <p className="text-lg md:text-xl font-kufi text-secondary-700 leading-relaxed">
                ﴿ وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا ﴾
              </p>
              <p className="mt-2 text-sm text-neutral-600 font-cairo">
                - سورة المائدة، الآية 32
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold font-cairo text-secondary-700">
                من الخطاب الملكي السامي
              </h2>
              <p className="text-base md:text-lg font-ibm text-neutral-700 leading-relaxed">
                إن التبرع بالدم هو عمل إنساني نبيل يعكس قيم التضامن والتكافل التي تميز الشعب المغربي الأصيل. إنه واجب وطني وإنساني يساهم في إنقاذ حياة الآلاف من المواطنين، ونحن ندعو كافة المغاربة للمشاركة في هذه الحملة الوطنية للتبرع بالدم.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-cairo font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>تبرّع الآن</span>
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-neutral-50 text-primary-500 border-2 border-primary-500 font-cairo font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2">
                <span>تعرّف على مراكز التبرع</span>
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-2/5 mt-8 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary-100 rounded-full opacity-50 -z-10"></div>
              
              <div className="relative rounded-lg overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={kingImage} 
                  alt="جلالة الملك محمد السادس" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-cairo">
                    جلالة الملك محمد السادس نصره الله
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold text-primary-500 font-cairo">+45٪</p>
                <p className="text-sm text-neutral-600 font-kufi mt-1">زيادة في التبرعات</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold text-primary-500 font-cairo">1000+</p>
                <p className="text-sm text-neutral-600 font-kufi mt-1">حياة تم إنقاذها</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownCircle className="w-8 h-8 text-primary-400 cursor-pointer" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;