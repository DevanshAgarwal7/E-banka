import React, { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import AlertMessage from "../AlertMessage";
import UserContext from "../../context/UserContext";
import { fetchUserDetailsService, updateProfilePicImageService, updateUserDetailsService } from "../../services/UserService";
import SuccessMessage from "./SuccessMessage";
import UserIdleChecker from "../../util/UserIdlechecker";

function ProfileModal({value}) {

    const {userInfo} = useContext(UserContext);

    const initialUserDetailsState = {
        userId: '',
        userAddress: '',
        userAddressPincode: '',
        userAge: '',
        userGender: '',
        userDob: '',
        userMobileNumber: '',
    }

    const defaultImage = "https://th.bing.com/th/id/OIP.Gl6B6jDrC6gWIrv57WlLdQHaHT?w=166&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7";
    const[profileImage, setProfileImage] = useState(defaultImage);
    const[isProfileImageValid, setProfileImageValidStatus] = useState(false);
    const[userDetails, setUserDetails] = useState(initialUserDetailsState);

    useEffect(()=> {
        initialUserDetailsState.userId = userInfo.userInfo.userId;
        const fetchUserDetails = async () => {
            const response = await fetchUserDetailsService(userInfo.userInfo.userId);
            setUserDetails(prevState => ({
                ...prevState,
                userAddress: response?.data?.userAddress,
                userAddressPincode: response?.data?.userAddressPincode,
                userAge: response?.data.userAge,
                userGender: response?.data?.userGender,
                userDob: response?.data?.userDob,
                userMobileNumber: response?.data?.userMobileNumber
            }));
            setProfileImage( () => {
                if(response?.data?.userProfilePic){
                    return "data:image/jpeg;base64," + response?.data?.userProfilePic;
                }
                return defaultImage
            });
        }
        fetchUserDetails();
    }, [])


    const[errorState, setErrorState] = useState({show: false, heading: "", message: ""});

    const setErrorWarning = (warningMessage) => {
      setErrorState({show: true, heading: "Warning", message: warningMessage});
      setTimeout(() => {
        setErrorState({show: false, heading: "", message: ""});
      }, 3000);
    }

    const[successAlertState, setSuccessAlertState] = useState({show: false, heading: "", message: ""});
    const setSuccessMessage = (successMessage) => {
        setSuccessAlertState({show: true, heading: "Success", message: successMessage});
      setTimeout(() => {
        setSuccessAlertState({show: false, heading: "", message: ""});
        handleClose();
      }, 4000);
    }

    const handleProfilePreview = (event) => {
        if(event.target.files[0] && (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/jpg"
            || event.target.files[0].type === "image/png" )){
                const fileReader = new FileReader();
                fileReader.onload = (reader)=>{
                    setProfileImage(reader.target.result);
                }
                fileReader.readAsDataURL(event.target.files[0]);
                setProfileImageValidStatus(true);
        }
        else {
            setProfileImage(defaultImage);
            setProfileImageValidStatus(false);
            setErrorWarning("Please Upload Image Only.")
        }
    }

    const handleChange = (event) => {
        setUserDetails(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
        setMobileNumberValidStatus({show: true, message: null})
        setAgeValidStatus({show: true, message: null})
        setPincodeValidStatus({show: true, message: null})
        setGenderValidStatus({show: false, message: null})
        setDobValidStatus({show: false, message: null})
        setAddressValidStatus({show: false, message: null})
    }

    const[notValidMobileNumber, setMobileNumberValidStatus] = useState({show: true, message: null});
    const[notValidAge, setAgeValidStatus] = useState({show: true, message: null});
    const[notValidPincode, setPincodeValidStatus] = useState({show: true, message: null});
    const[notValidGenderType, setGenderValidStatus] = useState({show: false, message: null});
    const[notValidDob, setDobValidStatus] = useState({show: false, message: null});
    const[notValidAddress, setAddressValidStatus] = useState({show: false, message: null})


    const setInvalidMobileNumber = (message) => {
        setMobileNumberValidStatus({show: true, message: message});
    }
    const handleMobileNumberValidation = (event) => {
        if (!/^\d*\.?\d*$/.test(event.target.value) || event.target.value === '') {
            setInvalidMobileNumber('Please Enter Only Number.'); 
          } else if(event.target.value.length !== 10){
            setInvalidMobileNumber('Please Enter 10 Digit Mobile Number');
          } else {
            setUserDetails(prevState => ({...prevState,[event.target.name]: event.target.value}));
            setMobileNumberValidStatus({show: false, message: null});
          }
    }

    const setInvalidAgeStatus= (message) => {
        setAgeValidStatus({show: true, message: message});
    }
    const handleAgeValidation = (event) => {
        if (!/^\d*\.?\d*$/.test(event.target.value) || event.target.value === '') {
            setInvalidAgeStatus('Please Enter Only Number.'); 
          } else if(parseInt(event.target.value) < 18 || parseInt(event.target.value) > 100){
            setInvalidAgeStatus('Please Enter Age Between 18 to 100');
          } else {
            setUserDetails(prevState => ({...prevState,[event.target.name]: parseInt(event.target.value)}));
            setAgeValidStatus({show: false,message: null});
          }
    }

    const setInvalidPincodeStatus= (message) => {
        setPincodeValidStatus({show: true, message: message});
    }
    const handlePincodeValidation = (event) => {
            if (!/^\d*\.?\d*$/.test(event.target.value) || event.target.value === '') {
                setInvalidPincodeStatus('Please Enter Only Number.'); 
            } else if(event.target.value.length !== 6 ){
                setInvalidPincodeStatus("Minimum 6 charater Allowed.");
            } else {
            setUserDetails(prevState => ({...prevState,[event.target.name]: event.target.value }));
            setPincodeValidStatus({show: false,message: null });
          }
    }


    const handleUserDetailsSubmit = async (event) => {
        event.preventDefault();
        if(userDetails.userAddress === '' || userDetails.userAddress?.length < 6){
            setAddressValidStatus(prevState => ({...prevState, show: true, message: "Minimum length of Address is 6"}));
                setTimeout(() => {
                    setAddressValidStatus({show: false, message: null});
                }, 4000);
        } else if(userDetails.userGender === ''){
            setGenderValidStatus(prevState => ({...prevState, show: true, message: "Please Select Gender"}));
                setTimeout(() => {
                    setGenderValidStatus({show: false, message: null});
                }, 4000);
        } else if(userDetails.userDob === ''){
            setDobValidStatus(prevState => ({...prevState, show: true, message: "Please Enter DOB."}));
                setTimeout(() => {
                    setDobValidStatus({show: false, message: null});
                }, 4000);
        } else if(userDetails.userMobileNumber &&  userDetails.userMobileNumber.length < 10){
            setMobileNumberValidStatus({show: true, message: 'Please Enter 10 Digit Mobile Number'});
            setTimeout(() => {
                setMobileNumberValidStatus({show: true, message: null});
            }, 4000);
        } else if(userDetails.userAge && userDetails?.userAge < 18 || userDetails?.userAge > 100){
            setAgeValidStatus({show: true, message: 'Please Enter Age Between 18 to 100 ..'});
            setTimeout(() => {
                setAgeValidStatus({show: true, message: null});
            }, 4000);
        }
        else{
            try {
                await updateUserDetailsService(userDetails);
                setSuccessMessage("Your Personal Details Updated Successfully.");
            } catch (error) {
                
            }
        }
    }

    const handleUpdateImageSubmit  = async (event) => {
        event.preventDefault();
        if(profileImage !== defaultImage){
            await updateProfilePicImageService({
                userId: userInfo?.userInfo?.userId,
                userProfilePic: profileImage
            })
            setSuccessMessage("Image Uploaded Successfully.");
        } else{
            setErrorWarning("No image selected or default image selected");
        }
    }

    const handleClose = () => {
        value.setHide(false);
    }


    return ( 
        <React.Fragment>
            <div className="profile_modal_component">
                <div className="profile_modal_div">
                    <Modal show={value.modalShowStatus}  onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{value?.modalOperation}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{height: "70vh", overflowY: "auto"}}>
                            <div className="d-flex flex-column mb-3 justify-content-center align-items-center flex-wrap">
                                <div>
                                    <label className="form-label">
                                        Profile Picture
                                        </label>
                                    <div className="p-2">
                                        <Image src={profileImage} roundedCircle  alt="Profile Pic" style={{objectFit: "cover" , width: "130px", height: "145px"}}/>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={(e) => handleUpdateImageSubmit(e)}>
                                        <input type="file" name="userProfilePic" onChange={(e) => handleProfilePreview(e)} />
                                        <button type="submit" className="btn btn-primary" disabled={!isProfileImageValid}>Update Image</button>
                                    </form>
                                </div>
                            </div>
                        <div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
                        <div className="p-2">
                            <form onSubmit={(e)=>handleUserDetailsSubmit(e)} >
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">
                                    Email Address
                                    </label>
                                    <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    name="userEmail"
                                    value={userInfo != null && userInfo?.userInfo?.userEmail}
                                    disabled
                                    aria-describedby="emailHelp"
                                    />
                                    <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="firstname" className="form-label">
                                    First Name
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    name="firstName"
                                    value={userInfo != null && userInfo?.userInfo?.firstName}
                                    disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">
                                    Last Name
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="lastname"
                                    name="lastName"
                                    value={userInfo != null && userInfo?.userInfo?.lastName}
                                    disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userid" className="form-label">
                                    User ID
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="userid"
                                    name="userId"
                                    value={userInfo != null && userInfo?.userInfo?.userId}
                                    disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                    Address
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="userAddress"
                                      value={userDetails.userAddress}
                                      onChange={(e) => handleChange(e)}
                                    />
                                    {notValidAddress.show && (<p style={{ color: "red", display: 'block' }}>{notValidAddress?.message}</p>)}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pincode" className="form-label">
                                    Pincode
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="pincode"
                                    name="userAddressPincode"
                                    value={userDetails.userAddressPincode}
                                    onChange={(e) => handleChange(e)}
                                    onKeyUp={(e) => handlePincodeValidation(e)}
                                    />
                                    {notValidPincode?.show && (<p style={{ color: "red", display: 'block' }}>{notValidPincode?.message}</p>)}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dob" className="form-label">
                                    Date Of Birth
                                    </label>
                                    <input
                                    type="date"
                                    className="form-control"
                                    id="dob"
                                    name="userDob"
                                    value={userDetails.userDob}
                                    onChange={(e) => handleChange(e)}
                                    />
                                    {notValidDob?.show && (<p style={{ color: "red", display: 'block' }}>{notValidDob?.message}</p>)}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="age" className="form-label">
                                    Age
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="age"
                                    name="userAge"
                                    value={userDetails.userAge}
                                    onChange={(e) => handleChange(e)}
                                    onKeyUp={(e) => handleAgeValidation(e)}
                                    aria-describedby="emailHelp"
                                    />
                                    {notValidAge && (<p style={{ color: "red", display: 'block' }}>{notValidAge?.message}</p>)}
                                </div>
                                <div>
                                    <label className="form-check-label">Gender</label>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userGender" value="Male" onClick={(e) => handleChange(e)} id="flexRadioDefault1" checked={userDetails.userGender === "Male"} onChange={(e) => handleChange(e)}/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userGender" value="Female" onClick={(e) => handleChange(e)} id="flexRadioDefault2" 
                                            checked={userDetails.userGender === "Female"} onChange={(e) => handleChange(e)}/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                Female
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userGender" value="Other" onClick={(e) => handleChange(e)} id="flexRadioDefault3"
                                            checked={userDetails.userGender === "Other"} onChange={(e) => handleChange(e)}/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                Other
                                            </label>
                                            {notValidGenderType.show && (<p style={{ color: "red", display: 'block' }}>{notValidGenderType?.message}</p>)}
                                        </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mobile_number" className="form-label">
                                    Mobile Number
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="mobile_number"
                                    name="userMobileNumber"
                                    value={userDetails.userMobileNumber}
                                    onChange={(e) => handleChange(e)}
                                    onKeyUp={(e) => handleMobileNumberValidation(e)}
                                    />
                                    {notValidMobileNumber.show && (<p style={{ color: "red", display: 'block' }}>{notValidMobileNumber?.message}</p>)}
                                </div>
                                <div className="d-flex justify-content-evenly">
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </div>
                        <div className="d-flex flex-row mb-3 justify-content-end align-items-end">
                            { errorState && <AlertMessage show={errorState.show} heading = {errorState.heading} message={errorState.message} style={{ position: 'relative', right: 0, bottom: 0 }}/>}
                        </div>
                        <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                            { successAlertState && <SuccessMessage show={successAlertState.show} heading = {successAlertState.heading} message={successAlertState.message} />}
                        </div>
                    </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </React.Fragment>
     );
}

export default ProfileModal;