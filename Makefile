build:
	npx hardhat compile

clean:
	npx hardhat clean

update-abi:
	rm -rf ./votingdapp/src/contracts_abi/PollFactory.sol;
	cp -r ./artifacts/contracts/PollFactory.sol ./votingdapp/src/contract_abi/