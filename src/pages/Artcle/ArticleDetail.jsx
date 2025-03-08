import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, User, MapPin } from "lucide-react";
import ArticleService from "../../services/articleService";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await ArticleService.getArticleById(id);
        setArticle(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        setError("لم نتمكن من العثور على المقال المطلوب");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString({
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4 font-kufi text-neutral-600">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="text-center py-16">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-cairo font-bold text-neutral-700 mb-2">
              {error}
            </h3>
            <p className="text-neutral-600 font-kufi mb-6">
              حدث خطأ أثناء محاولة الوصول إلى المقال المطلوب
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-kufi flex items-center mx-auto"
            >
              <ArrowLeft className="ml-2 w-4 h-4" />
              العودة للمكتبة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="text-center py-16">
            <h3 className="text-xl font-cairo font-bold text-neutral-700 mb-2">
              المقال غير موجود
            </h3>
            <p className="text-neutral-600 font-kufi mb-6">
              لم نتمكن من العثور على المقال المطلوب
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-kufi flex items-center mx-auto"
            >
              <ArrowLeft className="ml-2 w-4 h-4" />
              العودة للمكتبة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 flex items-center text-primary-600 hover:text-primary-700 font-kufi rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="ml-2 w-5 h-5" />
          العودة للمكتبة
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {article.imageUrl && (
            <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-neutral-500 font-kufi">
              <div className="flex items-center">
                <User className="ml-2 w-4 h-4" />
                <span>{article.user.psudoName}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="ml-2 w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              {article.city && (
                <div className="flex items-center">
                  <MapPin className="ml-2 w-4 h-4" />
                  <span>{article.city.cityName}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-cairo font-bold text-neutral-800 mb-6 text-right">
              {article.title}
            </h1>

            <div className="prose prose-lg max-w-none font-kufi text-neutral-700 text-right leading-relaxed">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 justify-end">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-neutral-100 text-neutral-600 rounded-full px-3 py-1 text-sm font-kufi"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-cairo font-bold text-neutral-800 mb-6 text-right">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/articles/${relatedArticle.id}`)}
                >
                  <div className="p-6">
                    <h3 className="font-cairo font-bold text-lg mb-2 text-neutral-800">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-neutral-600 text-sm font-kufi line-clamp-2">
                      {relatedArticle.content}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-neutral-500 text-sm font-kufi">
                        {relatedArticle.user.psudoName}
                      </span>
                      <span className="text-primary-500 hover:text-primary-600 transition-colors duration-200 font-kufi text-sm">
                        اقرأ المزيد
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;