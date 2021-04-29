import '../App.css';
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import store from "../redux/store";
import {Button, Col, Container, Jumbotron, ListGroup, Row} from "react-bootstrap";

function mapStateToProps(state) {
    console.log("Mainpage mapStateToProps", state);
    return state;
}

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        console.log("Mainpage constructor state:", this.state);
    }

    componentDidMount = async () => {
        try {
            console.log("Mainpage componentDidMount store:", store.getState());
            //this.state = store.getState();
        } catch (error) {
            alert("Failed to load provider");
            console.log(error);
        }
    };

    //<Test  contract={this.state} />
    render() {
        console.log("Mainpage render props:", this.props);
        console.log("Mainpage render getState:", store.getState());
        console.log("Mainpage render this.state.polls:", this.state.polls);
        console.log("Mainpage render this.props.polls:", this.props.polls);
        console.log("Mainpage render this.state.numpolls:", this.state.numpolls);
        return (
          <div>
              <Jumbotron fluid>
                  <Container>
                      <h4>Node info: {this.state.version}</h4>
                      <br/>
                      <h4>No. of Polls: {this.props.numpolls}</h4>
                      <p/>
                      <h4>isConnected: {this.props.isConnected}</h4>
                      <br/>
                  </Container>
              </Jumbotron>
              <Row>
                  <Col xs="auto">
                      <ListGroup horizontal>
                          {this.props.polls.map((thing) => (
                            <ListGroup.Item key={thing}>
                                <Link to={{pathname: '/ShowPoll', id: {thing}}}>{thing}</Link>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                  </Col>
              </Row>
              <br/>
              <Row>
                  <Link to="/ShowPoll">
                      <Button type="button">ShowPoll</Button>
                  </Link>
              </Row>
          </div>
        )
    }
}

export default connect(mapStateToProps)(MainPage);