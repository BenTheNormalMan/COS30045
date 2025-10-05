/* ===========================================
   COS30045 – Exercise 4.3 D3 Set Up
   Steps:
    1. Delete old code (keep D3 library only)
    2. Add responsive container
    3. Create SVG within div
    4. Add test rectangle
=========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Step 2 – select the responsive container and append SVG
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600") // scalable canvas
    .style("border", "1px solid #6B4C2B"); // PowerHub brown for visibility

  // Step 3 – add a test rectangle
  svg.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "#E5953C"); // PowerHub orange

  // Optional label for checking
  svg.append("text")
    .attr("x", 12)
    .attr("y", 45)
    .text("Test bar (rect x:10 y:10 width:414 height:16)")
    .style("fill", "#3D2A15")
    .style("font-size", "14px");
});
