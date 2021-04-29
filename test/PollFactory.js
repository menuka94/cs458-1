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
    expect(newlyAddedPoll.question).to.equal(question);
    expect(await PollFactoryInstance.numPolls()).to.equal(1);

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

  it("Should be able to vote for a poll", async function() {
    // Add poll and expect a "NewPoll" event to be emitted
    await expect(PollFactoryInstance.addPoll(question, options))
        .to.emit(PollFactoryInstance, 'NewPoll')

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
});

