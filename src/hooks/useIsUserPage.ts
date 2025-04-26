import { usePathname } from "next/navigation";

const useIsUserPage = (address: string | null) => {
  const pathname = usePathname();
  return Boolean(address) && pathname.startsWith(`/users/${address}`);
};

export default useIsUserPage;
