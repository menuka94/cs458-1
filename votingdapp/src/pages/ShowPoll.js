import React, {Component} from "react";
import {Link} from "react-router-dom";
import store from "../redux/store";
import {ethers} from "ethers";
import {connect} from "react-redux";
import {Button, Col, ListGroup, Row} from "react-bootstrap";


function mapStateToProps(state) {
    console.log("ShowPoll mapStateToProps", state);
    return state;
}

class ShowPoll extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        this.setState({answers: []});
    }

    componentDidMount = async () => {
        console.log("ShowPoll componentDidMount");
        //this.state = store.getState();
        console.log("ShowPoll state:", this.state);
        console.log("ShowPoll props:", this.props);
        let answers = [];
        let i = 0;
        let pollnumber = this.props.location.id.thing - 1;
        const poll = await this.props.contract.getPoll(pollnumber);
        const question = poll[0];
        for (i = 0; i < poll[1].length; i++) {
            answers.push((poll[1][i]));
        }
        this.setState({pollnumber: pollnumber + 1}); // fix these
        this.setState({question: question});
        this.setState({answers: answers});
    };

    // note: the map function i counter is 0-based
    async chose(num) {
        /*
        if (window.confirm('Vote?')) {
          console.log("Confirmed");
        }
        */
	console.log("ShowPoll id:", this.props.location.id.thing, num);
        await this.props.contract.connect(this.props.signer).votePoll(this.props.location.id.thing-1, num);
    }

    render() {
        console.log("ShowPoll render props:", this.props);
        console.log("ShowPoll render state:", this.state);
        console.log("ShowPoll id:", this.props.location.id.thing, typeof (this.props.location.id.thing));
        // weirdly <button> needs a key or it gets a console warning
        return (
          <div>
              <h1>Poll</h1>
              <h3>Question No. {this.state.pollnumber}</h3>
              <h2>{this.state.question}</h2>
              <Row>
                  <Col xs="auto">
                      <ListGroup>
                          {this.state.answers ? this.state.answers.map((answer, i) => ([
                              <ListGroup.Item action key={i}
                                              onClick={() => this.chose(i)}>
                                  {answer}
                              </ListGroup.Item>,
                          ])) : "Loading..."}
                      </ListGroup>
                  </Col>
              </Row>
              <br/>
              <Link to="/">
                  <Button type="button">Go Home</Button>
              </Link>
          </div>
        );
    }
}

export default connect(mapStateToProps)(ShowPoll);
