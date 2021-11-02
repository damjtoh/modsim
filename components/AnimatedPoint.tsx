import React, { FC, useEffect, useState } from "react";
import useAnimationFrame from "use-animation-frame";
import * as math from "mathjs";

type AnimatedPointProps = {
  initialX: number;
  direction: "LEFT" | "RIGHT";
  onXChange: (x: number) => void;
  equation: string;
};

const AnimatedPoint: FC<AnimatedPointProps> = ({
  initialX,
  direction,
  equation,
  onXChange,
}) => {
  const [animatedX, setAnimatedX] = useState(initialX);
  const handleAnimateTimeChange = (time) => {
    const rawSpeed = math.evaluate(equation, { x: animatedX });
    const speed =
      direction === "LEFT" ? -Math.abs(rawSpeed) : Math.abs(rawSpeed);
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
