import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, UserPlus, User, Pencil, X, ShieldCheck, ShieldX } from "lucide-react";
import AccountService from "../../services/accountService";
import CityService from "../../services/cityService";
import RoleService from "../../services/roleService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    roleId: "",
    cityId: "",
    bloodType: "A_PLUS",
    is_suspended: false
  });

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await AccountService.create(newUser);

      setUsers([...users, response.data]);
      setIsAddUserOpen(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        roleId: "",
        cityId: "",
        bloodType: "A_PLUS",
        is_suspended: false
      });

      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "Unknown";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodTypeMap = {
    "A+": "A_PLUS",
    "A-": "A_MOINS",
    "B+": "B_PLUS",
    "B-": "B_MOINS",
    "AB+": "AB_PLUS",
    "AB-": "AB_MOINS",
    "O+": "O_PLUS",
    "O-": "O_MOINS",
  };

  const reverseBloodTypeMap = Object.entries(bloodTypeMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  useEffect(() => {
    fetchUsers();
    fetchCities();
    fetchRoles();
  }, [pageNumber, size]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AccountService.get(pageNumber, size);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await CityService.getCities(0, 20);
      setCities(response.data.content || response.data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await RoleService.getRoles(0, 20);
      setRoles(response.data.content || response.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await AccountService.getById(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const handleEditClick = async (userId) => {
    try {
      const userData = await fetchUserById(userId);
      if (userData) {
        setEditingUser({
          ...userData,
          roleId: userData.role?.id || "",
          cityId: userData.city?.id || "",
          is_suspended: userData.is_suspended || false
        });
        setIsEditUserOpen(true);
      }
    } catch (error) {
      console.error("Error setting up user edit:", error);
    }
  };

  const handleEditUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        ...editingUser,
        roleId: editingUser.roleId || (editingUser.role?.id || ""),
        cityId: editingUser.cityId || (editingUser.city?.id || "")
      };

      await AccountService.update(updateData, editingUser.id);

      setIsEditUserOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleToggleSuspension = async (userId) => {
    try {
      await AccountService.toggleUserSuspension(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_suspended: !user.is_suspended } : user
        )
      );

    } catch (error) {
      console.error("Error toggling user suspension:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.toLowerCase() : "";
    const userEmail = user.email ? user.email.toLowerCase() : "";
    const matchesSearch =
      searchTerm === "" || userName.includes(searchTerm.toLowerCase()) || userEmail.includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" || (filter === "suspended" && user.is_suspended) || (filter === "active" && !user.is_suspended);

    return matchesSearch && matchesFilter;
  });


  const getCityNameById = (cityId) => {
    const city = cities.find((city) => city.id === cityId);
    return city ? city.cityName || city.name : "Unknown";
  };


  const getRoleNameById = (roleId) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.name : "Unknown";
  };

  const handleViewDetails = async (userId) => {
    try {
      const userData = await fetchUserById(userId);
      if (userData) {
        setSelectedUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await AccountService.delete(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const StatusButton = ({ user, icon: Icon, colorClass, hoverClass, activeClass, isSuspended, onToggleSuspension }) => {
    const isActive = isSuspended ? user.is_suspended : !user.is_suspended;

    return (
      <button
        className={`p-2 rounded-lg transition-colors relative ${isActive ? activeClass : colorClass} ${!isActive ? hoverClass : ""}`}
        title={isSuspended ? "Suspended" : "Active"}
        onClick={() => onToggleSuspension(user.id)}
      >
        <Icon className="h-5 w-5" />
        {isActive && <span className="absolute -top-1 -right-1 h-2 w-2 bg-neutral-800 rounded-full" />}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold font-cairo text-neutral-800">User Management</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Blood Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-cairo font-medium text-neutral-800">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-cairo text-neutral-600">{truncateText(user.email, 14)}</td>
                  <td className="px-6 py-4 font-cairo text-neutral-600">{user.phone}</td>
                  <td className="px-6 py-4 font-cairo text-neutral-600">
                    {user.roleId
                      ? getRoleNameById(user.roleId).replace(/^ROLE_/, "")
                      : typeof user?.role === "object"
                        ? (user?.role?.name || "").replace(/^ROLE_/, "")
                        : typeof user?.role === "string"
                          ? user?.role?.replace(/^ROLE_/, "")
                          : user?.role || "Unknown"}
                  </td>
                  <td className="px-6 py-4 font-cairo text-neutral-600">
                    {user.cityId
                      ? truncateText(getCityNameById(user.cityId), 14)
                      : user.city
                        ? typeof user.city === "object"
                          ? truncateText(user.city.cityName || "Unknown", 14)
                          : truncateText(user.city, 14)
                        : "Unknown"}
                  </td>
                  <td className="px-6 py-4 font-cairo text-neutral-600">
                    {user.bloodType ? reverseBloodTypeMap[user.bloodType] || String(user.bloodType) : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-cairo ${user.is_suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                      {user.is_suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <StatusButton
                        key={`active-btn-${user.id}`}
                        user={user}
                        icon={ShieldCheck}
                        colorClass="text-green-600"
                        hoverClass="hover:bg-green-50"
                        activeClass="bg-green-100 text-green-800"
                        isSuspended={false}
                        onToggleSuspension={handleToggleSuspension}
                      />
                      <StatusButton
                        key={`suspended-btn-${user.id}`}
                        user={user}
                        icon={ShieldX}
                        colorClass="text-red-600"
                        hoverClass="hover:bg-red-50"
                        activeClass="bg-red-100 text-red-800"
                        isSuspended={true}
                        onToggleSuspension={handleToggleSuspension}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(user.id);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(user.id);
                        }}
                        className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-neutral-100">
        <div className="text-sm text-neutral-600">
          Page {pageNumber + 1} of {totalPages || 1}
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg"
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg"
            onClick={() => setPageNumber(Math.min((totalPages || 1) - 1, pageNumber + 1))}
            disabled={pageNumber >= (totalPages || 1) - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isEditUserOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">Edit User</h2>
                <button
                  onClick={() => {
                    setIsEditUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.firstName || ""}
                      onChange={handleEditUserChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.lastName || ""}
                      onChange={handleEditUserChange}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.email || ""}
                      onChange={handleEditUserChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.phone || ""}
                      onChange={handleEditUserChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                    <select
                      name="roleId"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.roleId || (editingUser.role?.id || "")}
                      onChange={handleEditUserChange}
                    >
                      <option value="">Select a role</option>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/^ROLE_/, "")}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Editor">Editor</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <select
                      name="cityId"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.cityId || (editingUser.city?.id || "")}
                      onChange={handleEditUserChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.cityName || city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Blood Type</label>
                    <select
                      name="bloodType"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.bloodType || "A_PLUS"}
                      onChange={handleEditUserChange}
                    >
                      {bloodTypes.map((type) => (
                        <option key={type} value={bloodTypeMap[type]}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Suspended</label>
                    <input
                      type="checkbox"
                      name="is_suspended"
                      checked={!!editingUser.is_suspended}
                      onChange={handleEditUserChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditUserOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">Add New User</h2>
                <button onClick={() => setIsAddUserOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter first name"
                      value={newUser.firstName}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter last name"
                      value={newUser.lastName}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter the password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter phone number"
                      value={newUser.phone}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                    <select
                      name="roleId"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.roleId}
                      onChange={handleNewUserChange}
                    >
                      <option value="">Select a role</option>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/^ROLE_/, "")}
                          </option>
                        ))
                      ) : (
                        <option value="">No roles available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <select
                      name="cityId"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.cityId}
                      onChange={handleNewUserChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.cityName || city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Blood Type</label>
                    <select
                      name="bloodType"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.bloodType}
                      onChange={handleNewUserChange}
                    >
                      {bloodTypes.map((type) => (
                        <option key={type} value={bloodTypeMap[type]}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Suspended</label>
                    <input
                      type="checkbox"
                      name="is_suspended"
                      checked={newUser.is_suspended}
                      onChange={handleNewUserChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">Add New User</h2>
                <button onClick={() => setIsAddUserOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter first name"
                      value={newUser.firstName}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter last name"
                      value={newUser.lastName}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter the password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter phone number"
                      value={newUser.phone}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                    <select
                      name="roleId"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.roleId}
                      onChange={handleNewUserChange}
                    >
                      <option value="">Select a role</option>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name.replace(/^ROLE_/, "")}
                          </option>
                        ))
                      ) : (
                        <option value="">No roles available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <select
                      name="cityId"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.cityId}
                      onChange={handleNewUserChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.cityName || city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Blood Type</label>
                    <select
                      name="bloodType"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.bloodType}
                      onChange={handleNewUserChange}
                    >
                      {bloodTypes.map((type) => (
                        <option key={type} value={bloodTypeMap[type]}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Suspended</label>
                    <input
                      type="checkbox"
                      name="is_suspended"
                      checked={newUser.is_suspended}
                      onChange={handleNewUserChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Name</p>
                    <p className="text-neutral-800">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Email</p>
                    <p className="text-neutral-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Phone</p>
                    <p className="text-neutral-800">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Role</p>
                    <p className="text-neutral-800">
                      {typeof selectedUser.role === "object"
                        ? selectedUser.role.name.replace(/^ROLE_/, "")
                        : typeof selectedUser.role === "string"
                          ? selectedUser.role.replace(/^ROLE_/, "")
                          : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">City</p>
                    <p className="text-neutral-800">
                      {selectedUser.city
                        ? typeof selectedUser.city === "object"
                          ? selectedUser.city.cityName || selectedUser.city.name
                          : selectedUser.city
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Status</p>
                    <p className="text-neutral-800">{selectedUser.is_suspended ? "Suspended" : "Active"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">Blood Type</p>
                    <p className="text-neutral-800">
                      {selectedUser.bloodType
                        ? reverseBloodTypeMap[selectedUser.bloodType] || selectedUser.bloodType
                        : "Unknown"}
                    </p>
                  </div>
                  {selectedUser.joinDate && (
                    <div>
                      <p className="text-sm font-semibold text-neutral-600">Join Date</p>
                      <p className="text-neutral-800">{selectedUser.joinDate}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete User Account
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
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
  )
}

export default UserManagement
