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

		let votes = [];
		let weights = [];
		let answers = [];
		let pollnumber = this.props.location.id.thing - 1;

		const [ pollAddress,
			pollQuestion,
			pollIsWeighted,
			pollIsOpen,
			pollCreationDate,
			pollEndDate,
			pollOptions,
			pollVotes,
			pollWeights ] = await this.props.contract.getPoll(pollnumber);

        console.log("pollAddress:", pollAddress);
        console.log("pollQuestion:", pollQuestion);
        console.log("pollIsWeighted:", pollIsWeighted);
        console.log("pollIsOpen:", pollIsOpen);
        console.log("pollEndDate:", pollEndDate);
        console.log("pollCreationDate:", pollCreationDate);
        console.log("pollOptions:", pollOptions);
        console.log("pollVotes:", pollVotes);
        console.log("pollWeights:", pollWeights);


        for (let i = 0; i < pollOptions.length; i++) {
            answers.push(pollOptions[i]);
        }

        for (let i = 0; i < pollVotes.length; i++) {
            votes.push(pollVotes[i].toNumber());
        }

		for (let i = 0; i < pollWeights.length; i++) {
			weights.push(pollWeights[i].toNumber());
		}



        this.setState({pollnumber: pollnumber + 1});
        this.setState({question: pollQuestion});
        this.setState({answers: answers});
        this.setState({votes: votes});
		this.setState({weights: weights});
    }

    render() {
        console.log("Results id:", this.props.location.id.thing);
        console.log("answers:", this.state.answers);
        console.log("Votes:", this.state.votes);
		console.log("Weights:", this.state.weights);

        return (
            <div>
                <h3>Results for poll {this.state.pollnumber}</h3>
                <h2>{this.state.question}</h2>
                <Row>
                    <Col xs="auto">
                        <ListGroup>
                            {(this.state.answers && this.state.votes && this.state.weights) ? this.state.answers.map((answer, i) => ([
                                <ListGroup.Item action key={i}>
                                    {answer} Votes: {this.state.votes[i]} Weights: {this.state.weights[i]}
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
