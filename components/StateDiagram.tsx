import React, { FC, useRef, useState, useEffect, useMemo } from "react";
import useFunctionPlot from "../hooks/useFunctionPlot";
import { RangeStateComponent, StateDiagramComponent } from "../pages";
import * as d3 from "d3";
import AnimatedPoint from "./AnimatedPoint";

type StateDiagramProps = {
  components: StateDiagramComponent[];
  equation: string;
};

const Y_DOMAIN = [-2, 2];
const X_DOMAIN = [-5, 5];

const options = {
  height: 250,
  yAxis: { domain: Y_DOMAIN },
  xAxis: { domain: X_DOMAIN },
  grid: true,
  disableZoom: true,
  tip: {
    xLine: true,
    renderer: function (x, y, index) {
      return null;
    },
  },
  data: [
    {
      fn: "y=0",
    },
  ],
};

export const findRange = (ranges, x) =>
  ranges.find((r) => r.range[0] < x && r.range[1] > x);

const StateDiagram: FC<StateDiagramProps> = ({ components = [], equation }) => {
  const rootEl = useRef(null);
  const { instance } = useFunctionPlot(rootEl, options);
  const [isAnimating, setIsAnimating] = useState(false);
  const [initialAnimationConfig, setInitialAnimationConfig] = useState({
    x: 0,
    direction: undefined,
    limit: undefined,
  });
  const ranges = useMemo(
    () => components.filter((c) => c.type === "RANGE") as RangeStateComponent[],
    [components]
  );
  const handleMouseLeave = () => {
    instance.canvas.select("#arrow").style("display", "none");
  };
  useEffect(() => {
    if (instance) {
      instance.on("tip:update", function ({ x, index }) {
        const newX = instance.meta.xScale(x) - 6;
        const newY = instance.meta.yScale(0) - 6;
        const movement = findRange(ranges, x)?.movement;
        instance.canvas
          .select("#arrow")
          .style("display", null)
          .attr(
            "transform",
            `translate(${newX} ${newY})
            rotate(${movement === "RIGHT" ? 0 : 180},6,6)`
          );
      });
    }
  }, [instance]);

  const handleClickPress = (e) => {
    e.persist();
    if (!isAnimating) setIsAnimating(true);
    const [x] = d3.pointer(e.nativeEvent, e.target);
    const unscaledX = instance.meta.xScale.invert(x);
    const range = findRange(ranges, unscaledX);
    setInitialAnimationConfig({
      x: unscaledX,
      direction: range.movement,
      limit: range.range,
    });
  };
  const handleAnimationXChange = (x) => {
    if (
      instance &&
      x > initialAnimationConfig.limit[0] &&
      x < initialAnimationConfig.limit[1]
    ) {
      instance.canvas
        .select("#arrow-movement")
        .style("display", null)
        .attr(
          "transform",
          `translate(${instance.meta.xScale(x) - 6} ${
            instance.meta.yScale(0) - 6
          })
          rotate(${initialAnimationConfig.direction === "RIGHT" ? 0 : 180},6,6)`
        );
    } else {
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (instance) {
      components.forEach((c) => {
        if (c.type === "EQ_POINT") {
          instance.canvas
            .append("circle")
            .attr("r", 4)
            .attr("cx", instance.meta.xScale(c.x))
            .attr("cy", instance.meta.yScale(0))
            .style("fill", c.subType === "attractor" ? "green" : "red");
        } else if (c.type === "RANGE") {
          instance.canvas
            .append("path")
            .attr("id", "arrow")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "purple")
            .style("display", "none");
          instance.canvas
            .append("path")
            .attr("id", "arrow-movement")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "purple")
            .style("display", "none");
        }
      });
    }
  }, [instance, components]);

  const stopAnimating = () => {
    setIsAnimating(false);
    instance.canvas.select("#arrow-movement").style("display", "none");
  };

  return (
    <>
      <div
        ref={rootEl}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickPress}
      ></div>
      {isAnimating && (
        <div className="flex flex-col justify-center">
          <AnimatedPoint
            initialX={initialAnimationConfig.x}
            direction={initialAnimationConfig.direction}
            onXChange={handleAnimationXChange}
            equation={equation}
          />
          <button
            type="button"
            onClick={stopAnimating}
            className="w-32 mx-auto py-2 px-4 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Parar
          </button>
        </div>
      )}
    </>
  );
};

export default StateDiagram;
