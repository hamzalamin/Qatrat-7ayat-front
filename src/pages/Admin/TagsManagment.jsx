import React, { useState } from "react";
import { Search, X, Tag, Plus, ChevronLeft, ChevronRight, Pencil } from "lucide-react";

const TagManagement = () => {
  const [tags, setTags] = useState([
    { id: 1, name: "Frontend", color: "bg-blue-100 text-blue-800" },
    { id: 2, name: "Backend", color: "bg-green-100 text-green-800" },
    { id: 3, name: "Design", color: "bg-purple-100 text-purple-800" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [isEditTagOpen, setIsEditTagOpen] = useState(false);
  const [newTag, setNewTag] = useState({ name: "", color: "" });
  const [editingTag, setEditingTag] = useState(null);

  // Add Tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const newTagId = Math.max(...tags.map((tag) => tag.id)) + 1;
    const tagToAdd = {
      id: newTagId,
      name: newTag.name,
      color: newTag.color || "bg-gray-100 text-gray-800", // Default color if none selected
    };
    setTags([...tags, tagToAdd]);
    setNewTag({ name: "", color: "" });
    setIsAddTagOpen(false);
  };

  // Delete Tag
  const handleDeleteTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  // Open Edit Modal
  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setIsEditTagOpen(true);
  };

  // Update Tag
  const handleUpdateTag = (e) => {
    e.preventDefault();
    setTags(tags.map((tag) => (tag.id === editingTag.id ? editingTag : tag)));
    setIsEditTagOpen(false);
    setEditingTag(null);
  };

  // Filter Tags
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100">
      {/* Header Section */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold font-cairo text-neutral-800">
            Tag Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tags..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddTagOpen(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Tag
            </button>
          </div>
        </div>
      </div>

      {/* Tags Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">
                Color
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredTags.map((tag) => (
              <tr key={tag.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-cairo text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-neutral-400" />
                    {tag.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-cairo ${tag.color}`}
                  >
                    {tag.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Tag"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Tag"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="px-6 py-4 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600 font-cairo">
            Showing <span className="font-medium">{filteredTags.length}</span>{" "}
            tags
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

      {/* Add Tag Modal */}
      {isAddTagOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Add New Tag
                </h2>
                <button
                  onClick={() => setIsAddTagOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddTag} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={newTag.name}
                    onChange={(e) =>
                      setNewTag({ ...newTag, name: e.target.value })
                    }
                    placeholder="Enter tag name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Tag Color
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={newTag.color}
                    onChange={(e) =>
                      setNewTag({ ...newTag, color: e.target.value })
                    }
                  >
                    <option value="">Select a color</option>
                    <option value="bg-blue-100 text-blue-800">Blue</option>
                    <option value="bg-green-100 text-green-800">Green</option>
                    <option value="bg-purple-100 text-purple-800">Purple</option>
                    <option value="bg-yellow-100 text-yellow-800">Yellow</option>
                    <option value="bg-red-100 text-red-800">Red</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddTagOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Add Tag
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {isEditTagOpen && editingTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Edit Tag
                </h2>
                <button
                  onClick={() => setIsEditTagOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateTag} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={editingTag.name}
                    onChange={(e) =>
                      setEditingTag({ ...editingTag, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Tag Color
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={editingTag.color}
                    onChange={(e) =>
                      setEditingTag({ ...editingTag, color: e.target.value })
                    }
                  >
                    <option value="bg-blue-100 text-blue-800">Blue</option>
                    <option value="bg-green-100 text-green-800">Green</option>
                    <option value="bg-purple-100 text-purple-800">Purple</option>
                    <option value="bg-yellow-100 text-yellow-800">Yellow</option>
                    <option value="bg-red-100 text-red-800">Red</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditTagOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Update Tag
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManagement;