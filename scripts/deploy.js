async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying PollFactory contract with the account:",
      deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const PollFactory = await ethers.getContractFactory("PollFactory");
    const pollFactoryToken = await PollFactory.deploy();

    console.log("PollFactory contract address:", pollFactoryToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
