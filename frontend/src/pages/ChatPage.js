import { Box } from "@chakra-ui/layout";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import Chatbox from "../components/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (<div style={{width:'100%'}}>
    {user && <SideDrawer />}

    <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
      {user && (
        <MyChats fetchAgain = {fetchAgain}  />)}
      {user && (
        <Chatbox fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain} />)}
    </Box>
    </div>
    );
};

export default Chatpage;