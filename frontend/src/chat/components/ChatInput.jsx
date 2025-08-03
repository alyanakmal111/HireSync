import { useState, useRef, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setShowEmojiPicker(false); // Close emoji picker after sending
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <div className="button-container">
          <div className="emoji" ref={emojiPickerRef}>
            <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
        
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="message-input"
        />
        
        <button type="submit" className="send-button" disabled={msg.length === 0}>
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;

  .input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 25px;
    padding: 0.5rem;
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .button-container {
      display: flex;
      align-items: center;
      padding-left: 0.5rem;

      .emoji {
        position: relative;
        cursor: pointer;

        svg {
          font-size: 1.5rem;
          color: #667eea;
          transition: all 0.3s ease;
          
          &:hover {
            color: #764ba2;
            transform: scale(1.1);
          }
        }

        .emoji-picker-container {
          position: absolute;
          bottom: 60px;
          left: 0;
          z-index: 2000;
          
          .EmojiPickerReact {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            border-radius: 15px !important;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            background: rgba(255, 255, 255, 0.95) !important;
          }
          
          /* Target the emoji picker container directly */
          > div {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            border-radius: 15px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            background: rgba(255, 255, 255, 0.95) !important;
          }

          @media screen and (max-width: 768px) {
            left: -150px;
            bottom: 50px;
          }
        }
      }
    }

    .message-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      padding: 1rem;
      font-size: 1rem;
      color: #2d3748;
      font-family: 'Inter', sans-serif;
      
      &::placeholder {
        color: #a0aec0;
      }
      
      &:focus {
        outline: none;
      }
    }

    .send-button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-right: 0.2rem;
      
      &:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      svg {
        font-size: 1.2rem;
        color: white;
      }
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    
    .input-container {
      .message-input {
        padding: 0.8rem;
        font-size: 0.9rem;
      }
      
      .send-button {
        width: 40px;
        height: 40px;
        
        svg {
          font-size: 1rem;
        }
      }
      
      .button-container .emoji svg {
        font-size: 1.3rem;
      }
    }
  }
`;

