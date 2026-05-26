import { useState } from "react";

export default function StarRating({
  value,
  onChange,
  readonly = false,
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`star ${
            star <= (hovered || value)
              ? "star-active"
              : ""
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}