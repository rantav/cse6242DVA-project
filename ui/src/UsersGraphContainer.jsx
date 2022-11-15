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

    const query = new URLSearchParams({q})
    const url = '/query?' + query;
    fetch(url).then(response => {
      response.json().then(d => {
        d = reshapeGraphDataPath(d);
        setData(d)
      })
    });
  }

  function fetchInitData() {
    let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) where m.released > 2000 RETURN p,d,m';
    query = new URLSearchParams({q: query})
    const url = '/query?' + query;
    fetch(url).then(response => {
      response.json().then(d => {
        d = reshapeGraphData(d);
        setData(d)
      })
    });
  }

  // function fetchQuery(query) {
  //   query = new URLSearchParams({q: query})
  //   const url = '/query?' + query;
  //   fetch(url).then(response => {
  //     response.json().then(d => {
  //       setData(d)
  //     })
  //   });
  // }

  function expandNode(n) {
    let query = '';
    if (n.group == 'movie') {
      query = `MATCH (m:Movie)-[d]-(p:Person) where m.title = "${n.id}" RETURN p,d,m`;
    } else if (n.group == 'person') {
      query = `MATCH (p:Person)-[d]-(m:Movie) where p.name = "${n.id}" RETURN p,d,m`;
    }
    query = new URLSearchParams({q: query})
    const url = '/query?' + query;
    fetch(url).then(response => {
      response.json().then(newData => {
        newData = reshapeGraphData(newData);
        setData(oldData => mergeNodesLinks(newData, oldData))
      })
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
      ).values()]
    links = [...new Map(links.map(
      item => [`${item['source']}-${item['target']}-${item['type']}`, item])
      ).values()]
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
          setSelectedEntity({login: 'torvalds'}); // TODO: Replace this mock
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