// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GenSea {
  string public name;
  uint public userCount = 0;
  uint public mediaCount = 0;
  uint public messageCount = 0;
  mapping(uint => Media) public media;
  mapping(uint => Message) public messages;
  mapping(uint => mapping(address => uint)) public mediaTips;
  mapping(uint => User) public users;

  enum MediaType { Image, Video }

  struct User {
    uint id;
    address walletAddress;
    string username;
    string publicKey;
  }

  struct Message {
    uint id;
    address from;
    address to;
    string encrMsgTo;
    string encrMsgFrom;
    string timestamp;
  }

  struct Media {
    uint id;
    string hash;
    string description;
    MediaType mediaType;
    uint tipAmount;
    address payable author;
    string username;
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

  event MessageSent(
    address indexed from,
    address indexed to,
    string timestamp
  );

  event UserAdded(
    uint id,
    address walletAddress,
    string username
  );

  constructor() {
    name = "GenSea";
  }

  function addUser(string memory username, string memory publickey) public {
    require(msg.sender != address(0));
    require(bytes(username).length > 0);
    require(bytes(publickey).length > 0);

    for (uint256 i = 1; i <= userCount; i++) {
      require(users[i].walletAddress != msg.sender);
    }

    userCount++;
    users[userCount] = User(userCount, msg.sender, username, publickey);
    
    emit UserAdded(userCount, msg.sender, username);
  }

  function uploadMedia(string memory username, string memory _mediaHash, string memory _description, MediaType _mediaType) public {
    require(bytes(_mediaHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0));

    mediaCount++;

    media[mediaCount] = Media(mediaCount, _mediaHash, _description, _mediaType, 0, payable(msg.sender), username);

    emit MediaCreated(mediaCount, _mediaHash, _description, _mediaType, 0, payable(msg.sender));
  }

  function tipMediaOwner(uint _id) public payable {
    require(_id > 0 && _id <= mediaCount);

    Media memory _media = media[_id];
    address payable _author = _media.author;

    _author.transfer(msg.value);

    _media.tipAmount += msg.value;
    mediaTips[_id][msg.sender] += msg.value;
    media[_id] = _media;

    emit MediaTipped(_id, _media.hash, _media.description, _media.mediaType, _media.tipAmount, _author);
  }

  function sendMessage(address to, string memory encrMsgTo, string memory encrMsgFrom, string memory time) public {
    require(bytes(encrMsgTo).length > 0);
    require(bytes(encrMsgFrom).length > 0);
    require(msg.sender != address(0));
    require(to != address(0));

    messageCount++; 
    messages[messageCount] = Message(messageCount, msg.sender, to, encrMsgTo, encrMsgFrom, time);
    
    emit MessageSent(msg.sender, to, time);
  }
}