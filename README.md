# ETH With Friends

## Introduction
ETH With Friends is a Dapp (decentralized application) that allows you to see which of your friends are using Ethereum and view their registered and verified Ethereum wallet address. This tool provides an easy way for you to send money to your friends without needing them to send you their long and inconvenient Ethereum address!

This app is built using the Ethereum blockchain as the backend, meaning it runs completely in the browser and does not use any servers.

## Using the Dapp

### Web3
Use of the Dapp requires injected Web3 through the use of [MetaMask](https://metamask.io/) (alternatives exist as well). The UI will indicate that Web3 was detected successfully.

### Logging into Facebook
Use the button to log into Facebook (if you are not already).

### Setting Ethereum Address
Click the button to set your identity on the Ethereum blockchain. You will be prompted to send a transaction through your Web3 provider.

### Finding Friends
Your list of friends who have registered with the app and registered their Ethereum address is displayed at the bottom of the page. You can view addresses can send ETH directly from the Dapp. Click on a name in the list to send ETH to a friend.

## Security
The Ethereum Smart Contract is written so that identities are verified before the addresses are stored. We use an Oracle to verify from the Facebook API that the user is properly logged into Facebook before they can store their identity.

This protects against bad actors who try to save their own wallet addresses under someone else's Facebook identity.