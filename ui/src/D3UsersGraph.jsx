import * as d3 from 'd3';
import ForceGraph from './ForceGraph.js'

// Convert from neo4j format (mock-results-nicer-format.json) to D3 format
function reshapeForD3(data) {
  const links = d3.map(data, (d) => {
    return {
      id: d.d.identity,
      source: d.d.start,
      target: d.d.end,
      type: d.d.type,
      properties: d.d.properties
    }});
  let nodes = d3.map(data, (d) => {
    return {
      id: d.p.identity,
      labels: d.p.labels,
      properties: d.p.properties,
      group: 1,
    }})
    .concat(d3.map(data, (d) => {
      return {
        id: d.m.identity,
        labels: d.m.labels,
        properties: d.m.properties,
        group: 2,
      }}))
  nodes = d3.map(nodes, (n) => {
    return {
      id: n.id,
      labels: n.labels,
      properties: n.properties,
      group: n.group,
      name: n.properties.name}})
  return {nodes, links}

}


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
    const d = reshapeForD3(data);
    this.chart = ForceGraph(d, {
      svg: this.svg,
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => d.name,
      linkStrokeWidth: l => Math.sqrt(l.value),
      nodeRadius: 10,
      width,
      height,
      // invalidation // a promise to stop the simulation when the cell is re-run
    })
  }
  // updateDatapoints = () => {
  //   const { svg, props: { data, width, height } } = this;



  //   let s = svg.selectAll('circle').data(data)
  //   s.enter()
  //     .append('circle')
  //     .style('fill', 'red')
  //     .attr('cx', () => Math.random() * width)
  //     .attr('cy', () => Math.random() * height)
  //     .attr('r', 10)
  //     .on('mouseup', (d, i, nodes) => {
  //       // TODO: nodes is null. This still doesn't work
  //       console.log(d, i, nodes)
  //       this.setActiveDatapoint(d, nodes[i])
  //     });
  //   s.exit().remove()
  // }

  // setActiveDatapoint = (d, node) => {
  //   d3.select(node).style('fill', 'yellow');
  //   this.props.onDatapointClick(d);
  // }

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