import React, { useState } from 'react';
import { Droplet, Info } from 'lucide-react';

const BloodType = () => {
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  
  const bloodTypes = [
    { 
      type: 'A+', 
      color: '#E53935', 
      canDonateTo: ['A+', 'AB+'],
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      percentage: 34,
      description: 'فصيلة شائعة جداً، يمكن لها التبرع لحاملي A+ و AB+ فقط'
    },
    { 
      type: 'A-', 
      color: '#B32220', 
      canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
      canReceiveFrom: ['A-', 'O-'],
      percentage: 6,
      description: 'فصيلة نادرة نسبياً، يمكن لها التبرع لجميع فصائل A و AB'
    },
    { 
      type: 'B+', 
      color: '#2C4B7C', 
      canDonateTo: ['B+', 'AB+'],
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      percentage: 9,
      description: 'فصيلة متوسطة الشيوع، يمكن لها التبرع لحاملي B+ و AB+ فقط'
    },
    { 
      type: 'B-', 
      color: '#1A354A', 
      canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
      canReceiveFrom: ['B-', 'O-'],
      percentage: 2,
      description: 'فصيلة نادرة، يمكن لها التبرع لجميع فصائل B و AB'
    },
    { 
      type: 'AB+', 
      color: '#4DB6AC', 
      canDonateTo: ['AB+'],
      canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      percentage: 3,
      description: 'المستقبل العام - يمكن أن تستقبل من جميع الفصائل'
    },
    { 
      type: 'AB-', 
      color: '#1F5E57', 
      canDonateTo: ['AB+', 'AB-'],
      canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
      percentage: 1,
      description: 'أندر فصيلة دم، يمكن لها التبرع لحاملي AB فقط'
    },
    { 
      type: 'O+', 
      color: '#FF4747', 
      canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
      canReceiveFrom: ['O+', 'O-'],
      percentage: 38,
      description: 'الفصيلة الأكثر شيوعاً، يمكن لها التبرع لجميع الفصائل الموجبة'
    },
    { 
      type: 'O-', 
      color: '#800B0A', 
      canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canReceiveFrom: ['O-'],
      percentage: 7,
      description: 'المتبرع العام - يمكن التبرع لجميع الفصائل، لكن تستقبل فقط من O-'
    }
  ];

  return (
    <section dir="rtl" className="bg-neutral-50 py-12 md:py-16 px-4 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-cairo text-neutral-800 inline-flex items-center">
            <Droplet className="w-8 h-8 text-primary-500 ml-2" strokeWidth={2.5} fill="#FFEEEE" />
            <span>توافق فصائل الدم</span>
          </h2>
          <p className="mt-3 text-neutral-600 font-ibm max-w-2xl mx-auto">
            تعرف على فصيلة دمك ومع من تتوافق للتبرع أو الاستقبال، المعرفة قد تنقذ حياتك          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
          {bloodTypes.map((blood) => (
            <button
              key={blood.type}
              onClick={() => setSelectedBloodType(blood.type)}
              className={`relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedBloodType === blood.type
                ? "ring-4 ring-offset-2 ring-primary-300 shadow-lg"
                : "shadow-md hover:shadow-lg"
              }`}
              style={{
                backgroundColor: blood.color + '15',
                borderColor: blood.color,
                borderWidth: '2px'
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-2"
                style={{ backgroundColor: blood.color + '30' }} 
              >
                <Droplet
                  strokeWidth={1.5}
                  className="w-8 h-8 md:w-10 md:h-10"
                  style={{ color: blood.color }}
                  fill={blood.color + 'AA'}
                />
              </div>
              <span className="text-xl md:text-2xl font-bold font-cairo" style={{ color: blood.color }}>
                {blood.type}
              </span>
              <span className="text-xs md:text-sm text-neutral-600 mt-1 font-ibm">
                {blood.percentage}% من السكان
              </span>
            </button>
          ))}
        </div>

        {selectedBloodType && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-neutral-100" 
                style={{ 
                  backgroundColor: bloodTypes.find(b => b.type === selectedBloodType).color + '15'
                }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 ml-6"
                  style={{ backgroundColor: bloodTypes.find(b => b.type === selectedBloodType).color + '30' }}
                >
                  <Droplet
                    className="w-7 h-7"
                    style={{ color: bloodTypes.find(b => b.type === selectedBloodType).color }}
                    fill={bloodTypes.find(b => b.type === selectedBloodType).color + 'AA'}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-cairo text-neutral-800">
                    فصيلة دم {selectedBloodType}
                  </h3>
                  <p className="text-sm font-ibm text-neutral-600 mt-1">
                    {bloodTypes.find(b => b.type === selectedBloodType).description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold font-cairo text-neutral-800 flex items-center">
                    <div className="w-5 h-5 text-primary-500" /> 
                    يمكن التبرع لـ:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bloodTypes
                      .find(b => b.type === selectedBloodType)
                      .canDonateTo.map(type => (
                        <div key={`donate-${type}`} 
                          className="flex items-center px-3 py-2 rounded-lg"
                          style={{ 
                            backgroundColor: bloodTypes.find(b => b.type === type).color + '15',
                            borderColor: bloodTypes.find(b => b.type === type).color,
                            borderWidth: '1px'
                          }}
                        >
                          <Droplet
                            className="w-4 h-4 ml-1"
                            style={{ color: bloodTypes.find(b => b.type === type).color }}
                            fill={bloodTypes.find(b => b.type === type).color + 'AA'}
                          />
                          <span className="font-cairo font-bold"
                            style={{ color: bloodTypes.find(b => b.type === type).color }}
                          >
                            {type}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-bold font-cairo text-neutral-800 flex items-center">
                    <div className="w-5 h-5 text-secondary-500 rotate-180" /> 
                    يمكن استقبال من:
                  </h4>
                  <div className="flex flex-wrap gap-2 mr-4 ">
                    {bloodTypes
                      .find(b => b.type === selectedBloodType)
                      .canReceiveFrom.map(type => (
                        <div key={`receive-${type}`} 
                          className="flex items-center px-3 py-2 rounded-lg"
                          style={{ 
                            backgroundColor: bloodTypes.find(b => b.type === type).color + '15',
                            borderColor: bloodTypes.find(b => b.type === type).color,
                            borderWidth: '1px'
                          }}
                        >
                          <Droplet
                            className="w-4 h-4 ml-1"
                            style={{ color: bloodTypes.find(b => b.type === type).color }}
                            fill={bloodTypes.find(b => b.type === type).color + 'AA'}
                          />
                          <span className="font-cairo font-bold"
                            style={{ color: bloodTypes.find(b => b.type === type).color }}
                          >
                            {type}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-4 md:p-6 border-t border-neutral-100">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-secondary-500 mt-1 ml-3 flex-shrink-0" />
                <p className="text-sm font-ibm text-neutral-700">
                  هذه المعلومات إرشادية فقط. يرجى دائماً استشارة الطاقم الطبي قبل التبرع أو استقبال الدم للتأكد من التوافق. قد تكون هناك عوامل أخرى تؤثر على عملية نقل الدم.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!selectedBloodType && (
          <div className="text-center bg-white rounded-xl shadow-md p-6 mt-8 border border-neutral-100">
            <Info className="w-8 h-8 text-secondary-500 mx-auto mb-3" />
            <p className="text-neutral-700 font-ibm">
              اختر فصيلة دم من الأعلى لمعرفة توافقها مع الفصائل الأخرى
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-cairo font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto">
            <span>تعرف على فصيلة دمك</span>
            <Droplet className="w-5 h-5" />
          </button>
          <p className="mt-3 text-sm text-neutral-500 font-ibm">
            يمكنك التوجه لأقرب مركز صحي أو مركز تبرع للكشف عن فصيلة دمك
          </p>
        </div>
      </div>
    </section>
  );
};

export default BloodType;