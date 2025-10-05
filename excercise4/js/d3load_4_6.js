/* ============================================
   COS30045 – Exercise 4.6 (Scaling charts)
   Linear scale (x) + Band scale (y)
   ============================================ */

(function () {
  const csvPath = "data/excercise 2.csv";

  // Palette (khớp logo)
  const COLORS = {
    bar: "#E5953C",          // orange
    barStroke: "#6B4C2B",    // brown
    bg: "#FFF3CC"            // beige (nếu cần)
  };

  // Tên cột có thể khác nhau
  const COLS = {
    brand: ["Brand_Reg", "brand", "Brand", "Brand_Name"],
    count: ["Count", "count", "Total", "Freq"]
  };
  const pickCol = (cols, cands) => cands.find(c => cols.includes(c)) || null;

  // 1) Tạo SVG (viewBox nhỏ để… bắt buộc scale hoạt động)
  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("viewBox", "0 0 500 1600")          // <= như hướng dẫn
    .style("border", "1px solid #6B4C2B");

  // Một nhóm chứa bars (giúp dễ transform sau này nếu cần)
  const g = svg.append("g");

  // 2) Đọc CSV, chuẩn hóa dữ liệu
  d3.csv(csvPath, d => d)
    .then(raw => {
      if (!raw || !raw.length) {
        console.error("❌ CSV empty.");
        return;
      }

      const columns = raw.columns || Object.keys(raw[0]);
      const brandCol = pickCol(columns, COLS.brand);
      const countCol = pickCol(columns, COLS.count);

      if (!brandCol) {
        console.error("❌ Không tìm thấy cột brand. Columns:", columns);
        return;
      }

      let data;
      if (countCol) {
        // CSV đã tổng hợp
        data = raw
          .map(r => ({ brand: String(r[brandCol]).trim(), count: +r[countCol] }))
          .filter(d => d.brand && Number.isFinite(d.count));
      } else {
        // CSV raw -> group bằng D3 (đếm số mẫu theo brand)
        const roll = d3.rollups(
          raw,
          v => v.length,
          r => String(r[brandCol]).trim()
        );
        data = roll.map(([brand, count]) => ({ brand, count }));
      }

      // Sắp xếp giảm dần cho dễ nhìn
      data = d3.sort(data, d => -d.count);

      // 3) Tạo scales (bám sát đề)
      // Range theo viewBox hiện tại:
      const chartWidth = 480;   // chừa ~20px mép phải
      const chartHeight = 100; // cao để chứa nhiều nhãn (mỗi bar 1 band)

      const xScale = d3.scaleLinear()
        // domain min luôn 0, max = giá trị lớn nhất hiện có
        .domain([0, d3.max(data, d => d.count)])
        .range([0, chartWidth]);        // dữ liệu -> pixel theo chiều ngang

      const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand)) // 1 ô band cho mỗi brand
        .range([0, chartHeight])        // trải đều theo chiều dọc
        .paddingInner(0.08)             // thêm khoảng cách giữa các bar
        .paddingOuter(0.04);

      // 4) Vẽ bars (width theo xScale, y theo yScale)
      g.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", 0)                                  // x cố định: 0
        .attr("y", d => yScale(d.brand))               // vị trí theo band
        .attr("width", d => xScale(d.count))           // scale chiều ngang
        .attr("height", yScale.bandwidth())            // cao = band size
        .attr("rx", 2)
        .attr("fill", COLORS.bar)
        .attr("stroke", COLORS.barStroke)
        .attr("stroke-width", 1.5);

      // 5) (Tuỳ chọn) viền cap và ghi log kiểm tra – đúng spirit 4.6
      console.groupCollapsed("4.6 – Scales");
      console.log("Rows:", data.length);
      console.log("xScale domain:", xScale.domain());
      console.log("xScale range:", xScale.range());
      console.log("yScale domain (sample):", yScale.domain().slice(0, 10));
      console.log("yScale range:", yScale.range());
      console.groupEnd();
    })
    .catch(err => console.error("❌ Error loading CSV:", err));
})();
