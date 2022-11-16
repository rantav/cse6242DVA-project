import * as d3 from 'd3';
import ForceGraph from './ForceGraph.js'


export default class D3UsersGraph {

  containerEl;
  props;
  svg;

  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { data, width, height, onNodeClick } = props;
    this.svg = d3.select(containerEl)
    this.chart = ForceGraph({
      svg: this.svg,
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => d.name,
      linkTitle: d => d.type,
      linkStrokeWidth: 1,
      nodeRadius: 20,
      nodeStroke: '#eee',
      nodeStrength: -500,
      linkDistance: 20,
      width,
      height,
      onNodeClick,
      // invalidation // a promise to stop the simulation when the cell is re-run
    });
    this.chart.update(data)
  }

  update = (data) => {
    this.chart.update(data)
  }

  // TODO: Resize still not working
  resize = (width, height) => {
    const { svg } = this;
    svg.attr('width', width)
      .attr('height', height);
    svg.selectAll('circle')
      .attr('cx', () => Math.random() * width)
      .attr('cy', () => Math.random() * height);
  }
}