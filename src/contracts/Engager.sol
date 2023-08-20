// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Engager {
  string public name;
  uint public mediaCount = 0;
  mapping(uint => Media) public media;

  enum MediaType { Image, Video }

  struct Media {
    uint id;
    string hash;
    string description;
    MediaType mediaType;
    uint tipAmount;
    address payable author;
  }

  event MediaCreated(
    uint id,
    string hash,
    string description,
    MediaType mediaType,
    uint tipAmount,
    address payable author
  );

  event MediaTipped(
    uint id,
    string hash,
    string description,
    MediaType mediaType,
    uint tipAmount,
    address payable author
  );

  constructor() {
    name = "Engager";
  }

  function uploadMedia(string memory _mediaHash, string memory _description, MediaType _mediaType) public {
    require(bytes(_mediaHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0));

    mediaCount++;

    media[mediaCount] = Media(mediaCount, _mediaHash, _description, _mediaType, 0, payable(msg.sender));

    emit MediaCreated(mediaCount, _mediaHash, _description, _mediaType, 0, payable(msg.sender));
  }

  function tipMediaOwner(uint _id) public payable {
    require(_id > 0 && _id <= mediaCount);

    Media memory _media = media[_id];
    address payable _author = _media.author;

    _author.transfer(msg.value);

    _media.tipAmount += msg.value;
    media[_id] = _media;

    emit MediaTipped(_id, _media.hash, _media.description, _media.mediaType, _media.tipAmount, _author);
  }
}