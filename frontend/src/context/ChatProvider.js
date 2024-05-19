import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
       setUser(userInfo);}
    else {
        // Check if history object and push method are available
        if (history && history.push) {
          history.push('/');
        } else {
          console.error('History object or push method is not available.');
        }
      }

    // if (!userInfo){ 
    //     history.push("/");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;






// import { createContext, useContext, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Initialize user state with null
//   const history = useHistory();

//   useEffect(() => {
//     try {
    //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //   if (userInfo) {
    //     setUser(userInfo);
    //   } else {
    //     // Check if history object and push method are available
    //     if (history && history.push) {
    //       history.push('/');
    //     } else {
    //       console.error('History object or push method is not available.');
    //     }
    //   }
//     } catch (error) {
//       console.error('Error parsing user info from localStorage:', error);
//       // Redirect to home route if there's an error
//       if (history && history.push) {
//         history.push('/');
//       } else {
//         console.error('History object or push method is not available.');
//       }
//     }
//   }, [history]);

//   return (
//     <ChatContext.Provider value={{ user, setUser }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => useContext(ChatContext);

// export default ChatProvider;
