import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";

import initBlockchain from "./initBlockchain";
import Test from "./test";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {isConnected: false, peers: 0, version: '', contract: null, numpolls: 0, polls: []};
		console.log("componentDidMount: contract", this.state.contract);
	}
	componentDidMount = async() => {
	try {
		console.log("componentDidMount");
		const poll = await initBlockchain();
		const nump = await poll.voting.numPolls();
		console.log("nump:", nump.toNumber());
		this.setState({numpolls: nump.toNumber()});
		this.setState({contract: poll.voting});
		var i;
		for (i = 0; i < nump.toNumber(); i++) {
			this.state.polls.push(i+1);
		}
		this.setState({polls: this.state.polls});
		console.log("polls:", this.state.polls);
		console.log("state:", this.state);
		console.log("cDM end");
	} catch (error) {
		alert("Failed to load provider");
		console.log(error);
	};
	};

	

	render() {
		return (
			<div>
			<h2>Connected?:</h2><br/>
			{this.state.isConnected?'Connected':'Not connected'}
			<br/>
			<h2>Node info:</h2><br /> {this.state.version}
			<Test  contract={this.state} />
			<h2>Numpolls: {this.state.numpolls}</h2><br/>
			<h2>isConnected: {this.state.isConnected}</h2><br/>
			<ul>
			{this.state.polls.map((thing) => (
				<li key={thing}>{thing}</li>
			))}
			</ul>
			</div>
		)
	}
}
export default App;
