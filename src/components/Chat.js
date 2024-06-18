import React, { useState, useEffect, useRef } from "react";
import JSEncrypt from 'jsencrypt';

const Chat = ({ genSea, account, allUsers }) => {
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const encryptMessage = (message, publicKey) => {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        if (encryptor) {
            return encryptor.encrypt(message);
        }
        return null;
    };

    useEffect(() => {
        setOtherUsers(allUsers.filter((u) => u.walletAddress !== account));
    }, [allUsers, account]);

    useEffect(() => {
        if (genSea) {
            const messageSentEvent = genSea.events.MessageSent({ filter: { from: account } });
            messageSentEvent.on('data', (event) => {
                setMessages([{ from: event.returnValues.from, message: event.returnValues.message, timestamp: event.returnValues.timestamp }, ...messages]);
                scrollToBottom();
            });
            messageSentEvent.on('error', function(error) {
                console.error('Error fetching messages:', error);
            });

            return () => {
                messageSentEvent.removeAllListeners();
            };
        }
    }, [genSea, account, messages, selectedUser]);

    useEffect(() => {

        const decryptMessage = (encryptedMessageObject) => {
            try{
                let message = "";
                const { from, to, encrMsgTo, encrMsgFrom, ...rest } = encryptedMessageObject;
                const decryptor = new JSEncrypt();
                decryptor.setPrivateKey(localStorage.getItem(`privateKey-${account}`));
                if (decryptor) {
                    if (to === account)
                    {
                        message = encrMsgTo;
                    }
                    else if (from === account)
                    {
                        message = encrMsgFrom;
                    }
                    const decryptedText = decryptor.decrypt(message)
                    const decryptedMessageObject = { from, to, message: decryptedText, ...rest };
                    return decryptedMessageObject;
                }
                return null;
            }
            catch (error) {
                console.error('Error decrypting messages:', error);
                return null;
            }
        };

        if(selectedUser){
            if(selectedUser.walletAddress.trim() !== '')
            {
                const loadMessages = async (justOpened = false) => {
                    try {
                        
                        const messageCount = await genSea.methods.messageCount().call();
                        const loadedMessages = [];

                        for (let i = messageCount; i >= 1; i--) {
                            const messagesInfo = await genSea.methods.messages(i).call();
                            if((messagesInfo.from === account && messagesInfo.to === selectedUser.walletAddress) || (messagesInfo.to === account && messagesInfo.from === selectedUser.walletAddress))
                            {
                                const decryptedMsg = decryptMessage(messagesInfo);
                                loadedMessages.unshift(decryptedMsg);
                            }
                        }

                        setMessages(loadedMessages);
                        if(justOpened){
                            scrollToBottom();
                        }
                    } catch (error) {
                        console.error('Error loading messages:', error);
                    }
                };
    
                const intervalId = setInterval(loadMessages, 100);
                loadMessages(true);
    
                return () => clearInterval(intervalId);
            }
        }  
    }, [selectedUser, account, genSea]);

    async function handleSendMessage() {
        try {
            const encryptedMsgToBlockchain = encryptMessage(message, selectedUser.publicKey);
            const encryptedMsgFromBlockchain = encryptMessage(message, localStorage.getItem(`publicKey-${account}`));
    
            await genSea.methods.sendMessage(selectedUser.walletAddress, encryptedMsgToBlockchain, encryptedMsgFromBlockchain, new Date().toString()).send({ from: account })
                .on('transactionHash', function(hash) {
                    setMessage("");
                })
                .on('error', function(error) {
                    console.error('Error sending message:', error);
                });
        } 
        catch (error) {
            console.error("Failed to send message:", error);
        }
    }    

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="ChatApp">
            <div className="contacts-container">
                {otherUsers.map((contact, index) => (
                <div
                    key={index}
                    className={`contact ${ selectedUser && selectedUser.walletAddress === contact.walletAddress ? "selected" : "" }`}
                    onClick={() => setSelectedUser(contact)}
                >
                    {contact.username}
                </div>
                ))}
            </div>
            <div className="messages-container">
                {selectedUser && (
                    <form className="chat-area" onSubmit={(event) => {
                        event.preventDefault();
                        handleSendMessage();
                    }}>
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div 
                                    key={index} 
                                    className={`message ${
                                        message.from === selectedUser.walletAddress ? "from" : "to"
                                    }`}
                                >
                                    {message.message}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="send-message">
                            <textarea className="write-message" rows="1" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className="send-button" type="submit">Send</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Chat;