"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { processDescription } from "./Styles/text-helpers"
import "./Styles/BookPage.css"
import { jwtDecode } from "jwt-decode"
import { Star } from 'lucide-react'
import AudioPlayer from "./audio-player"

// Cookie utility functions
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const setCookie = (name, value, days = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

const BookPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [usersData, setUsersData] = useState({})
  const isInitialMount = useRef(true)
  
  // Function to track book visit in cookies
  const trackBookVisit = (bookData) => {
    if (!bookData) return;
    
    // Get existing tracking data from cookies or initialize
    let languageCounts = {};
    let authorCounts = {};
    let categoryCounts = {};
    
    // Try to get existing data
    try {
      const languageData = getCookie('book_languages');
      const authorData = getCookie('book_authors');
      const categoryData = getCookie('book_categories');
      
      languageCounts = languageData ? JSON.parse(languageData) : {};
      authorCounts = authorData ? JSON.parse(authorData) : {};
      categoryCounts = categoryData ? JSON.parse(categoryData) : {};
    } catch (error) {
      console.error('Error parsing cookie data:', error);
      // Reset if there's an error
      languageCounts = {};
      authorCounts = {};
      categoryCounts = {};
    }
    
    // Update counts
    const language = bookData.language || 'unknown';
    const author = bookData.author || `${bookData.author_first_name || ''} ${bookData.author_last_name || ''}`.trim();
    const category = bookData.category || 'unknown';
    
    languageCounts[language] = (languageCounts[language] || 0) + 1;
    authorCounts[author] = (authorCounts[author] || 0) + 1;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    
    // Save updated counts back to cookies
    setCookie('book_languages', JSON.stringify(languageCounts));
    setCookie('book_authors', JSON.stringify(authorCounts));
    setCookie('book_categories', JSON.stringify(categoryCounts));
    
    console.log('Updated tracking data:', {
      languages: languageCounts,
      authors: authorCounts,
      categories: categoryCounts
    });
    
    return {
      languages: languageCounts,
      authors: authorCounts,
      categories: categoryCounts
    };
  }
  
  // Function to log book data and tracking info
  const logBookData = () => {
    if (!book) return;
    
    console.log("BOOK DATA:", book);
    
    // Get current tracking data
    try {
      const languageData = getCookie('book_languages');
      const authorData = getCookie('book_authors');
      const categoryData = getCookie('book_categories');
      
      const trackingData = {
        languages: languageData ? JSON.parse(languageData) : {},
        authors: authorData ? JSON.parse(authorData) : {},
        categories: categoryData ? JSON.parse(categoryData) : {}
      };
      
      console.log("TRACKING DATA:", trackingData);
      alert("Book and tracking data logged to console. Press F12 to view.");
    } catch (error) {
      console.error('Error parsing cookie data:', error);
      alert("Error reading tracking data. See console for details.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserData(decodedToken)

        fetch("key-gertrudis-alhusseain-8243cb58.koyeb.app/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) return response.json()
            throw new Error("Failed to fetch user data")
          })
          .then((data) => {
            setUserData((prev) => ({
              ...prev,
              ...data,
            }))

            setUsersData((prev) => ({
              ...prev,
              [data.id]: {
                first_name: data.first_name,
                last_name: data.last_name,
                profile_pic: data.profile_pic,
              },
            }))
          })
          .catch((error) => {
            console.error("Error fetching user data:", error)
          })
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const signal = controller.signal
    const token = localStorage.getItem("token")

    const fetchBook = async () => {
      try {
        const response = await fetch(`https://key-gertrudis-alhusseain-8243cb58.koyeb.app/audiobook/${id}`, {
          signal,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        })
        if (!response.ok) {
          throw new Error("Failed to fetch audiobook")
        }
        const data = await response.json()

        if (isMounted) {
          setBook(data)
          
          // Track this book visit
          trackBookVisit(data);

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
    if (!id) return
    const fetchReviews = async () => {
      setReviewLoading(true)
      const token = localStorage.getItem("token")

      try {
        const response = await fetch(`https://key-gertrudis-alhusseain-8243cb58.koyeb.app/reviews/book/${id}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        })
        if (response.ok) {
          const data = await response.json()
          setReviews(data)

          const userIds = [...new Set(data.map((review) => review.userid))]

          if (userData && userIds.includes(userData.id)) {
            setUsersData((prev) => ({
              ...prev,
              [userData.id]: {
                first_name: data.first_name,
                last_name: data.last_name,
                profile_pic: data.profile_pic,
              },
            }))
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
      } finally {
        setReviewLoading(false)
      }
    }

    fetchReviews()
  }, [id, userData])

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  const handleSubmitReview = async () => {
    if (!reviewText || rating === 0) return
    if (!userData) {
      alert("You must be logged in to submit a review")
      return
    }

    try {
      const userId = userData.id
      const currentDate = new Date().toISOString()
      const token = localStorage.getItem("token")

      const response = await fetch("https://key-gertrudis-alhusseain-8243cb58.koyeb.app/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_text: reviewText,
          rating,
          book_id: id,
          user_id: userId,
          created_at: currentDate,
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([...reviews, newReview])
        setReviewText("")
        setRating(0)
        setShowReviewModal(false)
      }
    } catch (err) {
      console.error("Error submitting review:", err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  function calculateAverageRating() {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getUserName = (userId) => {
    if (usersData[userId]) {
      return `${usersData[userId].first_name} ${usersData[userId].last_name}`
    }

    if (userData && userData.id === userId) {
      return `${userData.first_name || ""} ${userData.last_name || ""}`.trim()
    }

    return `User #${userId}`
  }

  const getNameInitial = (userId) => {
    const name = getUserName(userId)
    return name.charAt(0).toUpperCase()
  }

  const getProfilePicture = (userId) => {
    if (userData && userData.id === userId && userData.profile_pic) {
      try {
        if (typeof userData.profile_pic === "object") {
          if (userData.profile_pic.data) {
            const uint8Array = new Uint8Array(userData.profile_pic.data)
            const blob = new Blob([uint8Array], { type: "image/jpeg" })
            return URL.createObjectURL(blob)
          }
        } else if (typeof userData.profile_pic === "string") {
          return userData.profile_pic
        }
      } catch (error) {
        console.error("Error processing profile picture:", error)
      }
    }

    if (usersData[userId] && usersData[userId].profile_pic) {
      try {
        if (typeof usersData[userId].profile_pic === "object") {
          if (usersData[userId].profile_pic.data) {
            const uint8Array = new Uint8Array(usersData[userId].profile_pic.data)
            const blob = new Blob([uint8Array], { type: "image/jpeg" })
            return URL.createObjectURL(blob)
          }
        } else if (typeof usersData[userId].profile_pic === "string") {
          return usersData[userId].profile_pic
        }
      } catch (error) {
        console.error("Error processing profile picture:", error)
      }
    }

    return null
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

  const { text: formattedDescription } = processDescription(book.description)
  console.log(book)
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
          
          {/* Add this button right here */}
          <button 
            onClick={logBookData}
            style={{
              padding: "8px 12px",
              backgroundColor: "#faae2b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            LOG TRACKING DATA
          </button>
          
          <p className="book-author">
            {book.author_first_name} {book.author_last_name}
          </p>

          <div className="book-meta">
            <div className="book-tags">
              <span className="tag genre">{book.category}</span>
            </div>
            <div className="book-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const averageRating = calculateAverageRating()
                  const value = averageRating / 2 // Convert from 10-scale to 5-scale
                  return (
                    <Star
                      key={star}
                      className={`star-icon ${star <= value ? "active" : ""}`}
                      fill={star <= value ? "#faae2b" : "none"}
                      stroke={star <= value ? "#faae2b" : "currentColor"}
                      size={18}
                    />
                  )
                })}
                <span className="average-rating">{calculateAverageRating()}/10</span>
                <span className="reviews-count">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="description-box">
        <h2>Description</h2>
        <p style={{ whiteSpace: "pre-line" }}>{formattedDescription}</p>
      </div>

      {/* Audio Player Component */}
      {book.episodes && book.episodes.length > 0 && (
        <AudioPlayer
          currentBookEpisode={currentEpisode}
          episodes={book.episodes}
          onEpisodeSelect={setCurrentEpisode}
          bookData={book}
        />
      )}

      <div className="reviews-section">
        <div className="reviews-title-container">
          <h2>Reviews</h2>
          <button
            className="add-review-btn"
            onClick={() => {
              if (!userData) {
                alert("You must be logged in to add a review")
                return
              }
              setShowReviewModal(true)
            }}
          >
            Add Review
          </button>
        </div>

        <div className="reviews-list">
          {reviewLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this audiobook!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-user-info">
                    {getProfilePicture(review.userid) ? (
                      <img
                        src={getProfilePicture(review.userid) || "/placeholder.svg"}
                        alt="User profile"
                        className="review-user-avatar"
                      />
                    ) : (
                      <div className="review-user-initial">{getNameInitial(review.userid)}</div>
                    )}
                    <div className="review-user-name">{getUserName(review.userid)}</div>
                  </div>
                  <div className="review-date">{formatDate(review.created_at)}</div>
                </div>
                <div className="review-rating">
                  <span className="rating-value">{review.rating}/10</span>
                </div>
                <div className="review-text">{review.review_text}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="review-modal-header">
              <h3>Write a Review</h3>
              <button className="close-modal-btn" onClick={() => setShowReviewModal(false)}>
                ×
              </button>
            </div>
            <div className="review-modal-content">
              <div className="rating-container">
                <label htmlFor="rating">Rating (1-10)</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <Star
                      key={value}
                      className={`star-icon ${value <= (hoverRating || rating) ? "active" : ""}`}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      fill={value <= (hoverRating || rating) ? "#faae2b" : "none"}
                      stroke={value <= (hoverRating || rating) ? "#faae2b" : "currentColor"}
                    />
                  ))}
                </div>
                <div className="rating-value">{rating || hoverRating || 0}/10</div>
              </div>
              <div className="review-text-container">
                <label htmlFor="review-text">Your Review</label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this audiobook..."
                  rows={5}
                ></textarea>
              </div>
              <div className="review-modal-actions">
                <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={handleSubmitReview}
                  disabled={!reviewText || rating === 0}
                  style={{ backgroundColor: "#faae2b", borderColor: "#faae2b", color: "#555" }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookPage