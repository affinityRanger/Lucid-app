// src/hooks/useCountUp.jsx

import { useEffect, useState } from "react";

export default function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    let animationFrame;

    const step = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
        cancelAnimationFrame(animationFrame);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}
