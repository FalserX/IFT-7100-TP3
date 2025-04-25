import { useState } from "react";
import InteractiveStarRating from "../interactive-star-rating/interactive-star-rating";
import { useLocale } from "@/contexts/locale-context";
type Props = {
  open: boolean;
  onClose: () => void;
  onRate: (sellerAddress: string, rating: number) => void;
  sellerAddress: string;
};

const RateSellerModal = ({ open, onClose, onRate, sellerAddress }: Props) => {
  const [rating, setRating] = useState<number>(2.5);
  const [loading, setLoading] = useState<boolean>(false);
  const { getLocaleString } = useLocale();
  if (!open) return null;

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert(
        getLocaleString(`errors.users.user.profile.order.rate.seller.valid`)
      );
      return;
    }

    setLoading(true);
    try {
      await onRate(sellerAddress, rating);
      onClose();
    } catch (err) {
      console.log("API error: an error occured when sending rating. ", err);
      alert(
        getLocaleString(`errors.users.user.profile.order.rate.seller.sending`)
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{`users.user.profile.order.rate.title`}</h2>
        <p className="text-sm text-gray-600 mb-2">{`users.user.profile.order.rate.description`}</p>
        <InteractiveStarRating value={rating} onRatingChange={setRating} />
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            {getLocaleString(
              `users.user.profile.order.rate.seller.btn.cancel.label`
            )}
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? getLocaleString(
                  `users.user.profile.order.rate.seller.btn.send.sending.label`
                )
              : getLocaleString(
                  `users.user.profile.order.rate.seller.btn.send.send.label`
                )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateSellerModal;
