import PageBody from "@/components/page-body/page-body";
import PageFooter from "@/components/page-footer/page-footer";
import PageHeader from "@/components/page-header/page-header";

export default function Home() {
  return (
    <>
      <main>
        <PageHeader />
        <PageBody name="eee" />
        <PageFooter name="ddd" />
      </main>
    </>
  );
}
