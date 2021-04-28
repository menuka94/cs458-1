
/*
const ethers = require('ethers');

const AppContractJSON = require('../artifacts/contracts/Voting.sol/Voting.json');

// npx hardhat node
// npx hardhat run --network localhost scripts/deploy.js
async function init() {
	const provider = await new ethers.providers.JsonRpcProvider();
	const signer = await provider.getSigner()
	let app = null;
	const abi = AppContractJSON.abi;
	app = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', abi, signer);
	var bla = await app.numPolls();
	console.log("number of polls:", bla.toNumber());
	x = [ethers.utils.formatBytes32String("#1"), ethers.utils.formatBytes32String("#2")]
	await app._addPoll("Bla", x);
	bla = await app.numPolls();
	console.log("number of polls:", bla.toNumber());
	return { app, signer };
}

async function somePoll(app, id) {
	bla = await app.getPoll(0);
	console.log(bla);
	a = []
	var question = bla[0];
	console.log("Question:", question);
	for (i = 0; i < bla[1].length; i++) {
		a.push(ethers.utils.parseBytes32String(bla[1][i]));
		console.log("Answer", i, a[i]);
		}
}

(async() =>  {
	const { app, signer } = await init();
	await somePoll(app, 0);
})()
*/