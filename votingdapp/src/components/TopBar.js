import React, {Component} from "react";

import {Navbar} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {
        userAddress: state.userAddress
    }
}

class TopBar extends Component {
    render() {
        return (
          <div>
              <Navbar bg="dark" variant="dark">
                  <Navbar.Brand href="#">Completely Fair Voting DApp</Navbar.Brand>
                  <Navbar.Toggle/>
                  <Navbar.Collapse className="justify-content-end">
                      <Navbar.Text>
                          Your account address: <a href="">{this.props.userAddress}</a>
                      </Navbar.Text>
                  </Navbar.Collapse>
              </Navbar>
          </div>
        );
    }
}

export default connect(mapStateToProps)(TopBar);
