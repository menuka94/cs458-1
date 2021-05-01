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

class Results extends Component {
	constructor(props) {
        	super(props);
        	this.state = store.getState();
        	this.setState({answers: []});
    	}

	componentDidMount = async () => {
		let pollnumber = this.props.location.id.thing - 1;
		let answers = [];
		let votes = [];
		let i = 0;
		const poll = await this.props.contract.getPoll(pollnumber);
		const question = poll[0];
		for (i = 0; i < poll[1].length; i++) {
		    answers.push(poll[1][i]);
		}
		for (i = 0; i < poll[2].length; i++) {
		    votes.push(poll[2][i].toNumber());
		}
		this.setState({pollnumber: pollnumber + 1});
		this.setState({question: question});
		this.setState({answers: answers});
		this.setState({votes: votes});
	}

	render() {
	console.log("Results id:", this.props.location.id.thing);
	console.log("answers:", this.state.answers);
	console.log("Votes:", this.state.votes);

	return (
		<div>
		<h3>Results for poll {this.state.pollmnumber}</h3>
		<h2>{this.state.question}</h2>
		<Row>
		  <Col xs="auto">
		      <ListGroup>
			  {(this.state.answers && this.state.votes) ? this.state.answers.map((answer, i) => ([
			      <ListGroup.Item action key={i}>
				  {answer} Votes: {this.state.votes[i]}
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

export default connect(mapStateToProps)(Results);
