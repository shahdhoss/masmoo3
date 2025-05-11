"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import SearchCard from "./SearchComp/SearchCard"
import "./Assets/css/tailwind.css"
import { getUserPreferences, generateRecommendations } from "./recommendations-helper"
import "./Home.css" // We'll create this file for Spotify-like styling

const Home = () => {
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState({
    byAuthor: [],
    byLanguage: [],
    byCategory: [],
  })

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://key-gertrudis-alhusseain-8243cb58.koyeb.app/audiobook")
        console.log("API Response:", response.data) // Debug
        setAllBooks(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching audiobooks:", error)
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Generate recommendations based on cookie data
  useEffect(() => {
    if (allBooks.length === 0) return

    // Get user preferences and generate recommendations
    const preferences = getUserPreferences()
    console.log("User preferences:", preferences)
    
    const recs = generateRecommendations(allBooks, preferences)
    console.log("Generated recommendations:", recs) // Debug
    
    // Remove duplicates across recommendation categories
    const uniqueRecs = removeDuplicateRecommendations(recs)
    setRecommendations(uniqueRecs)
  }, [allBooks])

  // Function to remove duplicate books across recommendation categories
  const removeDuplicateRecommendations = (recs) => {
    const seen = new Set()
    const uniqueRecs = {
      byAuthor: [],
      byLanguage: [],
      byCategory: []
    }
    
    // Process author recommendations first
    recs.byAuthor.forEach(book => {
      seen.add(book.id)
      uniqueRecs.byAuthor.push(book)
    })
    
    // Process language recommendations, skipping any already seen
    recs.byLanguage.forEach(book => {
      if (!seen.has(book.id)) {
        seen.add(book.id)
        uniqueRecs.byLanguage.push(book)
      }
    })
    
    // Process category recommendations, skipping any already seen
    recs.byCategory.forEach(book => {
      if (!seen.has(book.id)) {
        seen.add(book.id)
        uniqueRecs.byCategory.push(book)
      }
    })
    
    return uniqueRecs
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Discovering your next favorite audiobooks...</p>
      </div>
    )
  }

  // Check if we have any recommendations
  const hasAuthorRecs = recommendations.byAuthor.length > 0
  const hasLanguageRecs = recommendations.byLanguage.length > 0
  const hasCategoryRecs = recommendations.byCategory.length > 0
  const hasAnyRecs = hasAuthorRecs || hasLanguageRecs || hasCategoryRecs

  if (!hasAnyRecs) {
    return (
      <div className="home-container">
        <div className="welcome-header">
          <h1>Welcome to AudioBook Library</h1>
          <p className="welcome-subtitle">Discover your next audio adventure</p>
        </div>
        
        <div className="recommendation-notice">
          <h2>Personalized Recommendations</h2>
          <p>
            Browse more books to get personalized recommendations based on your interests. 
            We'll suggest books similar to what you've been exploring.
          </p>
        </div>

        <div className="recommendation-section">
          <h2>Popular Audiobooks</h2>
          <div className="books-grid">
            {allBooks.slice(0, 6).map((book) => (
              <SearchCard
                key={book.id}
                id={book.id}
                img={book.image}
                description={book.description}
                title={book.title}
                author={book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="welcome-header">
        <h1>Welcome to AudioBook Library</h1>
        <p className="welcome-subtitle">Your personalized listening experience</p>
      </div>
      
      <div className="recommendation-notice">
        <h2>Made For You</h2>
        <p>
          Based on your listening history, we've curated these collections just for you.
        </p>
      </div>

      {hasAuthorRecs && (
        <div className="recommendation-section">
          <h2>
            <span className="section-title-icon">👤</span>
            More by {recommendations.byAuthor[0]?.author ||
              `${recommendations.byAuthor[0]?.author_first_name || ""} ${recommendations.byAuthor[0]?.author_last_name || ""}`.trim()}
          </h2>
          <div className="books-grid">
            {recommendations.byAuthor.map((book) => (
              <SearchCard
                key={book.id}
                id={book.id}
                img={book.image}
                description={book.description}
                title={book.title}
                author={book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()}
              />
            ))}
          </div>
        </div>
      )}

      {hasLanguageRecs && (
        <div className="recommendation-section">
          <h2>
            <span className="section-title-icon">🌍</span>
            {recommendations.byLanguage[0]?.language === "eng" ? "English" : recommendations.byLanguage[0]?.language} Audiobooks
          </h2>
          <div className="books-grid">
            {recommendations.byLanguage.map((book) => (
              <SearchCard
                key={book.id}
                id={book.id}
                img={book.image}
                description={book.description}
                title={book.title}
                author={book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()}
              />
            ))}
          </div>
        </div>
      )}

      {hasCategoryRecs && (
        <div className="recommendation-section">
          <h2>
            <span className="section-title-icon">📚</span>
            {recommendations.byCategory[0]?.category} Mix
          </h2>
          <div className="books-grid">
            {recommendations.byCategory.map((book) => (
              <SearchCard
                key={book.id}
                id={book.id}
                img={book.image}
                description={book.description}
                title={book.title}
                author={book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()}
              />
            ))}
          </div>
        </div>
      )}

      <div className="recommendation-section">
        <h2>
          <span className="section-title-icon">✨</span>
          Discover More
        </h2>
        <div className="books-grid">
          {allBooks
            .filter(
              (book) =>
                !recommendations.byAuthor.some((rec) => rec.id === book.id) &&
                !recommendations.byLanguage.some((rec) => rec.id === book.id) &&
                !recommendations.byCategory.some((rec) => rec.id === book.id),
            )
            .slice(0, 3)
            .map((book) => (
              <SearchCard
                key={book.id}
                id={book.id}
                img={book.image}
                description={book.description}
                title={book.title}
                author={book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Home