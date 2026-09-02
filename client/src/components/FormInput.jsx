/**
 * A labeled text input used across auth forms (and future forms).
 * Keeping this as a small, generic component avoids repeating the same
 * label + input markup and Tailwind classes in every form.
 */
const FormInput = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FormInput;