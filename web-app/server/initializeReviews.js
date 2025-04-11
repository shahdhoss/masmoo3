const initialiseReviews = async () => {
    try {
      // Check if the reviews table exists, if not create it
      await db.sequelize.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          created_at TEXT NOT NULL,
          review_text TEXT NOT NULL,
          rating DOUBLE PRECISION NOT NULL,
          audiobookid INTEGER NOT NULL,
          userid INTEGER NOT NULL
        )
      `)
  
      console.log("Reviews table initialized successfully")
    } catch (error) {
      console.error("Error initializing reviews table:", error)
    }
  }