"use client"
import { useAudioPlayer } from "./audio-player-context"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import "./Styles/mini-player.css"

export default function MiniPlayer() {
  const {
    currentEpisode,
    book,
    isPlaying,
    togglePlay,
    currentTime,
    totalDuration,
    seek,
    formatTime,
    skipForward,
    skipBackward,
    isMinimized,
    setIsMinimized,
  } = useAudioPlayer()

  // New state to track if the player is completely hidden
  const [isHidden, setIsHidden] = useState(false)

  // If the player is not minimized, we should reset the hidden state
  useEffect(() => {
    if (!isMinimized) {
      setIsHidden(false)
    }
  }, [isMinimized])

  // If there's no current episode or the player is not minimized, don't render
  if (!currentEpisode || !isMinimized) return null

  // Function to hide the player completely
  const hidePlayer = () => {
    setIsHidden(true)
  }

  // Function to restore the player
  const restorePlayer = () => {
    setIsHidden(false)
  }

  return (
    <>
      {/* Floating restore button that appears when player is hidden */}
      <button
        className={`mini-player-restore ${!isHidden ? "hidden" : ""}`}
        onClick={restorePlayer}
        aria-label="Show player"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      <div className={`mini-player ${isHidden ? "hidden" : ""}`}>
        {/* Progress bar positioned at the top of the mini player */}
        <div className="mini-player-progress-container">
          <span className="mini-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={totalDuration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="mini-seek-bar"
          />
          <span className="mini-time">{formatTime(totalDuration)}</span>
        </div>

        <div className="mini-player-content">
          <div className="mini-player-info">
            <Link to={`/book/${book?.id}`} className="mini-player-cover">
              <img
                src={book?.image || "/placeholder.svg"}
                alt={book?.title || "Book cover"}
                className="mini-player-image"
              />
            </Link>
            <div className="mini-player-text">
              <div className="mini-player-title">{currentEpisode.chapter_title}</div>
              <div className="mini-player-book-title">{book?.title}</div>
            </div>
          </div>

          <div className="mini-player-center">
            <div className="mini-player-controls">
              <button onClick={skipBackward} className="mini-control-btn" aria-label="Rewind 10 seconds">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  <text x="9" y="15" fontSize="8" fill="currentColor">
                    10
                  </text>
                </svg>
              </button>
              <button onClick={togglePlay} className="mini-play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
              <button onClick={skipForward} className="mini-control-btn" aria-label="Forward 10 seconds">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  <text x="9" y="15" fontSize="8" fill="currentColor">
                    10
                  </text>
                </svg>
              </button>
              {/* Download button next to the controls */}
              <button
                className="mini-control-btn download-btn"
                aria-label="Download episode"
                onClick={() => {
                  // lessa h3mlha ya rgala
                  console.log("Download episode:", currentEpisode)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="mini-player-actions">
            {/* Hide button (down arrow) */}
            <button className="mini-player-hide" onClick={hidePlayer} aria-label="Hide player">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Expand button (up arrow) */}
            <button className="mini-player-expand" onClick={() => setIsMinimized(false)} aria-label="Expand player">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
