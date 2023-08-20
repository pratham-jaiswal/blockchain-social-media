import React, { Component } from 'react';
import photo from '../logo.png'
import './App.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar" style={{backgroundColor: "rgb(225,0,225)"}}>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://pratham-jaiswal.github.io/personal-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          Engager
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            { this.props.authenticated?
              (<div className="d-flex">
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
                  <small className="text-secondary">
                    <span>Address:</span>&nbsp;
                    <small id="account">{this.props.account}</small>
                  </small>
                  <img
                    className='ml-2'
                    width='30'
                    height='30'
                    alt=""
                    src={`https://robohash.org/${this.props.account}?set=set1`}
                    // src={this.props.pfp}
                  />
                </div>
                     
                <LogoutButton />
              </div>)
              : <LoginButton />
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;