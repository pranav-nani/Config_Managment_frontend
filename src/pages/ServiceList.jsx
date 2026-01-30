import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Server, Eye, Upload, Layers } from 'lucide-react';
import { configService } from '../services/configService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const ServiceList = () => {
  const [configs, setConfigs] = useState([]);
  const [filteredConfigs, setFilteredConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('all');

  useEffect(() => {
    fetchConfigs();
  }, []);

  useEffect(() => {
    filterConfigs();
  }, [searchTerm, selectedEnv, configs]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await configService.getAllConfigs();
      
      // Group by service + environment
      const grouped = data.reduce((acc, config) => {
        const key = `${config.serviceName}-${config.environment}`;
        if (!acc[key]) {
          acc[key] = {
            serviceName: config.serviceName,
            environment: config.environment,
            configs: [],
          };
        }
        acc[key].configs.push(config);
        return acc;
      }, {});

      const services = Object.values(grouped).map(group => ({
        ...group,
        activeVersion: group.configs.find(c => c.isActive)?.version || 'N/A',
        totalVersions: group.configs.length,
        lastUpdated: group.configs[0]?.createdAt,
      }));

      setConfigs(services);
      setFilteredConfigs(services);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filterConfigs = () => {
    let filtered = [...configs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by environment
    if (selectedEnv !== 'all') {
      filtered = filtered.filter(service => service.environment === selectedEnv);
    }

    setFilteredConfigs(filtered);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Services</h1>
          <p className="text-dark-600">Manage configurations for all your microservices</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <Upload size={20} />
          Upload Config
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Environment Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
            <select
              className="input pl-10 appearance-none cursor-pointer"
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
            >
              <option value="all">All Environments</option>
              <option value="dev">Development</option>
              <option value="test">Testing</option>
              <option value="prod">Production</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-600">
          Showing <span className="font-semibold text-dark-900">{filteredConfigs.length}</span> of{' '}
          <span className="font-semibold text-dark-900">{configs.length}</span> services
        </p>
      </div>

      {/* Services Table */}
      {filteredConfigs.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No services found"
          description={
            searchTerm || selectedEnv !== 'all'
              ? 'Try adjusting your filters'
              : 'Upload your first configuration to get started'
          }
          action={
            !searchTerm && selectedEnv === 'all' && (
              <Link to="/upload" className="btn btn-primary">
                <Upload size={20} />
                Upload Config
              </Link>
            )
          }
        />
      ) : (
        <div className="table-container animate-slide-up">
          <table className="table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Environment</th>
                <th>Active Version</th>
                <th>Total Versions</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((service, index) => (
                <tr key={`${service.serviceName}-${service.environment}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Server className="text-primary-600" size={20} />
                      </div>
                      <span className="font-semibold text-dark-900">
                        {service.serviceName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${service.environment}`}>
                      {service.environment.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-sm text-dark-900">
                      v{service.activeVersion}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-dark-400" />
                      <span className="text-dark-900">{service.totalVersions}</span>
                    </div>
                  </td>
                  <td className="text-dark-600">
                    {new Date(service.lastUpdated).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/services/${service.serviceName}/${service.environment}/versions`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={16} />
                        View Versions
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
