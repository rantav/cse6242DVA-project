import * as d3 from 'd3';
import ForceGraph from './ForceGraph.js'

// Convert from neo4j format (mock-results-nicer-format.json) to D3 format
function reshapeForD3(data) {
  // Type returned from the database now
  let links = data.map((d) => {
    return {
      source: d.d[0].name,
      target: d.d[2].title,
      type: d.d[1]
    }})
  let nodes = data.map((d, i) => {
    return {
      id: d.d[0].name,
      name: d.d[0].name,
      group: 'person'
    }})
    .concat(data.map((d) => {
      return {
        id: d.d[2].title,
        name: d.d[2].title,
        group: 'movie'
      }}))

  // type returned from the mock file
  // const links = d3.map(data, (d) => {
  //   return {
  //     id: d.d.identity,
  //     source: d.d.start,
  //     target: d.d.end,
  //     type: d.d.type,
  //     properties: d.d.properties
  //   }});
  // let nodes = d3.map(data, (d) => {
  //   return {
  //     id: d.p.identity,
  //     labels: d.p.labels,
  //     properties: d.p.properties,
  //     group: 1,
  //   }})
  //   .concat(d3.map(data, (d) => {
  //     return {
  //       id: d.m.identity,
  //       labels: d.m.labels,
  //       properties: d.m.properties,
  //       group: 2,
  //     }}))
  // nodes = d3.map(nodes, (n) => {
  //   return {
  //     id: n.id,
  //     labels: n.labels,
  //     properties: n.properties,
  //     group: n.group,
  //     name: n.properties.name}})

  // Unique the nodes
  nodes = [...new Map(nodes.map(
    item => [item['id'], item])
    ).values()]
  links = [...new Map(links.map(
    item => [`${item['source']}-${item['target']}-${item['type']}`, item])
    ).values()]
  return {nodes, links}

}


export default class D3UsersGraph {

  containerEl;
  props;
  svg;

  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { data, width, height, onNodeClick } = props;
    this.svg = d3.select(containerEl)
    const d = reshapeForD3(data);
    this.chart = ForceGraph({
      svg: this.svg,
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => d.name,
      linkStrokeWidth: 1,
      nodeRadius: 20,
      nodeStroke: '#eee',
      nodeStrength: -500,
      linkDistance: 300,
      width,
      height,
      onNodeClick,
      // invalidation // a promise to stop the simulation when the cell is re-run
    });
    this.chart.update(d)
  }

  update = (data) => {
    const d = reshapeForD3(data);
    this.chart.update(d)
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