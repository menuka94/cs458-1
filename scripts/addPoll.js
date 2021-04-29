const AppContractJSON = require("../artifacts/contracts/PollFactory.sol/PollFactory.json");
const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

async function init() {
  const provider = await new ethers.providers.JsonRpcProvider();
  const signer = await provider.getSigner()
  let app = new ethers.Contract(ContractAddress, AppContractJSON.abi, signer);

  await app.addPoll("Third poll", ["B1", "B2", "B3", "B4"]);
  await app.addPoll("What is the largest country in the world?", ["Russia", "Canada", "China", "United States"]);

  let num = await app.numPolls();
  console.log("num:", num.toNumber());

  return {app, signer};
}

(async () => {
  const {app, signer} = await init();
  //await somePoll(app, 0);
})()

