// Copied and modified version from

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph

import * as d3 from 'd3';

export default function ForceGraph({
    svg, // root node to attach graph into. If not provided, will be created
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkStrength,
    linkDistance,
    linkTitle,
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    colors = d3.schemeAccent, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    onNodeClick = null, // Event hander for node clicks
    invalidation // when this promise resolves, stop the simulation
} = {}) {

    if (!svg) {
        svg = d3.create("svg")
    }

    // svg.attr("width", width)
    //     .attr("height", height)
    //     .attr("viewBox", [-width / 2, -height / 2, width, height])
    //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


    let link = svg.append("g").selectAll("g.link");

    let node = svg.append("g").selectAll("g.node");

    // Construct the forces.
    const forceNode = d3.forceManyBody(node);
    const forceLink = d3.forceLink(link).id(nodeId);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
    if (linkDistance !== undefined) forceLink.distance(linkDistance);

    const simulation = d3.forceSimulation()
        .force("charge", forceNode)
        .force("link", forceLink)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('collide',d3.forceCollide().radius(nodeRadius * 2).iterations(2))
        .on("tick", ticked);

    function ticked() {
        node.attr("transform", d => `translate(${d.x}, ${d.y})`);
        link.selectAll('line')
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        link.selectAll('text')
            .attr("x", d => (d.source.x + (d.target.x - d.source.x) * 0.5))
            .attr("y", d => (d.source.y + (d.target.y - d.source.y) * 0.5));
    }

    // Terminate the force layout when this cell re-runs.
    if (invalidation) {
        invalidation.then(() => simulation.stop());
    }

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    return Object.assign(svg.node(), {
        update({ nodes, links }) {

            // Make a shallow copy to protect against mutation, while
            // recycling old nodes to preserve position and velocity.
            const old = new Map(node.data().map(d => [d.id, d]));
            nodes = nodes.map(d => Object.assign(old.get(d.id) || {x: width / 2, y: height / 2}, d));
            links = links.map(d => Object.assign({}, d));

            const groups = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
            // Compute default domains.
            if (groups && nodeGroups === undefined) nodeGroups = d3.sort(groups);
            const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(0.01).restart();

            node = node
                .data(nodes, nodeId)
                .join(enter => enter.append("g").attr("class", "node")
                    .call(drag(simulation))
                    .call(node => node.append("circle")
                        .attr("r", nodeRadius)
                        .attr("stroke-opacity", nodeStrokeOpacity)
                        .attr("stroke-width", nodeStrokeWidth)
                        .attr("fill", d => color ? color(nodeGroup(d)) : nodeFill)
                    )
                    .call(node => node.append("title").text(nodeTitle))
                    .call(node => node.append("text").text(nodeTitle)
                        .attr('y', nodeRadius)
                        .style("text-anchor", "middle")
                    )
                    .call(node => node.append("svg:image")
                        .attr('width', nodeRadius)
                        .attr('height', nodeRadius)
                        .attr('y', -nodeRadius / 2)
                        .attr('x', -nodeRadius / 2)
                        .attr("xlink:href", d => d.avatar_url)
                        .attr('clip-path', `inset(0% round ${Math.round(nodeRadius / 2)}px)`)
                    ),
                    update => update.call(node => node.select('circle')
                        .attr("stroke", d => {
                        return d.active ? '#0aa' : nodeStroke})
                    )
                );

            link = link
                .data(links, d => [linkSource(d), linkTarget(d)])
                .join(enter => enter.append("g").attr("class", "link")
                    .call(node => node.append("line")
                        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
                        .attr("stroke-opacity", linkStrokeOpacity)
                        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
                        .attr("stroke-linecap", linkStrokeLinecap)
                    )
                    // .call(node => node.append("text")
                    //     .text(linkTitle)
                    //     .attr("dy", ".25em")
                    //     .attr("text-anchor", "middle")
                    // )
                    , update => update.call(node => node.select('line')) // Why is that needed? no clear, but it fixes the dandling link bug...
                );

            if (onNodeClick) {
                node.on('click', (e, d) => {
                    nodes.forEach(n => n.active = false);
                    d.active = true;
                    onNodeClick(d)
                })
            }
        }
    });
}
