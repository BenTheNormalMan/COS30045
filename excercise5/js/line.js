(function () {
  const sel = '#line';
  const svg = d3.select(sel).append('svg')
    .attr('role', 'img')
    .attr('aria-label', 'Line: Spot power prices over time');

  const g  = svg.append('g');
  const gx = g.append('g').attr('class', 'axis x');
  const gy = g.append('g').attr('class', 'axis y');
  const linesG = g.append('g').attr('class', 'lines');

  let series = [];
  const margin = { top: 24, right: 100, bottom: 56, left: 60 };

  d3.csv('data/Ex5_ARE_Spot_Prices.csv').then(raw => {
    const parseYear = d3.timeParse('%Y');
    const avgCol = 'Average Price (notTas-Snowy)';

    series = [{
      id: 'Average',
      values: raw.map(d => ({
        date: parseYear(String(d.Year)),
        value: +d[avgCol]
      })).filter(d => d.date && isFinite(d.value))
    }];

    render();
  });

  function render() {
    const { width, height, innerWidth, innerHeight } = containerSize(sel, margin);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    g.attr('transform', `translate(${margin.left},${margin.top})`);

    const all = series.flatMap(s => s.values);

    // Domain “đúng slide”: đầu năm min → đầu năm (max+1)
    const minDate  = d3.utcYear.floor(d3.min(all, d => d.date));
    const maxDate1 = d3.utcYear.offset(d3.utcYear.floor(d3.max(all, d => d.date)), 1);

    const x = d3.scaleUtc().domain([minDate, maxDate1]).range([0, innerWidth]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(all, d => d.value)]).nice()
      .range([innerHeight, 0]);

    gx.attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.utcFormat('%Y')));
    gy.call(d3.axisLeft(y).ticks(6));

    // ===== Axis labels (chuẩn mục A) =====
    gx.call(g => g.selectAll('text.axis-title-x').data([0]).join('text')
      .attr('class', 'axis-title-x')
      .attr('x', innerWidth / 2)
      .attr('y', 44)                      // ngay dưới baseline X
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Year'));

    gy.call(g => g.selectAll('text.axis-title-y').data([0]).join('text')
      .attr('class', 'axis-title-y')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -48)                     // sát đường Y (tùy margin trái)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Spot Power Price ($/MWh)'));

    const line = d3.line()
      .defined(d => d.date && isFinite(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    linesG.selectAll('path').data(series, s => s.id).join(
      enter => enter.append('path')
        .attr('fill', 'none')
        .attr('stroke', d => d.id === 'Average' ? '#E69F00' : sharedColor(d.id))
        .attr('stroke-width', d => d.id === 'Average' ? 3 : 1.5)
        .attr('opacity', d => d.id === 'Average' ? 1 : 0.4)
        .attr('d', d => line(d.values)),
      update => update.attr('d', d => line(d.values))
    );

    // End label “Average” (clamp trong khung)
    linesG.selectAll('text.end-label').data(series, s => s.id).join(
      enter => enter.append('text')
        .attr('class', 'end-label')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', '#E69F00')
        .attr('text-anchor', 'start')
        .text(d => d.id)
        .attr('x', d => {
          const last = d.values[d.values.length - 1];
          const xp = x(last.date) + 6;
          return Math.min(xp, innerWidth - 4);
        })
        .attr('y', d => {
          const last = d.values[d.values.length - 1];
          return y(last.value) - 4;
        }),
      update => update
        .attr('x', d => {
          const last = d.values[d.values.length - 1];
          const xp = x(last.date) + 6;
          return Math.min(xp, innerWidth - 4);
        })
        .attr('y', d => {
          const last = d.values[d.values.length - 1];
          return y(last.value) - 4;
        })
    );

    // Tooltip
    svg.on('mousemove', ev => {
      const [mx] = d3.pointer(ev, g.node());
      const s = series[0];
      const i = d3.bisector(d => d.date).left(s.values, x.invert(mx));
      const a = s.values[Math.max(0, Math.min(s.values.length - 1, i))];
      if (!a) return;
      tooltip.show(`<strong>Average</strong><br/>${a.date.getUTCFullYear()} — ${a.value}`, ev.clientX, ev.clientY);
    });
    svg.on('mouseout', tooltip.hide);
  }

  new ResizeObserver(render).observe(document.querySelector(sel));
})();
