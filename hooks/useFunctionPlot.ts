import functionPlot from "function-plot";
import { useEffect, useState } from "react";

const useFunctionPlot = (rootElRef, options) => {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (rootElRef.current) {
      try {
        const instance = functionPlot({
          ...options,
          target: rootElRef.current,
        });
        setInstance(instance);
      } catch (e) {
        console.error("error plotting graph: ", e);
      }
    }
  }, [rootElRef.current, options]);

  return { instance };
};

export default useFunctionPlot;
