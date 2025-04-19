import { useState, useImperativeHandle, forwardRef } from "react";

export type CoordinatesData = {
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
    { road, zipCode, city, country, no, appNo, state, phone }: CoordinatesData,
    ref
  ) => {
    const [phoneBuyerChange, setPhoneBuyerChange] = useState<boolean>(false);
    const [addressNoBuyerChange, setAddressNoBuyerChange] =
      useState<boolean>(false);
    const [addressAppNoBuyerChange, setAddressAppNoBuyerChange] =
      useState<boolean>(false);
    const [addressCityBuyerChange, setAddressCityBuyerChange] =
      useState<boolean>(false);
    const [addressCountryBuyerChange, setAddressCountryBuyerChange] =
      useState<boolean>(false);
    const [addressRoadBuyerChange, setAddressRoadBuyerChange] =
      useState<boolean>(false);
    const [addressZipBuyerChange, setAddressZipBuyerChange] =
      useState<boolean>(false);
    const [addressStateBuyerChange, setAddressStateBuyerChange] =
      useState<boolean>(false);
    const [newPhoneBuyer, setNewPhoneBuyer] = useState<string>(phone);
    const [addressNoBuyer, setAddressNoBuyer] = useState<number>(no);
    const [addressRoadBuyer, setAddressRoadBuyer] = useState<string>(road);
    const [addressAppNoBuyer, setAddressAppNoBuyer] = useState<
      number | undefined
    >(appNo);
    const [addressCityBuyer, setAddressCityBuyer] = useState<string>(city);
    const [addressZipBuyer, setAddressZipBuyer] = useState<string>(zipCode);
    const [addressCountryBuyer, setAddressCountryBuyer] =
      useState<string>(country);
    const [addressStateBuyer, setAddressStateBuyer] = useState<string>(state);
    useImperativeHandle(ref, () => ({
      getData: (): CoordinatesData => ({
        phone: newPhoneBuyer,
        no: addressNoBuyer,
        appNo: addressAppNoBuyer,
        city: addressCityBuyer,
        country: addressCountryBuyer,
        road: addressRoadBuyer,
        state: addressStateBuyer,
        zipCode: addressZipBuyer,
      }),
    }));
    const handleProfilePhoneBuyerChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const newPhoneBuyer = event.target.value;
      const onlyNums = newPhoneBuyer.replace(/\D/g, "").slice(0, 10);
      const length = onlyNums.length;

      if (length < 4) {
        setNewPhoneBuyer(onlyNums);
        setPhoneBuyerChange(true);
        return;
      }
      if (length < 7) {
        setNewPhoneBuyer(`(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3)}`);
        setPhoneBuyerChange(true);
        return;
      }
      setNewPhoneBuyer(
        `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(6)}`
      );
      setPhoneBuyerChange(true);
    };
    const handleProfilePhoneBuyerFallback = (): void => {
      setNewPhoneBuyer(phone);
      setPhoneBuyerChange(false);
    };
    const handleProfileAddressBuyerAppNoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      try {
        const input = event.target.value;
        if (input == "") {
          setAddressAppNoBuyer(undefined);
          setAddressAppNoBuyerChange(true);
          return;
        }

        if (/^\d+$/.test(input)) {
          const parsed = Number.parseInt(input, 10);
          setAddressAppNoBuyer(parsed);
          setAddressAppNoBuyerChange(true);
        }
      } catch (e) {
        setAddressAppNoBuyer(appNo);
        console.log(e);
      }
    };
    const handleProfileAddressBuyerAppNoFallback = (): void => {
      setAddressAppNoBuyer(appNo);
      setAddressAppNoBuyerChange(false);
    };
    const handleProfileAddressBuyerNoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      try {
        const noAddress = Number.parseInt(event.target.value);
        setAddressNoBuyer(noAddress);
        setAddressNoBuyerChange(true);
      } catch (e) {
        console.log(e);
        setAddressNoBuyer(no);
        setAddressAppNoBuyerChange(false);
      }
    };
    const handleProfileAddressBuyerNoFallback = (): void => {
      setAddressNoBuyer(no ?? null);
      setAddressNoBuyerChange(false);
    };
    const handleProfileAddressBuyerRoadChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressRoadBuyer = event.target.value;
      setAddressRoadBuyer(addressRoadBuyer);
      setAddressRoadBuyerChange(true);
    };
    const handleProfileAddressBuyerRoadFallback = (): void => {
      setAddressRoadBuyer(road);
      setAddressRoadBuyerChange(false);
    };
    const handleProfileAddressBuyerCityChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressCityBuyer = event.target.value;
      setAddressCityBuyer(addressCityBuyer);
      setAddressCityBuyerChange(true);
    };
    const handleProfileAddressBuyerCityFallback = (): void => {
      setAddressCityBuyer(city);
      setAddressCityBuyerChange(false);
    };
    const handleProfileAddressBuyerZipChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressZipBuyer = event.target.value;
      setAddressZipBuyer(addressZipBuyer);
      setAddressZipBuyerChange(true);
    };
    const handleProfileAddressBuyerZipFallback = (): void => {
      setAddressZipBuyer(zipCode);
      setAddressZipBuyerChange(false);
    };
    const handleProfileAddressBuyerCountryChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressCountryBuyer = event.target.value;
      setAddressCountryBuyer(addressCountryBuyer);
      setAddressCountryBuyerChange(true);
    };
    const handleProfileAddressBuyerCountryFallback = (): void => {
      setAddressCountryBuyer(country);
      setAddressCountryBuyerChange(false);
    };
    const handleProfileAddressBuyerStateChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const addressStateBuyer = event.target.value;
      setAddressStateBuyer(addressStateBuyer);
      setAddressStateBuyerChange(true);
    };
    const handleProfileAddressBuyerStateFallback = (): void => {
      setAddressStateBuyer(state);
      setAddressStateBuyerChange(false);
    };

    return (
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <h3 className="mt-2 ml-2 font-bold text-gray-600">
          {"users.user.profile.coordinates.title"}
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h4 className="mt-2 ml-2 font-semibold text-gray-600">
              {"users.user.profile.address.title"}
            </h4>
            <table
              id="profileSectionAddress"
              className="w-[40vw] text-black m-2 table-auto border-spacing-4"
            >
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="address-no">
                      {"users.user.profile.address.no.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="number"
                      name="address-no"
                      id="address-no"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={addressNoBuyer}
                      onChange={handleProfileAddressBuyerNoChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressNoBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressNoBuyerChange
                          ? handleProfileAddressBuyerNoFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.no.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="address-apptNo">
                      {"users.user.profile.address.app-no.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="address-apptNo"
                      id="address-apptNo"
                      value={addressAppNoBuyer ?? ""}
                      onChange={handleProfileAddressBuyerAppNoChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressAppNoBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressAppNoBuyerChange
                          ? handleProfileAddressBuyerAppNoFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.app-no.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="road">
                      {"users.user.profile.address.road.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="road"
                      id="road"
                      value={addressRoadBuyer}
                      onChange={handleProfileAddressBuyerRoadChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressRoadBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressRoadBuyerChange
                          ? handleProfileAddressBuyerRoadFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.road.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="city">
                      {"users.user.profile.address.city.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={addressCityBuyer}
                      onChange={handleProfileAddressBuyerCityChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressCityBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressCityBuyerChange
                          ? handleProfileAddressBuyerCityFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.city.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="state">
                      {"users.user.profile.address.state.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={addressStateBuyer}
                      onChange={handleProfileAddressBuyerStateChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressStateBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressStateBuyerChange
                          ? handleProfileAddressBuyerStateFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.state.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="country">
                      {"users.user.profile.address.country.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={addressCountryBuyer}
                      onChange={handleProfileAddressBuyerCountryChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressCountryBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressCountryBuyerChange
                          ? handleProfileAddressBuyerCountryFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.country.btn.cancel"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="zip">
                      {"users.user.profile.address.zip.title"}
                    </label>
                  </td>
                  <td className="px-1 py-2">
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={addressZipBuyer}
                      onChange={handleProfileAddressBuyerZipChange}
                      className="rounded-xl border pl-2 border-gray-500"
                    />
                  </td>
                  <td>
                    <button
                      className={`bg-white border-2 ${
                        addressZipBuyerChange
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        addressZipBuyerChange
                          ? handleProfileAddressBuyerZipFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.address.zip.btn.cancel"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h4 className="mt-2 ml-2 font-semibold text-gray-600">
                {"users.user.profile.phone.title"}
              </h4>
            </div>
            <div className="flex flex-row gap-2">
              <div className="m-2">
                <label htmlFor="phone">
                  {"users.user.profile.phone.title"}
                </label>
              </div>
              <div className=" ml-2 -mr-4 px-8 py-2">
                <input
                  type="tel"
                  pattern="([0-9]{3})-[0-9]{3}-[0-9]{3}"
                  placeholder="(123) 456-7890"
                  name="phone"
                  id="phone"
                  value={newPhoneBuyer}
                  onChange={handleProfilePhoneBuyerChange}
                  className="rounded-xl border pl-2 border-gray-500"
                />
              </div>
              <div>
                <button
                  className={`bg-white border-2 ${
                    phoneBuyerChange
                      ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                      : "border-gray-500 text-gray-500"
                  } px-4 py-1 text-sm rounded-lg mr-4`}
                  onClick={
                    phoneBuyerChange
                      ? handleProfilePhoneBuyerFallback
                      : () => {}
                  }
                >
                  {"users.user.profile.phone.btn.cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CoordonatesSection.displayName = "CoordonatesSection";

export default CoordonatesSection;
