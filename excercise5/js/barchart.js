(function initBar() {
  const sel = '#bar';
  const svg = d3.select(sel)
    .append('svg')
    .attr('role', 'img')
    .attr('aria-label', 'Bar: Avg energy (55-inch) by tech');

  const g  = svg.append('g');
  const gx = g.append('g').attr('class', 'axis x');
  const gy = g.append('g').attr('class', 'axis y');
  const barsG   = g.append('g').attr('class', 'bars');
  const labelsG = g.append('g').attr('class', 'bar-labels');

  let data = [];
  const margin = { top: 24, right: 24, bottom: 64, left: 64 };

  // Load data
  d3.csv('data/Ex5_TV_energy_55inchtv_byScreenType.csv', d => ({
    screen_tech: d.Screen_Tech,
    energy_kwh_avg: +d["Mean(Labelled energy consumption (kWh/year))"]
  })).then(raw => {
    data = raw.filter(d => isFinite(d.energy_kwh_avg));
    sharedColor.domain(data.map(d => d.screen_tech));
    render();
    // Legend (có thể bỏ nếu không cần)
    buildLegend('#bar-legend', sharedColor.domain(), sharedColor);
  });

  function render() {
    const { width, height, innerWidth, innerHeight } =
      containerSize(sel, margin);

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    g.attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.screen_tech))
      .range([0, innerWidth])
      .padding(0.15);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy_kwh_avg)]).nice()
      .range([innerHeight, 0]);

    // Axes
    gx.attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));
    gy.call(d3.axisLeft(y).ticks(6));

    // ----- Axis labels ngang với đường trục -----
    // X label (ở giữa, ngay dưới baseline X)
    gx.call(g => g.selectAll('text.axis-title-x').data([0]).join('text')
      .attr('class', 'axis-title-x')
      .attr('x', innerWidth / 2)
      .attr('y', 44)                 // điều chỉnh để vừa sát baseline
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Screen Technology'));

    // Y label (xoay 90°, căn giữa, sát đường Y)
    gy.call(g => g.selectAll('text.axis-title-y').data([0]).join('text')
      .attr('class', 'axis-title-y')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -48)                // số âm lớn hơn -> gần trục Y hơn (phụ thuộc margin)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Mean Energy Consumption (kWh/year)'));

    // ----- Bars -----
    const bars = barsG.selectAll('rect').data(data, d => d.screen_tech);

    bars.join(
      enter => enter.append('rect')
        .attr('x', d => x(d.screen_tech))
        .attr('y', d => y(d.energy_kwh_avg))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.energy_kwh_avg))
        .attr('fill', d => sharedColor(d.screen_tech))
        .attr('opacity', 0.85)
        .on('mousemove', (ev, d) => {
          tooltip.show(
            `<strong>${d.screen_tech}</strong><br/>${d.energy_kwh_avg.toFixed(0)} kWh/yr`,
            ev.clientX, ev.clientY
          );
        })
        .on('mouseover', function () { d3.select(this).attr('opacity', 1); })
        .on('mouseout',  function () { d3.select(this).attr('opacity', 0.85); }),
      update => update
        .attr('x', d => x(d.screen_tech))
        .attr('y', d => y(d.energy_kwh_avg))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.energy_kwh_avg))
        .attr('fill', d => sharedColor(d.screen_tech)),
      exit => exit.remove()
    );

    // ----- Data labels trên đỉnh mỗi cột -----
    const fmt = d3.format(',.0f');
    const valueLabels = labelsG.selectAll('text.value')
      .data(data, d => d.screen_tech);

    valueLabels.join(
      enter => enter.append('text')
        .attr('class', 'value')
        .attr('x', d => x(d.screen_tech) + x.bandwidth() / 2)
        .attr('y', d => y(d.energy_kwh_avg) - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', 12)
        .text(d => `${fmt(d.energy_kwh_avg)}`),
      update => update
        .attr('x', d => x(d.screen_tech) + x.bandwidth() / 2)
        .attr('y', d => y(d.energy_kwh_avg) - 6)
        .text(d => `${fmt(d.energy_kwh_avg)}`),
      exit => exit.remove()
    );
  }

  new ResizeObserver(render).observe(document.querySelector(sel));
})();
