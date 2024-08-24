import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styling/Navbar.css';
import UserContext from "../context/UserContext";
import ProfileModal from "./Modals/ProfileModal";
import { logoutService } from "../services/LogoutService";
import AccountContext from "../context/AccountContext";

function Navbar(){

  const {userInfo, setUserInfo} = useContext(UserContext);
  const { setAccountInformation } = useContext(AccountContext);

  const [navbarToggle, setNavbarToggle] = useState(false);
  const handleNavbarToggle = (event) => {
    event.preventDefault();
    setNavbarToggle(currentState => !currentState);
  }
  
  const[profileModalStatus, setProfileModalStatus] = useState(false);
  const handleProfile = async (event) => {
    event.preventDefault();
    setNavbarToggle(false);
    setProfileModalStatus(true);
  }
  
  const navigate = useNavigate();
  const handleLogout = (event) => {
    event.preventDefault();
    setAccountInformation(null);
    setUserInfo(null);
    setNavbarToggle(false);
    logoutService();
    navigate("/");
  }

    return (
      <React.Fragment>
        <div className="navbar_component">
          <nav className="navbar navbar-expand-lg bg-body-tertiary navbar_color">
            <div className="container-fluid">
              <h4 className="navbar-brand align-center">
                E-Banka
              </h4>
              { userInfo != null && (
                <React.Fragment>
              <button
                className="navbar-toggler justify-content-end"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={(e) => handleNavbarToggle(e)}
              >
                <span className="navbar-toggler-icon" id="navbarNavDropdown">
                  {navbarToggle &&
                    <ul className="toggle-items" style={{ display: navbarToggle ? 'block' : 'none' }}>
                      <li><p>{userInfo?.userInfo?.firstName} {userInfo?.userInfo?.lastName}</p></li>
                          { (userInfo?.userInfo?.userRole !== "YES" && 
                            userInfo?.userInfo?.userApplicationStatus !== "PENDING" && userInfo?.userInfo?.userApplicationStatus !== "REJECTED") 
                            && <li><p className="dropdown-item" name="profile" onClick={(e) => handleProfile(e)} >View Profile</p></li>
                          }
                      <li>
                        <p className="dropdown-item" name="logout" onClick={(e) => handleLogout(e)}>Logout</p>
                      </li>
                    </ul>
                      }
                </span>
              </button>
           
              <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav">
                  <li className="dropdown"><h4 className="nav-item dropdown nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown"
                  onClick={(e) => handleNavbarToggle(e)}
                  aria-expanded="false">
                     {userInfo?.userInfo?.firstName} {userInfo?.userInfo?.lastName}
                    </h4>
                    {navbarToggle &&
                    <ul className="toggle-items">
                        { (userInfo?.userInfo?.userRole === "NO" && 
                          userInfo?.userInfo?.userApplicationStatus !== "PENDING" && userInfo?.userInfo?.userApplicationStatus !== "REJECTED") 
                          && <li><p className="dropdown-item" name="profile" onClick={(e) => handleProfile(e)} >View Profile</p></li>
                        }
                      <li>
                        <p className="dropdown-item" name="logout" onClick={(e) => handleLogout(e)}>Logout</p>
                      </li>
                    </ul>
                      }
                  </li>
                </ul>
              </div>
              </React.Fragment>
              )}
            </div>
          </nav>
        </div>
        {
          profileModalStatus && userInfo && <ProfileModal value={{modalShowStatus: profileModalStatus, setHide: setProfileModalStatus, modalOperation: `${userInfo && userInfo?.userInfo?.firstName} ${userInfo.userInfo.lastName} Profile `}} />
        }
      </React.Fragment>
    );
}

export default Navbar;