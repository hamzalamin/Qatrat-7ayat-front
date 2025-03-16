import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import RoleService from "../../services/roleService";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]); // Add filteredRoles state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", color: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchRoles();
  }, [currentPage]);

  const fetchRoles = async () => {
    try {
      const response = await RoleService.getRoles(currentPage, rowsPerPage);
      setRoles(response.data.content || response.data);
      setFilteredRoles(response.data.content || response.data); // Initialize filteredRoles
      setTotalPages(
        response.data.totalPages || Math.ceil(response.data.length / rowsPerPage)
      );
      setTotalRoles(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  // Handle search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles); // Reset to all roles if searchTerm is empty
    }
  }, [searchTerm, roles]);

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      await RoleService.createRole(newRole);
      fetchRoles();
      setNewRole({ name: "", color: "" });
      setIsAddRoleOpen(false);
    } catch (error) {
      console.error("Failed to add role:", error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await RoleService.deleteRole(id);
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setIsEditRoleOpen(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await RoleService.updateRole(editingRole, editingRole.id);
      fetchRoles();
      setIsEditRoleOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100">
      {/* Header and Search */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold font-cairo text-neutral-800">
            Role Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Roles..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={() => setIsAddRoleOpen(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
            {filteredRoles.map((role) => (
              <tr key={role.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-cairo text-neutral-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-neutral-400" />
                    {role.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-cairo ${role.color}`}
                  >
                    {role.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Role"
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600 font-cairo">
            Showing <span className="font-medium">{filteredRoles.length}</span> of{" "}
            <span className="font-medium">{totalRoles}</span> roles
          </p>
          <div className="flex space-x-2">
            <button
              className={`p-2 text-neutral-600 rounded-lg ${
                currentPage > 0
                  ? "hover:bg-neutral-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center px-2">
              <span className="text-sm text-neutral-600 font-cairo">
                Page {currentPage + 1} of {totalPages || 1}
              </span>
            </div>
            <button
              className={`p-2 text-neutral-600 rounded-lg ${
                currentPage < totalPages - 1
                  ? "hover:bg-neutral-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Add New Role
                </h2>
                <button
                  onClick={() => setIsAddRoleOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddRole} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={newRole.name}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      if (!inputValue.startsWith("ROLE_")) {
                        inputValue = "ROLE_" + inputValue.replace(/^ROLE_/, "");
                      }
                      setNewRole({ ...newRole, name: inputValue });
                    }}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role Color
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={newRole.color}
                    onChange={(e) =>
                      setNewRole({ ...newRole, color: e.target.value })
                    }
                  >
                    <option value="">Select a color</option>
                    <option value="bg-blue-100 text-blue-800">Blue</option>
                    <option value="bg-green-100 text-green-800">Green</option>
                    <option value="bg-purple-100 text-purple-800">
                      Purple
                    </option>
                    <option value="bg-yellow-100 text-yellow-800">
                      Yellow
                    </option>
                    <option value="bg-red-100 text-red-800">Red</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddRoleOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Add Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditRoleOpen && editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Edit Role
                </h2>
                <button
                  onClick={() => setIsEditRoleOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateRole} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={editingRole.name}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("ROLE_")) {
                        value = "ROLE_" + value.replace(/^ROLE_*/, "");
                      }
                      setEditingRole({ ...editingRole, name: value });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Role Color
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    value={editingRole.color}
                    onChange={(e) =>
                      setEditingRole({ ...editingRole, color: e.target.value })
                    }
                  >
                    <option value="bg-blue-100 text-blue-800">Blue</option>
                    <option value="bg-green-100 text-green-800">Green</option>
                    <option value="bg-purple-100 text-purple-800">
                      Purple
                    </option>
                    <option value="bg-yellow-100 text-yellow-800">
                      Yellow
                    </option>
                    <option value="bg-red-100 text-red-800">Red</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditRoleOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Update Role
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

export default RoleManagement;