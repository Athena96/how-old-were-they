import React, { Component } from 'react';
import './App.css';
import Main from './pages/main';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Nav } from 'react-bootstrap';

class App extends Component {

  render() {

    return (
      <div className="main">

        <Navbar className="color-nav" variant="dark" fixed="top"  collapseOnSelect expand="lg">
          <Navbar.Brand href="/home"><b>How old were they?</b></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto">
          </Nav>
          </Navbar.Collapse>

        </Navbar>
       
          <div >
            <Main />
          </div>


      </div>

    );
  }
}

export default App;
