import React, { useState,useEffect } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, Input, Spinner,Text, useToast } from '@chakra-ui/react';
import {getSender, getSenderFull} from "../config/ChatLogics"
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  
  const {user, selectedChat, setSelectedChat} =   ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

    useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", ()=> setSocketConnected(true))
    socket.on('typing', ()=>setIsTyping(true))
    socket.on('stop typing', ()=>setIsTyping(false))

  },[])

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };






  const typingHandler = (e)=>{
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };
  
  useEffect(() => {
    fetchMessages();
    setMessages([]);

    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket.on("message recieved",(newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        // give notification
      }
      else{
        setMessages([...messages, newMessageRecieved]);
      }
    })
  })
  
    return (
    <>
      {
        selectedChat? (
        <>
            <Text 
                fontSize={{base:"28px", md:"30px"}}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work Sans"
                display="flex"
                justifyContent={{base:"space-between"}}
                alignItems="center"
                >
                  {!selectedChat.isGroupChat ? (
                    <>
                      {getSender(user, selectedChat.users)}
                      <ProfileModal user = {getSenderFull(user, selectedChat.users)}/>
                    </>
                  ):(
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal 
                    fetchAgain = {fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages = {fetchMessages}
                    />
                    </>
                  )}
                </Text>

                <Box 
                  display="flex"
                  flexDir="column"
                  justifyContent="flex-end"
                  p={3}
                  bg="white"
                  width="100%"
                  h="100%"
                  borderRadius="lg"
                  overflowY="hidden"
                >
                  {loading ? (
                    <Spinner
                      size="xl"
                      width={20}
                      height={20}
                      alignSelf="center"
                      margin="auto"
                    />

                  ):(
                    <div className='messages'>
                      <ScrollableChat messages={messages} />
                    </div>
                  )}

                  <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                      {isTyping? <div className="typing-indicator">typing....</div>:<></>}
                      
                      <Input 
                        variant="filled"
                        background="#e0e0e0"
                        placeholder="Enter a message"
                        onChange={typingHandler}
                        value={newMessage}
                      />
                  </FormControl>

                </Box>
        </>
    ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
                Click on a user to start chat
            </Text>
        </Box>
    )
      }
    </>
  )
}

export default SingleChat