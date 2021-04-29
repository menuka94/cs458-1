/* SPDX-License-Identifier: GNU GENERAL PUBLIC LICENSE */

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PollFactory is Ownable {

    struct Option {
        string option;
        uint256 votes;
    }

    struct Poll {
        string question;
        Option[] options;
        bool isOpen;
        address[] voters;
    }

    event NewPoll(uint id);

    Poll[] public polls;

    /*
        Called when the contract is deployed to the blockchain.
    */
    constructor() {
        console.log("Deployed on blockchain");
    }

    /*
        Creates a new Poll in storage, using the question and options passed to
        the function.
        Note: Solidity >= 0.6.0 returns nothing from push()
    */
    function addPoll(string memory _question, string[] memory _options) public onlyOwner {
        polls.push();                   // Allocate space in storage for new Poll
        uint id = polls.length - 1;     // Get index as new size
        Poll storage poll = polls[id];  // Use index to get storage ptr to Poll
        poll.question     = _question;
        poll.isOpen       = true;

        // Create and push Poll Options
        for (uint i = 0; i < _options.length; i++) {
            poll.options.push(Option(_options[i], 0));
        }

        console.log("Added poll #", id);
        emit NewPoll(id);
    }

    /*
        Disables a poll for voting.
    */
    function closePoll(uint _id) public onlyOwner validPollId(_id) pollOpen(_id) {
        polls[_id].isOpen = false;
    }

    /*
        Retrieves a Poll by its id. We can't return a struct, so we have to disassemble the structs
        and return their components.
    */
    function getPoll(uint _id) public view validPollId(_id) returns (string memory question,
                                                                     string[] memory options,
                                                                     uint[] memory votes) {
        Poll memory poll = polls[_id]; // Bring Poll into memory
        string[] memory optionsStrings = new string[](poll.options.length);
        uint[] memory optionsVotes = new uint[](poll.options.length);
        for (uint i = 0; i < poll.options.length; i++) {
            optionsStrings[i] = poll.options[i].option;
            optionsVotes[i] = poll.options[i].votes;
        }

        return (polls[_id].question, optionsStrings, optionsVotes);
    }

    /*
        Fetches the total number of polls, inactive and active.
    */
    function numPolls() public view returns (uint) {
        return polls.length;
    }

    /*
        Casts a single vote for an option in a poll.
    */
    function votePoll(uint _id, uint8 _optionIndex) public validPollId(_id) pollOpen(_id) {
        require(_optionIndex < polls[_id].options.length, "Option index is invalid");
        require(!_hasVotedForPoll(_id, msg.sender), "You've already voted for this poll");

        console.log("votePoll:", msg.sender, _id, _optionIndex);
        console.log("hasVoted before:", _hasVotedForPoll(_id, msg.sender));
        polls[_id].voters.push(msg.sender);     // Add msg.sender to list of voters
        polls[_id].options[_optionIndex].votes++; // Increment chosen option's vote count
        console.log("hasVoted after:", _hasVotedForPoll(_id, msg.sender));
    }

    /*
        Counts the votes for each of the options.
    */
    function countVotes(uint _id) public view validPollId(_id) returns (uint256[] memory res) {
        uint256[] memory results = new uint[](polls[_id].options.length);
        for (uint i = 0; i < polls[_id].options.length; i++) {
            results[i] = polls[_id].options[i].votes;
        }

        return results;
    }

    // TODO: Refactor helper functions into separate file ---------

    /*
        Function modifier for ensuring a valid Poll ID is sent.
    */
    modifier validPollId(uint _id) {
        require(_isValidPollId(_id), "Poll ID is invalid");
        _;
    }

    function _isValidPollId(uint _id) private view returns (bool) {
        return _id < polls.length;
    }

    /*
        Function modifier for ensuring the poll is open.
    */
    modifier pollOpen(uint _id) {
        require(polls[_id].isOpen, "Poll is closed");
        _;
    }

    /*
        Function modifier for ensuring the poll is open.
    */
    modifier pollClosed(uint _id) {
        require(!polls[_id].isOpen, "Poll is open");
        _;
    }

    /*
        Checks if msg.sender has already voted for a specific poll.
    */
    function _hasVotedForPoll(uint _id, address _voter) private view returns (bool) {
        for (uint i = 0; i < polls[_id].voters.length; i++) {
            if (polls[_id].voters[i] == _voter) {
                return true;
            }
        }
        return false;
    }
}
