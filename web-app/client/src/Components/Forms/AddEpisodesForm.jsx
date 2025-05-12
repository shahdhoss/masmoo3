import React, { useState } from 'react';
import axios from 'axios';

const hosting = "https://key-gertrudis-alhusseain-8243cb58.koyeb.app"
// const hosting = "http://localhost:8080"
const AddEpisodesForm = ({ closeEpisodesBookModal, bookId }) => {
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
          updated.push({
            id: `${Date.now()}-${Math.random()}`,
            episode_title: '',
            audio_link: '',
            episode_no: '',
            duration: ''
          });
        }
        return updated.slice(0, count);
      });
    } else {
      setEpisodes([]);
    }
  };

  const handleEpisodeChange = (index, field, value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!bookId) {
      console.error("Book ID not found in localStorage");
      return;
    }
  
    axios.patch(`${hosting}/audiobook/${bookId}`, {
      episodes: episodes,
      noOfEpisodes: episodes.length,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }).then(response => {
      console.log("Episodes added:", response.data);
      closeEpisodesBookModal();
    })
    .catch(error => {
      console.error("Error adding episodes:", error);
    });
  };
  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Episodes</h5>
            <button type="button" className="btn-close" onClick={closeEpisodesBookModal}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div className="mb-3">
                <label className="form-label">Number of Episodes to be added</label>
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
                  <div  key={`episode-${index}`} className="mb-4 border p-3 rounded">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Episode ${index + 1} Title`}
                      value={ep.episode_title}
                      onChange={(e) => handleEpisodeChange(index, 'episode_title', e.target.value)}
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
              <button type="button" className="btn btn-secondary" onClick={closeEpisodesBookModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Episodes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEpisodesForm;
