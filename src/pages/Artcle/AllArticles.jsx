import React, { useState, useEffect } from "react";
import { Calendar, Search, ArrowLeft, Heart, Share2, UserCircle } from "lucide-react";
import ArticleService from "../../services/articleService";
import CityService from "../../services/cityService";
import { useNavigate } from "react-router-dom";

const AllArticles = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllArticles = async () => {
      setLoading(true);
      try {
        let allArticles = [];
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await ArticleService.getPublic(currentPage, size);
          allArticles = [...allArticles, ...response.data.content];
          hasMorePages = !response.data.last;
          currentPage++;
        }

        setAllArticles(allArticles);
        setFilteredArticles(allArticles);
        setTotalPages(Math.ceil(allArticles.length / size));
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setAllArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities(0, 100);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    let result = [...allArticles];

    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.user.psudoName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.city) {
      result = result.filter(
        (article) => article.city.id === parseInt(filters.city)
      );
    }

    setFilteredArticles(result);
    setTotalPages(Math.ceil(result.length / size));
    setPageNumber(0);
  }, [searchTerm, filters, allArticles, size]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      city: "",
    });
    setSearchTerm("");
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const paginatedArticles = filteredArticles.slice(
    pageNumber * size,
    (pageNumber + 1) * size
  );

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

        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 shadow-md">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full h-14 pr-10 pl-4 py-3 font-kufi border border-neutral-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-right shadow-sm"
                    placeholder="ابحث عن مقال أو كاتب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <select
                  className="block w-full border h-14 border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                >
                  <option value="">جميع المدن</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto md:ml-auto">
                <button
                  onClick={resetFilters}
                  className="text-primary-600 hover:text-primary-700 py-3 px-4 font-kufi rounded-lg transition-colors duration-200 flex items-center whitespace-nowrap"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-4 font-kufi text-neutral-600">
              جاري تحميل المقالات...
            </p>
          </div>
        ) : paginatedArticles.length === 0 ? (
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
              لم يتم العثور على مقالات تطابق معايير البحث، يرجى تعديل الفلتر
              وإعادة المحاولة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={article.imageUrl || "https://plus.unsplash.com/premium_photo-1723044801280-fe1932fa9841?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGJsb29kJTIwZG9uYXRpb258ZW58MHx8MHx8fDA%3D"}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-kufi">
                    {article.category || "عام"}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-cairo font-bold text-xl mb-2 text-neutral-800">
                    {article.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 font-kufi text-sm line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-neutral-500 text-sm font-kufi">
                      <Calendar className="w-4 h-4 ml-1" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-neutral-500 text-sm">
                      <Heart className="w-4 h-4 ml-1" />
                      {article.likes || 0}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/articles/${article.id}`)}
                      className="flex items-center text-primary-500 hover:text-primary-600 transition-colors duration-200 font-kufi"
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
        )}

        {filteredArticles.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                disabled={pageNumber === 0}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageToShow = i + 1;
                const pagesToShow = 5;
                const startPage = Math.max(
                  1,
                  pageNumber + 1 - Math.floor(pagesToShow / 2)
                );
                const endPage = Math.min(
                  totalPages,
                  startPage + pagesToShow - 1
                );

                if (pageToShow >= startPage && pageToShow <= endPage) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPageNumber(i)}
                      className={`px-4 py-2 rounded-md ${
                        i === pageNumber
                          ? "bg-primary-500 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={pageNumber === totalPages - 1}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
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