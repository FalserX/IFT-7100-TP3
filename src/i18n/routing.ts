import { createNavigation } from "next-intl/navigation";

export const routing = {
  locales: ["en", "fr"],
  defaultLocale: "fr",
};

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
