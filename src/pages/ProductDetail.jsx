import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TitleBar from "../Components/TitleBar";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProductDetail = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                return userData.token || "";
            }
            return "";
        } catch (err) {
            console.error("Error getting token:", err);
            return "";
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}api/items/get-items`);
                const foundProduct = response.data.find(p => p.itemId.toString() === productId);
                
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError("Product not found");
                }
                
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch product details. Please try again later.");
                setLoading(false);
                console.error("Error fetching product details:", err);
            }
        };
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleGoBack = () => {
        navigate('/products');
    };

    const handleAddToCart = async () => {
        const userId = getUserId();
        if (!userId) {
            toast.error("Please login to add items to cart", {
                position: "bottom-right",
                autoClose: 2000,
            });
            navigate('/login');
            return;
        }

        try {
            await axios.post(
                `${backendUrl}api/cart/${userId}/add`,
                {
                    itemId: product.itemId,
                    quantity: quantity
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getToken()}`
                    }
                }
            );

            toast.success(`Added ${quantity} ${product.name} to cart!`, {
                autoClose: 2000,
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart. Please try again.", {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    const getImageUrl = (imageBytes) => {
        if (!imageBytes) return null;
        return `data:image/jpeg;base64,${imageBytes}`;
    };

    if (loading) {
        return (
            <div>
                <TitleBar cart={true} />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div>
                <TitleBar cart={true} />
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300"
                        >
                            <img
                                src="/images/backbutton.png"
                                alt="Back"
                                className="w-8 h-8 sm:w-10 sm:h-10 mr-2 cursor-pointer"
                            />
                            <span className="text-base sm:text-lg font-medium">Back to Products</span>
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500 text-lg sm:text-xl">{error || "Product not found"}</div>
                    </div>
                </div>
            </div>
        );
    }

    const availableImages = [
        getImageUrl(product.image1),
        getImageUrl(product.image2),
        getImageUrl(product.image3),
        getImageUrl(product.image4)
    ].filter(img => img);

    return (
        <div>
            <TitleBar cart={true} />
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300"
                    >
                        <img
                            src="/images/backbutton.png"
                            alt="Back"
                            className="w-8 h-8 sm:w-10 sm:h-10 mr-2 cursor-pointer"
                        />
                        <span className="text-base sm:text-lg font-medium">Back to Products</span>
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    <div className="w-full lg:w-1/2 lg:pr-8">
                        <Swiper
                            navigation={true}
                            modules={[Navigation]}
                            className="product-detail-swiper"
                        >
                            {availableImages.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={img}
                                        alt={`Product view ${index + 1}`}
                                        className="w-full h-64 sm:h-80 md:h-[500px] object-contain"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" 
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-gray-600">(5/5)</span>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{product.category || "Uncategorized"}</p>
                        <p className="mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                        </p>
                        <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-700">{product.description}</p>
                        <div className="mt-2 sm:mt-4 flex items-center">
                            <span className="mr-2 sm:mr-4 text-sm sm:text-base">Quantity:</span>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-sm sm:text-base"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-2 sm:mt-4 flex items-center">
                            <span className="mr-2 sm:mr-4 text-sm sm:text-base">Stock:</span>
                            <span
                                className={`
                                    text-sm sm:text-base
                                    ${product.quantity > 10 ? 'text-green-600' :
                                    product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}
                                `}
                            >
                                {product.quantity} units available
                            </span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            className={`
                                mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-lg text-white font-bold text-sm sm:text-base
                                ${product.quantity > 0
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'}
                            `}
                        >
                            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;