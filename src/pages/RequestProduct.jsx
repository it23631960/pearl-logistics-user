import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TitleBar from "../Components/TitleBar";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RequestProduct = () => {
  const storedUserData = sessionStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const newImages = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 4));
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    
    if (!userData) {
      toast.error("Please login first to place an order");
      return;
    }
    
    setLoading(true);

    setLoading(true);



    const formFields = e.target.elements;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
      "contactNumber",
    ];

    const isFormValid = requiredFields.every(
      (fieldName) => formFields[fieldName].value.trim() !== ""
    );
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
  
      const formData = new FormData();

    
      const orderData = {
        userId: userData?.id, 
        firstName: formFields.firstName.value,
        lastName: formFields.lastName.value,
        email: formFields.email.value,
        contactNumber: formFields.contactNumber.value,
        street: formFields.street.value,
        city: formFields.city.value,
        state: formFields.state.value,
        zipCode: formFields.zipCode.value,
        country: formFields.country.value,
        name: formFields.name.value, 
        description: formFields.description.value, 
        fromCountry: formFields.fromCountry.value,
        productLink: formFields.productLink.value,
        cashOnDelivery: formFields.cashOnDelivery.checked,
      };

   
      formData.append("order", JSON.stringify(orderData));

     
      images.forEach((image) => {
        formData.append("images", image);
      });

      console.log("Sending order data:", orderData);

 
      const response = await axios.post(
        `${backendUrl}api/user/custom-orders`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Order response:", response.data);

    
      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

   
      navigate("/");
    } catch (error) {
      console.error("Error submitting custom order:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleBar />
      <form
        onSubmit={handleSubmit}
        className="flex max-w-4xl mx-auto p-6 bg-white rounded-lg space-x-6"
      >
        <div className="w-1/2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.firstName || ""}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.lastName || ""}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            defaultValue={userData?.email || ""}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            defaultValue={userData?.street || ""}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.city || ""}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.state || ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.zipcode || ""}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue={userData?.country || ""}
            />
          </div>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            defaultValue={userData?.contactNo || ""}
          />
        </div>

        <div className="w-1/2 space-y-4 ">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="relative w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
              >
                {images[index] ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images[index])}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="cursor-pointer"
                  >
                    <img
                      src="/images/addimage.png"
                      alt="Add"
                      className="w-8 h-8"
                    />
                    <input
                      type="file"
                      id={`image-upload-${index}`}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="fromCountry"
            placeholder="From Country"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="productLink"
            placeholder="Product Link"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="cashOnDelivery"
              id="cash-on-delivery"
              className="mr-2 rounded text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="cash-on-delivery" className="text-gray-700">
              Cash On Delivery
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-300" : "bg-white hover:bg-gray-100"
            } text-black border py-2 rounded-md transition duration-300 cursor-pointer`}
          >
            {loading ? "Submitting..." : "Place To Review"}
          </button>
        </div>
      </form>
    </>
  );
};

export default RequestProduct;
