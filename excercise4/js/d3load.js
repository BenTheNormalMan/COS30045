/* =========================================
   COS30045 – Ex 4.4 -> 4.5
   Load CSV -> (optional) aggregate -> draw bars
   Palette: beige–orange–brown
========================================= */

(function () {
  const csvPath = "data/excercise 2.csv";

  const COLS = {
    brand: ["Brand_Reg", "brand", "Brand", "Brand_Name"],
    count: ["Count", "count", "Total", "Freq"]
  };
  const pickCol = (columns, candidates) =>
    candidates.find(c => columns.includes(c)) || null;

  d3.csv(csvPath, d => d)
    .then(raw => {
      if (!raw?.length) {
        console.error("❌ CSV empty / not found");
        return;
      }

      const columns = raw.columns || Object.keys(raw[0]);
      const brandCol = pickCol(columns, COLS.brand);
      const countCol = pickCol(columns, COLS.count);
      if (!brandCol) {
        console.error("❌ Missing brand column. Columns:", columns);
        return;
      }

      let data;
      if (countCol) {
        // CSV đã tổng hợp sẵn
        data = raw
          .map(r => ({ brand: String(r[brandCol]).trim(), count: +r[countCol] }))
          .filter(d => d.brand && Number.isFinite(d.count));
        console.groupCollapsed("📦 Aggregated data (from CSV)");
      } else {
        // CSV dạng raw -> group trong D3
        const roll = d3.rollups(
          raw,
          v => v.length,
          r => String(r[brandCol]).trim()
        );
        data = roll.map(([brand, count]) => ({ brand, count }))
                   .filter(d => d.brand && Number.isFinite(+d.count));
        console.groupCollapsed("🧮 Aggregated data (grouped in D3)");
      }

      // ===== Ex 4.4: inspect =====
      console.log("✅ Aggregated data:", data);
      console.table(data.slice(0, 10));
      console.log("Rows:", data.length);
      console.log("Unique brands:", new Set(data.map(d => d.brand)).size);
      console.log("Max:", d3.max(data, d => d.count));
      console.log("Min:", d3.min(data, d => d.count));
      console.log("Extent:", d3.extent(data, d => d.count));

      const sorted = d3.sort(data, d => -d.count);
      console.log("Sorted (top 10):", sorted.slice(0, 10));
      console.groupEnd();

      // ===== Ex 4.5: draw bars (không scale) =====
      createBarChart(sorted);
    })
    .catch(err => console.error("❌ Error loading CSV:", err));

  // ---------- Ex 4.5: bind + draw ----------
  function createBarChart(data) {
    // Kích thước "thô" (chưa scale). 4.6 sẽ thêm scales.
    const viewW = 1200;
    const viewH = 600;

    const barHeight = 20;       // hằng
    const gap = 6;              // khoảng cách giữa bars
    const leftPad = 0;          // theo đề 4.5 x = 0; (để dành chỗ label cho 4.7 sau)
    const topPad = 12;

    // dọn container & tạo svg
    const wrap = d3.select(".responsive-svg-container");
    if (wrap.empty()) {
      console.error("❌ Missing .responsive-svg-container in HTML");
      return;
    }
    wrap.selectAll("*").remove(); // clear mỗi lần reload

    const svg = wrap.append("svg")
      .attr("viewBox", `0 0 ${viewW} ${viewH}`)
      .style("border", "1px dashed #6B4C2B")
      .style("background", "#FFF3CC22"); // beige nhạt

    // 1) Bind data -> rect
    const bars = svg.selectAll("rect")
      .data(data, d => d.brand)   // key theo brand
      .join("rect")
      .attr("class", d => `bar bar-${d.count}`);

    // 2) Thêm thuộc tính width/height (width = count, height = const)
    bars
      .attr("x", leftPad)                                 // x cố định (0)
      .attr("y", (_d, i) => topPad + i * (barHeight + gap))// y theo index
      .attr("width", d => d.count)                        // ❗ KHÔNG scale ở 4.5
      .attr("height", barHeight)
      .attr("rx", 3)
      .attr("fill", "#E5953C")                            // cam
      .attr("stroke", "#6B4C2B")                          // nâu
      .attr("stroke-width", 1.5);

    // Tự kéo chiều cao viewBox vừa số bar (cho đẹp hơn)
    const neededH = topPad + data.length * (barHeight + gap) + 12;
    svg.attr("viewBox", `0 0 ${viewW} ${Math.max(neededH, 120)}`);

    console.log(`createBarChart: drew ${data.length} bars (no scales yet).`);
  }
})();
