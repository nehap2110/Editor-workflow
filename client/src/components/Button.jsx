const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) => {
  const variants = {
    primary: "bg-press hover:bg-ink",
    dark: "bg-ink hover:bg-press",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;