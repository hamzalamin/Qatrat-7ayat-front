import React from 'react';
import { DropletIcon, Clock, MapPin, Phone, UserCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BloodDonorsSection = () => {
  const donors = [
    {
      id: 1,
      bloodType: 'A+',
      location: 'مستشفى الملك فهد - الرياض',
      availability: 'متاح اليوم',
      timePosted: '2 ساعات',
      contactNumber: '05XXXXXXXX',
      description: 'متبرع متاح من فصيلة A+ لمساعدة المحتاجين في خلال 24 ساعة القادمة',
      status: 'available'
    },
    {
      id: 2,
      bloodType: 'O-',
      location: 'جدة - حي النزهة',
      timePosted: '5 ساعات',
      availability: 'متاح اليوم',
      contactNumber: '05XXXXXXXX',
      description: 'متبرع متاح للحالات الطارئة في مدينة جدة',
      status: 'available'
    },
    {
      id: 3,
      bloodType: 'B+',
      location: 'مستشفى الأمل - الدمام',
      availability: 'متاح خلال 48 ساعة',
      timePosted: '6 ساعات',
      contactNumber: '05XXXXXXXX',
      description: 'متبرع مستعد لتقديم وحدتين من فصيلة الدم B+ للمحتاجين',
      status: 'available'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'available' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600';
  };

  return (
    <section className="bg-neutral-50 py-12 md:py-16 px-4 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-right mb-8">
          <h2 className="text-3xl font-cairo font-bold text-neutral-800 mb-2">
            المتبرعين بالدم
          </h2>
          <p className="text-neutral-600 font-kufi">
            قائمة بأحدث المتبرعين المتاحين في منطقتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div 
              key={donor.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-kufi ${getStatusColor(donor.status)}`}>
                  {donor.availability}
                </span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <DropletIcon className="w-5 h-5 text-primary-500" />
                  <span className="font-bold text-lg text-primary-500">{donor.bloodType}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <MapPin className="w-5 h-5 text-neutral-500 mr-2" />
                    <p className="text-neutral-700 font-kufi">{donor.location}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5 text-neutral-500 mr-2" />
                    <span className="text-neutral-600 text-sm">{donor.timePosted}</span>
                  </div>
                  <p className="text-neutral-700 font-kufi mt-2 line-clamp-2">{donor.description}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-kufi flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    اتصال
                  </button>
                  <div className="flex space-x-2 space-x-reverse">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg">
                      <Share2 className="w-5 h-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg">
                      <UserCircle className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/all-blood-donors" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-kufi transition-colors duration-200">
            عرض جميع المتبرعين
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BloodDonorsSection;
