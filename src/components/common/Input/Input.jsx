import ErrorMessage from "./ErrorMessage";

const InputField = ({ label, name, type = "text", icon, value, onChange, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold font-cairo text-neutral-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pr-12 rounded-lg bg-neutral-50 border ${
          error ? "border-red-500" : "border-neutral-200"
        } focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 font-ibm`}
      />
      <span className="text-neutral-400 absolute top-1/2 right-4 -translate-y-1/2">
        {icon}
      </span>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

export default InputField;
