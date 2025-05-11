import axios from "axios";
import UploadBookForm from "../Forms/UploadBookForm";
import AddEpisodesForm from "../Forms/AddEpisodesForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/css/userprofilestyles.css";
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const hosting= "https://key-gertrudis-alhusseain-8243cb58.koyeb.app"

const UserBookUpload = () => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isAddEpisodesModalOpen, setIsAddEpisodeModalOpen] = useState(false);
  const [currentEditingBookId, setCurrentEditingBookId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingStates, setLoadingStates] = useState({});
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const goToBook = (id) => {
    navigate(`/book/${id}`);
  };

  const openAddBookModal = () => {
    setIsAddBookModalOpen(true);
  };

  const closeAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  const openAddEpisodesModal = (bookId) => {
    setCurrentEditingBookId(bookId);
    setIsAddEpisodeModalOpen(true);
  };

  const closeEpisodesBookModal = () => {
    setCurrentEditingBookId(null);
    setIsAddEpisodeModalOpen(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const handleImageLoad = (bookId) => {
    setLoadingStates((prev) => ({
      ...prev,
      [bookId]: "loaded",
    }));
  };

  const handleImageError = (bookId) => {
    setLoadingStates((prev) => ({
      ...prev,
      [bookId]: "error",
    }));
  };

  const handleDeleteBook = (bookId) => {
    axios.delete(`${hosting}/audiobook/${bookId}`)
      .then((response) => {
        console.log("Book deleted successfully", response.data);
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        setLoadingStates((prev) => ({
          ...prev,
          [bookId]: "deleted",
        }));
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
      });
  };

  const fetchBooks = () => {
    const initialLoadingStates = {};
    books.forEach((book) => {
      initialLoadingStates[book.id] = "loading";
    });
    setLoadingStates(initialLoadingStates);

    axios.get(`${hosting}/user/uploadedbooks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        const uploadedBooks = response.data;
        setBooks(uploadedBooks);

        const newLoadingStates = {};
        uploadedBooks.forEach((book) => {
          newLoadingStates[book.id] = "loading";
        });
        setLoadingStates(newLoadingStates);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);

    fetchBooks();

    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="clips">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section">
                <h4>
                  <em>Your uploaded</em> books
                  <button className="plus-button" onClick={openAddBookModal}>
                    <span className="plus-sign">+</span>
                  </button>
                </h4>
                {isAddBookModalOpen && (
                  <UploadBookForm closeAddBookModal={closeAddBookModal} fetchBooks={fetchBooks} />
                )}
              </div>
            </div>

            {books.slice(0, visibleCount).map((book) => (
              <div className="col-lg-3 col-sm-5" key={book.id}>
                <div className="item">
                  <div className="audiobook-cover">
                    {(loadingStates[book.id] === "loading" || loadingStates[book.id] === "error") && (
                      <div
                        className="image-placeholder"
                        style={{
                          backgroundColor: "#f0f0f0",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                        }}
                      >
                        <span>
                          {loadingStates[book.id] === "error"
                            ? "Image not available"
                            : "Loading..."}
                        </span>
                      </div>
                    )}

                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={`Cover for ${book.title}`}
                      onLoad={() => handleImageLoad(book.id)}
                      onError={() => handleImageError(book.id)}
                      onClick={() => goToBook(book.id)}
                      style={{
                        display: loadingStates[book.id] === "loaded" ? "block" : "none",
                        width: "100%",
                        borderRadius: "10px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div
                    className="down-content"
                    style={{ margin: "15px", display: "flex", alignItems: "center" }}
                  >
                    <h4 style={{ marginRight: "10px" }}>{book.title}</h4>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      aria-label="Delete book"
                      className="delete-icon-button"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={() => openAddEpisodesModal(book.id)}
                      aria-label="Edit episodes"
                      className="delete-icon-button"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {visibleCount < books.length && (
              <div className="col-lg-12">
                <div className="main-button">
                  <a onClick={handleLoadMore} style={{ cursor: "pointer" }}>
                    Load More Books
                  </a>
                </div>
              </div>
            )}

            {isAddEpisodesModalOpen && currentEditingBookId && (
              <AddEpisodesForm
                closeEpisodesBookModal={closeEpisodesBookModal}
                bookId={currentEditingBookId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookUpload;
