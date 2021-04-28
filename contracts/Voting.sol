pragma solidity ^0.7.0;

contract Voting {
    struct Vote {
        bytes32 uuid;
        uint256 weight;
    }

    mapping(address => bool) public hasVoted;

    // votes received by a given candidate
    mapping(bytes32 => Vote[]) votesReceived;

    bytes32[] public candidateList;

    constructor(bytes32[] memory candidateNames) public {
        candidateList = candidateNames;
    }

    // get the total votes (weighted) for a given candidate
    function totalVotesFor(bytes32 candidate) view public returns (uint256){
        uint256 totalVotes = 0;
        Vote[] memory votesArr = votesReceived[candidate];

        for (uint i = 0; i < votesArr.length; i++) {
            totalVotes += votesArr[i].weight;
        }

        return totalVotes;
    }

    function voteForCandidate(bytes32 candidate, uint256 weight) public {
        require(validCandidate(candidate));
        require(!hasVoted[msg.sender]);
        Vote[] memory votesArr = votesReceived[candidate];
        Vote memory newVote = Vote({uuid: keccak256(abi.encodePacked(msg.sender)), weight: weight});
        votesArr[votesArr.length] = newVote;
        hasVoted[msg.sender] = true;
    }

    function validCandidate(bytes32 candidate) view public returns (bool) {
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}