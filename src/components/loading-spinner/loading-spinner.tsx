export type LoadingSpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  color = "#FFF",
  className,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={`${className} animate-spin rounded-full border-4 border-t-transparent`}
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent transparent transparent`,
      }}
    />
  );
};

export default LoadingSpinner;
