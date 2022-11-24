import React, { useState, useEffect, useRef } from 'react';
import D3UsersGraph from './D3UsersGraph';
import {
  Button,
  Stack
} from '@chakra-ui/react'

export default function UsersGraphContainer({setSelectedEntity}) {
  const [data, setData] = useState(null);
  const [userGraph, setUserGraph] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const refElement = useRef(null);

  useEffect(fetchInitData, []);
  // useEffect(shortestPath, []);
  useEffect(initVis, [ data ]);

  function shortestPath() {
    const q = `MATCH (start_actor:Actor1 {login: 'BlazinZzetti'} ),
                     (end_actor:Actor1 {login: 'liren-a'}),
              path = shortestPath((start_actor)-[*]-(end_actor))
              RETURN path`;

    fetchQuery(q)
      .then(d => {
        d = reshapeGraphDataPath(d);
        setData(d)
      });
  }

  function fetchInitData() {
    // let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) RETURN p,d,m';
    let query = 'MATCH (p:Actor1)-[d]-(m:Repo1) RETURN p,d,m limit 10';
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
    if (n.group == 'repo') {
      query = `MATCH (m:Repo1)-[d]-(p:Actor1) where m.name = "${n.id}" RETURN p,d,m limit 10`;
    } else if (n.group == 'actor') {
      query = `MATCH (p:Actor1)-[d]-(m:Repo1) where p.login = "${n.id}" RETURN p,d,m limit 10`;
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
        source: d.d[0].login,
        target: d.d[2].name,
        type: d.d[1]
      }})
    let nodes = data.map((d, i) => {
      return {
        id: d.d[0].login,
        name: d.d[0].login,
        avatar_url: d.d[0].avatar_url,
        group: 'actor'
      }})
      .concat(data.map((d) => {
        return {
          id: d.d[2].name,
          name: d.d[2].name,
          group: 'repo'
        }}))
    return dedupNodesLinks({nodes, links})
  }

  function reshapeGraphDataPath(data) {
    const links = [], nodes = [];
    const isActor = (e) => !!e.login;
    const getId = (e) => isActor(e) ? e.login : e.name;
    const p = data[0].path;
    for (let i = 0; i < p.length; i++) {

        if(i % 2 == 0) {
            nodes.push({
                name: getId(p[i]),
                id: getId(p[i]),
                group: isActor(p[i]) ? 'actor' : 'repo',
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