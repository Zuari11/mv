"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  // Deterministic rotation values based on index to avoid hydration mismatch
  const getRotationForIndex = (index: number) => {
    const rotations = [-8, -4, 0, 4, 8, -6, 2, -2, 6, -10];
    return rotations[index % rotations.length];
  };

  useEffect(() => {
    // Set client flag to enable animations after hydration
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (autoplay && isClient) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isClient]);
  return (
    <div className="w-full px-4 py-8 font-sans antialiased">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 max-w-none">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const rotation = getRotationForIndex(index);
                const exitRotation = getRotationForIndex(index + 1);

                return (
                  <motion.div
                    key={testimonial.src}
                    initial={
                      isClient
                        ? {
                            opacity: 0,
                            scale: 0.9,
                            z: -100,
                            rotate: rotation,
                          }
                        : {
                            opacity: isActive(index) ? 1 : 0.7,
                            scale: isActive(index) ? 1 : 0.95,
                            z: isActive(index) ? 0 : -100,
                            rotate: isActive(index) ? 0 : rotation,
                          }
                    }
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : rotation,
                      zIndex: isActive(index)
                        ? 40
                        : testimonials.length + 2 - index,
                      y: isActive(index) && isClient ? [0, -80, 0] : 0,
                    }}
                    exit={
                      isClient
                        ? {
                            opacity: 0,
                            scale: 0.9,
                            z: 100,
                            rotate: exitRotation,
                          }
                        : undefined
                    }
                    transition={{
                      duration: isClient ? 0.4 : 0,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={
              isClient
                ? {
                    y: 20,
                    opacity: 0,
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={
              isClient
                ? {
                    y: -20,
                    opacity: 0,
                  }
                : undefined
            }
            transition={{
              duration: isClient ? 0.2 : 0,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-2xl font-bold text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-gray-400">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-gray-300">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={
                    isClient
                      ? {
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }
                      : {
                          filter: "blur(0px)",
                          opacity: 1,
                          y: 0,
                        }
                  }
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: isClient ? 0.2 : 0,
                    ease: "easeInOut",
                    delay: isClient ? 0.02 * index : 0,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-300 transition-transform duration-300 group-hover/button:rotate-12 group-hover/button:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <IconArrowRight className="h-5 w-5 text-gray-300 transition-transform duration-300 group-hover/button:-rotate-12 group-hover/button:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
