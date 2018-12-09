import React, { Component } from 'react';
import './App.css';
import GustaveFormular from './GustaveFormular';

class App extends Component {
  render() {
    return (
        <div className="App container">
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm">
              <GustaveFormular />
            </div>
            <div className="col-sm-3"></div>
          </div>
        </div>
    );
  }
}

export default App;
