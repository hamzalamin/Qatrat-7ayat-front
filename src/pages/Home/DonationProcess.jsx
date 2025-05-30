import React, { useState, useRef } from "react";
import {
  Clipboard,
  Droplet,
  Clock,
  ArrowDownCircle,
  Heart,
  Coffee,
  Activity,
} from "lucide-react";



const DonationProcessSection = () => {

  const processSteps = [
    {
      title: "التسجيل والفحص",
      icon: <Clipboard className="w-6 h-6" />,
      description:
        "ملء استمارة بسيطة والخضوع لفحص طبي مبدئي للتأكد من أهليتك للتبرع",
      duration: "10-15 دقيقة",
      details:
        "يتم قياس ضغط الدم، النبض، درجة الحرارة، ونسبة الهيموجلوبين في الدم",
    },
    {
      title: "عملية التبرع",
      icon: <Droplet className="w-6 h-6" />,
      description: "سحب 450 مل من الدم (أقل من 10% من دم الجسم) بشكل آمن وبسيط",
      duration: "8-10 دقائق",
      details:
        "تتم العملية على يد متخصصين باستخدام معدات معقمة تستخدم لمرة واحدة",
    },
    {
      title: "فترة الراحة",
      icon: <Coffee className="w-6 h-6" />,
      description:
        "استراحة قصيرة مع تناول المشروبات والوجبات الخفيفة لاستعادة النشاط",
      duration: "10-15 دقيقة",
      details: "يُنصح بشرب السوائل وتناول وجبة خفيفة لتعويض السكر",
    },
    {
      title: "معالجة الدم",
      icon: <Activity className="w-6 h-6" />,
      description:
        "يتم فحص الدم وفصله إلى مكوناته الأساسية لتلبية احتياجات مختلف المرضى",
      duration: "24 ساعة",
      details:
        "يمكن فصل الدم إلى خلايا حمراء، صفائح دموية، وبلازما لمساعدة عدة مرضى",
    },
    {
      title: "إنقاذ الأرواح",
      icon: <Heart className="w-6 h-6" />,
      description:
        "وصول تبرعك لمن يحتاجه من المرضى في المستشفيات ومراكز الرعاية",
      duration: "خلال أسبوع",
      details: "تبرع واحد يمكن أن ينقذ حياة ما يصل إلى ثلاثة أشخاص",
    },
  ];

  

  return (
    <section dir="rtl" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-right mb-8 ">
          <h2 className="text-3xl font-cairo font-bold text-neutral-800 mb-2">
            رحلة قطرة الدم
          </h2>
          <p className="text-neutral-600 font-kufi">
            تعرف على المراحل البسيطة التي تمر بها عملية التبرع بالدم من لحظة
            وصولك حتى إنقاذ حياة شخص آخر
          </p>
        </div>

        <div className="relative mb-20">
          <div className="absolute top-10 left-0 right-0 h-1 bg-primary-100 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4 shadow-md z-10">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary-500">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold font-cairo shadow-sm">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-bold font-cairo text-neutral-800 mb-2">
                  {step.title}
                </h3>

                <p className="text-neutral-600 font-ibm text-sm mb-3">
                  {step.description}
                </p>

                <div className="flex items-center text-primary-600 text-sm font-cairo mb-2">
                  <Clock className="w-4 h-4 ml-1" />
                  <span>{step.duration}</span>
                </div>

                <p className="text-neutral-500 text-xs font-ibm italic">
                  {step.details}
                </p>
              </div>
            ))}
          </div>
        </div>  

         <div className="absolute  left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownCircle className="w-8 h-8 text-primary-400 cursor-pointer" />
        </div> 
      </div>
    </section>
  );
};

export default DonationProcessSection;
