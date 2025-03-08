import React, { useState, useEffect } from "react";
import { Calendar, Search, ArrowLeft } from "lucide-react";
import ArticleService from "../../services/articleService";
import CityService from "../../services/cityService";

const AllArticles = () => {
  const [allArticles, setAllArticles] = useState([]); // Store all articles
  const [filteredArticles, setFilteredArticles] = useState([]); // Store filtered articles
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "", // Filter by city ID
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [cities, setCities] = useState([]);

  // Fetch all articles from the backend
  useEffect(() => {
    const fetchAllArticles = async () => {
      setLoading(true);
      try {
        let allArticles = [];
        let currentPage = 0;
        let hasMorePages = true;

        // Fetch all pages of articles
        while (hasMorePages) {
          const response = await ArticleService.get(currentPage, size);
          allArticles = [...allArticles, ...response.data.content];
          hasMorePages = !response.data.last; // Check if there are more pages
          currentPage++;
        }

        setAllArticles(allArticles);
        setFilteredArticles(allArticles); // Initialize filtered articles
        setTotalPages(Math.ceil(allArticles.length / size)); // Calculate total pages
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

  // Fetch cities for filtering
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

  // Handle search and filtering
  useEffect(() => {
    let result = [...allArticles];

    // Search by title, content, or author
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

    // Filter by city
    if (filters.city) {
      result = result.filter((article) => article.city.id === parseInt(filters.city));
    }

    setFilteredArticles(result);
    setTotalPages(Math.ceil(result.length / size)); // Update total pages based on filtered results
    setPageNumber(0); // Reset to the first page after filtering
  }, [searchTerm, filters, allArticles, size]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      city: "",
    });
    setSearchTerm("");
  };

  // Handle page change
  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  // Get articles for the current page
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
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search Input */}
              <div className="w-full md:w-2/5 mb-1">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pr-10 pl-4 py-3 font-kufi border border-neutral-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-right shadow-sm"
                    placeholder="ابحث عن مقال أو كاتب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* City Filter Dropdown */}
              <div className="w-full md:w-1/4">
                <select
                  className="block w-full border border-neutral-300 rounded-lg py-3 px-4 text-right font-kufi bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
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

              {/* Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="text-primary-600 hover:text-primary-700 py-3 px-4 font-kufi rounded-lg transition-colors duration-200 flex items-center whitespace-nowrap"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
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
                <div className="p-6">
                  <h3 className="font-cairo font-bold text-xl mb-2 text-neutral-800">
                    {article.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 font-kufi text-sm line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-neutral-500 text-sm font-kufi">
                      <Calendar className="w-4 h-4 ml-1 mr-2 mb-1" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-neutral-500 text-sm font-kufi">
                      {article.user.psudoName}
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
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                disabled={pageNumber === 0}
                className="px-3 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageToShow = i + 1;
                const pagesToShow = 5; // Number of pages to display
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