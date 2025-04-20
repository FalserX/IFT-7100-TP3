import { useEffect, useState } from "react";
import { UserAdminView, UserOwnerView } from "../../../../types/user";
import ProfilePageBody from "./profile-page-body/profile-page-body";
import { RoleType } from "@/types/role";
import { getCurrentUser } from "@/libs/user-service";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { usePathname, useRouter } from "next/navigation";

const ProfilePage = ({ userId }: { userId: string }) => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserAdminView | UserOwnerView | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number>(200);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: RoleType[];
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          setError("errors.users.user.read");
          setErrorStatus(response.status);
        }
        const requestor = await getCurrentUser();
        if (
          !requestor.success ||
          typeof requestor.data !== "object" ||
          !("id" in requestor.data) ||
          !("role" in requestor.data)
        ) {
          setError(requestor.error?.errorMessage ?? "errors.error.unknown");
          setErrorStatus(requestor.error?.errorStatus ?? 500);
          return;
        }
        const requestorData = requestor.data as {
          id: string;
          role: RoleType[];
        };

        setCurrentUser(requestorData);
        const data = await response.json();
        setProfile(data.data);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : "errors.error.unknown");
        setErrorStatus(500);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (error && [401, 403].includes(errorStatus)) {
      router.replace(`/${locale}/unauthorized`);
    }
    if (error && [400].includes(errorStatus)) {
      router.replace(`/${locale}/badRequest`);
    }
    if (error && [500].includes(errorStatus)) {
      router.replace(`/${locale}/serverError`);
    }
    if (error && [404].includes(errorStatus)) {
      router.replace(`/${locale}/notFound`);
    }
  }, [router, locale, errorStatus, error]);

  return (
    <div className="flex flex-col">
      <div className="flex bg-transparent pl-4 rounded-xl shadow">
        <div className="flex min-h-screen min-w-[98vw] text-black bg-gray-500 rounded-2xl p-4">
          {isLoading ? (
            <LoadingSpinner
              size={64}
              color="rgba(125,250,100,1)"
              className="flex items-center text-center justify-center w-screen h-screen"
            />
          ) : error ? (
            <div className={`rounded-full border-4 border-t-transparent`}>
              <div>
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <ProfilePageBody
              currentUser={currentUser}
              profile={profile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
