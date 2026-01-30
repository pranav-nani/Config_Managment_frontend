const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-dark-600 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-dark-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
