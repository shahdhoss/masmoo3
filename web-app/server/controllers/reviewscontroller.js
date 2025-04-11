const { reviews } = require("../models")

exports.getAll = async (req, res) => {
  try {
    const allReviews = await reviews.findAll()
    res.status(200).json(allReviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

exports.getById = async (req, res) => {
  const { id } = req.params
  try {
    const reviewData = await reviews.findOne({
      where: { id },
    })

    if (!reviewData) {
      return res.status(404).json({ message: "Review not found" })
    }

    res.status(200).json(reviewData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

exports.getByBookId = async (req, res) => {
  const { book_id } = req.params
  try {
    const bookReviews = await reviews.findAll({
      where: { audiobookid: book_id },
    })

    res.status(200).json(bookReviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

exports.create = async (req, res) => {
  const { review_text, rating, book_id, user_id, created_at } = req.body
  try {
    const newReview = await reviews.create({
      review_text,
      rating,
      audiobookid: book_id,
      userid: user_id,
      created_at: created_at || new Date().toISOString(),
    })
    res.status(201).json(newReview)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

exports.update = async (req, res) => {
  const { id } = req.params
  const { review_text, rating } = req.body
  try {
    const review = await reviews.findOne({ where: { id } })
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    const updatedReview = await reviews.update({ review_text, rating }, { where: { id } })

    res.status(200).json({
      message: "Review updated successfully",
      updatedReview,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

exports.delete = async (req, res) => {
  const { id } = req.params
  try {
    const review = await reviews.findOne({ where: { id } })
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    await reviews.destroy({ where: { id } })
    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
