// src/components/LocalConsumptionMap.jsx
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import LocalMap from "../data/countries-110m.json";

/* Data */
const countryData = {
  ARG: { value: 199, story: "Mate is the national drink of Argentina." },
  BRA: { value: 120, story: "Brazil enjoys chimarrão." },
  URY: { value: 190, story: "Uruguay has one of the highest per-capita consumptions." },
  PRY: { value: 160, story: "Paraguay drinks tereré in summer." },
  SYR: { value: 150, story: "Imported by immigrant communities, now part of Syrian tea culture." },
  BOL: { value: 180, story: "Bolivia drinks mate for both culture and health." },
  CHL: { value: 150, story: "Chile has a strong mate culture." },
  USA: { value: 30, story: "Mate is trendy in US wellness circles." },
  ESP: { value: 60, story: "Spain is the largest importer in Europe." },
  ITA: { value: 30, story: "Mate is imported for health-conscious consumers." },
  DEU: { value: 50, story: "Germany has a growing interest in mate." },
  ARE: { value: 40, story: "United Arab Emirates enjoys mate as a trendy beverage." },
  COL: { value: 60, story: "Colombia has a small but growing mate market." },
  LBN: { value: 100, story: "Lebanon has a unique blend of mate with local herbs." },
  GBR: { value: 25, story: "In the UK, mate is niche but growing among herbal tea enthusiasts." },

  IND: { value: 15, story: "India is discovering Yerba Mate as a healthy alternative to tea and coffee.", color: "#F26323" },
};

/* Numeric ID → ISO Alpha-3 mapping */
const idToISO = {
  "032": "ARG",
  "068": "BOL",
  "076": "BRA",
  "152": "CHL",
  "600": "PRY",
  "760": "SYR",
  "858": "URY",
  "840": "USA",
  "724": "ESP",
  "380": "ITA",
  "276": "DEU",
  "784": "ARE",
  "170": "COL",
  "422": "LBN",
  "356": "IND", // India
    "826": "GBR" // United Kingdom

};

/* ISO Alpha-3 → Alpha-2 mapping for flags */
const iso3To2 = {
  ARG: "ar",
  BRA: "br",
  URY: "uy",
  PRY: "py",
  SYR: "sy",
  BOL: "bo",
  CHL: "cl",
  USA: "us",
  ESP: "es",
  ITA: "it",
  DEU: "de",
  ARE: "ae",
  COL: "co",
  LBN: "lb",
  IND: "in",
    GBR: "gb" // United Kingdom

};

/* Color scale */
const colorScale = scaleLinear()
  .domain([0, 200])
  .range(["#7A9D3E", "#2F3B28"]);

function getTooltipPosition(x, y, maxW = 300, maxH = 200, offset = 12) {
  let left = x + offset;
  let top = y + offset;
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  if (left + maxW > ww) left = x - offset - maxW;
  if (top + maxH > wh) top = y - offset - maxH;
  return { left: Math.max(8, left), top: Math.max(8, top) };
}

export default function LocalConsumptionMap() {
  const [tooltip, setTooltip] = useState(null);

  const getCountryColor = (isoOrId) => {
    const iso = idToISO[isoOrId] || isoOrId;
    const data = countryData[iso];
    if (data?.color) return data.color; // India special color
    return data && data.value !== null ? colorScale(data.value) : "#F3EAD0";
  };

  const handleEnter = (evt, geo) => {
    const rawId =
      geo.properties?.ISO_A3 ||
      geo.properties?.iso_a3 ||
      geo.properties?.ISO_A3_EH ||
      geo.id;

    const iso = idToISO[rawId] || rawId;
    const name = geo.properties?.name || "Unknown";
    const data = countryData[iso];
    const flagCode = iso3To2[iso];

    setTooltip({
      name,
      consumption: data?.value ?? null,
      story: data?.story ?? null,
      flagUrl: flagCode ? `https://flagcdn.com/w40/${flagCode}.png` : null,
      x: evt.clientX,
      y: evt.clientY,
    });
  };

  const handleMove = (evt) => {
    setTooltip((prev) =>
      prev ? { ...prev, x: evt.clientX, y: evt.clientY } : prev
    );
  };

  const handleLeave = () => setTooltip(null);

  return (
    <div className="py-[1px]" style={{ position: "relative" }}>
      {tooltip && (() => {
        const { left, top } = getTooltipPosition(tooltip.x, tooltip.y);
        return (
          <div
            style={{
              position: "fixed",
              left,
              top,
              background: "#EADBA2",
              color: "#1b1b1b",
              padding: "5px",
              borderRadius: 8,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              pointerEvents: "none",
              fontSize: 13,
              maxWidth: 300,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {tooltip.flagUrl && (
                <img
                  src={tooltip.flagUrl}
                  alt={`${tooltip.name} flag`}
                  style={{ width: 24, height: 16, borderRadius: 2 }}
                />
              )}
              <strong>{tooltip.name}</strong>
            </div>
            {tooltip.consumption !== null && (
              <>
                <div>Consumption: {tooltip.consumption}</div>
                <p style={{ margin: "4px 0 0" }}>{tooltip.story}</p>
              </>
            )}
          </div>
        );
      })()}

      <ComposableMap
        projectionConfig={{ scale: 200 }} // slightly bigger than before
        style={{ width: "100%", height: "98vh" }} // taller map
      >
        <Geographies geography={LocalMap}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawId =
                geo.properties?.ISO_A3 ||
                geo.properties?.iso_a3 ||
                geo.properties?.ISO_A3_EH ||
                geo.id;

              const color = getCountryColor(rawId);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => handleEnter(e, geo)}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  style={{
                    default: {
                      fill: color,
                      stroke: "#FFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#EADBA2",
                      stroke: "#FFF",
                      strokeWidth: 0.8,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { fill: color, outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
