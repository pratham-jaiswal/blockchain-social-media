import React, { Component } from "react";
import "./App.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPosts: [],
      totalPosts: 0,
      isUserFound: false,
    };
  }

  componentDidMount() {
    this.checkIfUserExists();
  }

  checkIfUserExists = () => {
    const { address, username, allUsers } = this.props;
    if (!address || !username) {
      window.location.reload();
      return;
    }
    const isUserFound = allUsers.some(user => user.walletAddress === address && user.username === username);
    this.setState({ isUserFound });
    console.log(isUserFound)
    if (isUserFound) {
      this.fetchUserPosts();
    }
  };

  fetchUserPosts = () => {
    const userPosts = this.props.media.filter(
      (media) => media.author === this.props.address
    );
    this.setState({ userPosts, totalPosts: userPosts.length });
  };

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mr-auto">
            {this.state.isUserFound ? 
            <div className="content mr-auto ml-auto">
              <div className="user-profile">
                <img
                  className="big-pfp"
                  alt=""
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.preventDefault()}
                  onCopy={(e) => {
                    e.preventDefault();
                    alert("Copying disabled");
                  }}
                  src={`https://robohash.org/${this.props.address}?set=set1`}
                />
                <div className="user-details">
                  <h4 className="profile-username">{this.props.username}</h4>
                  <div className="profile-address">{this.props.address}</div>
                </div>
              </div>
              <p>&nbsp;</p>
              <h4 className="profile-posts">Posts - <i>{this.state.totalPosts}</i></h4>
              <p>&nbsp;</p>
              <div className="posts">
                {this.state.userPosts.map((media, key) => {
                  return (
                    <div className="card mb-4" key={key}>
                      <div className="card-header">
                        <img
                          className="mr-2"
                          width="30"
                          height="30"
                          alt=""
                          onContextMenu={(e) => e.preventDefault()}
                          onMouseDown={(e) => e.preventDefault()}
                          onCopy={(e) => {
                            e.preventDefault();
                            alert("Copying disabled");
                          }}
                          src={`https://robohash.org/${media.author}?set=set1`}
                        />
                        <div className="card-user" title={media.author}>
                          <div className="card-username">{media.username}</div>
                          <div className="card-address">{media.author}</div>
                        </div>
                      </div>
                      <ul
                        id="imageList"
                        className="list-group list-group-flush"
                      >
                        <li className="list-group-item img-disp">
                          <p className="text-center">
                            {media.mediaType === "0" ? (
                              <img
                                src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`}
                                alt=""
                                onContextMenu={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.preventDefault()}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  alert("Copying disabled");
                                }}
                              />
                            ) : (
                              <video
                                controls
                                controlsList="nodownload noremoteplayback nofullscreen"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.preventDefault()}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  alert("Copying disabled");
                                }}
                              >
                                <source
                                  src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`}
                                  type="video/mp4"
                                />
                                <source
                                  src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`}
                                  type="video/ogg"
                                />
                                <source
                                  src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`}
                                  type="video/webm"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </p>
                          <i>{media.description}</i>
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <div className="more">
                            <p className="earning">
                              Earned:{" "}
                              {window.web3.utils.fromWei(
                                media.tipAmount.toString(),
                                "Ether"
                              )}{" "}
                              ETH
                            </p>
                            {media.author !== this.props.account ? (
                              <div className="tipsection">
                                <button
                                  className="btn"
                                  name={media.id}
                                  onClick={(event) => {
                                    let amt = document
                                      .getElementById(`${media.id}`)
                                      .value.toString();
                                    if (amt === "") {
                                      amt = "0.10";
                                    }
                                    let tipAmount = window.web3.utils.toWei(
                                      amt,
                                      "Ether"
                                    );
                                    this.props.tipMediaOwner(
                                      event.target.name,
                                      tipAmount
                                    );
                                  }}
                                >
                                  Support
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                <input
                                  id={media.id}
                                  type="number"
                                  step="0.01"
                                  min="0.10"
                                  placeholder="0.10"
                                />
                                &nbsp;ETH
                              </div>
                            ) : null}
                          </div>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div> : <div>404 - User not found</div>}
          </main>
        </div>
      </div>
    );
  }
}

export default Profile;
