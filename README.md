# Blockchain Approach to Decentralize Social Media - Engager

### _Steps_
1. Run ```npm install``` to download the required node modules.
2. On windows the *truffle-config.js* file shouldn't be renamed to *truffle.js*.
3. Download [Ganache], click on **New Workspace**, then under **Truffle Projects** click on **Add Project**, then locate and select your *truffle-config.js* file, then click on **Save Workspace**.
4. Install [Metamask] browser plugin, and create an account.
5. Setup Ganache network on Metamask by following this [guide], and export some of your ganache accounts to metamask by following this [guide.]
6. Create an [Infura] account, and provide all the details.
7. If you created a new infura account then **Create Your First Project**, select **IPFS** in **Network** and enter your **Project Name**.
8. Then click on **Create New Key**, select **IPFS** in **Network** and enter your **Project Name**.
9. Enter the card details (if you are making your first project, else you would have completed this step earlier).
The details can be seen in the image below:
[![Infura First Project Requirement](https://i.imgur.com/fdvm6DY.jpg)](https://i.imgur.com/fdvm6DY.jpg)

10. Now you'll get a **Project ID** and **API Key**.
11. Enable the **Dedicated Gateways** and enter a **UNIQUE SUBDOMAIN NAME**.
12. Now back to the files, run the command ```touch .env``` 
13. Edit the *.env* file as:
```
INFURA_API_KEY='<YOUR INFRUA API KEY>'
MNEMONIC='<Your Ganache 12 Phrase Mnemonic>'
PROJECT_ID='<YOUR INFRUA PROJECT ID>'
```
14. If the authorization is failing the remove the variables ```PROJECT_ID``` and ```INFURA_API_KEY``` from *app.js* file and directly past your api key and project id as:
```js
//Declare IPFS
const projectId = '<YOUR INFRUA PROJECT ID>';
const projectSecret = '<YOUR INFRUA API KEY>';
```
15. Compile the smart contracts using ```truffle migrate --reset --network development``` (the use of ```--network development``` is optional). If you want to publish it on any other network like *Goerli*, then use ```truffle migrate --reset --network goerli```.
16. Run the app using ```npm run start```.

### _Requirements_
1. Metamask Account [(1)]
2. Ganache GUI [(2)]
3. Infura account and key [(3)]
4. Node Package Manager [(4)]

[//]: #

   [Ganache]: <https://trufflesuite.com/ganache/>
   [Infura]: <https://infura.io/>
   [guide]: <https://dapp-world.com/blogs/01/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947>
   [guide.]: <https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/#:~:text=Ganache%20CLI,on%20the%20ganache%20blockchain%20successfully.>
   [(1)]: <https://myterablock.medium.com/how-to-create-or-import-a-metamask-wallet-a551fc2f5a6b>
   [(2)]: <https://trufflesuite.com/docs/ganache/quickstart/>
   [(3)]: <https://blog.infura.io/post/getting-started-with-infura-28e41844cc89>
   [(4)]: <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/>