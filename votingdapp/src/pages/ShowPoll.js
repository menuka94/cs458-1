import React, { Component } from "react";
import { Link } from "react-router-dom";
import store from "../redux/store";
import { ethers } from "ethers";
import { connect } from "react-redux";


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
	componentDidMount = async() => {
		console.log("ShowPoll componentDidMount");
		//this.state = store.getState();
		console.log("ShowPoll state:", this.state);
		console.log("ShowPoll props:", this.props);
		let x2 = [];
		let i = 0;
		const poll = await this.props.contract.getPoll(0);
		const question = poll[0];
		for (i = 0; i < poll[1].length; i++) {
			x2.push(ethers.utils.parseBytes32String(poll[1][i]));
		}
		console.log("ShowPoll x2:", x2);
		this.setState({pollnumber: 1}); // fix these
		this.setState({question: question}); 
		this.setState({answers: x2}); 
	};

	render() {
	console.log("ShowPoll render props:", this.props);
	console.log("ShowPoll render state:", this.state);
	return (
		<div>
		<h1>ShowPoll</h1>
		<h2>Question: {this.state.pollnumber}</h2>
		<h2>Question: {this.state.question}</h2>
		<ul>
		{this.state.answers ? this.state.answers.map((thing, i) => (
			<li key={i}>{thing}</li>
		)) : "Loading..."}
		</ul>
		<Link to="/">Go Home</Link>
		</div>
	);
	}
}

export default connect(mapStateToProps)(ShowPoll);
