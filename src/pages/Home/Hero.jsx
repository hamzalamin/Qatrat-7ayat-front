import React, { useState, useRef } from 'react';
import { ArrowDownCircle, Heart, Map } from 'lucide-react';
import kingImage from '../../../src/assets/images/king-mohmmed-6.jpg';
import { Link } from "react-router-dom";
import { X, Search, MapPin } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
};

const defaultCenter = {
  lat: 31.7917,
  lng: -7.0926,
};

const HeroSection = () => {
  const [showMap, setShowMap] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(6);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    geocoderRef.current.geocode(
      { address: searchTerm },
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const newResults = results.map((result, index) => ({
            id: index,
            name: result.formatted_address,
            position: {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng()
            }
          }));
          
          setSearchResults(newResults);
          setMapCenter(newResults[0].position);
          setMapZoom(12);
          
          // If you want to keep your predefined centers too:
          // setSearchResults([...newResults, ...donationCenters]);
        } else {
          setSearchResults([]);
          alert("No results found for: " + searchTerm);
        }
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section dir="rtl" className="relative w-full bg-white overflow-hidden">

      {showMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative shadow-xl">
            <button
              onClick={() => {
                setShowMap(false);
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute top-2 left-2 text-neutral-500 hover:text-red-500"
            >
              <X />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-center font-cairo">
              ابحث عن مراكز التبرع بالدم في أي مكان
            </h2>
            
            <div className="mb-4 flex justify-center relative">
              <input
                type="text"
                placeholder="ابحث عن أي مدينة في العالم"
                className="w-full max-w-md px-4 py-2 border border-neutral-300 rounded-md text-sm font-cairo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={handleSearch}
                className="absolute left-40 top-2 text-neutral-400 hover:text-primary-500"
              >
                <Search size={25} />
              </button>
            </div>
            
            <LoadScript 
              googleMapsApiKey="AIzaSyCYKzkInZ_yYAKTx4XcAQ8FTmFH4VQw424"
              libraries={['places']}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {searchResults.map((result) => (
                  <Marker
                    key={result.id}
                    position={result.position}
                    onClick={() => {
                      setSelectedCenter(result);
                      setMapCenter(result.position);
                      setMapZoom(14);
                    }}
                  />
                ))}
                
                {selectedCenter && (
                  <InfoWindow
                    position={selectedCenter.position}
                    onCloseClick={() => setSelectedCenter(null)}
                  >
                    <div className="text-sm font-cairo">
                      <p className="font-bold">{selectedCenter.name}</p>
                      <button 
                        className="mt-2 text-xs bg-primary-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          // Add logic to find blood centers near this location
                          alert(`Searching for blood centers near ${selectedCenter.name}`);
                        }}
                      >
                        ابحث عن مراكز التبرع القريبة
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="font-cairo font-bold mb-2">
                  نتائج البحث ({searchResults.length})
                </h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map(result => (
                    <li 
                      key={result.id} 
                      className="font-cairo p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedCenter(result);
                        setMapCenter(result.position);
                        setMapZoom(14);
                      }}
                    >
                      <MapPin className="ml-2 text-primary-500" size={16} />
                      <span>{result.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

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
              <Link
                to="/all-blood-requests"
                className="w-full sm:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-cairo font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                <span>تبرّع الآن</span>
              </Link>
              <button
                onClick={() => setShowMap(true)}
                className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-neutral-50 text-primary-500 border-2 border-primary-500 font-cairo font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
              >
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