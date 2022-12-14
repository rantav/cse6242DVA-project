import React, { useState, useEffect, useRef } from 'react';
import D3UsersGraph from './D3UsersGraph';
import ActorTypeahead from './ActorTypeahead';
import DetailsPane from './DetailsPane'
import {
  Stack,
  Alert,
  AlertIcon,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Box,
  Tooltip
} from '@chakra-ui/react'

export default function UsersGraphContainer() {
  const [data, setData] = useState(null);
  const [userGraph, setUserGraph] = useState(null);
  const [startNode, setStartNode] = useState('lunny');
  const [endNode, setEndNode] = useState('realaravinth');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [infoMessage, setInfoMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [entity, setEntity] = useState({login: null, type: 'user'});

  const refElement = useRef(null);

  // useEffect(fetchInitData, []);
  useEffect(shortestPath, [startNode, endNode]);
  useEffect(initVis, [ data ]);

  function shortestPath() {
    if (startNode && endNode) {
      const q = `MATCH (start_actor:Actor1 {login: '${startNode}'} ),
                      (end_actor:Actor1 {login: '${endNode}'}),
                path = shortestPath((start_actor)-[*]-(end_actor))
                RETURN path, length(path)`;
      setErrorMessage(null);
      setShowMessage(true);
      setInfoMessage('Calculating shortest path...');
      fetchQuery(q)
        .then(d => {
          setInfoMessage(null);
          if (d.length == 0) {
            setInfoMessage(null)
            setErrorMessage(`No path found between <code>${startNode}</code> and <code>${endNode}</code>`);
            return;
          }
          const pathLen = d[0]['length(path)'];
          setInfoMessage(`Shortest path between <code>${startNode}</code> and <code>${endNode}</code> (length: <strong>${pathLen}</strong>)`);
          d = reshapeGraphDataPath(d);
          setData(d)
        });
    }
    setTimeout(() => {
      setShowMessage(false);
    }
    , 3000);
  }

  function fetchInitData() {
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
      query = `MATCH (m:Repo1)-[d]-(p:Actor1) where m.name = "${n.id}" RETURN p,d,m limit 50`;
    } else if (n.group == 'actor') {
      query = `MATCH (p:Actor1)-[d]-(m:Repo1) where p.login = "${n.id}" RETURN p,d,m limit 50`;
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

  function reshapeGraphDataPath(d) {
    const links = [], nodes = [];
    const isActor = (e) => !!e.login;
    const getId = (e) => isActor(e) ? e.login : e.name;
    const p = d[0].path;
    for (let i = 0; i < p.length; i++) {

        if(i % 2 == 0) {
            nodes.push({
                name: getId(p[i]),
                id: getId(p[i]),
                avatar_url: p[i].avatar_url,
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
          const entity = {
            type: n.group,
          }
          if (n.group == 'actor') {
            entity.login = n.id;
          }
          if (n.group == 'repo') {
            entity.name = n.id;
          }
          setEntity(entity);
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
        <Stack spacing={2}>
          <Collapse in={showMessage} animateOpacity>
            {errorMessage &&
              <Alert status='error'>
                <AlertIcon />
                <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
              </Alert>
            }
            {infoMessage &&
              <Alert status='info'>
                <AlertIcon />
                <span dangerouslySetInnerHTML={{ __html: infoMessage }} />
              </Alert>
            }
          </Collapse>
          <Tooltip label="GitHub username for shortest-path start" aria-label='A tooltip'>
            <FormControl>
              <FormLabel>Type GitHub usernames to search for connecting path</FormLabel>
                <ActorTypeahead items={[startNode]} selected={startNode} onSelected={setStartNode}/>
            </FormControl>
          </Tooltip>
          <Tooltip label="GitHub username for shortest-path end" aria-label='A tooltip'>
            <FormControl>
              <ActorTypeahead items={[endNode]} selected={endNode} onSelected={setEndNode}/>
            </FormControl>
          </Tooltip>
        </Stack>

        <HStack spacing='5px'>
          <Box w='150px'>
            <DetailsPane entity={entity}/>
          </Box>
          <Box>
            <svg width={width} height={height} ref={refElement}></svg>
          </Box>
        </HStack>

    </div>
  );
}