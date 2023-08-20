import Engager from '../abis/Engager.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import UserDataComponent from './GetUserData';

//Declare IPFS variables
const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecret = process.env.REACT_APP_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

class App extends Component {

  handleUserLoaded = (userData) => {
    this.setState({ user: userData.user, account: userData.account, authenticated: userData.isAuthenticated, loading: userData.isLoading });
    if (userData.isAuthenticated) {
      this.initializeWeb3(this.state.account);
      this.loadBlockchainData();
    }
  };

  initializeWeb3(account) {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // Initialize web3 with the user's account
      window.web3.eth.defaultAccount = account;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // Initialize web3 with the user's account
      window.web3.eth.defaultAccount = account;
    } else {
      console.error('Web3 is not available.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Engager.networks[networkId]
    console.log("a"+networkData)
    if(networkData) {
      const engager = new web3.eth.Contract(Engager.abi, networkData.address)
      this.setState({ engager })
      const mediaCount = await engager.methods.mediaCount().call();
      this.setState({ mediaCount })
      // Load images
      for (var i = mediaCount; i >= 1; i--) {
        const mediaInfo = await engager.methods.media(i).call();
        this.setState({
          media: [...this.state.media, mediaInfo]
        });
      }
      this.setState({ loading: false})
    } else {
      window.alert('Engager contract not deployed to detected network.')
    }
  }

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result), fileType: file.type });
      console.log('buffer', this.state.buffer);
    };
  };

  uploadMedia = (description, mediaType) => {
    console.log(`Submitting file to ipfs...`);

    // Adding file to IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result);
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ loading: true });
      this.state.engager.methods.uploadMedia(result[0].hash, description, mediaType).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      });
    });
  };

  tipMediaOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.engager.methods.tipMediaOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      engager: null,
      media: [], // Use a single state for both images and videos
      user: {},
      loading: true,
      authenticated: false
    };
  
    this.uploadMedia = this.uploadMedia.bind(this);
    this.tipMediaOwner = this.tipMediaOwner.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  render() {
    return (
      <div>
        <UserDataComponent onUserLoaded={this.handleUserLoaded} />
        { this.state.loading ?
            <div id="loader" className="text-center mt-5">
              <p>Loading...</p>
            </div>
            : <div>
                <Navbar account={this.state.account} authenticated={this.state.authenticated} loading={this.state.loading } />
                { !this.state.authenticated?
                <div id="loader" className="text-center mt-5">
                  <p>Please Login</p>
                </div>
                : <Main
                    account={this.state.account}
                    media={this.state.media} // Use a single state for both images and videos
                    captureFile={this.captureFile}
                    uploadMedia={this.uploadMedia}
                    tipMediaOwner={this.tipMediaOwner}
                  />
                }
              </div>
        }
      </div>
    );
  }
}

export default App;