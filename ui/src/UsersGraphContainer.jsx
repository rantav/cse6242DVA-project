import React, { useState, useEffect, useRef } from 'react';
import D3UsersGraph from './D3UsersGraph';

let vis;

export default function UsersGraphContainer() {
  const [data, setData] = useState(null);
  const [userGraph, setUserGraph] = useState(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const [active, setActive] = useState(null);
  const refElement = useRef(null);

  useEffect(fetchData, []);
  useEffect(handleResizeEvent, []);
  useEffect(initVis, [ data, userGraph ]);
  useEffect(updateVisOnResize, [ width, height ]);

  function fetchData() {
    let query = 'MATCH (p:Person)-[d:DIRECTED]-(m:Movie) where m.released > 2000 RETURN p,d,m';
    query = new URLSearchParams({q: query})
    const url = '/query?' + query;
    fetch(url).then(response => {
      response.json().then(data => {
        setData(data)
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
        setData(data.concat(newData))
      })
    });
  }


  function handleResizeEvent() {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  function initVis() {
    if(data) {
      const d3Props = {
        data,
        width,
        height,
        onDatapointClick: setActive,
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

  function updateVisOnResize() {
    vis && vis.resize(width, height);
  }

  return (
    <div className='react-world'>
        <button onClick={fetchData}>reset</button>
        <div>{active}</div>
        <svg width={width} height={height} ref={refElement}></svg>
    </div>
  );
}