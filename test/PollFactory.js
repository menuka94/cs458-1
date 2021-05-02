const {expect} = require("chai");

describe("PollFactory", function () {

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
        PollFactory = await ethers.getContractFactory("PollFactory");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        PollFactoryInstance = await PollFactory.deploy();
    });

    it("Should return 0 for numPolls() at initialization", async function () {
        expect(await PollFactoryInstance.numPolls()).to.equal(0);
    });

    it("Should be able to deploy a new Poll and retrieve it", async function () {

        // Deploy a poll with the PollFactory's address
        let WeightedPoll = await ethers.getContractFactory("WeightedPoll");
        await WeightedPoll.deploy(PollFactoryInstance.address, question, options);

        // Retrieve newly added poll, assert it was created properly and poll count increased.
        const [ pollQuestion,
          pollIsOpen,
          pollCreationDate,
          pollEndDate,
          pollOptions,
          pollVotes ] = await PollFactoryInstance.getPoll(0);

        expect(pollQuestion).to.equal(question);                          // poll.question should be correct
        expect(pollIsOpen).to.equal(true);                          // poll should be open
        expect(pollCreationDate.toNumber()).to.be.greaterThan(0);   // start date should be > 0
        expect(pollEndDate.toNumber()).to.equal(0);                 // end date should be 0
        for (let i = 0; i < pollOptions.length; i++) {
            expect(pollOptions[i]).to.equal(options[i]);
            expect(pollVotes[i]).to.equal(0);
        }
        expect(await PollFactoryInstance.numPolls()).to.equal(1);   // should only be 1 poll in existence
    });

    it("Should be able to register to vote", async function() {

        // Register for voting
        await PollFactoryInstance.registerVoter();
        let result = await PollFactoryInstance.isRegisteredToVote();
        await expect(result).to.equal(true);

        // Artificially increase Ethereum Virtual Machine time and mine a new block with that time.
        // This allows "block.timestamp" to take on a new value in the smart contract.
        await network.provider.send("evm_increaseTime", [3600]);
        await network.provider.send("evm_mine");
        result = await PollFactoryInstance.registeredVoterFor();
        expect(result.toNumber()).to.be.greaterThan(0);
    });



    /*



     */

});

