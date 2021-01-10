import React, { Component } from 'react';
import './App.css';
import Main from './pages/main';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar } from 'react-bootstrap';

class App extends Component {

  render() {

    return (
      <div className="main">

        <Navbar className="color-nav" variant="dark" fixed="top"  collapseOnSelect expand="lg">
          <Navbar.Brand href="/home"><b>How old were they?</b></Navbar.Brand>
     

        </Navbar>
       
          <div >
            <Main />
          </div>


      </div>

    );
  }
}

export default App;
