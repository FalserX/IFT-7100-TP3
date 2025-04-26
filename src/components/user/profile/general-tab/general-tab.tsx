"use client";
import { useWallet } from "@/contexts/wallet-context";
import { useLocale } from "@/contexts/locale-context";
import { useContractContext } from "@/contexts/contract-context";
import ProfileTabHeader from "../profile-tab-header";

import { useState, useEffect } from "react";
import { Network } from "ethers";
import InteractiveStarRating from "@/components/interactive-star-rating/interactive-star-rating";

const GeneralTab = () => {
  const { getLocaleString } = useLocale();
  const { address, getBalance, getNetwork } = useWallet();
  const { getAverageRating } = useContractContext();
  const [balance, setBalance] = useState<number>(0);
  const [network, setNetwork] = useState<Network | string>("");
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = await getBalance();
      setBalance(fetchedBalance);
    };
    fetchBalance();
  }, [getBalance]);
  useEffect(() => {
    const fetchNetwork = async () => {
      const fetchedNetwork = await getNetwork();
      setNetwork(fetchedNetwork);
    };
    fetchNetwork();
  }, [getNetwork]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      if (address) {
        const fetchedAverageRating = await getAverageRating(address);
        setAverageRating(fetchedAverageRating);
      } else {
        setAverageRating(2.5);
      }
    };
    fetchAverageRating();
  }, [address, getAverageRating]);
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle={getLocaleString("users.user.profile.general.title")}
      />
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <div className="flex flex-row gap-2">
          <table
            id="profileSectionGeneric"
            className="w-[40vw] text-black m-2 table-auto border-spacing-4"
          >
            <tbody>
              <tr>
                <td>
                  <label htmlFor="address">
                    {getLocaleString("users.user.profile.general.address")}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    disabled={true}
                    value={address ?? ""}
                    onChange={() => {}}
                    className={`rounded-xl border pl-2 border-gray-500 bg-gray-300 w-[500px]`}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="balance">
                    {getLocaleString("users.user.profile.general.balance")}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="balance"
                    id="balance"
                    disabled={true}
                    value={balance.toString() ?? ""}
                    onChange={() => {}}
                    className={`rounded-xl border pl-2 border-gray-500 bg-gray-300 w-[500px]`}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="networkName">
                    {getLocaleString("users.user.profile.general.network.name")}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="networkName"
                    id="networkName"
                    disabled={true}
                    value={
                      typeof network === "string"
                        ? ""
                        : (network as Network).name == "unknown"
                        ? "local"
                        : (network as Network).name
                    }
                    onChange={() => {}}
                    className={`rounded-xl border pl-2 border-gray-500 bg-gray-300 w-[500px]`}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="networkChainId">
                    {getLocaleString(
                      "users.user.profile.general.network.chainId"
                    )}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="networkChainId"
                    id="networkChainId"
                    disabled={true}
                    value={
                      typeof network === "string"
                        ? ""
                        : String((network as Network).chainId)
                    }
                    onChange={() => {}}
                    className={`rounded-xl border pl-2 border-gray-500 bg-gray-300 w-[500px]`}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="averageRating">
                    {getLocaleString("users.user.profile.general.rating.label")}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <InteractiveStarRating
                    key={averageRating ?? "init"}
                    value={averageRating === null ? 2.5 : averageRating}
                    disabled={true}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
