import "./loading.css";

const Loading = ({
  className,
  spinnerColor,
}: {
  className: string;
  spinnerColor: string;
}) => {
  return (
    <div
      className={`loader mx-auto border-t-2 border-t-[${spinnerColor}] ${className}`}
    />
  );
};

export default Loading;
