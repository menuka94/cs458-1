//pragma solidity ^0.6.4;
pragma solidity ^0.7.0;
// We have to specify what version of compiler this code will compile with

import "hardhat/console.sol";

contract Voting {

    struct Poll {
		string question;
		bytes32[] answers;
		uint startDate;
		uint endDate;
		mapping (uint16 => uint256) votes;
		mapping (address => uint8) haveVoted;
	}

    event NewPoll(uint id);

    Poll[] public polls;
    mapping (address => bool) public haveVoted;

    /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
    We will use an array of bytes32 instead to store the list of candidates
    */
    bytes32[] public candidateList;

    /* This is the constructor which will be called once when you
    deploy the contract to the blockchain. When we deploy the contract,
    we will pass an array of candidates who will be contesting in the election
    */
    constructor() {
		console.log("Deployed on blockchain");
	}

    function _addPoll(string memory _question, bytes32[] memory _answers) public {
		// note: solidity >= 0.6.0 there is no return of the array length
		//polls.push(Poll(_question, _answers, block.timestamp, block.timestamp + 1 days));
        Poll storage tmppoll = polls.push();
		tmppoll.question = _question;
		tmppoll.answers = _answers;
		tmppoll.startDate = block.timestamp;
		tmppoll.endDate = block.timestamp + 1 days;
		uint id = polls.length - 1;
		console.log("Added poll #", id);
		/*
		for (uint i = 0; i < _answers.length; i++) {
			string memory conv = string(abi.encodePacked(_answers[i]));
			console.log("Answer:", i, conv);
			}
		*/
		emit NewPoll(id);
	}

    function getPoll(uint id) view public returns (string memory, bytes32[] memory) {
		require(id < polls.length);
		console.log("Poll number", id, polls[id].question);
		return(polls[id].question, polls[id].answers);
	}

    function numPolls() view public returns (uint) {
		return(polls.length);
	}

    function votePoll(uint id, uint8 answer) public {
		require(id < polls.length);
		require(answer < polls[id].answers.length);
		require(polls[id].haveVoted[msg.sender] == 0);
		console.log("votePoll:", msg.sender, id, answer);
		console.log("before:", polls[id].haveVoted[msg.sender]);
		polls[id].haveVoted[msg.sender] = answer+1;
		polls[id].votes[answer] +=1;
		console.log("after:", polls[id].haveVoted[msg.sender]);
	}

    function countVotes(uint id) view public returns (uint256[] memory res) {
		//function countVotes(uint id) view public {
		require(id < polls.length);
		uint256[] memory results = new uint[](polls[id].answers.length);
		for (uint i = 0; i < polls[id].answers.length; i++) {
			results[i] = uint256(polls[id].votes[uint16(i)]);
			//console.log doesn't allow > certain # of arguments
			console.log("result", id, i, results[i]);
		}

		return(results);
	}

}
