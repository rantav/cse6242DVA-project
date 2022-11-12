import * as d3 from 'd3';
import ForceGraph from './ForceGraph.js'

export default class D3UsersGraph {

  containerEl;
  props;
  svg;

  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { data, width, height } = props;
    this.svg = d3.select(containerEl)
    // this.updateDatapoints();
    this.chart = ForceGraph(data, {
      svg: this.svg,
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width,
      height,
      // invalidation // a promise to stop the simulation when the cell is re-run
    })
  }

  updateDatapoints = () => {
    const { svg, props: { data, width, height } } = this;



    let s = svg.selectAll('circle').data(data)
    s.enter()
      .append('circle')
      .style('fill', 'red')
      .attr('cx', () => Math.random() * width)
      .attr('cy', () => Math.random() * height)
      .attr('r', 10)
      .on('mouseup', (d, i, nodes) => {
        // TODO: nodes is null. This still doesn't work
        console.log(d, i, nodes)
        this.setActiveDatapoint(d, nodes[i])
      });
    s.exit().remove()
  }

  setActiveDatapoint = (d, node) => {
    d3.select(node).style('fill', 'yellow');
    this.props.onDatapointClick(d);
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