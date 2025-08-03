import { useState, useEffect } from "react";
import styled from "styled-components";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const func = async () => {
      setUserName(await JSON.parse(localStorage.getItem("user")).name);
    };
    func();
  }, []);
  return (
    <Container>
      <div className="welcome-card">
        <div className="welcome-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M13 8H7"/>
            <path d="M17 12H7"/>
          </svg>
        </div>
        <h1 className="welcome-title">
          Welcome, <span className="username-highlight">{userName}!</span>
        </h1>
        <p className="welcome-subtitle">
          Select a contact from the sidebar to start chatting and collaborate effectively.
        </p>
        <div className="welcome-features">
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Real-time messaging</span>
          </div>
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            <span>Professional communication</span>
          </div>
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Connect with colleagues</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  background: transparent;

  .welcome-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  .welcome-icon {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    font-family: 'Inter', sans-serif;
  }

  .username-highlight {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
    color: #718096;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
  }

  .welcome-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    
    svg {
      color: #667eea;
      flex-shrink: 0;
    }
    
    span {
      color: #4a5568;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    .welcome-card {
      padding: 2rem;
    }
    
    .welcome-title {
      font-size: 1.5rem;
    }
    
    .welcome-icon {
      width: 80px;
      height: 80px;
      
      svg {
        width: 50px;
        height: 50px;
      }
    }
  }
`;
