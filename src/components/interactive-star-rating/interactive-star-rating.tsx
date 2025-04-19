import React, { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  initialRating: number;
  className?: string;
  outOf?: number;
  onRatingChange?: (rating: number) => void;
  allowHalf?: boolean;
  disabled?: boolean;
};

const InteractiveStarRating = ({
  initialRating,
  className,
  outOf = 5,
  onRatingChange,
  allowHalf = true,
  disabled = false,
}: Props) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(initialRating);

  const handleMouseEnter = (index: number) => {
    if (!disabled) setHovered(index);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHovered(null);
  };

  const handleClick = (index: number) => {
    if (!disabled) {
      setRating(index);
      onRatingChange?.(index);
    }
  };

  const getStarType = (index: number) => {
    const value = hovered !== null ? hovered : rating;
    if (value >= index + 1) return "full";
    if (value >= index + 0.5) return "half";
    return "empty";
  };

  const renderStars = (disabled: boolean) => {
    const stars = [];
    for (let i = 0; i < outOf; i++) {
      const starType = getStarType(i);
      stars.push(
        <div
          key={i}
          className={`relative ${disabled ? "" : "cursor-pointer"} w-6 h-6`}
          onMouseLeave={handleMouseLeave}
        >
          {!disabled && allowHalf && (
            <>
              <div
                onMouseEnter={() => handleMouseEnter(i + 0.5)}
                onClick={() => handleClick(i + 0.5)}
                className="absolute left-0 w-1/2 h-full z-10"
              />
              <div
                onMouseEnter={() => handleMouseEnter(i + 1)}
                onClick={() => handleClick(i + 1)}
                className="absolute right-0 w-1/2 h-full z-10"
              />
            </>
          )}

          <Star className={`${className} text-gray-300`} />

          {starType !== "empty" && (
            <div
              className={`absolute top-0 left-0 overflow-hidden ${
                starType === "half" ? "w-1/2" : "w-full"
              } h-full text-yellow-400`}
            >
              <Star className={`${className} fill-yellow-400`} />
            </div>
          )}
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="flex gap-1">
      {renderStars(disabled)}
      <span className="ml-2 mt-2 text-sm text-gray-500">({rating})</span>
    </div>
  );
};
export default InteractiveStarRating;
