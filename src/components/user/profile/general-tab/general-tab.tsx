"use client";
import { useWallet } from "@/contexts/wallet-context";
import ProfileTabHeader from "../profile-tab-header";

import { useState, useEffect } from "react";
import { Network } from "ethers";

const GeneralTab = () => {
  const { address, getBalance, getNetwork } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [network, setNetwork] = useState<Network | string>("");

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
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.general.title"
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
                    {"users.user.profile.address"}
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
                    {"users.user.profile.balance"}
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
                    {"users.user.profile.network.name"}
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
                    {"users.user.profile.network.chainId"}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
