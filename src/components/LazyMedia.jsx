import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const LazyMedia = ({
  videoSrc,
  imgSrc,
  poster,
  alt = "",
  className = "",
  imgClassName = "",
  videoClassName = "",
  aspectClass = "aspect-[4/3]",
  priority = false,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (inView) {
      setCanPlay(true);
    }
  }, [inView]);

  useEffect(() => {
    if (canPlay && videoRef.current) {
      const play = async () => {
        try {
          await videoRef.current.play();
        } catch (_) {
          // Autoplay might be blocked; ignore
        }
      };
      play();
    }
  }, [canPlay]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl w-full ${aspectClass} ${className}`}>
      {videoSrc ? (
        canPlay ? (
          <motion.video
            ref={videoRef}
            className={`w-full h-full object-cover object-center ${videoClassName}`}
            playsInline
            muted
            loop
            autoPlay
            preload="none"
            poster={poster}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        ) : (
          <motion.img
            src={poster}
            alt={alt}
            className={`w-full h-full object-cover object-center ${imgClassName}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={priority ? "high" : "low"}
          />
        )
      ) : (
        <motion.img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover object-center ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "low"}
        />
      )}
    </div>
  );
};

export default LazyMedia;


