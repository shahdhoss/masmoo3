import "../Assets/css/userprofilestyles.css"; 
import profile from "../Assets/images/pfp_placeholder.png";
import game1 from "../Assets/images/images/game-01.jpg";
import game2 from "../Assets/images/images/game-02.jpg";
import game3 from "../Assets/images/images/game-03.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import UserBookUpload from "./UserBookUpload";
import {jwtDecode} from 'jwt-decode';
import EditProfileForm from "../Forms/EditProfileForm";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [role, setRole] = useState(null)
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);

    axios.get("http://localhost:8080/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      setData(response.data);
      const token = localStorage.getItem("token");
      if (token) {
        const decoded_token = jwtDecode(token);
        console.log(decoded_token);
        setRole(decoded_token.role);
      } else {
        console.error("No token found in localStorage");
      }
    })
    .catch((error) => {
      console.error("There was an error fetching the user data!", error);
    });
    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    };
  }, [isModalOpen]);
  
  
  return(
    
    <div className="row">
      <div className="col-lg-12">
        <div className="page-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-profile ">
                <div className="row">
                  <div className="col-lg-3">
                    <img src= {data["profile_pic"] || profile}  alt="" style={{ borderRadius: '23px' }}/>
                  </div>
                  <div className="col-lg-4 align-self-center">
                    <div className="main-info header-text">
                      <h3>{data["first_name"]} {data["last_name"]}</h3>
                      <p>{data["bio"]}</p>
                      <div className="main-button">
                      <a onClick={()=>openModal()}>Edit Info</a>
                      {isModalOpen && (<EditProfileForm closeModal={closeModal} />)}                      
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 align-self-center">
                    <ul>
                      <li>Favorited books<span>{data["fav_books"]}</span></li>
                      <li>Listen later<span>{data["listen_later"]}</span></li>
                      <li>Reviews<span>{data["reviews"]}</span></li>
                      <li>Uploaded books<span>0</span></li>
                    </ul>
                  </div>
                </div>
                <div>
                {role === "admin" && <UserBookUpload/>}
                </div>
              </div>
            </div>
          </div>

          <div className="gaming-library profile-library">
            <div className="col-lg-12">
              <div className="heading-section">
                <h4>Your Library</h4>
              </div>
              <div className="item">
                <ul>
                  <li><img src={game1} alt="" className="templatemo-item"/></li>
                  <li><h4>Dota 2</h4><span>Sandbox</span></li>
                  <li><h4>Date Added</h4><span>24/08/2036</span></li>
                  <li><h4>Hours Played</h4><span>634 H 22 Mins</span></li>
                  <li><h4>Currently</h4><span>Downloaded</span></li>
                  <li><div className="main-border-button border-no-active"><a href="#">Donwloaded</a></div></li>
                </ul>
              </div>
              <div className="item last-item">
                <ul>
                  <li><img src={game3} alt="" className="templatemo-item"/></li>
                  <li><h4>CS-GO</h4><span>Sandbox</span></li>
                  <li><h4>Date Added</h4><span>21/04/2022</span></li>
                  <li><h4>Hours Played</h4><span>632 H 46 Mins</span></li>
                  <li><h4>Currently</h4><span>Downloaded</span></li>
                  <li><div className="main-border-button border-no-active"><a href="#">Donwloaded</a></div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User