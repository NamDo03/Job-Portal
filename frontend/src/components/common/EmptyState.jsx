const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-gray-400">{icon}</div>
      <h3 className="mb-2 text-lg font-medium text-text-primary">{title}</h3>
      <p className="max-w-md text-text-2">{description}</p>
    </div>
  );
};

export default EmptyState;
