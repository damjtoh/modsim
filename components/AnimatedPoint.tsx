import React, { FC, useEffect, useState } from "react";
import useAnimationFrame from "use-animation-frame";
import * as math from "mathjs";

type AnimatedPointProps = {
  initialX: number;
  direction: "LEFT" | "RIGHT";
  onXChange: (x: number) => void;
};

const AnimatedPoint: FC<AnimatedPointProps> = ({
  initialX,
  direction,
  onXChange,
}) => {
  const [animatedX, setAnimatedX] = useState(initialX);
  const handleAnimateTimeChange = (time) => {
    const rawSpeed = math.evaluate("x^2 - 1", { x: animatedX });
    const speed =
      direction === "LEFT" ? -Math.abs(rawSpeed) : Math.abs(rawSpeed);
    console.log(
      "handleAnimateTimeChange",
      "\ninitialAnimationX: ",
      initialX,
      "\nspeed: ",
      speed,
      "\nnew x: ",
      initialX + speed * 0.1 * time,
      "\ncurrent time: ",
      time,
      "\ndirection: ",
      direction,
      "\nanimatedX: ",
      animatedX
    );
    if (
      (direction === "RIGHT" && initialX + speed * time > animatedX) ||
      (direction === "LEFT" && initialX + speed * time < animatedX)
    )
      setAnimatedX(initialX + speed * time);
  };
  useEffect(() => {
    onXChange(animatedX);
  }, [animatedX]);
  useAnimationFrame((e) => handleAnimateTimeChange(e.time), [animatedX]);
  return <div>Valor de x: {animatedX}</div>;
};

export default AnimatedPoint;