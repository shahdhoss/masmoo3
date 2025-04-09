import React, { useState } from 'react';
import '../Edit_profile/editstyles.css'; // Import your CSS file for styling
import axios from 'axios';

const Edit = ({ closeModal }) => {
  // State for the input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.patch("http://localhost:8080/user/update", {
      first_name: firstName,
      last_name: lastName,
      bio: bio,
      profile_pic: profilePic,
  }, {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
  })
  .then(response => {
      console.log("User data updated:", response.data);
      closeModal();
  })
  .catch(error => {
      console.error("Error updating user:", error);
  });
   
  };

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <div className="modal-header">
      <h4>Edit Profile</h4>
      <button onClick={closeModal} className="modal-close-btn">X</button>
    </div>
    
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="modal-form-group">
          <label htmlFor="firstName" className="modal-label">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="modal-input"
          />
        </div>
        
        <div className="modal-form-group">
          <label htmlFor="lastName" className="modal-label">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="modal-input"
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="bio" className="modal-label">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter bio"
            className="modal-textarea"
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="profilePic" className="modal-label">Profile Picture URL</label>
          <input
            type="text"
            id="profilePic"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="Enter profile picture URL"
            className="modal-input"
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="submit" className="modal-btn">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default Edit;
