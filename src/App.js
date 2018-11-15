import React, { Component } from 'react';
import Canvas from './Canvas'
import { init } from './canvasHelpers'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Canvas />
      </div>
    );
  }
}

export default App;
