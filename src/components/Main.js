import React, { Component } from 'react';
import './App.css';

class Main extends Component {
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
    
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mr-auto">
            <div className="content mr-auto ml-auto">
              <div className="post-img">
                <h2>Post Something...</h2>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const description = this.mediaDescription.value;
                    const fileName = this.fileInput.files[0].name; // Assuming you have a file input field
                    const mediaType = detectMediaType(fileName); // Implement this function to detect media type
                    this.props.uploadMedia(description, mediaType);
                  }}
                >
                  <input
                    ref={(input) => { this.fileInput = input; }}
                    id="click"
                    type="file"
                    accept=".jpg, .jpeg, .png, .bmp, .gif, .mp4, .ogg, .webm" // Add supported formats
                    onChange={this.props.captureFile}
                  />
                  <div className="form-group mr-sm-2">
                    <br/><br/>
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
                          // Generating random robot images from https://robohash.org/
                          src={`https://robohash.org/${media.author}?set=set1`}
                        />
                        <small className="text-muted">{media.author}</small>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item img-disp">
                          <p className="text-center">
                            {media.mediaType === '0' ? (
                              <img src={`${process.env.REACT_APP_GATEWAY}/ipfs/${media.hash}`} alt="" />
                            ) : (
                              <video controls>
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