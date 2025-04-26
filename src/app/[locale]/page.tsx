import { useTranslations } from "next-intl";
import ProductList from "../../components/ProductList";
import AddProductForm from "../../components/AddProductForm";
import PurchaseProductForm from "../../components/PurchaseProductForm";
import RateSellerForm from "../../components/RateSellerForm";
import UpdateProductForm from "../../components/UpdateProductForm";


export default function Home() {
  const t = useTranslations();
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
          <h2 className="items-center text-black">{t("home.content")}</h2>

          <ProductList />
          <AddProductForm />
          <UpdateProductForm />
          <PurchaseProductForm />
          <RateSellerForm />
    </main>
  );
}
