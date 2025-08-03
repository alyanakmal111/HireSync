import { useState, useEffect } from "react";
import styled from "styled-components";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const func = async () => {
      const data = await JSON.parse(localStorage.getItem("user"));
      setCurrentUserName(data.name);
      setCurrentUserImage(data.avatarImage);
    };
    func();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <h5>Contacts</h5>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="username">
                  <h4>{contact.name}</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="username">
              <h6>{currentUserName}</h6>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 15px 0 0 0;
    
    h5 {
      margin: 0;
      color: white;
      font-size: 1.4rem;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }
  }
  
  .contacts {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 0.8rem;
    overflow-y: auto;
    
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
    
    .contact {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      min-height: 60px;
      cursor: pointer;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      
      &:hover {
        background: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .username {
        h4 {
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
      }
    }
    
    .selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
      
      .username h4 {
        color: #667eea;
        font-weight: 700;
      }
    }
  }
  
  .current-user {
    background: linear-gradient(135deg, #2d3748, #4a5568);
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 0 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    .username {
      h6 {
        color: white;
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
      }
    }
  }
`;
