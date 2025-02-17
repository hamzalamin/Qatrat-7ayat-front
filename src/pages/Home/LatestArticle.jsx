import React from 'react';
import { Calendar, ArrowLeft, Heart } from 'lucide-react';

const LatestArticles = () => {
  const articles = [
    {
      id: 1,
      title: "فوائد التبرع بالدم للمتبرع",
      excerpt: "تعرف على الفوائد الصحية العديدة التي يحصل عليها المتبرع بالدم...",
      date: "2024-02-15",
      imageUrl: "https://cdn.pixabay.com/photo/2017/08/07/13/05/blood-donation-2603649_1280.jpg",
      likes: 245,
      category: "صحة"
    },
    {
      id: 2,
      title: "شروط التبرع بالدم",
      excerpt: "دليل شامل حول الشروط الواجب توافرها في المتبرع بالدم...",
      date: "2024-02-14",
      imageUrl: "https://cdn.pixabay.com/photo/2023/11/15/14/28/heart-8390212_1280.jpg",
      likes: 189,
      category: "إرشادات"
    },
    {
      id: 3,
      title: "قصص ملهمة من متبرعين",
      excerpt: "قصص حقيقية من متبرعين منتظمين وكيف ساهموا في إنقاذ حياة الآخرين...",
      date: "2024-02-13",
      imageUrl: "https://cdn.pixabay.com/photo/2013/03/07/14/31/blood-bags-91170_1280.jpg",
      likes: 312,
      category: "قصص"
    }
  ];

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-right mb-8">
          <h2 className="text-3xl font-cairo font-bold text-neutral-800 mb-2">
            أحدث المقالات
          </h2>
          <p className="text-neutral-600 font-kufi">
            تصفح أحدث المقالات والنصائح حول التبرع بالدم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {articles.map((article) => (
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
                <p className="text-neutral-600 mb-4 font-kufi text-sm">
                  {article.excerpt}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-neutral-500 text-sm font-kufi">
                    <Calendar className="w-4 h-4 ml-1" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-neutral-500 text-sm">
                    <Heart className="w-4 h-4 ml-1" />
                    {article.likes}
                  </div>
                </div>

                <button className="mt-4 flex items-center text-primary-500 hover:text-primary-600 transition-colors duration-200 font-kufi">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  اقرأ المزيد
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-kufi transition-colors duration-200">
            عرض جميع المقالات
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;