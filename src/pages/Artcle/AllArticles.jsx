import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Search, Filter, Tag, ChevronDown, ArrowLeft } from 'lucide-react';

const AllArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const fetchArticles = async () => {
      setTimeout(() => {
        const dummyArticles = [
          {
            id: 1,
            title: "فوائد التبرع بالدم للمتبرع",
            excerpt: "هل تعلم أن التبرع بالدم يمكن أن يحسن صحتك؟ اكتشف الفوائد الصحية المدهشة للتبرع الدوري بالدم.",
            imageUrl: "/api/placeholder/600/400",
            category: "صحة",
            date: "2024-02-10",
            likes: 123,
            author: "د. محمد الأحمد",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 2,
            title: "كل ما تحتاج معرفته عن فصائل الدم",
            excerpt: "دليل شامل حول فصائل الدم المختلفة وأهميتها في عمليات نقل الدم والتوافق بين المتبرع والمتلقي.",
            imageUrl: "/api/placeholder/600/400",
            category: "معلومات طبية",
            date: "2024-02-05",
            likes: 98,
            author: "د. سارة الخالدي",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 3,
            title: "قصة نجاح: كيف أنقذ متبرعو الدم حياة طفلة صغيرة",
            excerpt: "قصة ملهمة عن طفلة تعافت من مرض خطير بفضل متبرعين بالدم استجابوا لنداء مستشفى محلي.",
            imageUrl: "/api/placeholder/600/400",
            category: "قصص ملهمة",
            date: "2024-01-28",
            likes: 215,
            author: "أحمد المنصور",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 4,
            title: "نصائح هامة قبل التبرع بالدم",
            excerpt: "إرشادات مهمة يجب اتباعها قبل وبعد التبرع بالدم لضمان تجربة آمنة وصحية.",
            imageUrl: "/api/placeholder/600/400",
            category: "نصائح",
            date: "2024-01-22",
            likes: 87,
            author: "ليلى القاسم",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 5,
            title: "أسئلة شائعة حول التبرع بالدم",
            excerpt: "إجابات على الأسئلة الأكثر شيوعاً حول عملية التبرع بالدم والمخاوف المرتبطة بها.",
            imageUrl: "/api/placeholder/600/400",
            category: "أسئلة وأجوبة",
            date: "2024-01-15",
            likes: 145,
            author: "د. فاطمة العلي",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 6,
            title: "دور التبرع بالدم في إنقاذ ضحايا الحوادث",
            excerpt: "كيف يساعد مخزون الدم في المستشفيات على إنقاذ حياة ضحايا الحوادث والكوارث.",
            imageUrl: "/api/placeholder/600/400",
            category: "توعية",
            date: "2024-01-08",
            likes: 112,
            author: "د. خالد النعيمي",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 7,
            title: "التبرع بالصفائح الدموية: ما هو وكيف يتم؟",
            excerpt: "شرح مفصل لعملية التبرع بالصفائح الدموية وأهميتها لمرضى السرطان وغيرهم.",
            imageUrl: "/api/placeholder/600/400",
            category: "معلومات طبية",
            date: "2023-12-28",
            likes: 76,
            author: "د. سمير الجاسم",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 8,
            title: "حملات التبرع بالدم: دور المؤسسات والشركات",
            excerpt: "كيف يمكن للمؤسسات والشركات المساهمة في تنظيم حملات للتبرع بالدم وتعزيز ثقافة التبرع.",
            imageUrl: "/api/placeholder/600/400",
            category: "مجتمع",
            date: "2023-12-20",
            likes: 92,
            author: "عبد الله الشمري",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 9,
            title: "التبرع بالدم في رمضان: هل هو آمن؟",
            excerpt: "معلومات مهمة حول التبرع بالدم خلال شهر رمضان المبارك وكيفية الاستعداد له.",
            imageUrl: "/api/placeholder/600/400",
            category: "صحة",
            date: "2023-12-10",
            likes: 188,
            author: "د. نورة السعيد",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 10,
            title: "الأساطير الشائعة حول التبرع بالدم",
            excerpt: "تصحيح المفاهيم الخاطئة والأساطير المتداولة حول عملية التبرع بالدم والرد عليها.",
            imageUrl: "/api/placeholder/600/400",
            category: "توعية",
            date: "2023-11-30",
            likes: 167,
            author: "مريم الهاشمي",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 11,
            title: "فقر الدم: الأسباب والأعراض والعلاج",
            excerpt: "معلومات شاملة عن فقر الدم وكيفية علاجه والوقاية منه.",
            imageUrl: "/api/placeholder/600/400",
            category: "معلومات طبية",
            date: "2023-11-22",
            likes: 143,
            author: "د. حسن العتيبي",
            content: "محتوى المقال الكامل هنا..."
          },
          {
            id: 12,
            title: "كيف يتم تخزين الدم والمحافظة عليه؟",
            excerpt: "نظرة على التقنيات المستخدمة في بنوك الدم لتخزين وحفظ الدم المتبرع به.",
            imageUrl: "/api/placeholder/600/400",
            category: "معلومات طبية",
            date: "2023-11-15",
            likes: 79,
            author: "د. علي المطيري",
            content: "محتوى المقال الكامل هنا..."
          }
        ];
        
        setArticles(dummyArticles);
        setFilteredArticles(dummyArticles);
        setLoading(false);
      }, 1000);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let result = [...articles];


    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.title.includes(searchTerm) ||
          article.excerpt.includes(searchTerm) ||
          article.author.includes(searchTerm)
      );
    }

    if (filters.category) {
      result = result.filter((article) => article.category === filters.category);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'oldest':
          result.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'mostLiked':
          result.sort((a, b) => b.likes - a.likes);
          break;
        default:
          break;
      }
    }

    setFilteredArticles(result);
  }, [searchTerm, filters, articles]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      sortBy: 'newest',
    });
    setSearchTerm('');
  };

  const categories = [...new Set(articles.map(article => article.category))];

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-right mb-10">
          <h1 className="text-4xl font-cairo font-bold text-neutral-800 mb-3">
            مكتبة المقالات
          </h1>
          <p className="text-neutral-600 font-kufi">
            استعرض جميع المقالات والمحتوى التثقيفي حول التبرع بالدم وفوائده
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 font-kufi border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-right"
                placeholder="ابحث عن مقال أو كاتب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 space-x-reverse text-primary-600 font-kufi"
            >
              <Filter className="w-5 h-5 ml-1" />
              <span>
                {showFilters ? 'إخفاء الفلتر' : 'عرض خيارات الفلتر'}
              </span>
              <ChevronDown className={`w-4 h-4 mr-1 transform ${showFilters ? 'rotate-180' : ''} transition-transform`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-kufi text-right text-neutral-700">
                  التصنيف
                </label>
                <select
                  className="block w-full border border-neutral-300 rounded-lg py-2 px-4 text-right font-kufi"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">جميع التصنيفات</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-kufi text-right text-neutral-700">
                  ترتيب حسب
                </label>
                <select
                  className="block w-full border border-neutral-300 rounded-lg py-2 px-4 text-right font-kufi"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="mostLiked">الأكثر إعجاباً</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="font-kufi text-primary-600 hover:text-primary-700 py-2"
                >
                  إعادة ضبط الفلتر
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-4 font-kufi text-neutral-600">جاري تحميل المقالات...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
            <div className="mx-auto w-16 h-16 text-neutral-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h3 className="text-xl font-cairo font-bold text-neutral-700 mb-2">لا توجد مقالات</h3>
            <p className="text-neutral-600 font-kufi max-w-md mx-auto">
              لم يتم العثور على مقالات تطابق معايير البحث، يرجى تعديل الفلتر وإعادة المحاولة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-kufi">
                    {article.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-cairo font-bold text-xl mb-2 text-neutral-800">
                    {article.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 font-kufi text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-neutral-500 text-sm font-kufi">
                      <Calendar className="w-4 h-4 ml-1 mr-2 mb-1" />
                      {new Date(article.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-neutral-500 text-sm">
                      <Heart className="w-4 h-4 ml-1" />
                      {article.likes}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-neutral-500 text-sm font-kufi">
                      {article.author}
                    </span>
                    <button className="flex items-center text-primary-500 hover:text-primary-600 transition-colors duration-200 font-kufi">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      اقرأ المزيد
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredArticles.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100">
                السابق
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-md ${
                    page === 1
                      ? 'bg-primary-500 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100">
                التالي
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticles;