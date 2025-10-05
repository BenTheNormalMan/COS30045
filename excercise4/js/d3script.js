/* ================================
   COS30045 – Exercise 4.2
   Manipulate & Append with D3
================================= */

// Step 1: Select and style a heading element (e.g., <h1>)
function step1_styleHeading() {
  d3.select("h1")
    .style("color", "green"); // required by brief
}

// Step 2: Append a <p> element into a <div>
function step2_appendParagraph() {
  d3.select("div")
    .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");
}

// Step 3: Append an <svg> element and add a rectangle (no attributes yet)
function step3_appendSvgAndRect() {
  const svg = d3.select("body")
    .append("svg")
    .attr("id", "demo-svg")
    .attr("width", 400)
    .attr("height", 150);

  // append rect (invisible, no attributes)
  svg.append("rect");
}

// Step 4: Add attributes to make the rectangle visible
function step4_makeRectVisible() {
  d3.select("#demo-svg")
    .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .style("fill", "green");
}

// Run all steps sequentially
document.addEventListener("DOMContentLoaded", () => {
  step1_styleHeading();
  step2_appendParagraph();
  step3_appendSvgAndRect();
  step4_makeRectVisible();
});
