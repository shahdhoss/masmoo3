/**
 * Get user preferences from cookies
 * @returns {Object} Object containing user preferences
 */
export const getUserPreferences = () => {
  try {
    const languageData = getCookie("book_languages")
    const authorData = getCookie("book_authors")
    const categoryData = getCookie("book_categories")

    return {
      languages: languageData ? JSON.parse(languageData) : {},
      authors: authorData ? JSON.parse(authorData) : {},
      categories: categoryData ? JSON.parse(categoryData) : {},
    }
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return {
      languages: {},
      authors: {},
      categories: {},
    }
  }
}

/**
 * Get a cookie by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

/**
 * Find the most frequent item in a preferences object
 * @param {Object} prefsObj - Object with items as keys and counts as values
 * @returns {string|null} The most frequent item or null if empty
 */
export const getMostFrequent = (prefsObj) => {
  if (!prefsObj || Object.keys(prefsObj).length === 0) return null

  return Object.entries(prefsObj).sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

/**
 * Generate recommendations based on user preferences and available books
 * @param {Array} books - Array of all available books
 * @param {Object} preferences - User preferences object
 * @returns {Object} Object containing recommendations by author, language, and category
 */
export const generateRecommendations = (books, preferences) => {
  if (!books || books.length === 0) {
    return {
      byAuthor: [],
      byLanguage: [],
      byCategory: [],
    }
  }

  const topLanguage = getMostFrequent(preferences.languages)
  const topAuthor = getMostFrequent(preferences.authors)
  const topCategory = getMostFrequent(preferences.categories)

  // Find books matching these preferences
  const authorRecommendations = topAuthor
    ? books
        .filter((book) => {
          const bookAuthor = book.author || `${book.author_first_name || ""} ${book.author_last_name || ""}`.trim()
          return bookAuthor === topAuthor
        })
        .slice(0, 3)
    : []

  const languageRecommendations = topLanguage ? books.filter((book) => book.language === topLanguage).slice(0, 3) : []

  const categoryRecommendations = topCategory ? books.filter((book) => book.category === topCategory).slice(0, 3) : []

  return {
    byAuthor: authorRecommendations,
    byLanguage: languageRecommendations,
    byCategory: categoryRecommendations,
  }
}
