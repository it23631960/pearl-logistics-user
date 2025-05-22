import React, { useState, useEffect, useRef } from "react";
import TitleBar from "../Components/TitleBar";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    contactNo: '',
    id: null
  });
  
  const [profileImage, setProfileImage] = useState('/images/user.png');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        const user = parsedUserData.user;
        
        
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          street: user.street || '',
          city: user.city || '',
          state: user.state || '',
          zipcode: user.zipcode || '',
          country: user.country || '',
          contactNo: user.contactNo ? user.contactNo.toString() : '',
          id: user.id
        });
        
       
        if (user.image) {
          const base64Image = `data:image/jpeg;base64,${user.image}`;
          setProfileImage(base64Image);
        }
      } catch (error) {
        toast.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
     
      const formData = new FormData();
      
      
      const userToUpdate = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        zipcode: userData.zipcode,
        country: userData.country,
        contactNo: userData.contactNo ? parseInt(userData.contactNo) : null
      };
      
      
      formData.append('user', JSON.stringify(userToUpdate));
      
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      
      const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
      const token = storedUserData.token;
      
      
      const response = await axios.post(`${backendUrl}api/auth/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        sessionStorage.removeItem('userData');
        
        
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  return (
    <>
      <TitleBar />
      <div className="text-center p-5">
        <h2 className="text-3xl font-quicksand font-bold mb-4">Settings</h2>
        <hr className="w-3/4 mx-auto mb-4" />
        <div className="flex justify-center mb-4">
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs rounded-full opacity-0 hover:opacity-100 transition-opacity">
              Change Photo
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <form className="max-w-md mx-auto flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Street"
            name="street"
            value={userData.street}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="City"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              value={userData.state}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Zip Code"
              name="zipcode"
              value={userData.zipcode}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={userData.country}
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          <input
            type="text"
            placeholder="Contact Number"
            name="contactNo"
            value={userData.contactNo}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md text-lg"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default Settings;