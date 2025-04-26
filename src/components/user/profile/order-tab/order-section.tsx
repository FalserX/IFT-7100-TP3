import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import RateSellerModal from "@/components/rate-seller-modal/rate-seller-modal";
import { useContractContext } from "@/contexts/contract-context";
import { useToast } from "@/contexts/toast-notification-context";
import { useWallet } from "@/contexts/wallet-context";
import { useLocale } from "@/contexts/locale-context";
import { NotifType } from "@/types/notification";
import { RawTransaction, Transaction } from "@/types/transaction";
import { ethers, Overrides } from "ethers";
import React, { useEffect, useState } from "react";
const OrderSection = () => {
  const { getLocaleString } = useLocale();
  const { address } = useWallet();
  const { contract } = useContractContext();
  const { showToast } = useToast();
  const [txBuyer, setTxBuyer] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getSeller = async (productId: any | Overrides) => {
      try {
        if (contract) {
          const product = await contract.getProduct(productId);
          return product.seller;
        }
        return "Unknown";
      } catch (err) {
        console.log("Fetching error when getting the seller: ", err);
        return "Unknown";
      }
    };

    const fetchTxByBuyer = async () => {
      try {
        if (contract && address) {
          const result = await contract.getTransactionsByBuyer(
            ethers.getAddress(address)
          );

          const proxyTxs = Array.isArray(result)
            ? result
            : Object.values(result);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawTxs: RawTransaction[] = (proxyTxs as any[]).map((tx) => ({
            buyerAddress: String(tx[0]),
            productId: tx[1].toString(),
            quantity: tx[2].toString(),
            timestampRaw: tx[3],
          }));

          const enrichedTxs: Transaction[] = await Promise.all(
            rawTxs.map(async (tx) => {
              let tsSeconds: number;
              if (typeof tx.timestampRaw === "bigint") {
                tsSeconds = Number(tx.timestampRaw);
              } else if (
                typeof tx.timestampRaw === "string" &&
                tx.timestampRaw.startsWith("0x")
              ) {
                tsSeconds = parseInt(tx.timestampRaw, 16);
              } else {
                tsSeconds = Number(tx.timestampRaw);
              }

              if (Number.isNaN(tsSeconds)) {
                console.log("Invalid Timestamp : ", tx.timestampRaw);
                tsSeconds = 0;
              }
              const date = new Date(tsSeconds * 1000);
              if (isNaN(date.getTime())) {
                console.log("Invalid parsing Date", tsSeconds, date);
              }
              const productId = Number(tx.productId);
              const seller = await getSeller(productId);

              return {
                buyerAddress: tx.buyerAddress,
                productId: productId,
                quantity: Number(tx.quantity),
                timestamp: date,
                seller: seller,
              };
            })
          );

          setTxBuyer(enrichedTxs);
        }
      } catch (err) {
        console.log("API error, cannot fetch transactions, ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTxByBuyer();
  }, [contract, address]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openRatingModal = (seller: any) => {
    setSelectedSeller(seller);
    setModalOpen(true);
  };

  const handleRateSeller = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sellerAddress: any | Overrides,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rating: any | Overrides
  ) => {
    if (!contract) {
      throw new Error("Contract is null, cannot rate seller.");
    }
    const tx = await contract.rateSeller(sellerAddress, rating);
    await tx.wait();
    showToast(
      `users.user.profile.order.rate.seller.sent`,
      NotifType.CONFIRM,
      5000
    );
  };

  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {getLocaleString("users.user.profile.order.title")}
      </h3>
      {isLoading ? (
        <LoadingSpinner color="#AACC11" size={64} />
      ) : txBuyer && txBuyer.length > 0 ? (
        <div className="overflow-x-auto max-h-96 overflow-y max-w-[1500px]">
          <table className="w-full table-auto border-collapse border border-gray-300 mt-4 rounded-xl shadow-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  {getLocaleString("users.user.profile.order.actions")}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  {getLocaleString("users.user.profile.order.id")}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  {getLocaleString("users.user.profile.order.qty")}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  {getLocaleString("users.user.profile.order.date")}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  {getLocaleString("users.user.profile.order.seller")}
                </th>
              </tr>
            </thead>
            <tbody>
              {txBuyer.map((tx) => (
                <tr key={tx.productId} className="hover:bg-gray-500 border-t">
                  <td className="px-3 py-2">
                    <button
                      onClick={() => openRatingModal(tx.seller)}
                      className="hover:underline hover:bg-blue-600 hover:cursor-pointer px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      {"users.user.profile.orders.rate"}
                    </button>
                  </td>
                  <td className="px-3 py-2">{tx.productId.toString()}</td>
                  <td className="px-3 py-2">{tx.quantity.toString()}</td>
                  <td className="px-3 py-2">
                    {new Date(tx.timestamp).toLocaleDateString(`locale`, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs">{tx.seller}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <span className="text-gray-500 text-sm italic mt-4 ml-5 mb-2">
          {getLocaleString("users.user.profile.orders.empty")}
        </span>
      )}
      <RateSellerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRate={handleRateSeller}
        sellerAddress={selectedSeller}
      />
    </div>
  );
};

OrderSection.displayName = "OrderSection";

export default OrderSection;
