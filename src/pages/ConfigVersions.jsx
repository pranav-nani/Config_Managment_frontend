import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { configService } from '../services/configService';
import { formatDate } from '../utils/helpers';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

const ConfigVersions = () => {
  const { serviceName, environment } = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, version: null });
  const [activatingId, setActivatingId] = useState(null);

  useEffect(() => {
    fetchVersions();
  }, [serviceName, environment]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await configService.getConfigHistory(serviceName, environment);
      setVersions(data.sort((a, b) => b.version - a.version));
    } catch (error) {
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (configId) => {
    try {
      setActivatingId(configId);
      await configService.activateConfig(configId);
      toast.success('Configuration activated successfully!');
      fetchVersions();
    } catch (error) {
      toast.error('Failed to activate configuration');
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async () => {
    try {
      await configService.deleteConfig(deleteModal.version.id);
      toast.success('Configuration deleted successfully!');
      setDeleteModal({ isOpen: false, version: null });
      fetchVersions();
    } catch (error) {
      toast.error('Failed to delete configuration');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate('/services')} className="btn btn-secondary mb-4">
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 mb-2">
              {serviceName} <span className={`badge badge-${environment} ml-2`}>{environment.toUpperCase()}</span>
            </h1>
            <p className="text-dark-600">Version history and management</p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            Upload New Version
          </Link>
        </div>
      </div>

      {/* Versions List */}
      {versions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No versions found"
          description="No configuration versions exist for this service and environment"
          action={
            <Link to="/upload" className="btn btn-primary">
              Upload First Version
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`card ${version.isActive ? 'ring-2 ring-primary-500 bg-primary-50/30' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-dark-900">
                      Version {version.version}
                    </h3>
                    {version.isActive && (
                      <span className="badge badge-active">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Created: {formatDate(version.createdAt)}</span>
                    </div>
                    {version.createdBy && (
                      <div className="flex items-center gap-2">
                        <span>By: {version.createdBy}</span>
                      </div>
                    )}
                  </div>

                  {version.description && (
                    <p className="mt-3 text-dark-700">{version.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/configs/view/${version.id}`}
                    className="btn btn-secondary"
                  >
                    <Eye size={18} />
                    View
                  </Link>

                  {!version.isActive && (
                    <>
                      <button
                        onClick={() => handleActivate(version.id)}
                        disabled={activatingId === version.id}
                        className="btn btn-success"
                      >
                        {activatingId === version.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                            <span>Activating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteModal({ isOpen: true, version })}
                        className="btn btn-danger"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, version: null })}
        title="Delete Configuration Version"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-900">Warning</p>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. This will permanently delete version{' '}
                {deleteModal.version?.version} of {serviceName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setDeleteModal({ isOpen: false, version: null })}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={18} />
              Delete Version
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfigVersions;
