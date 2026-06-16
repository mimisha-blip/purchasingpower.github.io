import { useEffect, useState } from 'react';
import { backgroundImages } from './backgroundImages.js';

const INTERVAL_MS = 30000;

export default function TravelBackdrop() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % backgroundImages.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-scene" aria-hidden="true">
      {backgroundImages.map((img, i) => (
        <div
          key={img.label}
          className={`bg-slide ${i === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img.url})` }}
        />
      ))}
      <div className="bg-overlay" />
    </div>
  );
}
