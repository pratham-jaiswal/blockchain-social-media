# Blockchain Approach to Decentralize Social Media - Engager
A blockchain-based social media platform where users can post images/videos and tip test ethereum to others. Media is stored on Infura IPFS nodes using content-based addressing.

![Imgur](https://i.imgur.com/FW4cLx2.png)

## Features
**1. User Authentication**
- Users can log in using Auth0 authentication.
- User account information, balance, earned and tipped amounts are displayed in the navbar.

**2. Media Upload and Display**
- Users can upload images and videos to IPFS.
- Uploaded media is displayed on the main page.
- Uploaded media includes descriptions, creator information, and media type.

**3. Media Interaction**
- Users can view and play uploaded media files (images and videos).
- Users can tip the creator of media using Ethereum.
- Earned and tipped amounts are updated dynamically.

## Requirements
### Metamask
1. Install [Metamask] browser plugin, and create an account.

### Ganache
1. Download [Ganache](https://trufflesuite.com/ganache/), click on **New Workspace**, under **Truffle Projects** click on **Add Project**, locate and select your *truffle-config.js* file, then click on **Save Workspace**.
2. Setup Ganache network on Metamask by following this [guide](https://trufflesuite.com/ganache/), and export some of your ganache accounts to metamask by following this [guide](https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/).

### Infura
1. Create an [Infura](https://infura.io/) account, and provide all the details.
2. If you created a new infura account then **Create Your First Project**, select **IPFS** in **Network** and enter your **Project Name**.
3. Then click on **Create New Key**, select **IPFS** in **Network** and enter your **Project Name**.
4. Enter the required details.



5. Now you'll get a **Project ID** and **API Key**.
6. Enable the **Dedicated Gateways** and enter a **UNIQUE SUBDOMAIN NAME**.
7. Now back to the files, run the command ```touch .env```.
8. Edit the *.env* file as:
    ```.env
    REACT_APP_PROJECT_SECRET=examplesecret123
    REACT_APP_PROJECT_ID=exampleid123
    REACT_APP_GATEWAY='https://examplegateway.infura-ipfs.io'
    ```

### Auth0
1. Login/Create an account on [Auth0](https://auth0.com/).
2. If you created a new account fill the details further asked.
3. Once the dashboard opens, on the sidebar click on **Applications**, and then again **Applications**.
4. Click on **Create Applications**, then choose **Single Page Web Applications**, and then **Create**.
5. Go to the **Settings** tab and copy the **Domain**, **Client ID**, and **Client Secret**, then edit the *.env* file as:
    ```.env
    REACT_APP_AUTH0_DOMAIN=exampledomain.us.auth0.com
    REACT_APP_AUTH0_ID=exampleid789
    REACT_APP_AUTH0_SECRET=examplesecret789
    ```
6. Scroll down to **Application URIs**, and add your link or *http://localhost:3000* to **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**, then scroll down and click on **Save Changes**.
7. In the sidebar click on **Marketplace**, and search for *Ethereum*, click on **Sign-in with Ethereum**, then **Add Integration**.
8. Don't close the **siwe** page.
9. Send a post request from your terminal or [Postman](https://www.postman.com/) to *https://oidc.login.xyz/register* along with the following data in your body: (Replace *your-domain.us.auth0.com* with your own domain)
    ```.json
    {
        "redirect_uris": [
            "https://your-domain.us.auth0.com/login/callback" 
        ]
    }
    ```
10. You will receive a response as below:
    ```.json
    {
        "client_id": "example-id-456",
        "client_secret": "examplesecret456",
        "registration_access_token": "exampletoken456",
        "registration_client_uri": "https://oidc.login.xyz/client/example-path-456",
        "redirect_uris": [
            "https://your-domain.us.auth0.com/login/callback"
        ]
    }
    ```
11. Edit the *.env* file as:
    ```.env
    REACT_APP_SIWE_ID=example-id-456
    REACT_APP_SIWE_SECRET=examplesecret456
    REACT_APP_REG_ACCESS_TOKEN=exampletoken456
    REACT_APP_REG_CLIENT_URI=https://oidc.login.xyz/client/example-path-456
    ```
12. Go back to the **siwe** page, and enter the values you received in **Client ID** (`REACT_APP_SIWE_ID`) and **Client Secret** (`REACT_APP_SIWE_SECRET`), enable **Profile**, and then click on **Save Changes**.

## Get Started
1. Works perfectly on ***Node v16.20.1***
2. Clone the repository
    ```sh
    git clone https://github.com/pratham-jaiswal/engager.git
    ```
3. Navigate to the project directory, and install the required dependencies
    ```sh
    npm install
    ```
4. Create a *.env* file in the project root and set the environment variables as in *.env.example*
5. Compile the smart contracts using ```truffle migrate --reset```
6. Run the app using ```npm start```.