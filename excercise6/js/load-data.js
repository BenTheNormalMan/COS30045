async function loadData() {
  const data = await d3.csv("data/Ex6_TVdata.csv", d => ({
    energyConsumption: +d.energyConsumption,
    screenTech: d.screenTech?.trim(),
    screenSize: +d.screenSize,
    star: +d.star
  }));
  console.log("Loaded rows:", data.length, data.slice(0,5));
  drawHistogram(data);
  drawScatterplot(data);
  populateFilters(data);
  createTooltip();
  handleMouseEvents();
}
loadData();
