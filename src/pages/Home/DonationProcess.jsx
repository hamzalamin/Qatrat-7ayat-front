import React, { useState } from "react";
import {
  Clipboard,
  Droplet,
  Clock,
  ChevronDown,
  Heart,
  User,
  FileText,
  Coffee,
  Activity,
  CheckCircle,
  HelpCircle,
  MapPin,
  Calendar,
} from "lucide-react";

const DonationProcessSection = () => {
  const [openFaqId, setOpenFaqId] = useState(null);

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

  const faqs = [
    {
      id: 1,
      question: "من يمكنه التبرع بالدم؟",
      answer:
        "يمكن للأشخاص الأصحاء بين 18 و60 عاماً، ممن يزنون أكثر من 50 كجم، التبرع بالدم. يجب أن تكون بصحة جيدة وألا تعاني من أمراض معدية أو مزمنة خطيرة. هناك بعض الحالات التي قد تمنع التبرع مؤقتاً مثل الحمل، العمليات الجراحية الحديثة، أو تناول بعض الأدوية.",
    },
    {
      id: 2,
      question: "كم مرة يمكنني التبرع بالدم؟",
      answer:
        "يمكن للرجال التبرع كل 3 أشهر (4 مرات سنوياً)، بينما يمكن للنساء التبرع كل 4 أشهر (3 مرات سنوياً). هذه الفترة ضرورية للسماح للجسم باستعادة مخزون الحديد والخلايا الدموية.",
    },
    {
      id: 3,
      question: "هل التبرع بالدم آمن؟",
      answer:
        "نعم، عملية التبرع بالدم آمنة تماماً. يتم استخدام معدات معقمة تُستخدم لمرة واحدة فقط، مما يمنع أي خطر للعدوى. الكمية المسحوبة آمنة ويستطيع الجسم تعويضها خلال فترة قصيرة. يشرف على العملية فريق طبي متخصص.",
    },
    {
      id: 4,
      question: "ماذا يجب أن أفعل قبل التبرع بالدم؟",
      answer:
        "ينصح بتناول وجبة متوازنة قبل 3 ساعات من التبرع، وشرب كمية كافية من الماء (2-3 أكواب على الأقل). تجنب الدهون والأطعمة الثقيلة. احرص على النوم جيداً ليلة التبرع. أحضر هويتك الشخصية وقائمة بالأدوية التي تتناولها إن وجدت.",
    },
    {
      id: 5,
      question: "هل هناك آثار جانبية للتبرع بالدم؟",
      answer:
        "معظم المتبرعين لا يشعرون بأي آثار جانبية سوى وخز بسيط عند إدخال الإبرة. في حالات نادرة، قد يشعر البعض بدوار خفيف أو ضعف مؤقت يزول بالراحة وتناول السوائل. من النادر جداً حدوث مضاعفات. سيقدم لك الفريق الطبي كافة النصائح للتعافي السريع.",
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const myths = [
    {
      myth: "التبرع بالدم يسبب زيادة الوزن",
      reality:
        "التبرع بالدم لا يؤثر على الوزن، بل قد يحفز الجسم على إنتاج خلايا دم جديدة وصحية",
    },
    {
      myth: "التبرع بالدم يضعف الجسم لفترة طويلة",
      reality:
        "يستعيد الجسم السوائل خلال 24 ساعة والخلايا الحمراء خلال أسابيع قليلة",
    },
    {
      myth: "المرأة لا يمكنها التبرع أثناء الدورة الشهرية",
      reality:
        "يمكن للمرأة التبرع خلال الدورة الشهرية طالما أن مستوى الهيموجلوبين طبيعي",
    },
    {
      myth: "التبرع يؤدي للإصابة بفقر الدم",
      reality:
        "يتم التأكد من مستويات الهيموجلوبين قبل كل تبرع، ولا يُسمح بالتبرع لمن يعاني من نقص الحديد",
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-2 bg-neutral-50 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-primary-500 ml-2" />
              <h3 className="text-xl font-bold font-cairo text-neutral-800">
                شروط التبرع الأساسية
              </h3>
            </div>

            <ul className="space-y-3 mt-4">
              {[
                "العمر بين 18 و60 سنة",
                "الوزن لا يقل عن 50 كجم",
                "عدم وجود أمراض مزمنة خطيرة",
                "مستوى هيموجلوبين طبيعي (13 للرجال، 12.5 للنساء)",
                "عدم التبرع خلال آخر 3 أشهر للرجال و4 أشهر للنساء",
                "عدم تناول مضادات حيوية خلال آخر أسبوعين",
                "عدم إجراء عمليات جراحية خلال آخر 6 أشهر",
                "الصيام 3 ساعات قبل التبرع من الدهون",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-neutral-700 font-ibm text-sm"
                >
                  <CheckCircle className="w-5 h-5 text-primary-500 ml-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button className="mt-6 px-6 py-2 bg-white border border-primary-300 text-primary-600 rounded-full font-cairo font-medium text-sm hover:bg-primary-50 transition-colors duration-300 w-full flex items-center justify-center">
              <FileText className="w-4 h-4 ml-2" />
              تحميل استمارة الأهلية الكاملة
            </button>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-neutral-100 shadow-sm">
            <div className="flex items-center mb-6">
              <HelpCircle className="w-6 h-6 text-primary-500 ml-2" />
              <h3 className="text-xl font-bold font-cairo text-neutral-800">
                الأسئلة الشائعة
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-neutral-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-right bg-neutral-50 hover:bg-neutral-100 transition-colors duration-200"
                  >
                    <span className="font-cairo font-medium text-neutral-800">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
                        openFaqId === faq.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openFaqId === faq.id && (
                    <div className="p-4 bg-white">
                      <p className="text-neutral-600 font-ibm text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-secondary-50 rounded-xl p-6 md:p-8 shadow-md">
          <h3 className="text-xl font-bold font-cairo text-neutral-800 mb-6 flex items-center">
            <Clipboard className="w-6 h-6 text-secondary-500 ml-2" />
            تصحيح المفاهيم الخاطئة
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {myths.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                  <p className="text-secondary-700 font-cairo font-medium text-sm">
                    <span className="text-secondary-500 font-bold ml-1">
                      الخرافة:
                    </span>
                    {item.myth}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-primary-700 font-ibm text-sm">
                    <span className="text-primary-500 font-bold ml-1">
                      الحقيقة:
                    </span>
                    {item.reality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-xl font-bold font-cairo text-neutral-800 mb-4">
            مستعد للتبرع وإنقاذ حياة؟
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-cairo font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <span>احجز موعداً للتبرع</span>
              <Calendar className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-cairo font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <span>ابحث عن أقرب مركز</span>
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationProcessSection;
