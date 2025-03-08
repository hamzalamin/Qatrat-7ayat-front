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
  Clock,
  Lock,
  Phone,
  User,
  Mail
} from 'lucide-react';
import ProfileService from '../../services/profileService';
import AuthService from '../../services/authService';
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
    if (count < 5) return { level: "متبرع مبتدئ", icon: <Heart className="w-8 h-8 text-pink-500" /> };
    if (count < 10) return { level: "متبرع بطل", icon: <Award className="w-8 h-8 text-yellow-500" /> };
    return { level: "متبرع محترف", icon: <Clock className="w-8 h-8 text-red-500" /> };
  };

  const badge = getBadgeLevel(donationCount);

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg p-4 shadow-lg border-r-4 border-green-600">
      {badge.icon}
      <div className="mr-2 text-right">
        <p className="font-bold text-lg">{badge.level}</p>
        <p className="text-sm text-gray-500">{donationCount} تبرعات</p>
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ProfileService.getProfile();
        setUser(profileData.data);
        setIsLoading(false);
      } catch (err) {
        setError('فشل في تحميل الملف الشخصي');
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
        email: user.email || '',
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
        const updatedProfile = await ProfileService.updateProfile(user.id, editedUser);
        setUser(updatedProfile.data);
        setIsEditing(false);
      } catch (err) {
        setError('فشل في تحديث الملف الشخصي');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('كلمات المرور غير متطابقة');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }
    
    try {
      // Assuming you have a method to change password in your AuthService
      await AuthService.changePassword(passwordData);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      alert('تم تغيير كلمة المرور بنجاح');
    } catch (err) {
      setPasswordError('فشل في تغيير كلمة المرور');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await ProfileService.deleteProfile(user.id);
        AuthService.clearAuth(); // Clear authentication state
        navigate('/login');
      } catch (err) {
        setError('فشل في حذف الحساب');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!user) return null;

  const selectedBloodType = bloodTypeOptions.find(bt => bt.value === user.bloodType);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-green-700 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">الملف الشخصي للمتبرع</h1>
            <p className="text-white/80">رحلتك لإنقاذ الأرواح</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 p-2 rounded-lg ml-2"
                >
                  <Save className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
              >
                <Edit className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Personal Information */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4 border-r-4 border-green-600 pr-2">البيانات الشخصية</h2>
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">الاسم الأول</label>
                  <div className="relative">
                    <User className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={editedUser?.firstName || ''}
                      onChange={handleInputChange}
                      placeholder="الاسم الأول"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">الاسم الأخير</label>
                  <div className="relative">
                    <User className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={editedUser?.lastName || ''}
                      onChange={handleInputChange}
                      placeholder="الاسم الأخير"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={editedUser?.email || ''}
                      onChange={handleInputChange}
                      placeholder="البريد الإلكتروني"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={editedUser?.phone || ''}
                      onChange={handleInputChange}
                      placeholder="رقم الهاتف"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">الاسم المستعار</label>
                  <div className="relative">
                    <User className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="psudoName"
                      value={editedUser?.psudoName || ''}
                      onChange={handleInputChange}
                      placeholder="الاسم المستعار (اختياري)"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">فصيلة الدم</label>
                  <div className="relative">
                    <Droplet className="absolute top-3 right-3 w-5 h-5 text-red-500" />
                    <select
                      name="bloodType"
                      value={editedUser?.bloodType || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {bloodTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                  <Users className="w-6 h-6 text-green-600 ml-3" />
                  <div>
                    <span className="text-sm text-gray-500">الاسم الكامل</span>
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
                
                {user.email && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Mail className="w-6 h-6 text-green-600 ml-3" />
                    <div>
                      <span className="text-sm text-gray-500">البريد الإلكتروني</span>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                  <Phone className="w-6 h-6 text-green-600 ml-3" />
                  <div>
                    <span className="text-sm text-gray-500">رقم الهاتف</span>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                  <Droplet className={`w-6 h-6 ml-3 ${selectedBloodType.color}`} />
                  <div>
                    <span className="text-sm text-gray-500">فصيلة الدم</span>
                    <p className="font-semibold">{selectedBloodType.label}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                  <Map className="w-6 h-6 text-green-600 ml-3" />
                  <div>
                    <span className="text-sm text-gray-500">المدينة</span>
                    <p className="font-semibold">{user.city.cityName}</p>
                  </div>
                </div>
                
                {user.psudoName && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                    <User className="w-6 h-6 text-green-600 ml-3" />
                    <div>
                      <span className="text-sm text-gray-500">الاسم المستعار</span>
                      <p className="font-semibold">{user.psudoName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DonationBadge donationCount={user.donationCount || 0} />
            
            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-green-700">التبرع القادم</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">
                  {user.nextEligibleDonationDate 
                    ? new Date(user.nextEligibleDonationDate).toLocaleDateString('ar-EG')
                    : 'غير متاح'}
                </span>
                <span className="text-gray-600">:تاريخ الأهلية</span>
              </div>
            </div>
            
            {/* Password Change Section */}
            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-lg mb-3 text-green-700 border-r-4 border-green-600 pr-2">تغيير كلمة المرور</h3>
              {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">كلمة المرور الحالية</label>
                  <div className="relative">
                    <Lock className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="كلمة المرور الحالية"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Lock className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="كلمة المرور الجديدة"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="تأكيد كلمة المرور"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 flex justify-between items-center">
          <button 
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            حذف الحساب
          </button>
          <div>
            <p className="text-sm text-gray-600">
              تاريخ إنشاء الحساب: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;