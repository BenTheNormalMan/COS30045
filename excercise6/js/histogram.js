let svg, innerChart, bars, bottomAxisG, leftAxisG;

function drawHistogram(data){
  svg = d3.select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role","img")
    .attr("aria-label","Histogram of energy consumption");

  innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const bins = binGenerator(data);

  const minX = bins[0].x0;
  const maxX = bins[bins.length - 1].x1;
  const maxLen = d3.max(bins, d => d.length);

  xScale.domain([minX, maxX]).range([0, innerWidth]);
  yScale.domain([0, maxLen]).range([innerHeight, 0]).nice();

  bars = innerChart.selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("class","bar")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor);

  const bottomAxis = d3.axisBottom(xScale);
  bottomAxisG = innerChart.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(bottomAxis);

  svg.append("text").attr("class","axis-label").attr("text-anchor","end")
    .attr("x", width - 4).attr("y", height - 8)
    .text("Energy consumption (kWh/year)");

  const leftAxis = d3.axisLeft(yScale).ticks(8);
  leftAxisG = innerChart.append("g").call(leftAxis);

  svg.append("text").attr("class","axis-label").attr("x", 8).attr("y", 18)
    .text("Frequency");
}
