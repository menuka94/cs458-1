// symlink Voting.json to: ../../artifacts/contracts/Voting.sol/Voting.json
import VotingContract from "./Voting.json";
import {ethers} from "ethers";
import store from "./redux/store";

function huh(data) {
  return {
    type: "SOMETHING",
    payload: data
  };
}

const initBlockchain = async () => {
  let provider;
  window.ethereum.enable()
    .then(provider = new ethers.providers.Web3Provider(window.ethereum));

  const signer = await provider.getSigner();
  console.log('signer:', signer);

  const userAddress = await signer.getAddress();
  console.log("userAddress:", userAddress);

  console.log(VotingContract);
  //const parsed = JSON.parse(VotingContract);
  let contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);
  let data = {provider, signer, contract, userAddress};
  store.dispatch(huh(data));
  console.log("initBlockchain end");
  return data;
}

export default initBlockchain;
