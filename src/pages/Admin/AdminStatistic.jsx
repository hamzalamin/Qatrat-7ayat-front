import React from 'react';
import { 
  Users, 
  Droplet, 
  UserCheck, 
  Calendar,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-neutral-600 font-cairo mb-1 text-sm">{title}</p>
        <h3 className="text-2xl font-bold font-cairo text-neutral-800">{value}</h3>
        {trend && (
          <p className={`flex items-center text-sm mt-2 ${trend.type === 'increase' ? 'text-green-600' : 'text-primary-500'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend.value}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminStatistics = () => {
  const stats = [
    {
      title: "Total Donors",
      value: "2,847",
      icon: Users,
      trend: { value: 12, type: 'increase' },
      color: "bg-primary-500"
    },
    {
      title: "Active Coordinators",
      value: "156",
      icon: UserCheck,
      trend: { value: 8, type: 'increase' },
      color: "bg-secondary-500"
    },
    {
      title: "Total Donations",
      value: "1,238",
      icon: Droplet,
      trend: { value: 15, type: 'increase' },
      color: "bg-accent-400"
    },
    {
      title: "Pending Requests",
      value: "43",
      icon: Clock,
      color: "bg-primary-400"
    }
  ];

  const emergencyStats = [
    {
      title: "Urgent Blood Requests",
      value: "12",
      icon: AlertCircle,
      color: "bg-primary-600"
    },
    {
      title: "Today's Appointments",
      value: "28",
      icon: Calendar,
      color: "bg-secondary-400"
    },
    {
      title: "Active Donation Centers",
      value: "15",
      icon: MapPin,
      color: "bg-accent-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {emergencyStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100">
        <h3 className="font-cairo font-bold text-lg mb-4">Blood Type Availability</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
            <div key={type} className="text-center">
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-xl font-bold text-primary-500">{type}</p>
                <p className="text-sm text-neutral-600 mt-1">
                  {Math.floor(Math.random() * 100)} units
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;