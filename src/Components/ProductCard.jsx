import React from "react";
import { useNavigate } from "react-router-dom";
import cartIcon from "../assets/icons/cartIcon.svg";
import { toast, Bounce } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductCard = ({ productsData }) => {
  const navigate = useNavigate();

  const getUserId = () => {
    try {
        const userDataStr = sessionStorage.getItem("userData");
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
          
            if (userData && userData.user && userData.user.id) {
                return userData.user.id;
            }
        }
        return null;
    } catch (err) {
        console.error("Error parsing user data:", err);
        return null;
    }
  };

  const getToken = () => {
    try {
        const userDataStr = sessionStorage.getItem("userData");
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userData && userData.token) {
                return userData.token;
            }
        }
        return null;
    } catch (err) {
        console.error("Error getting token:", err);
        return null;
    }
  };

  
  const notify = () =>
    toast.success("Added to the cart!", {
      position: "bottom-top",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  
  const handleProductClick = () => {
    navigate(`/products/${productsData.itemId}`);
  };

  
  const getImageUrl = (imageBytes) => {
    if (!imageBytes) return null;
    return `data:image/jpeg;base64,${imageBytes}`;
  };

 
  const availableImages = [
    getImageUrl(productsData.image1),
    getImageUrl(productsData.image2),
    getImageUrl(productsData.image3),
    getImageUrl(productsData.image4),
  ].filter((img) => img);

  
  const handleAddToCart = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to add items to cart", {
        position: "bottom-right",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }
  
    try {
      await axios.post(
        `${backendUrl}api/cart/${userId}/add`,
        {
          itemId: productsData.itemId,
          quantity: 1, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
  
      toast.success(`Added ${productsData.name} to cart!`, {
        autoClose: 2000,
      });
  
     
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };
  

  return (
    <div className="w-80 h-fit rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="h-36 w-full">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper h-full cursor-pointer"
        >
          {availableImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="mx-auto h-full object-contain"
                src={image}
                alt={`Product Pic ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="bg-blue-300 text-xs font-light w-fit py-1 px-4 font-lexend rounded-full">
            {productsData.category || "Uncategorized"}
          </div>
          <div className="mt-2 flex flex-col items-end">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <svg
                  key={index}
                  className={`h-4 w-4 text-yellow-400`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-lexend text-gray-900">5/5</span>
          </div>
        </div>
        <div>
          <p
            onClick={handleProductClick}
            className="cursor-pointer text-base font-lexend leading-tight text-gray-900 mt-2"
          >
            {productsData.name}
          </p>
          <p
            onClick={handleProductClick}
            className="cursor-pointer line-clamp-3 text-sm leading-tight font-quicksand text-gray-600 mt-2 pr-12"
          >
            {productsData.description}
          </p>
        </div>
        <hr className="my-4 border-gray-400" />
        <div className="flex items-center justify-between gap-4">
          <p className="text-xl font-lexend text-gray-900">
            ${productsData.price.toFixed(2)}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="group flex font-lexend hover:scale-105 duration-100 gap-2 items-center rounded-lg bg-blue-700 px-5 py-2 text-sm text-white hover:bg-transparent hover:text-blue-700 border-2 border-blue-700 cursor-pointer"
          >
            <img
              src={cartIcon}
              alt="Cart Icon"
              className="h-5 group-hover:invert duration-100"
            />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;