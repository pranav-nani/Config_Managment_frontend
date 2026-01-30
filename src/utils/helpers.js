import yaml from 'js-yaml';

// Validate JSON string
export const validateJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate YAML string
export const validateYAML = (yamlString) => {
  try {
    yaml.load(yamlString);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Parse file content based on extension
export const parseConfigFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const content = await file.text();

  if (extension === 'json') {
    const validation = validateJSON(content);
    if (!validation.valid) {
      throw new Error(`Invalid JSON: ${validation.error}`);
    }
    return { data: JSON.parse(content), type: 'json' };
  } else if (extension === 'yaml' || extension === 'yml') {
    const validation = validateYAML(content);
    if (!validation.valid) {
      throw new Error(`Invalid YAML: ${validation.error}`);
    }
    return { data: yaml.load(content), type: 'yaml' };
  } else {
    throw new Error('Unsupported file format. Please upload JSON or YAML files.');
  }
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format relative time
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Pretty print JSON
export const prettyPrintJSON = (obj) => {
  return JSON.stringify(obj, null, 2);
};

// Get environment badge color
export const getEnvBadgeClass = (env) => {
  const classes = {
    dev: 'badge-dev',
    test: 'badge-test',
    prod: 'badge-prod',
  };
  return classes[env] || 'badge-dev';
};
