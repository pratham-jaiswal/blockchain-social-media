import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import FormData from 'form-data';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadText: "",
      uploadStatus: null,
    };
  }

  render() {
    function detectMediaType(fileName) {
      if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg') || fileName.toLowerCase().endsWith('.png') || fileName.toLowerCase().endsWith('.bmp') || fileName.toLowerCase().endsWith('.gif')) {
        return 0;
      } else if (fileName.toLowerCase().endsWith('.mp4') || fileName.toLowerCase().endsWith('.avi') || fileName.toLowerCase().endsWith('.mkv')) {
        return 1;
      } else {
        return 'Unknown';
      }
    }

    const uploadImage = (description, mediaType) => {
      const file = this.fileInput.files[0];
    
      const data = new FormData();
      data.append('media', file);
      data.append('workflow', process.env.REACT_APP_SIGHTENGINE_WORKFLOW);
      data.append('api_user', process.env.REACT_APP_SIGHTENGINE_USER);
      data.append('api_secret', process.env.REACT_APP_SIGHTENGINE_SECRET);
    
      axios({
        method: 'post',
        url: process.env.REACT_APP_SIGHTENGINE_IMG_URL,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if(response.data.status === "success")
        {
          if (response.data.summary.action === "accept")
          {
            try{
              this.props.uploadMedia(description, mediaType);
              this.setState({ uploadText: "Success!", uploadStatus: "success" })
            }
            catch(err){
              
              this.setState({ uploadText: "Something went wrong", uploadStatus: "error" })
            };
          }
          else
          {
            this.setState({ uploadText: "Your post contains inappropriate content.", uploadStatus: "error" });
          }
        }
        else
        {
          this.setState({ uploadText: "Something went wrong on our end", uploadStatus: "error" });
          console.log(console.log(response))
        }
      })
      .then( () => {
        setTimeout(() => {
          this.setState({ uploadText: "", uploadStatus: null });
        }, 5000);
      })
      .catch(function (error) {
        console.log(error);
      });
    };

    const uploadVideo = (description, mediaType) => {
      const file = this.fileInput.files[0];
      const data = new FormData();
      data.append('media', file);
      data.append('workflow', process.env.REACT_APP_SIGHTENGINE_WORKFLOW);
      data.append('api_user', process.env.REACT_APP_SIGHTENGINE_USER);
      data.append('api_secret', process.env.REACT_APP_SIGHTENGINE_SECRET);

      axios({
        method: 'post',
        url: process.env.REACT_APP_SIGHTENGINE_VID_URL,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if(response.data.status === "success")
        {
          if (response.data.summary.action === "accept")
          {
            try{
              this.props.uploadMedia(description, mediaType);
              this.setState({ uploadText: "Success!", uploadStatus: "success" })
            }
            catch(err){
              
              this.setState({ uploadText: "Something went wrong", uploadStatus: "error" })
            };
          }
          else
          {
            this.setState({ uploadText: "Your post contains inappropriate content.", uploadStatus: "error" });
          }
        }
        else
        {
          this.setState({ uploadText: "Something went wrong on our end", uploadStatus: "error" });
        }
      })
      .then( () => {
        setTimeout(() => {
          this.setState({ uploadText: "", uploadStatus: null });
        }, 5000);
      })
      .catch(function (error) {
        console.log(error);
      });
    };

    const handleMediaUpload = (event) => {
      event.preventDefault();
      const description = this.mediaDescription.value;
      const fileName = this.fileInput.files[0].name;
      const mediaType = detectMediaType(fileName);

      this.setState({ uploadText: "Processing...", uploadStatus: "process" });
      if (mediaType === 0) {
        const image = new Image();
        image.src = URL.createObjectURL(this.fileInput.files[0]);
        image.onload = () => {
          uploadImage(description, mediaType);
        };
      }
      else if (mediaType === 1) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(this.fileInput.files[0]);
        video.onloadedmetadata = () => {
          if (video.duration < 60) {
            uploadVideo(description, mediaType);
          } else {
            this.setState({ uploadText: "Video length exceeds 60 seconds.", uploadStatus: "error" });
            setTimeout(() => {
              this.setState({ uploadText: "", uploadStatus: null });
            }, 5000);
          }
        };
      } 
      else {
        this.setState({ uploadText: "Incorrect file type.", uploadStatus: "error" });
        setTimeout(() => {
          this.setState({ uploadText: "", uploadStatus: null });
        }, 5000);
      }
    };
    
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mr-auto">
            <div className="content mr-auto ml-auto">
              <div className="post-img">
                <h2>Post Something...</h2>
                <form onSubmit={handleMediaUpload}>
                  <input
                    ref={(input) => { this.fileInput = input; }}
                    id="click"
                    type="file"
                    accept=".jpg, .jpeg, .png, .jfif, .bmp, .gif, .mp4, .ogg, .webm"
                    onChange={this.props.captureFile}
                    required
                  />
                  {this.state.uploadStatus !== null ?
                    <div className={this.state.uploadStatus}>
                      {this.state.uploadText}
                    </div> : 
                    <div>&nbsp;</div>
                  }
                  <div className="form-group mr-sm-2">
                    <br/>
                    <input
                      id="mediaDescription"
                      type="text"
                      ref={(input) => {
                        this.mediaDescription = input;
                      }}
                      className="form-control"
                      placeholder="Caption"
                      required
                    />
                  </div>
                  <button type="submit" className="btn">Post!</button>
                </form>
              </div>
              <p>&nbsp;</p>
              <div className="posts">
                { this.props.media.map((media, key) => {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <img
                          className='mr-2'
                          width='30'
                          height='30'
                          alt=""
                          onContextMenu={(e) => e.preventDefault()}
                          onMouseDown={(e) => e.preventDefault()}
                          onCopy={(e) => {
                            e.preventDefault();
                            alert("Copying disabled");
                          }}
                          src={`https://robohash.org/${media.author}?set=set1`}
                        />
                        <Link to={{ pathname: "/s", search: `?username=${media.username}&address=${media.author}` }}>
                          <div className="card-user" title={media.author}>
                            <div className='card-username'>{media.username}</div>
                            <div className='card-address'>{media.author}</div>
                          </div>
                        </Link>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item img-disp">
                          <p className="text-center">
                            {media.mediaType === '0' ? (
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
                              <video controls
                                controlsList="nodownload noremoteplayback nofullscreen"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.preventDefault()}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  alert("Copying disabled");
                                }}
                              >
                                <source src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`} type="video/mp4" />
                                <source src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`} type="video/ogg" />
                                <source src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </p>
                          <i>{media.description}</i>
                        </li>
                        <li key={key}className="list-group-item py-2">
                          <div className="more">
                            <p className="earning">
                              Earned: {window.web3.utils.fromWei(media.tipAmount.toString(), 'Ether')} ETH
                            </p>
                            {media.author !== this.props.account ?
                            <div className="tipsection">
                              <button
                                className="btn"
                                name={media.id}
                                onClick={(event) => {
                                  let amt = document.getElementById(`${media.id}`).value.toString()
                                  if(amt===''){
                                    amt='0.10'
                                  }
                                  let tipAmount = window.web3.utils.toWei(amt, 'Ether')
                                  this.props.tipMediaOwner(event.target.name, tipAmount)
                                }}
                              >
                                Support
                              </button>&nbsp;&nbsp;&nbsp;
                                <input id={media.id} type="number" step="0.01" min="0.10" placeholder="0.10" />
                                &nbsp;ETH
                            </div> : null}
                          </div>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;