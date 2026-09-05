import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 border border-hairline bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition hover:border-press hover:text-press"
    >
      <span className="text-base leading-none">←</span>
      {label}
    </button>
  );
};

export default BackButton;