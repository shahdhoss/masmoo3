"use client"

import { useEffect } from "react"
import { useAudioPlayer } from "./audio-player-context"

export default function AudioPlayer({ currentBookEpisode, episodes, onEpisodeSelect, bookData }) {
  const {
    currentEpisode,
    setCurrentEpisode,
    isPlaying,
    togglePlay,
    currentTime,
    totalDuration,
    seek,
    formatTime,
    setBook,
    setIsMinimized,
  } = useAudioPlayer()

  // Sync the local episode with the global context
  useEffect(() => {
    if (currentBookEpisode && (!currentEpisode || currentBookEpisode.episode_no !== currentEpisode.episode_no)) {
      setCurrentEpisode(currentBookEpisode)
    }
  }, [currentBookEpisode, currentEpisode, setCurrentEpisode])

  // Set the book data in context
  useEffect(() => {
    if (bookData) {
      setBook(bookData)
    }
  }, [bookData, setBook])

  // Set minimized to false when on the book page
  useEffect(() => {
    setIsMinimized(false)

    // When navigating away, set to minimized if there's a current episode
    return () => {
      if (currentEpisode) {
        setIsMinimized(true)
      }
    }
  }, [setIsMinimized, currentEpisode])

  // Handle episode selection
  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode)
    if (onEpisodeSelect) {
      onEpisodeSelect(episode)
    }
  }

  // Sort episodes by episode number
  const sortedEpisodes = [...episodes].sort((a, b) => a.episode_no - b.episode_no)

  return (
    <div className="audio-section">
      {currentEpisode && (
        <>
          <h2>Now Playing: {currentEpisode.chapter_title}</h2>
          <div className="audio-player">
            {/* No audio element here - it's managed by the context */}

            <div className="progress-bar">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={totalDuration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="seek-bar"
              />
              <span>{formatTime(totalDuration)}</span>
            </div>

            <div className="player-controls">
              <button
                onClick={() => seek(currentTime - 10)}
                className="control-btn rewind-btn"
                aria-label="Rewind 10 seconds"
              >
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
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  <text x="9" y="15" fontSize="8" fill="currentColor">
                    10
                  </text>
                </svg>
              </button>
              <button onClick={togglePlay} className="play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
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
              <button
                onClick={() => seek(currentTime + 10)}
                className="control-btn forward-btn"
                aria-label="Forward 10 seconds"
              >
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
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  <text x="9" y="15" fontSize="8" fill="currentColor">
                    10
                  </text>
                </svg>
              </button>
              <button
                className="control-btn download-btn"
                aria-label="Download episode"
                onClick={() => {
                  // The user will implement the download functionality
                  console.log("Download episode:", currentEpisode)
                }}
              >
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="chapters-section">
        <h2>Chapters</h2>
        <div className="chapters-list">
          {sortedEpisodes.slice(0, 20).map((episode) => (
            <div
              key={episode.episode_no}
              className={`chapter-item ${episode.episode_no === currentEpisode?.episode_no ? "active" : ""}`}
              onClick={() => handleEpisodeSelect(episode)}
            >
              <div className="chapter-number">
                {episode.episode_no === currentEpisode?.episode_no ? (
                  <div className="playing-indicator"></div>
                ) : (
                  <span>{+episode.episode_no + 1}</span>
                )}
              </div>
              <div className="chapter-info">
                <h3>{episode.chapter_title}</h3>
                <p>{episode.duration}</p>
              </div>
            </div>
          ))}
          {sortedEpisodes.length > 20 && (
            <div className="more-chapters">{sortedEpisodes.length - 20} more chapters...</div>
          )}
        </div>
      </div>
    </div>
  )
}
