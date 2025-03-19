import { useError } from "../../../context/ErrorContext";

const GlobalError = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-xl z-50">
      <div className="flex justify-between items-center space-x-2">
        <span>{error}</span>
        <button onClick={clearError} className="ml-4 font-bold">X</button>
      </div>
    </div>
  );
};

export default GlobalError;
