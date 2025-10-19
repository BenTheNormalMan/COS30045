// scatterplot.js (NO-JITTER, points stack vertically per star column)
let svgS, bottomAxisGS, leftAxisGS; // KHÔNG khai báo lại innerChartS!

function drawScatterplot(data){
  // SVG & inner chart (riêng cho scatter)
  svgS = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role","img")
    .attr("aria-label","Scatterplot: Energy vs Star rating");

  innerChartS = svgS.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales: x 0..8 (nguyên), y 0..2600 (theo hình mẫu, tự nới nếu data lớn hơn)
  const xMin = 0, xMax = 8;
  const yMaxTarget = 2600;
  const yMaxData = d3.max(data, d => d.energyConsumption);
  const yMax = Math.max(yMaxTarget, yMaxData || 0);

  xScaleS.domain([xMin, xMax]).range([0, innerWidth]).nice();
  yScaleS.domain([0, yMax]).range([innerHeight, 0]).nice();

  // ----- POINTS: NO JITTER -----
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => xScaleS(d.star))                       // không cộng jitter
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 3)                                           // có thể giảm 2.5 nếu muốn
      .attr("opacity", 0.6)                                   // dễ quan sát khi chồng
      .attr("fill", d => colorScale(d.screenTech));           // LED/LCD/OLED theo shared-constants

  // Axis X: ticks nguyên 0..8
  bottomAxisGS = innerChartS.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleS).ticks(8).tickFormat(d3.format("d")));

  svgS.append("text")
    .attr("class","axis-label")
    .attr("text-anchor","end")
    .attr("x", width - 4)
    .attr("y", height - 8)
    .text("Star Rating");

  // Axis Y
  leftAxisGS = innerChartS.append("g")
    .call(d3.axisLeft(yScaleS).ticks(10));

  svgS.append("text")
    .attr("class","axis-label")
    .attr("x", 8)
    .attr("y", 18)
    .text("Labeled Energy Consumption (kWh/year)");

  // Legend bên phải (giống hình mẫu)
  const legend = svgS.append("g")
    .attr("transform", `translate(${width - margin.right - 90}, ${margin.top + 10})`);
  const types = colorScale.domain(); // ["LED","LCD","OLED"]
  const itemH = 18;
  types.forEach((t,i) => {
    const g = legend.append("g").attr("transform", `translate(0, ${i * itemH})`);
    g.append("rect").attr("width",10).attr("height",10).attr("fill",colorScale(t));
    g.append("text").attr("x",16).attr("y",9).attr("font-size",12).text(t);
  });
}
