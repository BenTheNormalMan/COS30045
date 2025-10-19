const tooltip = (() => {
  const el = document.createElement('div');
  el.className = 'tooltip hidden';
  document.body.appendChild(el);

  return {
    show(html, x, y) {
      el.innerHTML = html;
      el.style.left = `${x + 12}px`;
      el.style.top = `${y + 12}px`;
      el.classList.remove('hidden');
    },
    move(x, y) {
      el.style.left = `${x + 12}px`;
      el.style.top = `${y + 12}px`;
    },
    hide() {
      el.classList.add('hidden');
    }
  };
})();

function containerSize(sel, margin = { top: 24, right: 24, bottom: 40, left: 56 }) {
  const node = document.querySelector(sel);
  const { width, height } = node.getBoundingClientRect();
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  return { width, height, innerWidth, innerHeight, margin };
}

const sharedColor = d3.scaleOrdinal().range([
  '#0072B2',
  '#E69F00',
  '#009E73',
  '#D55E00',
  '#CC79A7',
  '#56B4E9',
  '#F0E442',
  '#000000'
]);

function buildLegend(containerSelector, domain, color) {
  const root = d3.select(containerSelector);
  if (root.empty()) return;

  const items = root.selectAll('div.item').data(domain, d => d);

  const enter = items.enter()
    .append('div')
    .attr('class', 'item');

  enter.append('span')
    .attr('class', 'swatch')
    .style('background', d => color(d));

  enter.append('span')
    .text(d => d);

  items.exit().remove();
}
