import React, { useState } from 'react';
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  User,
  Pencil,
  X,
  ShieldCheck,
  ShieldX,
  Shield
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "active",
      phone: "+1 234-567-8901",
      joinDate: "2024-01-15",
      department: "IT"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "inactive",
      phone: "+1 234-567-8902",
      joinDate: "2024-02-01",
      department: "HR"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User',
    phone: '',
    department: '',
  });

  const handleStatusChange = (id, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUserId = Math.max(...users.map(u => u.id)) + 1;
    const userToAdd = {
      ...newUser,
      id: newUserId,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: 'User',
      phone: '',
      department: '',
    });
    setIsAddUserOpen(false);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const StatusButton = ({
    user,
    status,
    icon: Icon,
    colorClass,
    hoverClass,
    activeClass,
  }) => (
    <button
      onClick={() => handleStatusChange(user.id, status)}
      className={`p-2 rounded-lg transition-colors relative ${
        user.status === status ? activeClass : colorClass
      } ${user.status !== status ? hoverClass : ""}`}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    >
      <Icon className="h-5 w-5" />
      {user.status === status && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-neutral-800 rounded-full" />
      )}
    </button>
  );

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
              <option value="inactive">Inactive</option>
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
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Join Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold font-cairo text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="font-cairo font-medium text-neutral-800">{user.name}</div>
                  <div className="text-sm text-neutral-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{user.email}</td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{user.role}</td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{user.department}</td>
                <td className="px-6 py-4 font-cairo text-neutral-600">{user.joinDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-cairo ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <StatusButton
                      user={user}
                      status="active"
                      icon={ShieldCheck}
                      colorClass="text-green-600"
                      hoverClass="hover:bg-green-50"
                      activeClass="bg-green-100 text-green-800"
                    />
                    <StatusButton
                      user={user}
                      status="suspended"
                      icon={ShieldX}
                      colorClass="text-red-600"
                      hoverClass="hover:bg-red-50"
                      activeClass="bg-red-100 text-red-800"
                    />
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <User className="h-5 w-5" />
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
            Showing <span className="font-medium">{filteredUsers.length}</span> users
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

      {isEditUserOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Edit User
                </h2>
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
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.department}
                      onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Role
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Editor">Editor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Status
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
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
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  Add New User
                </h2>
                <button
                  onClick={() => setIsAddUserOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
              
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Role
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Editor">Editor</option>
                    </select>
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
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
                <h2 className="text-xl font-bold font-cairo text-neutral-800">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Name
                    </p>
                    <p className="text-neutral-800">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Email
                    </p>
                    <p className="text-neutral-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Phone
                    </p>
                    <p className="text-neutral-800">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Role
                    </p>
                    <p className="text-neutral-800">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Department
                    </p>
                    <p className="text-neutral-800">{selectedUser.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600">
                      Join Date
                    </p>
                    <p className="text-neutral-800">{selectedUser.joinDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <div className="flex space-x-2">
                  <StatusButton
                    user={selectedUser}
                    status="active"
                    icon={ShieldCheck}
                    colorClass="text-green-600"
                    hoverClass="hover:bg-green-50"
                    activeClass="bg-green-100 text-green-800"
                  />
                  <StatusButton
                    user={selectedUser}
                    status="suspended"
                    icon={ShieldX}
                    colorClass="text-red-600"
                    hoverClass="hover:bg-red-50"
                    activeClass="bg-red-100 text-red-800"
                  />
                  <StatusButton
                    user={selectedUser}
                    status="inactive"
                    icon={Shield}
                    colorClass="text-yellow-600"
                    hoverClass="hover:bg-yellow-50"
                    activeClass="bg-yellow-100 text-yellow-800"
                  />
                </div>
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
  );
};

export default UserManagement;