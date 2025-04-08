"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import { processDescription } from "./Styles/text-helpers"
import "./Styles/BookPage.css"

const BookPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [mediaError, setMediaError] = useState(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const audioRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const signal = controller.signal

    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/audiobook/${id}`, { signal })
        if (!response.ok) {
          throw new Error("Failed to fetch audiobook")
        }
        const data = await response.json()

        if (isMounted) {
          setBook(data)

          if (data.episodes && data.episodes.length > 0) {
            const firstEpisode = data.episodes.find((ep) => ep.episode_no === 0) || data.episodes[0]
            setCurrentEpisode(firstEpisode)
          }
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          setError("Error loading audiobook. Please try again later.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBook()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [id])

  useEffect(() => {
    if (!currentEpisode || !audioRef.current) return

    setIsPlaying(false)
    setCurrentTime(0)
    setMediaError(null)

    try {
      const [hours, minutes, seconds] = currentEpisode.duration.split(":").map(Number)
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      setTotalDuration(isNaN(totalSeconds) ? 0 : totalSeconds)
    } catch (err) {
      setTotalDuration(0)
    }

    const audio = audioRef.current

    audio.preload = "metadata"
    audio.pause()
    audio.currentTime = 0

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleError = () => {
      setMediaError("Unable to load audio. Please try again later.")
      setIsPlaying(false)
    }
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentEpisode])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setMediaError(null)
              setIsPlaying(true)
            })
            .catch(() => {
              setMediaError("Unable to play audio. Try clicking again.")
              setIsPlaying(false)
            })
        }
      }
    } catch (err) {
      setMediaError("An error occurred while trying to play the audio.")
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioRef.current.muted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleSeek = useCallback((e) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }, [])

  const handleEpisodeSelect = useCallback((episode) => {
    setCurrentEpisode(episode)
  }, [])

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [])

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [])

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (error || !book) {
    return <div className="error-container">{error || "Book not found"}</div>
  }

  const sortedEpisodes = book.episodes ? [...book.episodes].sort((a, b) => a.episode_no - b.episode_no) : []
  // Format the description to handle HTML tags
  const { text: formattedDescription, links } = processDescription(book.description)
  return (
    <div className="book-page">
      <div className="book-header">
        <div className="book-cover">
          {!isImageLoaded && <div className="image-placeholder"></div>}
          <img
            src={book.image || "/placeholder.svg"}
            alt={`Cover for ${book.title}`}
            onLoad={handleImageLoad}
            style={{ display: isImageLoaded ? "block" : "none" }}
            loading="eager"
          />
        </div>

        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">
            {book.author_first_name} {book.author_last_name}
          </p>

          <div className="book-meta">
            <div className="book-tags">
              <span className="tag genre">{book.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="description-box">
        <h2>Description</h2>
        <p style={{ whiteSpace: "pre-line" }}>{formattedDescription}</p>
        
        {links.length > 0 && (
          <div className="description-links">
            <h3>Related Links:</h3>
            <ul>
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {currentEpisode && (
        <div className="audio-section">
          <h2>Now Playing: {currentEpisode.chapter_title}</h2>
          <div className="audio-player">
            <audio ref={audioRef} src={currentEpisode.audio_link} preload="metadata" />

            {mediaError && <div className="media-error">{mediaError}</div>}

            <div className="progress-bar">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={totalDuration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="seek-bar"
              />
              <span>{formatTime(totalDuration)}</span>
            </div>

            <div className="player-controls">
              <button
                onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}
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
                onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}
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
                onClick={toggleMute}
                className={`control-btn volume-btn ${isMuted ? "muted" : ""}`}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
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
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
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
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="chapters-section">
        <h2>Chapters</h2>
        <div className="chapters-list">
          {sortedEpisodes.slice(0, 20).map((episode) => (
            <div
              key={episode._id}
              className={`chapter-item ${episode._id === currentEpisode?._id ? "active" : ""}`}
              onClick={() => handleEpisodeSelect(episode)}
            >
              <div className="chapter-number">
                {episode._id === currentEpisode?._id ? (
                  <div className="playing-indicator"></div>
                ) : (
                  <span>{episode.episode_no + 1}</span>
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

export default BookPage