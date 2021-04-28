// pragma experimental ABIEncoderV2;


/*
const { expect } = require("chai");

describe("Voting contract", function () {
    let Voting;
    let hardhatVoting;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        Voting = await ethers.getContractFactory("Voting");
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
	hardhatVoting = await Voting.deploy();
	//console.log("Contract deployed");
    });

    describe("Deployment", function () {
	it("Adding poll 0", async function () {
		x = [ethers.utils.formatBytes32String("foo")]
		await expect(hardhatVoting._addPoll("Something here", x)).to.emit(hardhatVoting, "newPoll").withArgs(0);
	});
    });

    describe("Check question", function () {
	it("Adding poll 0", async function () {
		x = [ethers.utils.formatBytes32String("foo"), ethers.utils.formatBytes32String("bla")]
		x2 = []
		hardhatVoting._addPoll("Test", x);
	        const bla = await hardhatVoting.getPoll(0);
		const question = bla[0]
		for (i = 0; i < bla[1].length; i++) {
			x2.push(ethers.utils.parseBytes32String(bla[1][i]));
		}
	        expect(question).to.equal("Test");
		expect(x2[0]).to.equal('foo');
		expect(x2[1]).to.equal('bla');
	});
    });

    describe("Count polls", function () {
	console.log("Count polls");
	it("Counting polls", async function () {
		x = [ethers.utils.formatBytes32String("foo"), ethers.utils.formatBytes32String("bla")]
		hardhatVoting._addPoll("Something", x);
		hardhatVoting._addPoll("Something 2", x);
		const num = await hardhatVoting.numPolls();
		expect(num).to.equal(2);
	});
    });

    describe("Voting", function () {
	console.log("Checking voting");
	it("Counting polls", async function () {
		x = [ethers.utils.formatBytes32String("foo"), ethers.utils.formatBytes32String("bla")]
		hardhatVoting._addPoll("Something", x);
		await hardhatVoting.connect(addr1).votePoll(0, 0);
		await hardhatVoting.connect(addr2).votePoll(0, 1);
		await hardhatVoting.connect(addr3).votePoll(0, 1);
		const res = await hardhatVoting.countVotes(0);
		// to convert bignumber back to int
		const v1 = res[0].toNumber();
		const v2 = res[1].toNumber();
		expect(v1).to.equal(1);
		expect(v2).to.equal(2);
	});
    });

});
*/