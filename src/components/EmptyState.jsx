import { FileQuestion } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileQuestion, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center mb-4">
        <Icon className="text-dark-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-dark-900 mb-2">{title}</h3>
      <p className="text-dark-600 mb-6 max-w-md">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
