import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import ArticleService from '../../services/articleService';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await ArticleService.get(pageNumber, size);
        setArticles(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, [pageNumber, size]);

  // Cycle through status: PENDING → APPROVED → REJECTED → PENDING
  const handleStatusUpdate = async (id) => {
    try {
      await ArticleService.updateStatus(id);
      
      setArticles(articles.map(article => {
        if (article.id === id) {
          // Determine the next status
          let nextStatus;
          if (!article.status || article.status === 'PENDING') {
            nextStatus = 'APPROVED';
          } else if (article.status === 'APPROVED') {
            nextStatus = 'REJECTED';
          } else if (article.status === 'REJECTED') {
            nextStatus = 'PENDING';
          }
          
          return { ...article, status: nextStatus };
        }
        return article;
      }));
      
      // If the selected article is being updated, update it too
      if (selectedArticle && selectedArticle.id === id) {
        let nextStatus;
        if (!selectedArticle.status || selectedArticle.status === 'PENDING') {
          nextStatus = 'APPROVED';
        } else if (selectedArticle.status === 'APPROVED') {
          nextStatus = 'REJECTED';
        } else if (selectedArticle.status === 'REJECTED') {
          nextStatus = 'PENDING';
        }
        
        setSelectedArticle({ ...selectedArticle, status: nextStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         searchTerm === '';
    const matchesFilter = filter === 'all' || 
                        (article.status?.toLowerCase() === filter.toLowerCase()) ||
                        (!article.status && filter.toLowerCase() === 'pending');
    return matchesSearch && matchesFilter;
  });

  const handlePreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, totalPages - 1));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusDetails = (status) => {
    if (!status || status === 'PENDING') {
      return {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: AlertCircle
      };
    } else if (status === 'APPROVED') {
      return {
        label: 'Approved',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: Check
      };
    } else if (status === 'REJECTED') {
      return {
        label: 'Rejected',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: X
      };
    }
    
    return {
      label: status,
      bgColor: 'bg-neutral-100',
      textColor: 'text-neutral-800',
      icon: AlertCircle
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold font-cairo text-neutral-800">Article Management</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4 font-kufi text-neutral-600">Loading articles...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Published</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Updated</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <tr key={article.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        {article.imageUrl && (
                          <div className="w-12 h-12 overflow-hidden rounded-full">
                            <img 
                              src={article.imageUrl} 
                              alt={article.title}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-cairo font-medium text-neutral-800">{article.title}</div>
                        <div className="text-sm text-neutral-500 truncate max-w-56">{article.content?.substring(0, 100)}...</div>
                      </td>
                      <td className="px-6 py-4 font-cairo text-neutral-600">
                        {article.user?.psudoName || article.user?.firstName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 font-cairo text-neutral-600">{article.city?.cityName || 'Unknown'}</td>
                      <td className="px-6 py-4 font-cairo text-neutral-600">{formatDate(article.publishedAt)}</td>
                      <td className="px-6 py-4 font-cairo text-neutral-600">{formatDate(article.updatedAt)}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const status = getStatusDetails(article.status);
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm font-cairo ${status.bgColor} ${status.textColor}`}>
                              {status.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(article.id)}
                            className="p-2 rounded-lg transition-colors hover:bg-primary-50 text-primary-500"
                            title="Update Status"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-neutral-500">
                      No articles found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-neutral-600 font-cairo">
                {filteredArticles.length > 0 ? (
                  <>
                    Showing <span className="font-medium">{pageNumber * size + 1}</span> to{' '}
                    <span className="font-medium">{Math.min((pageNumber + 1) * size, filteredArticles.length)}</span> of{' '}
                    <span className="font-medium">{filteredArticles.length}</span> results
                  </>
                ) : (
                  'No results found'
                )}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageNumber === 0}
                  className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pageNumber === totalPages - 1 || totalPages === 0}
                  className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  {selectedArticle.title}
                </h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">User:</span>{" "}
                  {selectedArticle.user?.psudoName || selectedArticle.user?.firstName || 'Unknown'}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">City:</span>{" "}
                  {selectedArticle.city?.cityName || 'Unknown'}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Published:</span>{" "}
                  {formatDate(selectedArticle.publishedAt)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {formatDate(selectedArticle.updatedAt)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Status:</span>{" "}
                  {(() => {
                    const status = getStatusDetails(selectedArticle.status);
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs ${status.bgColor} ${status.textColor}`}>
                        {status.label}
                      </span>
                    );
                  })()}
                </p>
                
                {selectedArticle.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title}
                      className="w-full h-auto rounded-lg object-cover max-h-64" 
                    />
                  </div>
                )}
                
                <div className="prose max-w-none mt-4">
                  <p>{selectedArticle.content}</p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleStatusUpdate(selectedArticle.id)}
                  className="px-4 py-2 flex items-center gap-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;