import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Video from "./video";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const receive = async () => {
      const data = await JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      
      // Add mock timestamps to existing messages for demo purposes
      const messagesWithTimestamps = response.data.map((msg, index) => {
        const now = new Date();
        const daysAgo = Math.floor(index / 3); // Group every 3 messages by day
        const messageDate = new Date(now);
        messageDate.setDate(now.getDate() - daysAgo);
        messageDate.setHours(now.getHours() - (index % 12));
        
        return {
          ...msg,
          timestamp: messageDate.toISOString()
        };
      });
      
      setMessages(messagesWithTimestamps);
    };
    receive();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      // App.displaymsg();
      if (currentChat) {
        await JSON.parse(localStorage.getItem("user"))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem("user"));
    socket.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ 
      fromSelf: true, 
      message: msg,
      timestamp: new Date().toISOString()
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (msg) => {
        setArrivalMessage({ 
          fromSelf: false, 
          message: msg,
          timestamp: new Date().toISOString()
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = message.timestamp || new Date().toISOString();
      const dateString = new Date(messageDate).toDateString();

      if (currentDate !== dateString) {
        currentDate = dateString;
        grouped.push({
          type: 'date',
          date: formatMessageDate(messageDate),
          id: `date-${index}`
        });
      }

      grouped.push({
        type: 'message',
        ...message,
        timestamp: messageDate
      });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="user-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="username">
            <h3>{currentChat?.name || 'User'}</h3>
            <span className="status">online</span>
          </div>
        </div>
        <div className="chat-actions">
          <Video socket={socket} currentChat={currentChat} />
        </div>
      </div>
      
      <div className="chat-messages">
        {groupedMessages.map((item) => {
          if (item.type === 'date') {
            return (
              <div key={item.id} className="date-separator">
                <span className="date-text">{item.date}</span>
              </div>
            );
          }

          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  item.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  <p>{item.message}</p>
                  <span className="timestamp">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}



const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;

  .chat-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 15px 0 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-avatar {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .username {
        h3 {
          margin: 0;
          font-size: 1.2rem; /* Slightly smaller to accommodate longer text */
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          line-height: 1.2;
        }

        .status {
          font-size: 0.75rem; /* Made smaller */
          opacity: 0.8;
          display: block;
          margin-top: 3px;
          text-transform: lowercase; /* Keep "online" lowercase */
        }
      }
    }

    .chat-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }

  .chat-messages {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 0.3);
    max-height: calc(100vh - 180px); /* Ensure fixed height */

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
    }

    .date-separator {
      display: flex;
      justify-content: center;
      margin: 0.5rem 0; /* Reduced margin */
      
      .date-text {
        background: transparent; /* Remove background */
        color: #9ca3af; /* Light gray text */
        padding: 0.3rem 0.8rem; /* Reduced padding */
        border-radius: 12px;
        font-size: 0.75rem; /* Smaller font */
        font-weight: 400; /* Lighter weight */
        opacity: 0.6; /* More subtle */
      }
    }

    .message {
      display: flex;
      align-items: flex-end;
      max-width: 100%;

      .content {
        max-width: 45%; /* Reduced from 70% to 45% */
        padding: 1rem 1.5rem;
        border-radius: 18px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
        
        p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
          word-wrap: break-word;
        }

        .timestamp {
          font-size: 0.75rem;
          opacity: 0.7;
          display: block;
          margin-top: 0.5rem;
          text-align: right;
        }

        @media screen and (max-width: 768px) {
          max-width: 65%; /* Reduced from 85% to 65% for mobile */
          padding: 0.8rem 1rem;
          
          p {
            font-size: 0.9rem;
          }
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background: linear-gradient(135deg, #00d4ff, #0099cc);
        color: white;
        border-bottom-right-radius: 8px;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background: linear-gradient(135deg, #e8f5e8, #d4edda);
        color: #2d3748;
        border-bottom-left-radius: 8px;
        border: 1px solid rgba(40, 167, 69, 0.2);

        .timestamp {
          color: #28a745;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .chat-header {
      padding: 1rem;
      
      .user-details .username h3 {
        font-size: 1rem; /* Smaller for mobile to fit longer text */
        line-height: 1.2;
      }
      
      .user-details .username .status {
        font-size: 0.7rem; /* Even smaller on mobile */
      }
      
      .user-avatar {
        width: 40px;
        height: 40px;
        
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    .chat-messages {
      padding: 1rem;
    }
  }
`;

