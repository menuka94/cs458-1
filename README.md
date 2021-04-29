# CS458 Voting DApp Term Project

## Run Locally 

1. `npm install`
2. `npx hardhat compile`
3. `make update-abi`
4. `cd votingdapp` and `npm install`
5. `npx hardhat node` -- keep this running in a separate terminal window. Copy a private key from a generated account.
6. `npx hardhat run --network localhost scripts/deploy.js` -- Copy the Contract Address and replace the `ContractAddress` 
   variable in both `scripts/addPoll.js` and `votingdapp/src/initBlockchain.js`
7. `npx hardhat run scripts/addPolls.js`
8. `cd votingdapp` and `npm start`

### Connecting Metamask
- From the dropdown in Metamask UI, choose `localhost:8545` as the network
- From the menu in the upper right corner
    - `Create Account`
    - Move to `Import` tab
    - Paste the private key copied in Step 5 above and click `Import`
  
