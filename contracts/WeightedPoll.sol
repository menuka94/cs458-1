
/* SPDX-License-Identifier: GNU GENERAL PUBLIC LICENSE */

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

import "./Poll.sol";

contract WeightedPoll is Poll {
  bool     private isOpen;
  string   private question;
  Option[] private options;
  uint     private creationDate;
  uint     private endDate;

  constructor(string memory q, string[] memory o) {
    question = q;
    isOpen    = false;
    creationDate = block.timestamp;
    endDate   = 0;

    for (uint i = 0; i < o.length; i++) {
      options.push(Option(o[i], 0));
    }

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
    Disables a poll for voting.
  */
  function closePoll(uint _id) public onlyOwner validPollId(_id) pollOpen(_id) {
    isOpen  = false;
    endDate = block.timestamp;
  }

  /*
      Enables a poll for voting.
  */
  function openPoll(uint _id) public onlyOwner validPollId(_id) pollClosed(_id) {
    isOpen  = true;
    endDate = 0;
  }

  /*
      Retrieves a Poll by its id. We can't return a struct, so we have to disassemble the structs
      and return their components.
  */
  function getPoll() public view validPollId(_id) returns ( string memory question,
                                                            string[] memory options,
                                                            uint[] memory votes ) {
    string[] memory optionsStrings = new string[](options.length);
    uint[] memory optionsVotes = new uint[](options.length);
    for (uint i = 0; i < options.length; i++) {
      optionsStrings[i] = options[i].option;
      optionsVotes[i] = options[i].votes;
    }

    return (question, optionsStrings, optionsVotes);
  }

  function votePoll(uint8 _optionIndex) {
    options[_optionIndex] += 1;
  }

  function countVotes() {}

  function pollOpen() {
    return isOpen;
  }
  function pollClosed() {}
  function hasVoted(address _voter) {}
}

