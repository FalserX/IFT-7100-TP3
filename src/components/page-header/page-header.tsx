import PageLoginSpace from "../page-login-space/page-login-space";
import PageLogo from "../page-logo/page-logo";
import PageCurrent from "../page-current/page-current";

const PageHeader = () => {
  return (
    <header className="flex flex-col gap-6 items-center p-7 md:flex-row md:gap-12 rounded-2xl bg-gray-700">
      <PageLogo />
      <PageCurrent pageName="Test" />
      <PageLoginSpace />
    </header>
  );
};

export default PageHeader;
