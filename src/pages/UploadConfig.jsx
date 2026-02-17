import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileJson, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { configService } from '../services/configService';
import {useAuth} from '../contexts/AuthContext';
import { parseConfigFile, prettyPrintJSON } from '../utils/helpers';
import { toast } from 'react-toastify';

const UploadConfig = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    serviceName: '',
    environment: 'dev',
    createdBy:''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidationError(null);
    setPreview(null);

    try {
      const parsed = await parseConfigFile(selectedFile);
      setPreview(prettyPrintJSON(parsed.data));
      toast.success('File validated successfully!');
    } catch (error) {
      setValidationError(error.message);
      setFile(null);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('serviceName', formData.serviceName);
      uploadData.append('environment', formData.environment);

      const creator = user?.email || 'unknown';
      uploadData.append('createdBy', creator);

      await configService.uploadConfig(uploadData);
      toast.success('Configuration uploaded successfully!');
      navigate('/services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Upload Configuration</h1>
        <p className="text-dark-600">Upload a new JSON or YAML configuration file for your microservice</p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-dark-900 mb-6">Service Details</h2>
          
          <div className="space-y-5">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="label">
                Service Name *
              </label>
              <input
                id="serviceName"
                type="text"
                className="input"
                placeholder="e.g., auth-service, payment-api"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
              <p className="text-xs text-dark-500 mt-1">
                Enter the name of your microservice
              </p>
            </div>

            {/* Environment */}
            <div>
              <label htmlFor="environment" className="label">
                Environment *
              </label>
              <select
                id="environment"
                className="input cursor-pointer"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                required
              >
                <option value="dev">Development</option>
                <option value="test">Testing</option>
                <option value="prod">Production</option>
              </select>
              <p className="text-xs text-dark-500 mt-1">
                Select the target environment for this configuration
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <h2 className="text-lg font-semibold text-dark-900 mb-6">Configuration File</h2>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="label">
                Upload File (JSON or YAML) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-dark-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all"
                >
                  <div className="text-center p-6">
                    {file ? (
                      <>
                        <FileJson className="mx-auto text-emerald-500 mb-3" size={48} />
                        <p className="text-dark-900 font-medium mb-1">{file.name}</p>
                        <p className="text-sm text-dark-600">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <p className="text-xs text-primary-600 mt-2">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto text-dark-400 mb-3" size={48} />
                        <p className="text-dark-900 font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-dark-600">
                          JSON or YAML files only
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Validation Status */}
            {validationError && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-900">Validation Failed</p>
                  <p className="text-sm text-red-700 mt-1">{validationError}</p>
                </div>
              </div>
            )}

            {file && !validationError && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-emerald-900">File Validated Successfully</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Your configuration file is valid and ready to upload
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">Configuration Preview</h2>
              <span className="text-xs text-dark-500">First 50 lines</span>
            </div>
            <div className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono">
                {preview.split('\n').slice(0, 50).join('\n')}
                {preview.split('\n').length > 50 && '\n...'}
              </pre>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !file || validationError}
            className="btn btn-primary px-8"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Upload Configuration</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadConfig;
