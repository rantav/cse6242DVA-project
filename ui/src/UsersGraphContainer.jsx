import React, { useState, useEffect, useRef } from 'react';
import D3UsersGraph from './D3UsersGraph';

let vis;

export default function UsersGraphContainer() {
  const [data, setData] = useState(null);
  const [userGraph, setUserGraph] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const refElement = useRef(null);

  useEffect(fetchData, []);
  useEffect(initVis, [ data ]);

  function fetchData() {
    let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) where m.released > 2000 RETURN p,d,m';
    query = new URLSearchParams({q: query})
    const url = '/query?' + query;
    fetch(url).then(response => {
      response.json().then(d => {
        setData(d)
      })
    });
  }

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
        setData(oldData => newData.concat(oldData))
      })
    });
  }

  function initVis() {
    if(data) {
      const d3Props = {
        data,
        width,
        height,
        onNodeClick: (n) => expandNode(n),
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
    <div className='react-world'>
        <button onClick={fetchData}>reset</button>
        <svg width={width} height={height} ref={refElement}></svg>
    </div>
  );
}