import React, { Component } from 'react';
import photo from '../logo.png'
import './App.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
        >
          <div>
            <img src={photo} width="30" height="30" className="app-logo d-inline-block align-top" alt="" />
          </div>
          <div className="app-name">GenSea</div>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            { this.props.authenticated && this.props.registered ?
              (<div className="d-flex">
                <small className="text-secondary p-2">
                  <a href="/chat">
                    <i className="fa-solid fa-message"></i>
                  </a>
                </small>
                <small className="text-secondary p-2">
                  <span>Balance:</span>&nbsp;
                  <small id="account">{this.props.balance} ETH</small>
                </small>
                <small className="text-secondary p-2">
                  <span>Earned:</span>&nbsp;
                  <small id="account">{this.props.earned} ETH</small>
                </small>
                <small className="text-secondary p-2">
                  <span>Tipped:</span>&nbsp;
                  <small id="account">{this.props.tipped} ETH</small>
                </small>
                <div className="p-2">
                  <small className="text-secondary" title={this.props.account}>
                    <small id="account" >
                      <a href="/profile">
                        <i>{this.props.username}</i>
                      </a>
                    </small>
                  </small>
                  
                  <a href="/profile">
                    <img
                      className='ml-2'
                      width='30'
                      height='30'
                      alt=""
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={(e) => e.preventDefault()}
                      onCopy={(e) => {
                        e.preventDefault();
                        alert("Copying disabled");
                      }}
                      src={`https://robohash.org/${this.props.account}?set=set1`}
                    />
                  </a>
                </div>

                
                    
                <LogoutButton />
                
              </div>)
              : !this.props.authenticated ? <LoginButton /> : <div></div>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;