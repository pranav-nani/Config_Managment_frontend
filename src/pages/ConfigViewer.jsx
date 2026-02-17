import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, Download, Eye } from "lucide-react";
import ReactJson from "react-json-view";
import { configService } from "../services/configService";
import { copyToClipboard, prettyPrintJSON } from "../utils/helpers";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const ConfigViewer = () => {
  const { configId } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("tree"); // 'tree' or 'raw'

  useEffect(() => {
    fetchConfig();
  }, [configId]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await configService.getConfigById(configId);
      setConfig({
        ...data,
        data: data.configData || {},
      });
    } catch (error) {
      toast.error("Configuration not found");
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const jsonString = prettyPrintJSON(config.data);
    const success = await copyToClipboard(jsonString);

    if (success) {
      setCopied(true);
      toast.success("Configuration copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const jsonString = prettyPrintJSON(config.data);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.serviceName}-${config.environment}-v${config.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Configuration downloaded!");
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!config) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-dark-900">
                {config.serviceName}
              </h1>
              <span className={`badge badge-${config.environment}`}>
                {config.environment.toUpperCase()}
              </span>
              {config.isActive && (
                <span className="badge badge-active">
                  <CheckCircle size={14} />
                  Active
                </span>
              )}
            </div>
            <p className="text-dark-600">
              Version {config.version} • Created{" "}
              {new Date(config.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "tree" ? "raw" : "tree")}
              className="btn btn-secondary">
              <Eye size={18} />
              {viewMode === "tree" ? "Raw View" : "Tree View"}
            </button>
            <button onClick={handleCopy} className="btn btn-secondary">
              {copied ? (
                <>
                  <CheckCircle size={18} className="text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
            <button onClick={handleDownload} className="btn btn-primary">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Display */}
      <div className="card">
        <div className="card-header">
          <span>Configuration Data</span>
          <span className="text-sm font-normal text-dark-600">
            {viewMode === "tree" ? "Tree View" : "Raw JSON"}
          </span>
        </div>

        {viewMode === "tree" ? (
          <div className="bg-dark-50 rounded-lg p-4 overflow-x-auto">
            <ReactJson
              src={config.data}
              theme="rjv-default"
              displayDataTypes={false}
              displayObjectSize={true}
              enableClipboard={true}
              collapsed={2}
              name={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "14px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
          </div>
        ) : (
          <div className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-emerald-400 font-mono">
              {prettyPrintJSON(config.data)}
            </pre>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-dark-600 mb-2">
            Service Name
          </h3>
          <p className="text-lg font-semibold text-dark-900">
            {config.serviceName}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-dark-600 mb-2">
            Environment
          </h3>
          <span className={`badge badge-${config.environment} text-base`}>
            {config.environment.toUpperCase()}
          </span>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-dark-600 mb-2">Version</h3>
          <p className="text-lg font-semibold text-dark-900 font-mono">
            v{config.version}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-dark-600 mb-2">Status</h3>
          <span
            className={`badge ${config.isActive ? "badge-active" : "badge-inactive"} text-base`}>
            {config.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-dark-600 mb-2">
            Created At
          </h3>
          <p className="text-sm text-dark-900">
            {new Date(config.createdAt).toLocaleString()}
          </p>
        </div>

        {config.createdBy && (
          <div className="card">
            <h3 className="text-sm font-semibold text-dark-600 mb-2">
              Created By
            </h3>
            <p className="text-sm text-dark-900">{config.createdBy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigViewer;
