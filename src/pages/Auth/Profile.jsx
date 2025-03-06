import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Map, 
  Users, 
  Edit, 
  Save, 
  X, 
  Heart, 
  Award,
  Clock
} from 'lucide-react';
import ProfileService from '../../services/profileService';
import { useNavigate } from 'react-router-dom';

const bloodTypeOptions = [
  { value: "A_PLUS", label: "A+", color: "text-red-600" },
  { value: "A_MOINS", label: "A-", color: "text-red-500" },
  { value: "B_PLUS", label: "B+", color: "text-orange-600" },
  { value: "B_MOINS", label: "B-", color: "text-orange-500" },
  { value: "AB_PLUS", label: "AB+", color: "text-purple-600" },
  { value: "AB_MOINS", label: "AB-", color: "text-purple-500" },
  { value: "O_PLUS", label: "O+", color: "text-green-600" },
  { value: "O_MOINS", label: "O-", color: "text-green-500" }
];

const DonationBadge = ({ donationCount }) => {
  const getBadgeLevel = (count) => {
    if (count < 5) return { level: "Starter", icon: <Heart className="w-8 h-8 text-pink-500" /> };
    if (count < 10) return { level: "Hero", icon: <Award className="w-8 h-8 text-yellow-500" /> };
    return { level: "Champion", icon: <Clock className="w-8 h-8 text-red-500" /> };
  };

  const badge = getBadgeLevel(donationCount);

  return (
    <div className="flex items-center space-x-2 bg-white shadow-md rounded-lg p-3 mt-4">
      {badge.icon}
      <div>
        <p className="font-bold text-lg">{badge.level} Donor</p>
        <p className="text-sm text-gray-500">{donationCount} donations</p>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ProfileService.getProfile();
        setUser(profileData.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setIsLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        psudoName: user.psudoName || '',
        phone: user.phone,
        bloodType: user.bloodType,
        cityId: user.city.id
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editedUser && user) {
      try {
        setIsLoading(true);
        const updatedProfile = await ProfileService.updateProfile(user.city.id, editedUser);
        setUser(updatedProfile.data);
        setIsEditing(false);
      } catch (err) {
        setError('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await ProfileService.deleteProfile(user.city.id);
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        setError('Failed to delete profile');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return null;

  const selectedBloodType = bloodTypeOptions.find(bt => bt.value === user.bloodType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Donor Profile</h1>
            <p className="text-white/80">Your lifesaving journey</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 p-2 rounded-full"
                >
                  <Save className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
              >
                <Edit className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-6 p-8">
          {/* Personal Information */}
          <div className="md:col-span-2 bg-red-50/50 p-6 rounded-xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Personal Details</h2>
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={editedUser?.firstName || ''}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="lastName"
                  value={editedUser?.lastName || ''}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="phone"
                  value={editedUser?.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  name="bloodType"
                  value={editedUser?.bloodType || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {bloodTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-red-500" />
                  <span className="text-lg">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Droplet className={`w-6 h-6 ${selectedBloodType.color}`} />
                  <span className="text-lg">{selectedBloodType.label} Blood Type</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Map className="w-6 h-6 text-red-500" />
                  <span className="text-lg">{user.city.cityName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DonationBadge donationCount={user.donationCount || 0} />
            
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Next Donation</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Eligible Date</span>
                <span className="font-bold text-red-600">
                  {user.nextEligibleDonationDate 
                    ? new Date(user.nextEligibleDonationDate).toLocaleDateString() 
                    : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Account Created: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;