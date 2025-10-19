// Dimensions & inner chart pattern
const margin = { top: 40, right: 30, bottom: 50, left: 60 };
const width  = 900;
const height = 460;
const innerWidth  = width - margin.left - margin.right;
const innerHeight = height - margin.top  - margin.bottom;

// Colours
const barColor = "#60646c";
const bodyBackgroundColor = "#e6fbf7";

// Histogram scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Bin generator for histogram
const binGenerator = d3.bin().value(d => +d.energyConsumption);

// Filter config
const filters_screen = [
  { id: "all",  label: "ALL",  isActive: true  },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

// ---- 6.2 additions ----
// Separate inner chart for scatterplot
let innerChartS;

// Scales for scatterplot (x: star, y: energy)
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Tooltip config
const tooltipWidth = 66;
const tooltipHeight = 40;

// Colour scale for screen type (hues)
const colorScale = d3.scaleOrdinal()
  .domain(["LED","LCD","OLED"])
  .range(["#1f77b4","#2ca02c","#d62728"]);
