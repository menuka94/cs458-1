const { expect } = require("chai");

describe("PollFactory", function() {

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

  it("Should return 0 for numPolls() at initialization", async function() {
    expect(await PollFactoryInstance.numPolls()).to.equal(0);
  });

  it("Should be able to deploy a new Poll and retrieve it", async function() {
    // Add poll and expect a "NewPoll" event to be emitted
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

    // Retrieve newly added poll, assert it was created properly and poll count increased.
    const newlyAddedPoll = await PollFactoryInstance.polls(0);
    expect(newlyAddedPoll.question).to.equal(question);                      // poll.question should be correct
    expect(newlyAddedPoll.isOpen).to.equal(true);                       // poll should be open
    expect(newlyAddedPoll.startDate.toNumber()).to.be.greaterThan(0);   // start date should be > 0
    expect(newlyAddedPoll.endDate.toNumber()).to.equal(0);              // end date should be 0
    expect(await PollFactoryInstance.numPolls()).to.equal(1);           // should only be 1 poll in existence

    // Retrieve newly added poll question, options, and votes from getPoll() function
    const [actualQuestion, actualOptions, actualVotes] = await PollFactoryInstance.getPoll(0);
    expect(actualQuestion).to.equal(question);
    expect(actualOptions.length).to.equal(options.length);
    expect(actualVotes.length).to.equal(options.length);

    // Expect options to match up
    for (let i = 0; i < options.length; i++) {
      expect(actualOptions[i]).to.equal(options[i]);
    }
  });

  it("Should be able to register to vote", async function() {
    // Add poll and expect a "NewPoll" event to be emitted
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

    // Register for voting
    await PollFactoryInstance.registerVoter();
    let result = await PollFactoryInstance.isRegisteredToVote();
    await expect(result).to.equal(true);

    // Artificially increase Ethereum Virtual Machine time and mine a new block with that time.
    // This allows "block.timestamp" to take on a new value in the smart contract.
    await network.provider.send("evm_increaseTime", [3600])
    await network.provider.send("evm_mine")
    result = await PollFactoryInstance.registeredVoterFor();
    expect(result.toNumber()).to.be.greaterThan(0);
  });

  it("Should not be able to vote for a poll without registering", async function() {
    // Add poll and expect a "NewPoll" event to be emitted
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

    // Try to vote for poll without registering, should be reverted.
    await expect(PollFactoryInstance.votePoll(0, 2))
        .to.be.revertedWith("Sender is not a registered registered voter")
  });

  it("Should be able to vote for a poll after registering", async function() {
    // Add poll and expect a "NewPoll" event to be emitted
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

    // Register for voting
    await PollFactoryInstance.registerVoter();

    // Have the owner of the contract vote for Jack Daniels
    await PollFactoryInstance.votePoll(0, 2);

    // Assert 1 vote for Jack Daniels
    let votes = await PollFactoryInstance.countVotes(0);
    expect(votes[0]).to.equal(0);
    expect(votes[1]).to.equal(0);
    expect(votes[2]).to.equal(1);

    // Try to vote again for another candidate, should be rejected
    await expect(PollFactoryInstance.votePoll(0, 1)).to.be.revertedWith("You've already voted for this poll");
  });

  it("Only contract owner should be able to create a poll", async function() {
    await expect(PollFactoryInstance.connect(addr1).addPoll(question, options))
        .to.be.revertedWith("Ownable: caller is not the owner")
  });

  it("Should be able to open/close a poll for voting", async function() {
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

    // Retrieve newly added poll, assert it is open
    let newlyAddedPoll = await PollFactoryInstance.polls(0);
    expect(newlyAddedPoll.isOpen).to.equal(true);

    // Close the poll, assert it is not open and endDate >= startDate
    await PollFactoryInstance.closePoll(0);
    newlyAddedPoll = await PollFactoryInstance.polls(0);
    expect(newlyAddedPoll.isOpen).to.equal(false);
    expect(newlyAddedPoll.endDate.toNumber()).to.be.greaterThanOrEqual(newlyAddedPoll.startDate.toNumber());

    // Try to vote for closed poll, should be reverted
    await expect(PollFactoryInstance.votePoll(0, 1))
        .to.be.revertedWith("Poll is closed")
  });

});

