import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GustaveFormular from './GustaveFormular';

class App extends Component {
  render() {
    return (
        <div className="App container">
          <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm">
              <GustaveFormular />
            </div>
            <div className="col-sm"></div>
          </div>
        </div>
    );
  }
}

export default App;
