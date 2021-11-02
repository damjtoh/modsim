import { defaultVariables, defaultFunctions, resolve } from "equation-resolver";
import * as math from "mathjs";
import Head from "next/head";
import React, { ChangeEvent, useState } from "react";
import { defaultErrorHandler, Equation, EquationOptions } from "react-equation";
import dynamic from "next/dynamic";
import { useMutation } from "react-query";
import axios from "axios";

const FunctionPlot = dynamic(() => import("../components/FunctionPlot"), {
  ssr: false,
});
const StateDiagram = dynamic(() => import("../components/StateDiagram"), {
  ssr: false,
});

export type StateDiagramComponent =
  | RangeStateComponent
  | EquilibriumPointStateComponent;

export type RangeStateComponent = {
  type: "RANGE";
  range: [number, number];
  movement: "RIGHT" | "LEFT";
};
export type EquilibriumPointStateComponent = {
  type: "EQ_POINT";
  subType: "attractor" | "repeler";
  x: number;
};

export default function Home() {
  const [equationValue, setEquationValue] = useState("y = x^2 - 1");
  const [components, setComponents] = useState([]);
  const [domain, setDomain] = useState([-10, 10]);
  const handleEquationChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEquationValue(e.target.value);

  const { mutate: calculate, isLoading } = useMutation(
    (eq: string) =>
      axios.post("/api/dynamic", {
        eq,
        domain,
      }),
    {
      onSuccess: ({ data }) => {
        setComponents(data.result);
      },
    }
  );
  const eqPoints = components.filter((c) => c.type === "EQ_POINT");
  const handleCalculate = () => {
    setComponents([]);
    calculate(equationValue);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Sistemas dinámicos de orden 1 autonomos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Container */}
      <div className="flex flex-col flex-1 justify-around">
        <h1 className="text-2xl text-center">
          Sistemas dinámicos de orden 1 autonomos
        </h1>
        <div className="generate mt-2 flex flex-row items-center justify-between">
          <label className="flex flex-row items-center w-full">
            Función
            <input
              type="text"
              value={equationValue}
              className="border b-gray-200 rounded-lg ml-2 p-2 w-full"
              onChange={handleEquationChange}
            />
          </label>
          <button
            className="w-4/12 py-2 my-2 px-4 ml-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            onClick={handleCalculate}
          >
            Calcular
          </button>
        </div>
        <div className="flex flex-row justify-center text-xl">
          <EquationOptions
            variables={defaultVariables}
            functions={defaultFunctions}
            errorHandler={defaultErrorHandler}
          >
            <Equation value={equationValue} />
          </EquationOptions>
        </div>
        <div>
          <FunctionPlot
            roots={eqPoints}
            options={{
              yAxis: { domain: [-2, 8] },
              grid: true,
              disableZoom: true,
              data: [
                {
                  fn: equationValue,
                },
              ],
            }}
          />
        </div>
        {components.length > 0 && (
          <div>
            <h3 className="text-center text-xl mt-6">Diagrama de fases</h3>
            <StateDiagram components={components} equation={equationValue} />
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center mt-auto w-full h-12 border-t">
        Damián Crespi
        <a
          className="flex items-center justify-center ml-2 underline"
          href="https://github.com/damjtoh/modsim"
          target="_blank"
          rel="noopener noreferrer"
        >
          Código
        </a>
      </footer>
    </div>
  );
}
