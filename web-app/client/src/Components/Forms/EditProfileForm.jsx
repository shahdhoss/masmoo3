import { useState } from "react";
import axios from "axios";
import profile from "../Assets/images/pfp_placeholder.png";
 
const hosting = "https://key-gertrudis-alhusseain-8243cb58.koyeb.app"
// const hosting = "http://localhost:8080"
const EditProfileForm = ({ closeModal, data }) => {
  const [firstName, setFirstName] = useState(data.first_name || '')
  const [lastName, setLastName] = useState(data.last_name || '')
  const [bio, setBio] = useState(data.bio || '')
  const [profilePic, setProfilePic] = useState(data.profile_pic || '')
  const [profilePicPreview, setProfilePicPreview] = useState(data.profile_pic || '')


  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('bio', bio)
    if (profilePic) {
      formData.append('profile_pic', profilePic)
    }

    axios.patch(`${hosting}/user/update`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data',
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
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
  
      const previewURL = URL.createObjectURL(file)
      setProfilePicPreview(previewURL)
    }
  }
  
  
  return (
  <div className="modal show fade d-block w-full max-w-2xl" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content rounded-2xl p-8 bg-white shadow-lg relative">
        
        <button type="button" className="btn-close absolute top-4 right-4" onClick={closeModal}></button>
        
        <div className="flex items-center gap-3 mb-6">
          {/* Profile Image */}
          <div className="rounded-circle overflow-hidden" style={{ width: "70px", height: "70px" }}>
            <img
              src={profilePicPreview || profile}
              alt="Profile"
              className="w-120 h-120 object-cover"
            />
          </div>

          {/* Name and Bio */}
          <div>
            <h2 className="text-lg font-semibold m-0">{firstName || ""} {lastName || ""}</h2>
            <p className="text-gray-500 m-0">{bio || ""}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-1/2 border rounded-lg p-2"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-1/2 border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              placeholder="Write something about yourself..."
              className="w-full border rounded-lg p-2"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Upload a picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-gray-600 border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
  
  );
};

export default EditProfileForm;