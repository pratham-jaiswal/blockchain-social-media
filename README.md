# GenSea - Blockchain based Social Media

GenSea is a decentralized social media platform that uses Ethereum smart contracts to store user data and IPFS for image storage. The platform also allows users to chat with each other. The platform is built using React, Truffle, and Solidity.

## Features

1. User can login or create an account using their Ethereum Wallet (Metamask).
2. User can create posts with images and videos.
3. Posts are moderated using Sightengine before being uploaded.
4. User can tip ethereum on posts.
5. User can chat with other users.

## Demo

| ![](https://res.cloudinary.com/dhzmockpa/image/upload/v1718704300/Blockchain%20Social%20Media%20GitHub/evqmmbhinprzfenn2dtt.png) |
|:--:|
| <i>Homepage</i>|

| ![](https://res.cloudinary.com/dhzmockpa/image/upload/v1718704300/Blockchain%20Social%20Media%20GitHub/uxl3srbi0rrdorwupexq.png) |
|:--:|
| <i>User Profile</i>|

| ![](https://res.cloudinary.com/dhzmockpa/image/upload/v1718704299/Blockchain%20Social%20Media%20GitHub/w5qna0shqng1n75nwafm.png) |
|:--:|
| <i>Chat</i>|

## Technologies Used

1. React.js
2. [Truffle](https://archive.trufflesuite.com/)
3. [Ganache](https://archive.trufflesuite.com/ganache/)
4. [Solidity](https://soliditylang.org/)
5. [Infura](https://app.infura.io/) IPFS
6. [Sightengine](https://sightengine.com/)

## Getting Started (Node v16.20.1)

1. Clone the repository
```sh
git clone https://github.com/pratham-jaiswal/blockchain-social-media.git
```
2. Install dependencies
```sh
cd blockchain-social-media
npm install
```
3. Start Ganache app
4. Compile and deploy smart contracts
```sh
truffle compile
truffle migrate
```
5. Retrieve the Auth0, Infura, and Sightengine keys, then add them to the .env file using the .env-example as a reference.
```.env
REACT_APP_PROJECT_SECRET=INFURA_SECRET
REACT_APP_PROJECT_ID=INFURA_PROJECT_ID
REACT_APP_GATEWAY=https://YOUR-GATEWAY.infura-ipfs.io
REACT_APP_AUTH0_DOMAIN=AUTH0_DOMAIN
REACT_APP_AUTH0_ID=AUTH0_ID
REACT_APP_SIGHTENGINE_WORKFLOW=SIGHTENGINE_WORKFLOW
REACT_APP_SIGHTENGINE_USER=SIGHTENGINE_USER
REACT_APP_SIGHTENGINE_SECRET=SIGHTENGINE_SECRET
REACT_APP_SIGHTENGINE_IMG_URL=https://api.sightengine.com/1.0/check-workflow.json
REACT_APP_SIGHTENGINE_VID_URL=https://api.sightengine.com/1.0/video/check-workflow-sync.json
```
6. Start the React app
```sh
npm start
```