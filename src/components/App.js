import GenSea from '../abis/GenSea.json'
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar'
import Main from './Main'
import Chat from './Chat';
import Web3 from 'web3';
import './App.css';
import GetUserData from './GetUserData';
import JSEncrypt from 'jsencrypt';
import Profile from './Profile';

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
      this.setState({ loading: true })
      this.initializeWeb3(this.state.account);
      this.loadBlockchainData();
    }
  };

  async initializeWeb3(account) {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
      window.web3.eth.defaultAccount = account;
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.web3.eth.defaultAccount = account;
    }
    else {
      console.error('Web3 is not available.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = GenSea.networks[networkId]
    if(networkData) {
      const genSea = new web3.eth.Contract(GenSea.abi, networkData.address)
      this.setState({ genSea });

      const userCount = await genSea.methods.userCount().call();
      for (var i = userCount; i >= 1; i--) {
        const userInfo = await genSea.methods.users(i).call();
        if(userInfo.walletAddress === this.state.account && !this.state.registered)
        {
          this.setState({ username: userInfo.username, registered: true });
        }
        this.setState({
          allUsers: [...this.state.allUsers, userInfo]
        });
      }
      
      const mediaCount = await genSea.methods.mediaCount().call();
      this.setState({ mediaCount })
      for (i = mediaCount; i >= 1; i--) {
        const mediaInfo = await genSea.methods.media(i).call();
        this.setState({
          media: [...this.state.media, mediaInfo]
        });
      }

      const balance = parseFloat(window.web3.utils.fromWei(await web3.eth.getBalance(this.state.account))).toFixed(2);
      this.setState({ balance: balance.toString() });

      const tipped = await this.calculateTotalTipped();
      this.setState({ tipped: (parseFloat(tipped).toFixed(2)).toString() });

      const earned = this.calculateTotalEarned();
      this.setState({ earned: (parseFloat(earned).toFixed(2)).toString() });

      this.initializeEventListeners();

      this.setState({ loading: false})
    }
    else {
      window.alert('GenSea contract not deployed to detected network.')
    }
  }

  addUser = async () => {
    this.setState({ loading: true });
    try {
      const encryptor = new JSEncrypt({ default_key_size: 4096 });
      localStorage.setItem(`privateKey-${this.state.account}`, encryptor.getPrivateKey());
      localStorage.setItem(`publicKey-${this.state.account}`, encryptor.getPublicKey());

      await this.state.genSea.methods.addUser(this.state.username, localStorage.getItem(`publicKey-${this.state.account}`)).send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false, username: this.username, registered: true });
        });
    } catch (error) {
      console.error('Error adding user:', error);
      this.setState({ loading: false });
    }
  };

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result), fileType: file.type });
    };
  };

  uploadMedia = (description, mediaType) => {
    ipfs.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ loading: true });
      this.state.genSea.methods.uploadMedia(this.state.username, result[0].hash, description, mediaType).send({ from: this.state.account }).on('transactionHash', (hash) => {
        window.location.reload();
        this.setState({ loading: false });
      });
    });
  };

  tipMediaOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.genSea.methods.tipMediaOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false });
    })
  }

  updateTippedMedia(id, tipAmount) {
    const updatedMedia = this.state.media.map((media) => {
      if (media.id === id) {
        const updatedTipAmount = window.web3.utils.toBN(tipAmount);
        return { ...media, tipAmount: updatedTipAmount.toString() };
      }
      return media;
    });
  
    this.setState({ media: updatedMedia });
  }

  calculateTotalEarned() {
    var userMedia = this.state.media.filter(obj => obj.author === this.state.account);
    let totalEarned = userMedia.reduce((accumulator, media) => {
      return accumulator.add(window.web3.utils.toBN(media.tipAmount));
    }, window.web3.utils.toBN(0));
  
    return window.web3.utils.fromWei(totalEarned.toString(), 'Ether');
  }

  async calculateTotalTipped() {
    const web3 = window.web3;
    const userAccount = this.state.account;
    const mediaCount = this.state.mediaCount;
    
    let totalTipped = web3.utils.toBN(0);
  
    for (let i = 1; i <= mediaCount; i++) {
      const userTip = await this.state.genSea.methods.mediaTips(i, userAccount).call();
      totalTipped = totalTipped.add(web3.utils.toBN(userTip));
    }
  
    return web3.utils.fromWei(totalTipped.toString(), 'Ether');
  }

  initializeEventListeners() {
    if (this.state.genSea) {
      this.state.genSea.events.MediaTipped({}, (error, event) => {
        if (!error) {
          this.setState({
            mediaTippedEvents: [...this.state.mediaTippedEvents, event]
          });
          this.calculateAndSetNewTippedAmount();
          this.updateTippedMedia(event.returnValues.id, event.returnValues.tipAmount);
        }
      })
      .on('error', (error) => {
        console.error('MediaTipped event error:', error);
      });
  
      this.state.genSea.events.UserAdded({}, (error, event) => {
        if (error) {
          console.error('UserAdded event error:', error);
        }
      })
      .on('error', (error) => {
        console.error('UserAdded event error:', error);
      });

      this.state.genSea.events.MessageSent({}, (error, event) => {
        if (error) {
          console.error('MessageSend event error:', error);
        }
      })
      .on('error', (error) => {
        console.error('MessageSend event error:', error);
      });
    }
  }
  

  async calculateAndSetNewTippedAmount() {
    const newTipped = await this.calculateTotalTipped();
    const newEarned = parseFloat(this.calculateTotalEarned()).toFixed(2);
    
    this.setState({
      tipped: (parseFloat(newTipped).toFixed(2)).toString(),
      earned: newEarned.toString()
    });
  }

  handleChange = (event) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^A-Za-z0-9]/g, '').toLowerCase(); // Remove any characters that are not alphanumeric
    this.setState({ username: sanitizedValue});
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      username:'',
      registered: false,
      allUsers: [],
      genSea: null,
      media: [],
      mediaCount: 0,
      user: {},
      loading: true,
      authenticated: false,
      mediaTippedEvents: [],
      balance: '0',
      earned: '0',
      tipped: '0'
    };

    this.uploadMedia = this.uploadMedia.bind(this);
    this.tipMediaOwner = this.tipMediaOwner.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.initializeEventListeners = this.initializeEventListeners.bind(this);
    this.updateTippedMedia = this.updateTippedMedia.bind(this);
  }

  render() {
    return (
      <Router>
      <div>
        <GetUserData onUserLoaded={this.handleUserLoaded} />
        { this.state.loading ?
            <div id="loader" className="text-center mt-5">
              <p>Loading...</p>
            </div>
            : this.state.authenticated && !this.state.registered ?
            <div>
              <Navbar
                account={this.state.account}
                authenticated={this.state.authenticated}
                username={this.state.username}
                registered={this.state.registered}
                loading={this.state.loading}
                balance={this.state.balance}
                earned={this.state.earned}
                tipped= {this.state.tipped}
              />
              <form className="register-form" onSubmit={(event) => {
                event.preventDefault();
                this.addUser();
              }}>
                <h2>Welcome to GenSea!!</h2>
                <h4>Please fill-out the details</h4>
                <div>
                  <label>Username:</label>
                  <input
                    id = "username"
                    type="text"
                    className="register-input"
                    placeholder="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    minLength={4}
                    maxLength={30}
                    required
                  />
                </div>
                <div>
                  <label>Ethereum Wallet Address:</label>
                  <input 
                    type="text"
                    className="register-input"
                    value={this.state.account}
                    disabled
                  />
                </div>
                <button className="btn" type="submit">Send</button>
              </form>
            </div> : (<Routes>
              <Route path="/" element={
                <div>
                  <Navbar
                    account={this.state.account}
                    authenticated={this.state.authenticated}
                    loading={this.state.loading}
                    username={this.state.username}
                    registered={this.state.registered}
                    balance={this.state.balance}
                    earned={this.state.earned}
                    tipped= {this.state.tipped}
                  />
                  { !this.state.authenticated?
                  <div id="loader" className="text-center mt-5">
                    <p>Please Login</p>
                  </div>
                  : <Main
                      account={this.state.account}
                      username={this.state.username}
                      media={this.state.media}
                      captureFile={this.captureFile}
                      uploadMedia={this.uploadMedia}
                      tipMediaOwner={this.tipMediaOwner}
                    />
                  }
                </div>
              } />
              
              <Route path="/chat" element={
                <div>
                  <Navbar
                    account={this.state.account}
                    authenticated={this.state.authenticated}
                    loading={this.state.loading}
                    username={this.state.username}
                    registered={this.state.registered}
                    balance={this.state.balance}
                    earned={this.state.earned}
                    tipped= {this.state.tipped}
                  />
                  { !this.state.authenticated?
                  <div id="loader" className="text-center mt-5">
                    <p>Please Login</p>
                  </div>
                  : <Chat
                    genSea={this.state.genSea}
                    account={this.state.account}
                    allUsers={this.state.allUsers}
                  />
                  }
                </div>
              } />

              <Route path="/profile" element={
                <div>
                  <Navbar
                    account={this.state.account}
                    authenticated={this.state.authenticated}
                    loading={this.state.loading}
                    username={this.state.username}
                    registered={this.state.registered}
                    balance={this.state.balance}
                    earned={this.state.earned}
                    tipped= {this.state.tipped}
                  />
                  { !this.state.authenticated?
                  <div id="loader" className="text-center mt-5">
                    <p>Please Login</p>
                  </div>
                  : <Profile
                      allUsers={this.state.allUsers}
                      address={this.state.account}
                      account={this.state.account}
                      username={this.state.username}
                      media={this.state.media}
                    />
                  }
                </div>
              } />
              <Route path="/s" element={
                <div>
                  <Navbar
                    account={this.state.account}
                    authenticated={this.state.authenticated}
                    loading={this.state.loading}
                    username={this.state.username}
                    registered={this.state.registered}
                    balance={this.state.balance}
                    earned={this.state.earned}
                    tipped= {this.state.tipped}
                  />
                  { !this.state.authenticated?
                  <div id="loader" className="text-center mt-5">
                    <p>Please Login</p>
                  </div>
                  : <Profile
                      allUsers={this.state.allUsers}
                      address={new URLSearchParams(window.location.search).get('address')}
                      account={this.state.account}
                      username={new URLSearchParams(window.location.search).get('username')}
                      media={this.state.media}
                    />
                  }
                </div>
              } />
            </Routes>
            
          )
        }
      </div>
      </Router>
    );
  }
}

export default App;