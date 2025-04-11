export type PageCurrentProps = {
  pageName: string;
};

const PageCurrent = ({ pageName }: PageCurrentProps) => {
  return (
    <div className="flex grow justify-center">
      <p>{pageName}</p>
    </div>
  );
};

export default PageCurrent;
