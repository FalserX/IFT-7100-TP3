import PageLogo from "../page-logo/page-logo";
import PageCurrent from "../page-current/page-current";
import PageAccountSpace from "../page-account-space/page-account-space";

type PageHeaderProps = {
  pageName: string;
  siteName: string;
};

const PageHeader = ({ pageName, siteName }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 items-center p-7 md:flex-row md:gap-12 rounded-2xl bg-gray-700">
      <PageLogo siteName={siteName} />
      <PageCurrent pageName={pageName} />
      <PageAccountSpace />
    </header>
  );
};

export default PageHeader;
