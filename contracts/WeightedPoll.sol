
/* SPDX-License-Identifier: GNU GENERAL PUBLIC LICENSE */

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

import "./Poll.sol";

contract WeightedPoll is Poll {
  bool     private isOpen;
  string   private question;
  Option[] private options;

  constructor(string memory q, Option[] memory o) {
    question = q;
    options  = o;
  }

  function closePoll() {
    isOpen = false;
  }
  function openPoll() {
    isOpen = true;
  }
  function getPoll() {
    return {question, options};
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

