
/* SPDX-License-Identifier: GNU GENERAL PUBLIC LICENSE */

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
  Define the interface for the PollFactory contract, allowing us to see if
  a user is registered to vote.
*/
interface PollFactoryInterface {
  function isAddressRegisteredToVote(address _address) external view returns (bool);
  function addPoll(address newPollAddress) external;
}

contract WeightedPoll is Ownable {

  PollFactoryInterface pollFactoryContract;

  struct Option {
    string option;
    uint256 votes;
  }

  bool      private isOpen;
  string    private question;
  Option[]  private options;
  uint      private creationDate;
  uint      private endDate;
  address[] private voters;

  constructor(address _pfAddress, string memory _question, string[] memory _options) {
    pollFactoryContract = PollFactoryInterface(_pfAddress);
    question = _question;
    isOpen    = true;
    creationDate = block.timestamp;
    endDate   = 0;

    for (uint i = 0; i < _options.length; i++) {
      options.push(Option(_options[i], 0));
    }

    console.log("WeightedPoll: Deployed on blockchain with address", address(this));
    console.log("WeightedPoll: Using PollFactory address", _pfAddress);
    pollFactoryContract.addPoll(address(this)); // Add ourself to the list of deployed polls in PollFactory
  }

  /*
      Function modifier for ensuring the poll is open.
  */
  modifier pollOpen() {
    require(isOpen, "Poll is closed");
    _;
  }

  /*
      Function modifier for ensuring the poll is open.
  */
  modifier pollClosed() {
    require(!isOpen, "Poll is open");
    _;
  }

  /*
    Disables a poll for voting.
  */
  function closePoll() public onlyOwner pollOpen {
    isOpen  = false;
    endDate = block.timestamp;
  }

  /*
      Enables a poll for voting.
  */
  function openPoll() public onlyOwner pollClosed {
    isOpen  = true;
    endDate = 0;
  }

  /*
      Retrieves a Poll's struct elements. We can't return a struct, so we have to disassemble the structs
      and return their components.
  */
  function getPoll() public view returns (address pollAddress,
                                          string memory pollQuestion,
                                          bool isPollOpen,
                                          uint pollCreationDate,
                                          uint pollEndDate,
                                          string[] memory pollOptions,
                                          uint[] memory pollVotes) {
    string[] memory optionsStrings = new string[](options.length);
    uint[] memory optionsVotes = new uint[](options.length);
    for (uint i = 0; i < options.length; i++) {
      optionsStrings[i] = options[i].option;
      optionsVotes[i] = options[i].votes;
    }

    return (address(this), question, isOpen, creationDate, endDate, optionsStrings, optionsVotes);
  }

  /*
      Casts a single vote for an option in a poll.
  */
  function votePoll(uint8 _optionIndex) public pollOpen hasNotAlreadyVoted isRegistered {
    require(_optionIndex < options.length, "Option index is invalid");

    console.log("votePoll:", msg.sender, _optionIndex);
    console.log("hasVoted before:", _hasVotedForPoll(msg.sender));
    voters.push(msg.sender);                                        // Add msg.sender to list of voters
    options[_optionIndex].votes++;                                  // Increment chosen option's vote count
    console.log("hasVoted after:", _hasVotedForPoll(msg.sender));
  }

  /*
      Counts the votes for each of the options.
  */
  function countVotes() public view returns (uint256[] memory res) {
    uint256[] memory results = new uint[](options.length);
    for (uint i = 0; i < options.length; i++) {
      results[i] = options[i].votes;
    }

    return results;
  }

  /*
      Function modifier for ensuring the sender has not already voted for the poll.
  */
  modifier hasNotAlreadyVoted() {
    require(!_hasVotedForPoll(msg.sender), "You've already voted for this poll");
    _;
  }

  /*
      Checks if msg.sender has already voted for a specific poll.
  */
  function _hasVotedForPoll(address _voter) private view returns (bool) {
    for (uint i = 0; i < voters.length; i++) {
      if (voters[i] == _voter) {
        return true;
      }
    }
    return false;
  }

  /*
      Function modifier for ensuring the msg.sender is a registered voter.
  */
  modifier isRegistered() {
    require(pollFactoryContract.isAddressRegisteredToVote(msg.sender), "Sender is not a registered registered voter");
    _;
  }
}

