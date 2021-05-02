const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PollFactory", function() {

    let WeightedPoll;
    let WeightedPollInstance;
    let PollFactory;
    let PollFactoryInstance;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    /*
      Helpful testing tips:
      To switch to another address to interact with contract, use:
      await PollFactoryInstance.connect(addr1).votePoll(0, 0);

      To format Javascript string to bytes32 use:
      ethers.utils.formatBytes32String("foo");

      To convert BigNumber back to int use:
      res[0].toNumber();
    */

    let question = "Who should be the next Grand Wizard?";
    let options = ["Alice", "Bob", "Jack Daniels"];

    /*
        Runs before each test, re-deploying the contract every
        time. It receives a callback, which can be async.
    */
    beforeEach(async function () {
        // First deploy the PollFactory to handle voter registration
        // and keep track of any deployed polls.
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        PollFactory = await ethers.getContractFactory("PollFactory");
        PollFactoryInstance = await PollFactory.deploy();

        // Deploy the poll with the PollFactory's address
        WeightedPoll = await ethers.getContractFactory("WeightedPoll");
        WeightedPollInstance = await WeightedPoll.deploy(PollFactoryInstance.address, question, options);
    });

    it("Should not be able to vote for a poll without registering", async function() {

        // Try to vote for poll (3rd option) without registering, should be reverted.
        await expect(WeightedPollInstance.votePoll(2))
            .to.be.revertedWith("Sender is not a registered registered voter")
    });

    it("Should be able to vote once for a poll after registering", async function() {

        // Register for voting
        await PollFactoryInstance.registerVoter();
        let isRegistered = await PollFactoryInstance.isRegisteredToVote();
        expect(isRegistered).to.equal(true);

        // Have the owner of the contract vote for Jack Daniels
        await WeightedPollInstance.votePoll(2);

        // Assert 1 vote for Jack Daniels
        let votes = await WeightedPollInstance.countVotes();
        expect(votes[0]).to.equal(0);
        expect(votes[1]).to.equal(0);
        expect(votes[2]).to.equal(1);

        // Try to vote again for another candidate, should be rejected
        await expect(WeightedPollInstance.votePoll(1)).to.be.revertedWith("You've already voted for this poll");
    });

    it("Owner should be able to open/close a poll for voting", async function() {

        // Retrieve newly added poll, assert it is open.
        let [ pollQuestion,
            pollIsOpen,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes ] = await WeightedPollInstance.getPoll();
        expect(pollIsOpen).to.equal(true);

        // Close the poll, assert it is not open and endDate >= startDate
        await WeightedPollInstance.closePoll();
        [ pollQuestion,
            pollIsOpen,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes ] = await WeightedPollInstance.getPoll();
        expect(pollIsOpen).to.equal(false);

        // Artificially increase Ethereum Virtual Machine time and mine a new block with that time.
        // This allows "block.timestamp" to take on a new value in the smart contract.
        await network.provider.send("evm_increaseTime", [3600]);
        await network.provider.send("evm_mine");
        [ pollQuestion,
            pollIsOpen,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes ] = await WeightedPollInstance.getPoll();
        expect(pollEndDate.toNumber()).to.be.greaterThan(pollCreationDate.toNumber());

        // Try to vote for closed poll, should be reverted
        await expect(WeightedPollInstance.votePoll(1))
            .to.be.revertedWith("Poll is closed")
    });




});