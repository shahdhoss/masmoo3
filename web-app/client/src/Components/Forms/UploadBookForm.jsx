import React, { useState } from 'react';
import axios from 'axios';

const UploadBookForm = ({ closeAddBookModal , fetchBooks}) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [noOfEpisodes, setNoOfEpisodes] = useState('');
  const [episodes, setEpisodes] = useState([]);

  const handleNoOfEpisodesChange = (e) => {
    const value = e.target.value;
    setNoOfEpisodes(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count >= 0) {
      setEpisodes((prev) => {
        const updated = [...prev];
        while (updated.length < count) {
          updated.push({ chapter_title: '', audio_link: '', episode_no: '', duration: '' });
        }
        return updated.slice(0, count);
      });
    } else {
      setEpisodes([]);
    }
  };

  const handleEpisodeChange = (index, field ,value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/audiobook/',
      {
        uploader_id: parseInt(localStorage.getItem('userId')),
        title,
        image,
        language,
        category,
        description,
        author,
        episodes,
        noOfEpisodes: episodes.length,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      console.log('Book added', response.data);
      closeAddBookModal();
      fetchBooks();
    })
    .catch((error) => {
      console.error('Error uploading book:', error);
    });
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload Book</h5>
            <button type="button" className="btn-close" onClick={closeAddBookModal}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of Episodes</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={noOfEpisodes}
                  onChange={handleNoOfEpisodesChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Episodes</label>
                {episodes.map((ep, index) => (
                  <div key={index} className="mb-4 border p-3 rounded">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Episode ${index + 1} Title`}
                      value={ep.chapter_title}
                      onChange={(e) => handleEpisodeChange(index, 'chapter_title', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Episode ${index + 1} Audio URL`}
                      value={ep.audio_link}
                      onChange={(e) => handleEpisodeChange(index, 'audio_link', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Episode ${index + 1} Duration`}
                      value={ep.duration}
                      onChange={(e) => handleEpisodeChange(index, 'duration', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Episode ${index + 1} Number`}
                      value={ep.episode_no}
                      onChange={(e) => handleEpisodeChange(index, 'episode_no', e.target.value)}
                      required
                    />
                  </div>
                ))}

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeAddBookModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBookForm;