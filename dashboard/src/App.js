import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import OrderDashboardComponent from './OrderDashboardComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Navbar />
          <OrderDashboardComponent />
      </div>
    );
  }
}

export default App;
