
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { useWebSocket } from "../../websocketprovider";
import Navbar from "../../components/Layout/Navbar";

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const func = async () => {
      if (!localStorage.getItem("user")) {
        console.log("user logged in");
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("user")));
      }
    };
    func();
  }, [navigate]);

  const { socket, addUser } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
        addUser(currentUser._id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }
  }, [socket, addUser, currentUser]);

  useEffect(() => {
    const func = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    func();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Navbar />
      <Container>
        <div className="chat-container-modern">
          <div className="chat-sidebar">
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          </div>
          <div className="chat-main">
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}



const Container = styled.div`
  min-height: calc(100vh - 80px); /* Account for navbar height */
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  overflow: hidden; /* Prevent page scroll */
  position: relative;
  top: 0;
  left: 0;

  .chat-container-modern {
    width: 100%;
    max-width: 100vw;
    height: calc(100vh - 120px); /* Account for navbar + padding */
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 350px 1fr;
    overflow: hidden;

    @media screen and (max-width: 1024px) {
      grid-template-columns: 300px 1fr;
      margin: 0;
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
      height: calc(100vh - 100px);
      margin: 0;
      padding: 0;
    }
  }

  .chat-sidebar {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .chat-main {
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

