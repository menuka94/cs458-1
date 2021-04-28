const { expect } = require("chai");

describe("PollFactory", function() {
  it("Should return 0 for numPolls() at initialization", async function() {
    const PollFactory = await ethers.getContractFactory("PollFactory");
    const pollFactory = await PollFactory.deploy();
    
    await pollFactory.deployed();
    expect(await pollFactory.numPolls()).to.equal(0);
  });
});