import React, {Component} from "react";
import {Link} from "react-router-dom";
import store from "../redux/store";
import {ethers} from "ethers";
import {connect} from "react-redux";
import {Button, Row, Col} from "react-bootstrap";

// https://www.cluemediator.com/add-or-remove-input-fields-dynamically-with-reactjs
// https://stackoverflow.com/questions/36512686/react-dynamically-add-input-fields-to-form
function mapStateToProps(state) {
    console.log("AddPoll mapStateToProps", state);
    return state;
}

class AddPoll extends Component {
	constructor(props) {
        super(props);
        this.state = store.getState();
	this.setState({inputs: ['']});
	this.setState({question: ''});
	}

	componentDidMount = async () => {
	this.setState({inputs: ['']});
	this.setState({question: ''});
    	}

	appendInput = async event => {
		event.preventDefault();
		//var newInput = 'input-${this.state.inputs.length}';
		var newInput = '';
		this.setState(prevState => ({ inputs: prevState.inputs.concat([newInput])}));
	};

	handleSubmit = async event => {
		event.preventDefault();
		console.log("handleSubmit", event);
		console.log("handleSubmit question:", this.state.question);
		console.log("handleSubmit inputs:", this.state.inputs);
		await this.props.contract.connect(this.props.signer).addPoll(this.state.question, this.state.inputs);
	};

	inputChange = async (e, index) => {
		if (index == -1) {
			this.setState({question: e.target.value});
		} else {
			let arr = this.state.inputs;
			arr[index] = e.target.value;
			this.setState({inputs: arr});
		}
		console.log("inputChange:", index, e.target.value);
	}


	render() {

	//<Button type="submit" onClick={this.handleSubmit}>Submit</Button>
	//{this.state.inputs ? this.state.inputs.map(input => [<input type="text" key={input} />, <br/>]) : "Loading..."}
	return (
		<div>
		<form>
		Question:<br />
		<input type="text" onChange={e => this.inputChange(e, -1)} />
		<br />
		Answers:<br />
		<div id="dynamicInput">
		</div>
		{this.state.inputs ? 
		this.state.inputs.map((input, i) => {
			return ([
			<input type="text" key={i} onChange={e => this.inputChange(e, i)} />,
			<br />
			]);
		}) : "Loading..." }
		<Row>
		<Col xs="auto">
		<Button type="button"  type="submit" onClick={this.handleSubmit}>Add Poll</Button>
		</Col>
		<Col xs="auto">
		<Button type="button" onClick={this.appendInput}>
			Add Input
		</Button>
		</Col>
		<Col xs="auto">
		<Link to="/">
                  <Button type="button">Go Home</Button>
                </Link>
		</Col>
		</Row>
		</form>
		  
		</div>
	);
	}
}

export default connect(mapStateToProps)(AddPoll);
