import { RoleType } from "@/types/role";
import { UserAdminView, UserOwnerView } from "@/types/user";
import { useState, useImperativeHandle, forwardRef } from "react";

export type CoordinatesData = {
  roles: RoleType[];
  isOwner: boolean;
  profile: UserAdminView | UserOwnerView;
  phone: string;
  road: string;
  zipCode: string;
  city: string;
  country: string;
  no: number;
  appNo: number | undefined;
  state: string;
};

const CoordonatesSection = forwardRef(
  (
    {
      road,
      zipCode,
      city,
      country,
      no,
      appNo,
      state,
      phone,
      roles,
      isOwner,
      profile,
    }: CoordinatesData,
    ref
  ) => {
    const [phoneMerchantChange, setPhoneMerchantChange] =
      useState<boolean>(false);
    const [addressNoMerchantChange, setAddressNoMerchantChange] =
      useState<boolean>(false);
    const [addressAppNoMerchantChange, setAddressAppNoMerchantChange] =
      useState<boolean>(false);
    const [addressCityMerchantChange, setAddressCityMerchantChange] =
      useState<boolean>(false);
    const [addressCountryMerchantChange, setAddressCountryMerchantChange] =
      useState<boolean>(false);
    const [addressRoadMerchantChange, setAddressRoadMerchantChange] =
      useState<boolean>(false);
    const [addressZipMerchantChange, setAddressZipMerchantChange] =
      useState<boolean>(false);
    const [addressStateMerchantChange, setAddressStateMerchantChange] =
      useState<boolean>(false);
    const [newPhoneMerchant, setNewPhoneMerchant] = useState<string>(phone);
    const [addressNoMerchant, setAddressNoMerchant] = useState<number>(no);
    const [addressRoadMerchant, setAddressRoadMerchant] =
      useState<string>(road);
    const [addressAppNoMerchant, setAddressAppNoMerchant] = useState<
      number | undefined
    >(appNo);
    const [addressCityMerchant, setAddressCityMerchant] =
      useState<string>(city);
    const [addressZipMerchant, setAddressZipMerchant] =
      useState<string>(zipCode);
    const [addressCountryMerchant, setAddressCountryMerchant] =
      useState<string>(country);
    const [addressStateMerchant, setAddressStateMerchant] =
      useState<string>(state);
    useImperativeHandle(ref, () => ({
      getData: (): CoordinatesData => ({
        phone: newPhoneMerchant,
        no: addressNoMerchant,
        appNo: addressAppNoMerchant,
        city: addressCityMerchant,
        country: addressCountryMerchant,
        road: addressRoadMerchant,
        state: addressStateMerchant,
        zipCode: addressZipMerchant,
        roles: roles,
        isOwner: isOwner,
        profile: profile,
      }),
    }));
    const handleProfilePhoneMerchantChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const newPhoneMerchant = event.target.value;
      const onlyNums = newPhoneMerchant.replace(/\D/g, "").slice(0, 10);
      const length = onlyNums.length;

      if (length < 4) {
        setNewPhoneMerchant(onlyNums);
        setPhoneMerchantChange(true);
        return;
      }
      if (length < 7) {
        setNewPhoneMerchant(`(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3)}`);
        setPhoneMerchantChange(true);
        return;
      }
      setNewPhoneMerchant(
        `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(6)}`
      );
      setPhoneMerchantChange(true);
    };
    const handleProfilePhoneMerchantFallback = (): void => {
      setNewPhoneMerchant(phone);
      setPhoneMerchantChange(false);
    };
    const handleProfileAddressMerchantAppNoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      try {
        const input = event.target.value;
        if (input == "") {
          setAddressAppNoMerchant(undefined);
          setAddressAppNoMerchantChange(true);
          return;
        }

        if (/^\d+$/.test(input)) {
          const parsed = Number.parseInt(input, 10);
          setAddressAppNoMerchant(parsed);
          setAddressAppNoMerchantChange(true);
        }
      } catch (e) {
        setAddressAppNoMerchant(appNo);
        console.log(e);
      }
    };
    const handleProfileAddressMerchantAppNoFallback = (): void => {
      setAddressAppNoMerchant(appNo);
      setAddressAppNoMerchantChange(false);
    };
    const handleProfileAddressMerchantNoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      try {
        const noAddress = Number.parseInt(event.target.value);
        setAddressNoMerchant(noAddress);
        setAddressNoMerchantChange(true);
      } catch (e) {
        console.log(e);
        setAddressNoMerchant(no);
        setAddressAppNoMerchantChange(false);
      }
    };
    const handleProfileAddressMerchantNoFallback = (): void => {
      setAddressNoMerchant(no ?? null);
      setAddressNoMerchantChange(false);
    };
    const handleProfileAddressMerchantRoadChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressRoadMerchant = event.target.value;
      setAddressRoadMerchant(addressRoadMerchant);
      setAddressRoadMerchantChange(true);
    };
    const handleProfileAddressMerchantRoadFallback = (): void => {
      setAddressRoadMerchant(road);
      setAddressRoadMerchantChange(false);
    };
    const handleProfileAddressMerchantCityChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressCityMerchant = event.target.value;
      setAddressCityMerchant(addressCityMerchant);
      setAddressCityMerchantChange(true);
    };
    const handleProfileAddressMerchantCityFallback = (): void => {
      setAddressCityMerchant(city);
      setAddressCityMerchantChange(false);
    };
    const handleProfileAddressMerchantZipChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressZipMerchant = event.target.value;
      setAddressZipMerchant(addressZipMerchant);
      setAddressZipMerchantChange(true);
    };
    const handleProfileAddressMerchantZipFallback = (): void => {
      setAddressZipMerchant(zipCode);
      setAddressZipMerchantChange(false);
    };
    const handleProfileAddressMerchantCountryChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressCountryMerchant = event.target.value;
      setAddressCountryMerchant(addressCountryMerchant);
      setAddressCountryMerchantChange(true);
    };
    const handleProfileAddressMerchantCountryFallback = (): void => {
      setAddressCountryMerchant(country);
      setAddressCountryMerchantChange(false);
    };
    const handleProfileAddressMerchantStateChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressStateMerchant = event.target.value;
      setAddressStateMerchant(addressStateMerchant);
      setAddressStateMerchantChange(true);
    };
    const handleProfileAddressStateMerchantFallback = (): void => {
      setAddressStateMerchant(state);
      setAddressStateMerchantChange(false);
    };
    return isOwner && roles.includes(RoleType.VENDOR) ? (
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <h3 className="mt-2 ml-2 font-bold text-gray-600">
          {"users.user.profile.coordinates.title"}
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h4 className="mt-2 ml-2 font-semibold text-gray-600">
              {"users.user.profile.merchant.address.title"}
            </h4>
            <table
              id="profileSectionAddress"
              className="w-[40vw] text-black m-2 table-auto border-spacing-4"
            >
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="address-no">
                      {"users.user.profile.merchant.address.no.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="number"
                      disabled={!isOwner}
                      name="address-no"
                      id="address-no"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={addressNoMerchant}
                      onChange={handleProfileAddressMerchantNoChange}
                      className={`rounded-xl border pl-2 border-gray-500 ${
                        isOwner ? "bg-white" : "bg-gray-200"
                      }`}
                    />
                  </td>
                  <td>
                    {!isOwner && (
                      <button
                        className={`bg-white border-2 ${
                          addressNoMerchantChange
                            ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                            : "border-gray-500 text-gray-500"
                        } px-4 py-1 text-sm rounded-lg mr-4`}
                        onClick={
                          addressNoMerchantChange
                            ? handleProfileAddressMerchantNoFallback
                            : () => {}
                        }
                      >
                        {"users.user.profile.merchant.address.no.btn.cancel"}
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="address-apptNo">
                      {"users.user.profile.merchant.address.app-no.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="address-apptNo"
                      id="address-apptNo"
                      value={addressAppNoMerchant ?? ""}
                      onChange={handleProfileAddressMerchantAppNoChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressAppNoMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressAppNoMerchantChange
                          ? handleProfileAddressMerchantAppNoFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.app-no.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="road">
                      {"users.user.profile.merchant.address.road.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="road"
                      id="road"
                      value={addressRoadMerchant}
                      onChange={handleProfileAddressMerchantRoadChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressRoadMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressRoadMerchantChange
                          ? handleProfileAddressMerchantRoadFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.road.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="city">
                      {"users.user.profile.merchant.address.city.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={addressCityMerchant}
                      onChange={handleProfileAddressMerchantCityChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressCityMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressCityMerchantChange
                          ? handleProfileAddressMerchantCityFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.city.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="state">
                      {"users.user.profile.merchant.address.state.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={addressStateMerchant}
                      onChange={handleProfileAddressMerchantStateChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressStateMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressStateMerchantChange
                          ? handleProfileAddressStateMerchantFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.state.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="country">
                      {"users.user.profile.merchant.address.country.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={addressCountryMerchant}
                      onChange={handleProfileAddressMerchantCountryChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressCountryMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressCountryMerchantChange
                          ? handleProfileAddressMerchantCountryFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.country.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="zip">
                      {"users.user.profile.merchant.address.zip.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={addressZipMerchant}
                      onChange={handleProfileAddressMerchantZipChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressZipMerchantChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressZipMerchantChange
                          ? handleProfileAddressMerchantZipFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.merchant.address.zip.btn.cancel"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h4 className="mt-2 ml-2 font-semibold text-gray-600">
                {"users.user.profile.merchant.phone.title"}
              </h4>
            </div>
            <div className="flex flex-row gap-2">
              <div className="m-2">
                <label htmlFor="phone">
                  {"users.user.profile.merchant.phone.title"}
                </label>
              </div>
              <div className=" ml-2 -mr-4 px-8 py-2">
                <input
                  type="tel"
                  pattern="([0-9]{3})-[0-9]{3}-[0-9]{3}"
                  placeholder="(123) 456-7890"
                  name="phone"
                  id="phone"
                  value={newPhoneMerchant}
                  onChange={handleProfilePhoneMerchantChange}
                  className="rounded-xl border pl-2 border-gray-500"
                />
              </div>
              <div>
                <button
                  className={`bg-white border-2 ${
                    phoneMerchantChange
                      ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                      : "border-gray-500 text-gray-500"
                  } px-4 py-1 text-sm rounded-lg mr-4`}
                  onClick={
                    phoneMerchantChange
                      ? handleProfilePhoneMerchantFallback
                      : () => {}
                  }
                >
                  {"users.user.profile.merchant.phone.btn.cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <h3 className="mt-2 ml-2 font-bold text-gray-600">
          {"users.user.profile.coordinates.title"}
        </h3>
        <div className="justify-center m-2 text-center">
          {"users.user.profile.merchant.no-opt-in"}
        </div>
      </div>
    );
  }
);

CoordonatesSection.displayName = "CoordonatesSection";

export default CoordonatesSection;
