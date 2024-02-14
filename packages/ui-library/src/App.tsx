import React, { useEffect, useRef } from 'react';
import './App.css';
import { Component, TemplateFunction} from './components/template';
import {h} from 'snabbdom';

const counterTemplate: TemplateFunction<{}, { count: number }> = (props, state, updateState) => {
  return h('div', [
    h('h1', `Count: ${state.count}`),
    h('button', { on: { click: () => updateState({ count: state.count + 1 }) } }, 'Add')
  ]);
};

const SnabbdomCounter = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (containerRef.current && !containerRef.current.id) {
      const uniqueId = 'snabbdom-counter'; 
      containerRef.current.id = uniqueId;

      new Component(counterTemplate, {}, { count: 0 }, uniqueId, {
        onMount: () => console.log('Counter component mounted'),
        onUpdate: (oldState, newState) => console.log(`Counter state updated from ${oldState.count} to ${newState.count}`),
      });
    }
  }, [containerRef]);

  return <div ref={containerRef}></div>;
};

function App() {
  return (
    <div className="App">
      <SnabbdomCounter />
    </div>
  );
}

export default App;
