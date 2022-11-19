import React, { useState, useEffect, useRef } from 'react';
import D3UsersGraph from './D3UsersGraph';
import {
  Button,
  Stack
} from '@chakra-ui/react'

export default function UsersGraphContainer({setSelectedEntity}) {
  const [data, setData] = useState(null);
  const [userGraph, setUserGraph] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight - 500);
  const refElement = useRef(null);

  useEffect(fetchInitData, []);
  useEffect(initVis, [ data ]);

  function shortestPath() {
    const q = `MATCH (KevinB:Person {name: 'Kevin Bacon'} ),
        (Al:Person {name: 'Al Pacino'}),
        path = shortestPath((KevinB)-[:ACTED_IN*]-(Al))
      WHERE all(r IN relationships(path) WHERE r.roles IS NOT NULL)
      RETURN path`;

    fetchQuery(q)
      .then(d => {
        d = reshapeGraphDataPath(d);
        setData(d)
      });
  }

  function fetchInitData() {
    // let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) RETURN p,d,m';
    let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) where m.released > 2010 RETURN p,d,m';
    fetchQuery(query)
      .then(d => {
        d = reshapeGraphData(d);
        setData(d)
      });
  }

  // Fetch data from the server -> neo4j
  // and return a promise of its json response
  function fetchQuery(query) {
    query = new URLSearchParams({q: query})
    const url = '/query?' + query;
    return fetch(url).then(response => response.json())
  }

  function expandNode(n) {
    let query = '';
    if (n.group == 'movie') {
      query = `MATCH (m:Movie)-[d]-(p:Person) where m.title = "${n.id}" RETURN p,d,m`;
    } else if (n.group == 'person') {
      query = `MATCH (p:Person)-[d]-(m:Movie) where p.name = "${n.id}" RETURN p,d,m`;
    }
    fetchQuery(query)
      .then(newData => {
        newData = reshapeGraphData(newData);
        setData(oldData => mergeNodesLinks(newData, oldData))
      });
  }

  function mergeNodesLinks(d1, d2) {
    const nodes = d1.nodes.concat(d2.nodes);
    const links = d1.links.concat(d2.links);
    return dedupNodesLinks({nodes, links});
  }

  // Convert from neo4j format to D3 format
  function reshapeGraphData(data) {
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
    return dedupNodesLinks({nodes, links})
  }

  function reshapeGraphDataPath(data) {
    const links = [], nodes = [];
    const isPerson = (e) => !!e.name;
    const getId = (e) => isPerson(e) ? e.name : e.title;
    const p = data[0].path;
    for (let i = 0; i < p.length; i++) {

        if(i % 2 == 0) {
            nodes.push({
                name: getId(p[i]),
                id: getId(p[i]),
                group: isPerson(p[i]) ? 'person' : 'movie',
            });
        } else {
            links.push({
                source: getId(p[i - 1]),
                target: getId(p[i + 1]),
                type: p[i],
            });
        }
    }
    return {nodes, links};
  }

  function dedupNodesLinks({nodes, links}) {
    nodes = [...new Map(nodes.map(
      item => [item['id'], item])
      ).values()];

    links = [...new Map(links.map(
      item => [`${item['source']}-${item['target']}-${item['type']}`, item])
      ).values()];
    // const nodeI = {};
    // nodes.forEach((n, i) => nodeI[n.id] = i);
    // links = links.map(l => {return {source: nodeI[l.source], target: nodeI[l.target], type: l.type}});
    // const nodeMap = {};
    // nodes.forEach((n) => nodeMap[n.id] = n);
    // links = links.map(l => {return {source: nodeMap[l.source], target: nodeMap[l.target], type: l.type}});
    return {nodes, links}
  }

  function initVis() {
    if(data) {
      const d3Props = {
        data,
        width,
        height,
        onNodeClick: (n) => {
          // setSelectedEntity(n);
          setSelectedEntity({login: 'torvalds'}); // TODO: Replace this mock with the line above
          expandNode(n);
        },
      };
      if (userGraph) {
        userGraph.update(data);
      } else {
        let ug = new D3UsersGraph(refElement.current, d3Props);
        setUserGraph(ug);
      }
    }
  }

  return (
    <div>
        <Stack spacing={4} direction='row' align='center'>
          <Button onClick={shortestPath}>Shortest Path Demo</Button>
          <Button onClick={fetchInitData}>Reset</Button>
        </Stack>
        <svg width={width} height={height} ref={refElement}></svg>
    </div>
  );
}