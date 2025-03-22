import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ArticleService from '../../services/articleService';
import CityService from '../../services/cityService';
import TextEditor from '../../components/layout/helps/TextEditor';

const ArticleManagement = () => {
  const { user } = useAuth();

  const isAdmin = user.roles.includes('ROLE_ADMIN');
  const isCoordinator = user.roles.includes('ROLE_COORDINATOR');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    cityId: ''
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = isCoordinator
          ? await ArticleService.getMyArticles(pageNumber, size)
          : await ArticleService.get(pageNumber, size);

        setArticles(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [pageNumber, size, isCoordinator]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities(0, 20);
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleStatusUpdate = async (id) => {
    if (!isAdmin) return;

    try {
      await ArticleService.updateStatus(id);

      setArticles(articles.map(article => {
        if (article.id === id) {
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

  const handleDelete = async (id) => {
    if (!isCoordinator) return;

    try {
      await ArticleService.delete(id);
      setArticles(articles.filter(article => article.id !== id));
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(null);
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleEdit = (article) => {
    if (!isCoordinator) return;

    setEditForm({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl,
      cityId: article.city?.id
    });
    setSelectedArticle(article);
    setIsEditing(true);
  };

  const handleCreate = async () => {
    if (!isCoordinator) return;
  
    if (!editForm.content || editForm.content.trim() === '') {
      alert("Content cannot be empty.");
      return;
    }
  
    try {
      const response = await ArticleService.create(editForm);
      setArticles([response.data, ...articles]);
      setIsEditing(false);
      setEditForm({ title: '', content: '', imageUrl: '', cityId: '' });
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  };
  
  const handleUpdate = async () => {
    if (!selectedArticle || !isCoordinator) return;
  
    if (!editForm.content || editForm.content.trim() === '') {
      alert("Content cannot be empty.");
      return;
    }
  
    try {
      const dataToSend = {
        ...editForm,
        cityId: editForm.cityId ? parseInt(editForm.cityId, 10) : null
      };
  
      console.log("Sending update request with:", dataToSend);
  
      await ArticleService.update(dataToSend, selectedArticle.id);
  
      const response = await ArticleService.getMyArticles(pageNumber, size);
      setArticles(response.data.content);
  
      setIsEditing(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Failed to update article:', error);
      alert("Failed to update article. Please try again.");
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
          <h1 className="text-2xl font-bold font-cairo text-neutral-800">
            {isCoordinator ? 'My Articles' : 'Article Management'}
          </h1>
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

            {isCoordinator && (
              <button
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                onClick={() => {
                  setEditForm({ title: '', content: '', imageUrl: '', cityId: '' });
                  setSelectedArticle(null);
                  setIsEditing(true);
                }}
              >
                <Plus className="h-5 w-5" />
                New Article
              </button>
            )}
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
                  {!isCoordinator && (
                    <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">User</th>
                  )}
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
                        <div className="text-sm text-neutral-500 truncate max-w-56">
                          {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </div>
                      </td>
                      {!isCoordinator && (
                        <td className="px-6 py-4 font-cairo text-neutral-600">
                          {article.user?.psudoName || article.user?.firstName || 'Unknown'}
                        </td>
                      )}
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
                          {isAdmin && (
                            <button
                              onClick={() => handleStatusUpdate(article.id)}
                              className="p-2 rounded-lg transition-colors hover:bg-primary-50 text-primary-500"
                              title="Update Status"
                            >
                              <RefreshCw className="h-5 w-5" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>

                          {isCoordinator && (
                            <>
                              <button
                                onClick={() => handleEdit(article)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isCoordinator ? "7" : "8"} className="px-6 py-12 text-center text-neutral-500">
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

      {selectedArticle && !isEditing && (
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
                {!isCoordinator && (
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold">User:</span>{" "}
                    {selectedArticle.user?.psudoName || selectedArticle.user?.firstName || 'Unknown'}
                  </p>
                )}
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
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                {isAdmin && (
                  <button
                    onClick={() => handleStatusUpdate(selectedArticle.id)}
                    className="px-4 py-2 flex items-center gap-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update Status
                  </button>
                )}
                {isCoordinator && (
                  <button
                    onClick={() => handleEdit(selectedArticle)}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Article
                  </button>
                )}
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

      {isEditing && isCoordinator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  {selectedArticle ? 'Edit Article' : 'Create New Article'}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ title: '', content: '', imageUrl: '', cityId: '' });
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Content</label>
                  <TextEditor
                    content={editForm.content}
                    onChange={(content) => setEditForm({ ...editForm, content })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                  <select
                    value={editForm.cityId}
                    onChange={(e) => setEditForm({ ...editForm, cityId: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={selectedArticle ? handleUpdate : handleCreate}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {selectedArticle ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ title: '', content: '', imageUrl: '', cityId: '' });
                  }}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
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