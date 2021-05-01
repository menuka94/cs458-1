
/* SPDX-License-Identifier: GNU GENERAL PUBLIC LICENSE */

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;


  
interface Poll {
  struct Option {
    string option;
    uint256 votes;
  }

  function closePoll() {}
  function openPoll() {}
  function getPoll() {}
  function votePoll(uint8 _optionIndex) {}
  function countVotes() {}
  function isOpen() {}
  function hasVoted(address _voter) {}
}

