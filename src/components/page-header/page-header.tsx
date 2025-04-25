"use client";
import PageLogo from "../page-logo/page-logo";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import { useLocale } from "@/contexts/locale-context";
import { useWallet } from "@/contexts/wallet-context";
import { useCart } from "@/contexts/cart-context";
import LanguageSwitcher from "../language-switcher/language-switcher";
import CartButton from "../cart-button/cart-button";
const PageHeader = () => {
  const { currentLocale, getLocaleString } = useLocale();
  const { connectMetaMask, address, logout } = useWallet();
  const { cart } = useCart();

  return (
    <header className="w-full p-5">
      <div className="flex justify-between items-center w-full">
        <PageLogo
          href={`/${currentLocale}`}
          imgAlt={`client.layout.btn.logo.alt`}
          imgSrc={`/Logo.svg`}
          tooltip={`client.layout.btn.logo.tooltip`}
        />
        <div className="flex gap-6 items-center">
          <LanguageSwitcher
            imgSrc={"/Globe.svg"}
            imgAlt={getLocaleString("header.language.btn.logo.alt")}
            tooltip={getLocaleString("header.language.btn.tooltip")}
          />
          {address && (
            <CartButton
              imgAlt="users.user.cart.title"
              imgSrc={`${
                cart.length > 0 ? "FillBasket.svg" : "/EmptyBasket.svg"
              }`}
              tooltip={getLocaleString("users.user.cart.btn.label")}
            />
          )}
          <AccountDropdownMenu>
            {address ? (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt={"users.user.account.dropdown.account.btn.alt"}
                  buttonIconSrc="/User.svg"
                  label={"users.user.account.dropdown.account.btn.label"}
                  tooltip={"users.user.account.dropdown.account.btn.tooltip"}
                  href={`${window.location.origin}/${currentLocale}/users/${address}`}
                />
                <AccountDropdownItemButton
                  buttonIconAlt={"users.user.account.dropdown.logout.btn.alt"}
                  buttonIconSrc="/Exit.svg"
                  label={"users.user.account.dropdown.logout.btn.label"}
                  tooltip={"users.user.account.dropdown.logout.btn.tooltip"}
                  onClick={logout}
                />
              </>
            ) : (
              <AccountDropdownItemButton
                buttonIconAlt={"users.user.account.dropdown.login.btn.alt"}
                buttonIconSrc="/Enter.svg"
                label={"users.user.account.dropdown.login.btn.label"}
                tooltip={"users.user.account.dropdown.login.btn.tooltip"}
                onClick={connectMetaMask}
              />
            )}
          </AccountDropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
