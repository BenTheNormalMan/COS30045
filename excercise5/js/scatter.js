(function () {
  const sel = '#scatter';
  const svg = d3.select(sel)
    .append('svg')
    .attr('role', 'img')
    .attr('aria-label', 'Scatter: Energy vs star rating');

  const g  = svg.append('g');
  const gx = g.append('g').attr('class', 'axis x');
  const gy = g.append('g').attr('class', 'axis y');
  const pointsG = g.append('g').attr('class', 'points');

  let data = [];
  const margin = { top: 24, right: 24, bottom: 56, left: 64 }; // đủ chỗ cho axis labels

  // scales
  const x = d3.scaleLinear();
  const y = d3.scaleLinear();
  const r = d3.scaleSqrt();

  // load data
  d3.csv('data/Ex5_TV_energy.csv', d => ({
    model: d.model || `${d.brand ?? ''}-${d.screensize ?? ''}`,
    brand: d.brand,
    screen_tech: d.screen_tech,
    star_rating: +d.star2,
    energy_kwh_per_year: +d.energy_consumpt,
    screen_size_inch: +d.screensize
  })).then(raw => {
    data = raw.filter(d => isFinite(d.star_rating) && isFinite(d.energy_kwh_per_year));
    render();
  });

  function render() {
    const { width, height, innerWidth, innerHeight } = containerSize(sel, margin);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    g.attr('transform', `translate(${margin.left},${margin.top})`);

    // domains
    x.domain([0, 10]).range([0, innerWidth]); // 0→10 như yêu cầu
    y.domain([0, d3.max(data, d => d.energy_kwh_per_year)]).nice()
      .range([innerHeight, 0]);
    r.domain(d3.extent(data, d => d.screen_size_inch)).range([3, 10]);

    // axes
    gx.attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6));
    gy.call(d3.axisLeft(y).ticks(6));

    // ===== Axis labels (ngang với đường trục) =====
    // X label (giữa, dưới baseline X)
    gx.call(g => g.selectAll('text.axis-title-x').data([0]).join('text')
      .attr('class', 'axis-title-x')
      .attr('x', innerWidth / 2)
      .attr('y', 44)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Star Rating'));

    // Y label (xoay dọc, giữa chiều cao, sát trục Y)
    gy.call(g => g.selectAll('text.axis-title-y').data([0]).join('text')
      .attr('class', 'axis-title-y')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50) // chỉnh gần/xa trục theo margin trái
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Energy Consumption (kWh/year)'));

    // points
    const pts = pointsG.selectAll('circle').data(data, d => d.model);
    pts.join(
      enter => enter.append('circle')
        .attr('cx', d => x(d.star_rating))
        .attr('cy', d => y(d.energy_kwh_per_year))
        .attr('r', d => r(d.screen_size_inch))
        .attr('fill', '#56B4E9')          // 1 màu duy nhất
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .attr('opacity', 0.7)
        .on('mousemove', (ev, d) => {
          tooltip.show(
            `<strong>${d.brand} ${d.model}</strong><br/>⭐ ${d.star_rating} — ${d.energy_kwh_per_year} kWh/yr<br/>${d.screen_tech}, ${d.screen_size_inch}"`,
            ev.clientX, ev.clientY
          );
        })
        .on('mouseout', tooltip.hide),
      update => update
        .attr('cx', d => x(d.star_rating))
        .attr('cy', d => y(d.energy_kwh_per_year))
        .attr('r', d => r(d.screen_size_inch))
        .attr('fill', '#56B4E9'),        // giữ cùng 1 màu ở update
      exit => exit.remove()
    );
  }

  new ResizeObserver(render).observe(document.querySelector(sel));
})();
