import React, { Component } from "react";

function testpolls(props) {
	//let numpolls = await contract.numPolls();
	console.log("contract:", props);
	const numpolls = 0;
	console.log("numpolls:", numpolls);
	return (
		<strong>foo</strong>
	);
}

class Test extends Component {

	render() {
		return ( 
		<div>
			{console.log("props:", this.props)}
		</div>
		)
	}
}

export default Test;
