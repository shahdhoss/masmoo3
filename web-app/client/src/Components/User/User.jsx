import "../Assets/css/userprofilestyles.css"; 
import profile from "../Assets/images/pfp_placeholder.png";
import clip1 from "../Assets/images/images/clip-01.jpg";
import clip2 from "../Assets/images/images/clip-02.jpg";
import clip3 from "../Assets/images/images/clip-03.jpg";
import clip4 from "../Assets/images/images/clip-04.jpg";
import game1 from "../Assets/images/images/game-01.jpg";
import game2 from "../Assets/images/images/game-02.jpg";
import game3 from "../Assets/images/images/game-03.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import Edit_profile from "../Edit_profile/Edit";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    axios.get("http://localhost:8080/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error("There was an error fetching the user data!", error);
    });
})
return (
  <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="page-content">

          <div className="row">
            <div className="col-lg-12">
              <div className="main-profile ">
                <div className="row">
                  <div className="col-lg-4">
                    <img src= {data["profile_pic"] || profile}  alt="" style={{ borderRadius: '23px' }}/>
                  </div>
                  <div className="col-lg-4 align-self-center">
                    <div className="main-info header-text">
                      <h4>{data["first_name"]} {data["last_name"]}</h4>
                      <p>{data["bio"]}</p>
                      <div className="main-border-button main-button">
                      <a onClick={()=>openModal()}>Edit Info</a>
                      {isModalOpen && (<Edit_profile closeModal={closeModal} />)}                      
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
                <div className="row">
                  <div className="col-lg-12">
                    <div className="clips">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="heading-section">
                            <h4> <em>Your uploaded </em> books</h4>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                          <div className="item">
                            <div className="thumb">
                              <img src={clip1} alt="" style={{ borderRadius: '23px' }}/>
                            </div>
                            <div className="down-content">
                              <h4>First Clip</h4>
                              <span><i className="fa fa-eye"></i> 250</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                          <div className="item">
                            <div className="thumb">
                              <img src={clip2} alt="" style={{ borderRadius: '23px' }}/>
                            </div>
                            <div className="down-content">
                              <h4>Second Clip</h4>
                              <span><i className="fa fa-eye"></i> 183</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                          <div className="item">
                            <div className="thumb">
                              <img src={clip3} alt="" style={{ borderRadius: '23px' }}/>
                            </div>
                            <div className="down-content">
                              <h4>Third Clip</h4>
                              <span><i className="fa fa-eye"></i> 141</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                          <div className="item">
                            <div className="thumb">
                              <img src={clip4} alt="" style={{ borderRadius: '23px' }}/>
                            </div>
                            <div className="down-content">
                              <h4>Fourth Clip</h4>
                              <span><i className="fa fa-eye"></i> 91</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="main-button">
                            <a href="#">Load More Clips</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div className="item">
                <ul>
                  <li><img src={game2} alt="" className="templatemo-item"/></li>
                  <li><h4>Fortnite</h4><span>Sandbox</span></li>
                  <li><h4>Date Added</h4><span>22/06/2036</span></li>
                  <li><h4>Hours Played</h4><span>745 H 22 Mins</span></li>
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
  </div>
  
)
}

export default User