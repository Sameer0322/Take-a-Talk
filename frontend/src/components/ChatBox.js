import React from 'react'
import { ChatState } from "../context/ChatProvider"
import { Box } from "@chakra-ui/react"
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const {selectedChat}= ChatState();
  return (
    <Box
    display={{base: selectedChat ? "flex" : "none", md:"flex"}}
    alignItems="center"
    flexDir="column"
    padding={3}
    bg="grey"
    width={{base:"100%", md:"68%"}}  // Always occupy 100% width
    borderRadius="lg"
    borderWidth="1px"
  >
      <SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
