import React, { Component } from 'react';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mr-auto">
            <div className="content mr-auto ml-auto">
              <div className="post-img">
                <h2>Post an Image</h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.imageDescription.value
                  this.props.uploadImage(description)
                }} >
                  <input id="click" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                    <div className="form-group mr-sm-2">
                      <br></br>
                        <input
                          id="imageDescription"
                          type="text"
                          ref={(input) => { this.imageDescription = input }}
                          className="form-control"
                          placeholder="Caption"
                          required />
                    </div>
                  <button type="submit" class="btn">Post!</button>
                </form>
              </div>
              <p>&nbsp;</p>
              <div className="posts">
                { this.props.images.map((image, key) => {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <img
                          className='mr-2'
                          width='30'
                          height='30'
                          alt=""
                          // Generating random robot images from https://robohash.org/
                          src={`https://robohash.org/${image.author}?set=set1`}
                        />
                        <small className="text-muted">{image.author}</small>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item img-disp">
                          <p class="text-center"><img src={`<Your-dedicated-gateway>/ipfs/${image.hash}`} alt=""/></p>

                          <i>{image.description}</i>
                        </li>
                        <li key={key}className="list-group-item py-2">
                          <div className="more">
                            <p className="earning">
                              Earned: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                            </p>
                            <div className="tipsection">
                              <button
                                className="btn"
                                name={image.id}
                                onClick={(event) => {
                                  let amt = document.getElementById(`${image.id}`).value.toString()
                                  if(amt==''){
                                    amt='0.10'
                                  }
                                  let tipAmount = window.web3.utils.toWei(amt, 'Ether')
                                  this.props.tipImageOwner(event.target.name, tipAmount)
                                }}
                              >
                                Support
                              </button>&nbsp;&nbsp;&nbsp;
                                <input id={image.id} type="number" step="0.01" min="0.10" placeholder="0.10"/>
                                &nbsp;ETH
                            </div>
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