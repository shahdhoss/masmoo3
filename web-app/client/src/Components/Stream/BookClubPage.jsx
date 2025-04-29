import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BookClubPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)  
  const [roomName, setRoomName] = useState('')

  const handleSubmit = () => {
    if (roomName.trim() === '') {
      alert('Please enter a room name.')
      return
    }
    if (role === 'streamer') {
      navigate(`/streamerLayout/${roomName}`)
    } else if (role === 'listener') {
      navigate(`/listenerLayout/${roomName}`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#333' }}>📚 Book Club</h1>

      {!role ? (
        <>
          <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: '#555' }}>
            Are you a streamer or a listener?
          </h2>

          <div style={{
            display: 'flex',
            gap: '20px',
          }}>
            <button
              onClick={() => setRole('streamer')}
              style={buttonStyle('#4CAF50')}
            >
              Streamer
            </button>

            <button
              onClick={() => setRole('listener')}
              style={buttonStyle('#2196F3')}
            >
              Listener
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#555' }}>
            {role === 'streamer' ? 'Create a room' : 'Join a room'}
          </h2>
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '1.2rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '20px',
              width: '250px',
              textAlign: 'center',
            }}
          />
          <br />
          <button
            onClick={handleSubmit}
            style={buttonStyle('#673AB7')}
          >
            Continue
          </button>
        </>
      )}
    </div>
  )
}

function buttonStyle(color) {
  return {
    padding: '15px 30px',
    fontSize: '1.2rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: color,
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.3s',
    textTransform: 'uppercase',
  }
}

export default BookClubPage
