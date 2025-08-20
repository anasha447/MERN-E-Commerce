import React from "react";
import WorldMap from "../components/world-map";
import WhatIsMate from "../components/whatismate";
import IndianMate from "../components/indian-mate";
import PreparationSteps from "../components/mate-preparation";
import MateTimeline from "../components/time-line-mate";
function ConsumptionMap () {
  return (
    <div className="bg-white min-h-screen">
<WhatIsMate />
      <MateTimeline />

      <h1 className="text-center font-heading text-black text-2xl font-bold my-4">
        Yerba Mate Consumption Map
      </h1>
      <WorldMap />
      <IndianMate/>
      <PreparationSteps/>

    </div>
  );
}

export default ConsumptionMap;
