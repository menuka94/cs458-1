import '../App.css';
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import initBlockchain from "../initBlockchain";
import Test from "../test";
import store from "../redux/store";

function mapStateToProps(state) {
	console.log("MainPage mapStateToProps", state);
	return state;
}

class MainPage extends Component {
	constructor(props) {
		super(props);
		//this.state = {isConnected: false, peers: 0, version: '', contract: null, numpolls: 0, polls: []};
		//console.log("componentDidMount: contract", this.state.contract);
		this.state = store.getState();
		console.log("MainPage constructor state:", this.state);
	}
	componentDidMount = async() => {
	try {
		console.log("MainPage componentDidMount store:", store.getState());
		//this.state = store.getState();
	} catch (error) {
		alert("Failed to load provider");
		console.log(error);
	};
	};

	

	//<Test  contract={this.state} />
	render() {
		console.log("MainPage render props:", this.props);
		console.log("MainPage render getState:", store.getState());
		console.log("MainPage render this.state.polls:", this.state.polls);
		console.log("MainPage render this.props.polls:", this.props.polls);
		console.log("MainPage render this.state.numpolls:", this.state.numpolls);
		return (
			<div>
			<h2>Connected?:</h2><br/>
			{this.state.isConnected?'Connected':'Not connected'}
			<br/>
			<h2>Node info:</h2><br /> {this.state.version}
			<h2>Numpolls: {this.props.numpolls}</h2><br/>
			<h2>isConnected: {this.props.isConnected}</h2><br/>
			<ul>
			{this.props.polls.map((thing) => (
				<li key={thing}>{thing}</li>
			))}
			</ul>
			<Link to="/ShowPoll">ShowPoll</Link>
			</div>
		)
	}
}
export default connect(mapStateToProps)(MainPage);
