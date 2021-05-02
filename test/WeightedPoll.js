const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeightedPoll", function() {

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

    let question = "Who should be the next person?";
    let options = ["Alice", "Bob", "Don"];

    /*
        Runs before each test, re-deploying the contract every
        time. It receives a callback, which can be async.
    */
    beforeEach(async function () {
        PollFactory = await ethers.getContractFactory("PollFactory");
        PollFactoryInstance = await PollFactory.deploy();
        await PollFactoryInstance.addPoll(true, question, options);

        // Deploy the poll with the PollFactory's address
        WeightedPoll = await ethers.getContractFactory("WeightedPoll");
        WeightedPollInstance = await WeightedPoll.deploy(PollFactoryInstance.address, true, question, options);

        // First deploy the PollFactory to handle voter registration
        // and keep track of any deployed polls.
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    it("Should not be able to vote for a poll without registering", async function() {

        // Try to vote for poll (3rd option) without registering, should be reverted.
        //await expect(WeightedPollInstance.votePoll(2, owner.address))
        //    .to.be.revertedWith("Sender is not a registered voter")
    });

    it("Should be able to vote once for a poll after registering", async function() {

        // Register for voting
        await PollFactoryInstance.registerVoter();
        let isRegistered = await PollFactoryInstance.isRegisteredToVote();
        expect(isRegistered).to.equal(true);

        // Have the owner of the contract vote for Jack Daniels
        await WeightedPollInstance.votePoll(2, owner.address);

        // Assert 1 vote for Jack Daniels
        let votes = await WeightedPollInstance.countVotes();
        expect(votes[0]).to.equal(0);
        expect(votes[1]).to.equal(0);
        expect(votes[2]).to.equal(1);

        // Assert 1 vote for Jack Daniels
        let weights = await WeightedPollInstance.countWeights();
        console.log(weights[2].toNumber());

        // Try to vote again for another candidate, should be rejected
        await expect(WeightedPollInstance.votePoll(1, owner.address)).to.be.revertedWith("You've already voted for this poll");
    });

    it("Owner should be able to open/close a poll for voting", async function() {

        // Retrieve newly added poll, assert it is open.
        let [ pollAddress,
            pollQuestion,
            pollIsWeighted,
            pollIsOpen,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes,
            pollWeights ] = await WeightedPollInstance.getPoll();
        expect(pollIsOpen).to.equal(true);

        // Close the poll, assert it is not open and endDate >= startDate
        await WeightedPollInstance.closePoll();
        [ pollAddress,
            pollQuestion,
            pollIsWeighted,
            pollIsOpen,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes,
            pollWeights ] = await WeightedPollInstance.getPoll();
        expect(pollIsOpen).to.equal(false);

        // Artificially increase Ethereum Virtual Machine time and mine a new block with that time.
        // This allows "block.timestamp" to take on a new value in the smart contract.
        await network.provider.send("evm_increaseTime", [3600]);
        await network.provider.send("evm_mine");
        [ pollAddress,
            pollQuestion,
            pollIsOpen,
            pollIsWeighted,
            pollCreationDate,
            pollEndDate,
            pollOptions,
            pollVotes,
            pollWeights ] = await WeightedPollInstance.getPoll();
        expect(pollEndDate.toNumber()).to.be.greaterThan(pollCreationDate.toNumber());

        // Try to vote for closed poll, should be reverted
        await expect(WeightedPollInstance.votePoll(1, owner.address))
            .to.be.revertedWith("Poll is closed")
    });




});