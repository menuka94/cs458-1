build:
	npx hardhat compile

clean:
	npx hardhat clean

update-abi:
	rm -rf ./votingdapp/src/contracts_abi/PollFactory.sol ./votingdapp/src/contracts_abi/WeightedPoll.sol;
	cp -r ./artifacts/contracts/PollFactory.sol ./artifacts/contracts/WeightedPoll.sol ./votingdapp/src/contract_abi/