import React, { useEffect, useMemo, useRef, useState } from "react";
import functionPlot from "function-plot";
import { FunctionPlotOptions } from "function-plot/dist/types";
import { EquilibriumPointStateComponent } from "../pages";

export interface FunctionPlotProps {
  options?: Omit<FunctionPlotOptions, "target">;
  roots?: EquilibriumPointStateComponent[];
}

const FunctionPlot: React.FC<FunctionPlotProps> = ({ options, roots = [] }) => {
  const rootEl = useRef(null);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (instance) {
      instance.canvas.selectAll("circle").remove();
      roots.map((r) => {
        instance.canvas
          .append("circle")
          .attr("r", 5)
          .attr("cx", instance.meta.xScale(r.x))
          .attr("cy", instance.meta.yScale(0))
          .style("fill", r.subType === "repeler" ? "red" : "green");
      });
    }
  }, [instance, roots]);

  useEffect(() => {
    try {
      const instance = functionPlot(
        Object.assign({}, options, { target: rootEl.current })
      );
      setInstance(instance);
    } catch (e) {
      console.error("error plotting graph");
    }
  }, [options]);

  return <div ref={rootEl} />;
};

export default FunctionPlot;
