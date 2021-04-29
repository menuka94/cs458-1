// symlink Voting.json to: ../../artifacts/contracts/Voting.sol/Voting.json
import VotingContract from "./Voting.json";
import { ethers } from "ethers";
import store from "./redux/store";

function huh(data) {
	return {
		type: "SOMETHING",
		payload: data
	};
}

const initBlockchain = async() => {
	let provider;
	console.log("initBlockchain");
	window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
	console.log("initBlockchain getSigner");
	const signer = await provider.getSigner();
	const userAddress = await signer.getAddress();
	console.log("su:", signer, userAddress);

	let contract = null;
	console.log(VotingContract);
	console.log("init1");
	//const parsed = JSON.parse(VotingContract);
	console.log("init2");
	contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);
	let data = { provider, signer, contract, userAddress };
	store.dispatch(huh(data));
	console.log("initBlockchain end ");
	return data;
}

export default initBlockchain;
