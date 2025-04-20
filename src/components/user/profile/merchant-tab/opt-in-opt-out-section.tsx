import { RoleType } from "@/types/role";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  roles: RoleType[];
  isOwner: boolean;
};
export type ProfileRoleData = Pick<Props, "roles">;

type OptInOptOutRef = {
  getData: () => ProfileRoleData;
};

const OptInOptOutSection = forwardRef<OptInOptOutRef, Props>(
  ({ roles, isOwner }, ref) => {
    const [newRoles, setNewRoles] = useState<RoleType[]>(roles);
    const [isNewRoleSet, setIsNewRoleSet] = useState<boolean>(false);

    const handleOptInOptOutRolling = () => {
      setNewRoles((prevRoles) => {
        const updatedRoles = prevRoles.includes(RoleType.VENDOR)
          ? prevRoles.filter((r) => r !== RoleType.VENDOR)
          : [...prevRoles, RoleType.VENDOR];
        return updatedRoles;
      });
      setIsNewRoleSet(true);
    };
    useImperativeHandle(ref, () => ({
      getData: (): ProfileRoleData => {
        return { roles: newRoles };
      },
    }));

    return (
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <h3 className="mt-2 ml-2 font-bold text-gray-600">
          {"users.user.profile.merchant.optinoptout.title"}
        </h3>
        <div className="flex flex-row justify-center items-center m-2">
          <button
            disabled={!isOwner}
            onClick={handleOptInOptOutRolling}
            className={`border p-2 rounded-xl  ${
              isOwner
                ? "pointer-cursor bg-blue-500 text-white hover:bg-blue-700"
                : " text-gray-600 bg-gray-300"
            }`}
          >
            {newRoles.includes(RoleType.VENDOR)
              ? "users.user.profile.merchant.optinoptout.optout.btn.label"
              : "users.user.profile.merchant.optinoptout.optin.btn.label"}
          </button>
          {isNewRoleSet && (
            <div className="ml-5 text-green-600">
              <span>
                {"users.user.profile.merchant.optinoptout.roleset.label"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
OptInOptOutSection.displayName = "OptInOptOutSection";

export default OptInOptOutSection;
