import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating = 0, handleRatingChange, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= rating;

        return (
          <Button
            key={star}
            className={`p-2 rounded-full transition-colors ${
              isActive
                ? "text-yellow-500 hover:bg-black"
                : "text-black hover:bg-primary hover:text-primary-foreground"
            }`}
            variant="outline"
            size="icon"
            onClick={
              !readOnly && handleRatingChange ? () => handleRatingChange(star) : undefined
            }
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <StarIcon
              className={`w-6 h-6 ${isActive ? "fill-yellow-500" : "fill-black"}`}
            />
          </Button>
        );
      })}
    </div>
  );
}

export default StarRatingComponent;
