import { useEffect, useState } from 'react';
import { Server, FileJson, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react';
import { configService } from '../services/configService';
import { formatRelativeTime } from '../utils/helpers';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentConfigs, setRecentConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have separate endpoints for stats
      const configs = await configService.getAllConfigs();
      
      // Calculate stats
      const uniqueServices = new Set(configs.map(c => c.serviceName)).size;
      const totalConfigs = configs.length;
      const activeConfigs = configs.filter(c => c.isActive).length;
      
      // Get recent configs (sorted by date)
      const recent = [...configs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalServices: uniqueServices,
        totalConfigs: totalConfigs,
        activeConfigs: activeConfigs,
        inactiveConfigs: totalConfigs - activeConfigs,
      });
      
      setRecentConfigs(recent);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const statCards = [
    {
      icon: Server,
      label: 'Total Services',
      value: stats?.totalServices || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: FileJson,
      label: 'Total Configs',
      value: stats?.totalConfigs || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      label: 'Active Configs',
      value: stats?.activeConfigs || 0,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      icon: Clock,
      label: 'Inactive Configs',
      value: stats?.inactiveConfigs || 0,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Dashboard</h1>
        <p className="text-dark-600">Welcome back! Here's an overview of your configuration management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.textColor} size={24} />
                </div>
                <TrendingUp className="text-emerald-500" size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-dark-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card animate-slide-up animate-delay-400">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-primary-600" />
            <span>Recent Configurations</span>
          </div>
          <Link to="/services" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentConfigs.length === 0 ? (
          <div className="text-center py-12">
            <FileJson className="mx-auto text-dark-300 mb-3" size={48} />
            <p className="text-dark-600">No configurations uploaded yet</p>
            <Link to="/upload" className="btn btn-primary mt-4">
              Upload First Config
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentConfigs.map((config, index) => (
              <div
                key={config.id || index}
                className="flex items-center justify-between p-4 rounded-lg bg-dark-50/50 hover:bg-dark-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FileJson className="text-primary-600" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-dark-900 truncate">{config.serviceName}</h4>
                    <p className="text-sm text-dark-600">
                      Version {config.version} • {formatRelativeTime(config.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`badge badge-${config.environment}`}>
                    {config.environment.toUpperCase()}
                  </span>
                  {config.isActive && (
                    <span className="badge badge-active">Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animate-delay-400">
        <Link to="/services" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Server className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-dark-900">View Services</h3>
              <p className="text-sm text-dark-600">Browse all configurations</p>
            </div>
          </div>
        </Link>

        <Link to="/upload" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <FileJson className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-dark-900">Upload Config</h3>
              <p className="text-sm text-dark-600">Add new configuration</p>
            </div>
          </div>
        </Link>

        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">System Status</h3>
              <p className="text-sm text-white/90">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
