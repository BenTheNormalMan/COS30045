/* ================================
   COS30045 – Exercise 4.7 (Labels)
   Group <g> per row + safe label position
================================== */
(function () {
  const csvPath = "data/excercise 2.csv";

  // Column name helpers (your file may vary)
  const COLS = {
    brand: ["Brand_Reg", "brand", "Brand", "Brand_Name"],
    count: ["Count", "count", "Total", "Freq"]
  };
  const pickCol = (columns, candidates) =>
    candidates.find(c => columns.includes(c)) || null;

  d3.csv(csvPath, d => d)
    .then(raw => {
      if (!raw?.length) throw new Error("CSV empty");

      const columns = raw.columns || Object.keys(raw[0]);
      const brandCol = pickCol(columns, COLS.brand);
      const countCol = pickCol(columns, COLS.count);
      if (!brandCol) throw new Error("No brand column found.");

      // Aggregate if needed
      let data;
      if (countCol) {
        data = raw.map(r => ({
          brand: String(r[brandCol]).trim(),
          count: +r[countCol]
        }));
      } else {
        const roll = d3.rollups(raw, v => v.length, r => String(r[brandCol]).trim());
        data = roll.map(([brand, count]) => ({ brand, count }));
      }

      // Clean + sort
      data = data
        .filter(d => d.brand && Number.isFinite(+d.count))
        .sort((a, b) => d3.descending(a.count, b.count));

      createBarChart(data);
    })
    .catch(err => console.error("❌ CSV load error:", err));

  function createBarChart(data) {
    const svg = d3.select("#chart-4-7");
    // read viewBox to keep responsive
    const [ , , VW, VH ] = svg.attr("viewBox").split(/\s+/).map(Number);

    // margins give room for labels on both sides
    const margin = { top: 16, right: 80, bottom: 16, left: 130 };
    const width  = VW - margin.left - margin.right;
    const height = VH - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxCount = d3.max(data, d => d.count) ?? 0;

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, maxCount]).nice()
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.brand))
      .range([0, height])
      .paddingInner(0.2)
      .paddingOuter(0.1);

    // One <g> per row so rect + texts move together
    const row = g.selectAll("g.bar-row")
      .data(data)
      .join("g")
      .attr("class", "bar-row")
      .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // Bar
    row.append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", d => xScale(d.count))
      .attr("rx", 6);

    // Brand label (to the left)
    row.append("text")
      .attr("class", "bar-label")
      .attr("x", -10)                                  // little gap from bar start
      .attr("y", yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => d.brand);

    // Count label (auto inside/outside)
    row.append("text")
      .attr("class", "bar-value")
      .text(d => d.count)
      .attr("y", yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", function (d) {
        // if the outside position fits, put outside; else inside
        const outsideX = xScale(d.count) + 8;
        const fitsOutside = outsideX <= width - 6;
        d.__inside = !fitsOutside;
        return fitsOutside ? "start" : "end";
      })
      .attr("x", function (d) {
        return d.__inside
          ? Math.max(12, xScale(d.count) - 8)          // inside, a bit left of bar end
          : xScale(d.count) + 8;                        // outside, a bit right of bar end
      })
      .classed("inside", d => d.__inside)
      .classed("outside", d => !d.__inside);
  }
})();
