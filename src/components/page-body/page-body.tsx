type PageBodyProps = {
  name: string;
};

const PageBody = ({ name }: PageBodyProps) => {
  return <div className="bg-amber-950 min-h-screen rounded-2xl">{name}</div>;
};

export default PageBody;
