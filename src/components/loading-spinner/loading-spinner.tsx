export type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 16,
  color = "#FFF",
}) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent transparent transparent`,
      }}
    />
  );
};

export default LoadingSpinner;
