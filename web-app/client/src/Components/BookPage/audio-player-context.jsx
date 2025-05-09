"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Create the context
const AudioPlayerContext = createContext()

// Custom hook to use the audio context
export const useAudioPlayer = () => useContext(AudioPlayerContext)

export const AudioPlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [book, setBook] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [audioElement, setAudioElement] = useState(null)

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio()
    setAudioElement(audio)

    // Clean up on unmount
    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Update audio source when episode changes
  useEffect(() => {
    if (!audioElement || !currentEpisode) return

    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime)
    const handleDurationChange = () => setTotalDuration(audioElement.duration)
    const handleEnded = () => setIsPlaying(false)

    audioElement.src = currentEpisode.audio_link
    audioElement.addEventListener("timeupdate", handleTimeUpdate)
    audioElement.addEventListener("durationchange", handleDurationChange)
    audioElement.addEventListener("ended", handleEnded)

    // If it was playing before changing episodes, start playing the new one
    if (isPlaying) {
      audioElement.play().catch((error) => console.error("Error playing audio:", error))
    }

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate)
      audioElement.removeEventListener("durationchange", handleDurationChange)
      audioElement.removeEventListener("ended", handleEnded)
    }
  }, [audioElement, currentEpisode])

  // Play/pause control
  useEffect(() => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audioElement.pause()
    }
  }, [isPlaying, audioElement])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const seek = (time) => {
    if (audioElement) {
      audioElement.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const skipForward = () => {
    if (audioElement) {
      audioElement.currentTime += 10
    }
  }

  const skipBackward = () => {
    if (audioElement) {
      audioElement.currentTime -= 10
    }
  }

  const value = {
    currentEpisode,
    setCurrentEpisode,
    isPlaying,
    setIsPlaying,
    togglePlay,
    currentTime,
    totalDuration,
    seek,
    formatTime,
    skipForward,
    skipBackward,
    book,
    setBook,
    isMinimized,
    setIsMinimized,
  }

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}
