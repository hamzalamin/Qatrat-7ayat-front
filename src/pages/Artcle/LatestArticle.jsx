import React, { useState, useEffect } from "react";
import { Calendar, ArrowLeft, Heart, Share2, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ArticleService from "../../services/articleService";

const LatestArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await ArticleService.getLatestPublic();
        // Check if response.data is an array (direct data) or has content property
        const articlesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.content || []);
        
        const sortedArticles = articlesData.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        const lastThreeArticles = sortedArticles.slice(0, 3);
        const formattedArticles = lastThreeArticles.map((article) => ({
          id: article.id,
          title: article.title,
          excerpt: article.content.substring(0, 100) + "...",
          date: article.publishedAt,
          imageUrl: article.imageUrl || "https://via.placeholder.com/300",
          likes: article.likes || 0,
          category: article.category || "عام",
          author: article.user?.psudoName || "مجهول",
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
        <p className="mt-4 font-kufi text-neutral-600">
          جاري تحميل المقالات...
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
        <div className="mx-auto w-16 h-16 text-neutral-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-cairo font-bold text-neutral-700 mb-2">
          لا توجد مقالات
        </h3>
        <p className="text-neutral-600 font-kufi max-w-md mx-auto">
          لم يتم العثور على مقالات حديثة.
        </p>
      </div>
    );
  }

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

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/articles/${article.id}`)}
                    className=" flex items-center text-primary-500 hover:text-primary-600 transition-colors duration-200 font-kufi"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    اقرأ المزيد
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
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/all-articles"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-kufi transition-colors duration-200"
          >
            عرض جميع المقالات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
