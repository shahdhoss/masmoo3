import { useState } from "react";
import axios from "axios";

const EditProfileForm = ({ closeModal, bookId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

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
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  id="bio"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="profilePic" className="form-label">Profile Picture URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="profilePic"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;