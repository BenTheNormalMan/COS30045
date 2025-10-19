(function initDonut() {
  const sel = '#donut';
  const svg = d3.select(sel)
    .append('svg')
    .attr('role', 'img')
    .attr('aria-label', 'Donut: Avg energy by screen tech');

  const g      = svg.append('g');
  const arcsG  = g.append('g').attr('class', 'arcs');    // nhóm lát
  const labelsG= g.append('g').attr('class', 'labels');  // nhóm nhãn (sẽ raise() lên trên)

  let data = [];
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };

  d3.csv('data/Ex5_TV_energy_Allsizes_byScreenType.csv', d => ({
    screen_tech: d.Screen_Tech,
    energy_metric: +d["Mean(Labelled energy consumption (kWh/year))"]
  })).then(raw => {
    data = raw.filter(d => isFinite(d.energy_metric) && d.energy_metric > 0);
    sharedColor.domain([...new Set(data.map(d => d.screen_tech))]);
    render();
    // (tuỳ chọn) legend
    buildLegend('#donut-legend', sharedColor.domain(), sharedColor);
  });

  function render() {
    const { width, height, innerWidth, innerHeight } = containerSize(sel, margin);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    g.attr('transform', `translate(${width/2},${height/2})`);

    const outerR = Math.min(innerWidth, innerHeight) / 2;
    const innerR = outerR * 0.55;

    // Arc dùng để vẽ lát
    const arc = d3.arc()
      .innerRadius(innerR)
      .outerRadius(outerR);

    // Arc đặc biệt để lấy centroid ở **giữa lát**
    const midR = (innerR + outerR) / 2;
    const arcCenter = d3.arc()
      .innerRadius(midR)
      .outerRadius(midR);

    const pie = d3.pie()
      .value(d => d.energy_metric)
      .sort(null);

    // ---- VẼ LÁT ----
    const arcs = arcsG.selectAll('path.slice')
      .data(pie(data), d => d.data.screen_tech);

    arcs.join(
      enter => enter.append('path')
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', d => sharedColor(d.data.screen_tech))
        .attr('stroke', '#0f1216')
        .attr('stroke-width', 2)
        .attr('opacity', 0.92)
        .on('mousemove', (ev, d) => {
          const p = d.data;
          tooltip.show(`<strong>${p.screen_tech}</strong><br/>Avg: ${p.energy_metric.toFixed(0)} kWh`,
            ev.clientX, ev.clientY);
        })
        .on('mouseout', tooltip.hide),
      update => update.attr('d', arc).attr('fill', d => sharedColor(d.data.screen_tech)),
      exit => exit.remove()
    );

    // Đảm bảo NHÃN ở **trên** lát
    labelsG.raise();

    // ---- NHÃN (trắng, halo, đặt đúng giữa mỗi lát) ----
    const total = d3.sum(data, x => x.energy_metric);
    const labelData = pie(data).filter(d => (d.data.energy_metric / total) >= 0.05); // ẩn lát <5%

    const labels = labelsG.selectAll('text.slice-label')
      .data(labelData, d => d.data.screen_tech);

    labels.join(
      enter => enter.append('text')
        .attr('class', 'slice-label')
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${arcCenter.centroid(d)})`)  // giữa lát
        .attr('opacity', 1)
        .attr('fill', '#FFFFFF')
        .attr('font-size', 13)
        .attr('font-weight', 700)
        // halo để nổi trên mọi nền
        .style('paint-order', 'stroke')
        .style('stroke', '#000')
        .style('stroke-width', 3)
        .style('stroke-opacity', 0.35)
        .style('pointer-events', 'none')
        .text(d => `${d.data.screen_tech} (${d3.format('.0%')(d.data.energy_metric / total)})`),
      update => update
        .attr('transform', d => `translate(${arcCenter.centroid(d)})`)
        .text(d => `${d.data.screen_tech} (${d3.format('.0%')(d.data.energy_metric / total)})`),
      exit => exit.remove()
    );
  }

  new ResizeObserver(render).observe(document.querySelector(sel));
})();
