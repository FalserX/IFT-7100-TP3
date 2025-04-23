"use client";
import PageLogo from "../page-logo/page-logo";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import { useLocale } from "@/contexts/locale-context";
import { useWallet } from "@/contexts/wallet-context";
const PageHeader = () => {
  const { currentLocale } = useLocale();
  const { connectMetaMask, address, logout } = useWallet();

  return (
    <header className="w-full p-5">
      <div className="flex justify-between items-center w-full">
        <PageLogo
          href={`/${currentLocale}`}
          imgAlt={`client-layout.btn-logo-alt`}
          imgSrc={`/Logo.svg`}
          tooltip={`client-layout.btn-logo-tooltip`}
        />
        <div className="flex gap-6 items-center">
          <AccountDropdownMenu>
            {address ? (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt={"users.user.account.dropdown.account.btn.alt"}
                  buttonIconSrc="/Info.svg"
                  label={"users.user.account.dropdown.account.btn.lbl"}
                  tooltip={"users.user.account.dropdown.account.btn.tooltip"}
                  href={`${window.location.origin}/${currentLocale}/users/${address}`}
                />
                <AccountDropdownItemButton
                  buttonIconAlt={"users.user.account.dropdown.logout.btn.alt"}
                  buttonIconSrc="/Exit.svg"
                  label={"users.user.account.dropdown.logout.btn.lbl"}
                  tooltip={"users.user.account.dropdown.logout.btn.tooltip"}
                  onClick={logout}
                />
              </>
            ) : (
              <AccountDropdownItemButton
                buttonIconAlt={"users.user.account.dropdown.login.btn.alt"}
                buttonIconSrc="/Enter.svg"
                label={"users.user.account.dropdown.login.btn.lbl"}
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
