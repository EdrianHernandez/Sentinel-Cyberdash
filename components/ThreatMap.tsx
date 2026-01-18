import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ThreatPoint {
  id: number;
  long: number;
  lat: number;
  intensity: number; // 0-1
}

export const ThreatMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Draw Map
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;
    
    // Projection
    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const graticule = d3.geoGraticule();

    // 1. Draw Grid (The "Cyber" Earth)
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#0e7490") // cyan-700
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.3);

    svg.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#06b6d4") // cyan-500
      .attr("stroke-width", 1.5);


    // 2. Generate Random Threat Points
    const generateThreats = (count: number): ThreatPoint[] => {
      const threats: ThreatPoint[] = [];
      for(let i=0; i<count; i++) {
        threats.push({
          id: i,
          long: (Math.random() * 360) - 180,
          lat: (Math.random() * 140) - 70, // Avoid poles
          intensity: Math.random()
        });
      }
      return threats;
    };

    const threats = generateThreats(15);

    // 3. Render Threats with pulse effect
    const g = svg.append("g");
    
    // Pulse Circles
    g.selectAll(".pulse")
      .data(threats)
      .enter()
      .append("circle")
      .attr("class", "pulse")
      .attr("cx", d => projection([d.long, d.lat])?.[0] || 0)
      .attr("cy", d => projection([d.long, d.lat])?.[1] || 0)
      .attr("r", 2)
      .attr("fill", "none")
      .attr("stroke", d => d.intensity > 0.8 ? "#ef4444" : "#eab308") // Red or Yellow
      .attr("stroke-width", 1)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("r", 20)
      .style("opacity", 0)
      .on("end", function repeat() {
         d3.select(this)
           .attr("r", 2)
           .style("opacity", 1)
           .transition()
           .duration(2000)
           .ease(d3.easeLinear)
           .attr("r", 20)
           .style("opacity", 0)
           .on("end", repeat);
      });

    // Core Points
    g.selectAll(".point")
      .data(threats)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.long, d.lat])?.[0] || 0)
      .attr("cy", d => projection([d.long, d.lat])?.[1] || 0)
      .attr("r", 3)
      .attr("fill", d => d.intensity > 0.8 ? "#ef4444" : "#eab308")
      .attr("filter", "url(#glow)");

    // Defs for Glow
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  }, [dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[300px] relative bg-slate-950/30">
      <svg ref={svgRef} className="w-full h-full absolute inset-0" />
      
      {/* Overlay Scan Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};