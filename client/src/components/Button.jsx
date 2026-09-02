/**
 * A generic full-width button used for primary actions (submit, sign
 * out, etc.). `variant` picks between the two color schemes currently
 * used across the app.
 */
const Button = ({ children, onClick, type = "button", disabled = false, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    dark: "bg-gray-800 hover:bg-gray-900",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white text-sm font-medium py-2 rounded disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;