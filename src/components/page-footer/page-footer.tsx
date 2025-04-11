type PageFooterProps = { name: string };

const PageFooter = ({ name }: PageFooterProps) => {
  return <div className="bg-blue-700 min-h-11/12 rounded-2xl">{name}</div>;
};

export default PageFooter;
