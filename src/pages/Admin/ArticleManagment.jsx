import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "The Importance of Regular Blood Donation",
      author: "Dr. Sarah Johnson",
      category: "Health Education",
      status: "pending",
      date: "2024-02-20",
      excerpt:
        "Regular blood donation plays a crucial role in maintaining adequate blood supply...",
    },
    {
      id: 2,
      title: "Blood Types and Compatibility",
      author: "Dr. Michael Chen",
      category: "Medical",
      status: "pending",
      date: "2024-02-19",
      excerpt:
        "Understanding blood type compatibility is essential for safe transfusions...",
    },
  ]);
  

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    const article = articles.find(a => a.id === id);
    if (article.status === newStatus) return;

    setArticles(articles.map(article => 
      article.id === id ? { ...article, status: newStatus } : article
    ));
  };

  const StatusButton = ({ article, status, icon: Icon, colorClass, hoverClass, activeClass }) => (
    <button
      onClick={() => handleStatusChange(article.id, status)}
      className={`p-2 rounded-lg transition-colors relative ${
        article.status === status ? activeClass : colorClass
      } ${article.status !== status ? hoverClass : ''}`}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    >
      <Icon className="h-5 w-5" />
      {article.status === status && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-neutral-800 rounded-full" />
      )}
    </button>
  );

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || article.status === filter;
    return matchesSearch && matchesFilter;
  });

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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredArticles.map(article => (
              <tr key={article.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="font-cairo font-medium text-neutral-800">{article.title}</div>
                  <div className="text-sm text-neutral-500 truncate max-w-56">{article.excerpt}</div>
                </td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{article.author}</td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{article.category}</td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{article.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-cairo ${
                    article.status === 'approved' ? 'bg-green-100 text-green-800' :
                    article.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <StatusButton 
                      article={article}
                      status="approved"
                      icon={Check}
                      colorClass="text-green-600"
                      hoverClass="hover:bg-green-50"
                      activeClass="bg-green-100 text-green-800"
                    />
                    <StatusButton 
                      article={article}
                      status="rejected"
                      icon={X}
                      colorClass="text-primary-500"
                      hoverClass="hover:bg-primary-50"
                      activeClass="bg-primary-100 text-primary-800"
                    />
                    <StatusButton 
                      article={article}
                      status="pending"
                      icon={AlertCircle}
                      colorClass="text-yellow-600"
                      hoverClass="hover:bg-yellow-50"
                      activeClass="bg-yellow-100 text-yellow-800"
                    />
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600 font-cairo">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredArticles.length}</span> results
          </p>
          <div className="flex space-x-2">
            <button className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

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
                  <span className="font-semibold">Author:</span>{" "}
                  {selectedArticle.author}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedArticle.category}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedArticle.date}
                </p>
                <div className="prose max-w-none">
                  <p>{selectedArticle.excerpt}</p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <div className="flex space-x-2">
                  <StatusButton
                    article={selectedArticle}
                    status="approved"
                    icon={Check}
                    colorClass="text-green-600"
                    hoverClass="hover:bg-green-50"
                    activeClass="bg-green-100 text-green-800"
                  />
                  <StatusButton
                    article={selectedArticle}
                    status="rejected"
                    icon={X}
                    colorClass="text-primary-500"
                    hoverClass="hover:bg-primary-50"
                    activeClass="bg-primary-100 text-primary-800"
                  />
                  <StatusButton
                    article={selectedArticle}
                    status="pending"
                    icon={AlertCircle}
                    colorClass="text-yellow-600"
                    hoverClass="hover:bg-yellow-50"
                    activeClass="bg-yellow-100 text-yellow-800"
                  />
                </div>
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