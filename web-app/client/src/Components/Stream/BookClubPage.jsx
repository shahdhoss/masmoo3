import React, { useState, useEffect } from 'react';
import { Book, Mic, Headphones, ArrowRight } from 'lucide-react';
import "./style.css";
import { useNavigate } from 'react-router-dom';

function BookClubPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

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

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTimeout(() => {
      const inputField = document.getElementById('room-input');
      if (inputField) {
        inputField.focus();
        inputField.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (roomName.trim() === '') {
      const inputField = document.getElementById('room-input');
      inputField.classList.add('shake');
      setTimeout(() => inputField.classList.remove('shake'), 500);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (role === 'streamer') {
        navigate(`/streamerLayout/${roomName}`);
      } else if (role === 'listener') {
        navigate(`/listenerLayout/${roomName}`);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && roomName.trim() !== '') {
      handleSubmit();
    }
  };

  return (
    <div className={`min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center p-4 text-center transition-opacity duration-1000 ${animation ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 bg-white rounded-3 shadow p-5 transition-all duration-500 transform hover:shadow-lg">
            <div className="d-flex justify-content-center mb-4">
              <Book className="text-primary w-12 h-12" />
            </div>

            <h1 className="display-4 fw-bold mb-3 text-secondary">
              <span className="text-primary">Book</span> Club
            </h1>

            {!role ? (
              <>
                <p className="lead text-muted mb-5">
                  Choose your way to join:
                </p>

                <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
                  <div className="col d-flex justify-content-end justify-content-md-center">
                    <button
                      onClick={() => handleRoleSelect('streamer')}
                      className="card border-0 shadow-sm rounded-3 p-4 h-100 d-flex flex-column align-items-center justify-content-center hover-shadow"
                      style={{ backgroundColor: '#fceabb', color: '#212529', borderColor: '#fceabb', maxWidth: '200px' }}
                    >
                      <Mic className="text-dark w-10 h-10 mb-3 transition" />
                      <h5 className="fw-semibold text-dark mb-1">Streamer</h5>
                      <p className="text-muted small">Share your voice and read aloud.</p>
                    </button>
                  </div>
                  <div className="col d-flex justify-content-start justify-content-md-center">
                    <button
                      onClick={() => handleRoleSelect('listener')}
                      className="card border-0 shadow-sm rounded-3 p-4 h-100 d-flex flex-column align-items-center justify-content-center hover-shadow"
                      style={{ backgroundColor: '#a7dadc', color: '#212529', borderColor: '#a7dadc', maxWidth: '200px' }}
                    >
                      <Headphones className="text-dark w-10 h-10 mb-3 transition" />
                      <h5 className="fw-semibold text-dark mb-1">Listener</h5>
                      <p className="text-muted small">Cozy up and listen to the story.</p>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="animate__animated animate__fadeIn">
                <h2 className="h5 text-muted mb-3">
                  {role === 'streamer' ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <Mic className="text-primary me-2" /> Create a cozy reading room
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      <Headphones className="text-info me-2" /> Join a reading room
                    </div>
                  )}
                </h2>

                <div className="mb-4">
                  <input
                    id="room-input"
                    type="text"
                    className="form-control form-control-lg rounded-pill text-center"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    onClick={handleSubmit}
                    className={`btn btn-${role === 'streamer' ? 'warning' : 'info'} btn-lg rounded-pill shadow-sm ${isLoading ? 'disabled' : 'hover-shadow'}`}
                    style={{
                      backgroundColor: role === 'streamer' ? '#faae2b' : '#a7dadc',
                      color: '#212529',
                      borderColor: role === 'streamer' ? '#fceabb' : '#a7dadc',
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Sniffing for the room...
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        Let's go! <ArrowRight className="ms-2" />
                      </div>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setRole(null)}
                  className="btn btn-link mt-3 text-decoration-none text-muted"
                >
                  ← Back to selection
                </button>

              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-muted small">
        Connecting book lovers, one page at a time. 🐾
      </p>

      <style jsx global>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        .transition {
          transition: all 0.3s ease-in-out;
        }
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate__fadeIn {
          --animate-duration: 0.5s;
        }
      `}</style>
    </div>
  );
}

export default BookClubPage;