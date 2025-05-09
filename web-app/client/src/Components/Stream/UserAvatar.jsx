import React, { useState, useEffect } from "react";

const UserAvatar = ({ user, isNewUser, isStreamer = false }) => {
    const [showAnimation, setShowAnimation] = useState(isNewUser);
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
      const style = document.createElement("style");
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
  
      if (isNewUser) {
        const timer = setTimeout(() => {
          setShowAnimation(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
      
      return () => style.remove();
    }, [isNewUser]);
  
    useEffect(() => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
      link.id = "bootstrap-css";
      document.head.appendChild(link);
      return () => {
        const existing = document.getElementById("bootstrap-css");
        if (existing) existing.remove();
      };
    }, []);
    
    const getBorderStyle = () => {
      if (isStreamer) {
        return isHovered ? '4px solid #FF6B6B' : '4px solid #FF6B6B';
      }
      return isHovered ? '4px solid #29ABE2' : '4px solid transparent';
    };
    
    return (
      <div 
        className="d-flex flex-column align-items-center mb-4"
        style={{
          animation: showAnimation ? 'fadeIn 0.6s ease-out' : 'none',
          position: 'relative'
        }}
      >
        <div 
          className="position-relative"
          style={{ 
            animation: showAnimation ? 'bounce 1s ease' : 'none'
          }}
        >
          <img
            src={user.profile_pic || user.picture}
            className="rounded-circle shadow"
            alt={`${user.first_name || user.name}'s profile`}
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              transition: 'all 0.3s ease-in-out',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              border: getBorderStyle(),
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {user.isSpeaking && (
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-3 border-success"
              style={{ animation: 'pulse 1.5s infinite' }}
            ></div>
          )}
          
          {showAnimation && !isStreamer && (
            <div 
              className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-primary"
              style={{ 
                fontSize: '1rem', 
                padding: '0.5rem 0.8rem',
                animation: 'pulse 2s infinite'
              }}
            >
              New!
            </div>
          )}
          
          {/* Streamer badge */}
          {isStreamer && (
            <div 
              className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
              style={{ 
                fontSize: '0.9rem', 
                padding: '0.5rem 0.8rem'
              }}
            >
              Host
            </div>
          )}
        </div>
        
        <div className="mt-3 text-center">
          <p 
            className="fw-bold mb-0" 
            style={{ 
              fontSize: '1.2rem',
              transition: 'color 0.3s ease',
              color: isStreamer ? '#FF6B6B' : (isHovered ? '#29ABE2' : 'inherit')
            }}
          >
            {user.name || user.first_name}
          </p>
          
          <div className="d-flex align-items-center justify-content-center mt-1">
            <div 
              className={`rounded-circle me-1`} 
              style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: user.isSpeaking ? '#28a745' : '#6c757d'
              }}
            ></div>
            <small 
              className="text-muted"
              style={{
                fontWeight: isStreamer ? 'bold' : 'normal'
              }}
            >
              {isStreamer ? 'Streaming' : (user.isSpeaking ? 'Active' : 'Listening')}
            </small>
          </div>
        </div>
      </div>
    );
  }

export default UserAvatar;