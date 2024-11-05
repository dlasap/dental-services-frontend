import React = require("react");

type SpinnerProps = {
  size?: string; // Size of the spinner, e.g., "w-8 h-8"
  color?: string; // Color of the spinner, e.g., "text-blue-500"
};

const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = "w-8 h-8",
  color = "text-secondary",
}) => {
  return (
    <div className={`flex items-center justify-center ${size} ${color}`}>
      <svg
        className={`animate-spin ${size} ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
