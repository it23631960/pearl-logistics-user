import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [itemImages, setItemImages] = useState({});
  const navigate = useNavigate();
  
  
  const getUserId = () => {
    const userDataStr = sessionStorage.getItem("userData");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.user && userData.user.id) {
          return userData.user.id;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return null; 
  };

  useEffect(() => {
    fetchCartItems();
  
   
    const handleCartUpdate = () => {
      fetchCartItems();
    };
  
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);
  

  const fetchCartItems = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error("User ID not found in session storage");
      return;
    }
    
    try {
      const response = await axios.get(`${backendUrl}api/cart/${userId}`);
   
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
      
      
      items.forEach(item => {
        if (item && item.itemId) {
          fetchItemImage(item.itemId);
        }
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
     
      setCartItems([]);
    }
  };


  const fetchItemImage = async (itemId) => {
    try {
      const response = await axios.get(`${backendUrl}api/items/${itemId}/image`, {
        responseType: 'arraybuffer'
      });
      
      const base64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      setItemImages(prev => ({
        ...prev,
        [itemId]: `data:image/jpeg;base64,${base64}`
      }));
    } catch (error) {
      console.error(`Error fetching image for item ${itemId}:`, error);
    }
  };


  const handleCheckout = () => {
    navigate("/checkout", { state: { cart: cartItems } });
  };

 
  const totalPrice = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0)
    : 0;

  
  const removeItemFromCart = async (itemId) => {
    const userId = getUserId();
    if (!userId) {
      console.error("User ID not found in session storage");
      return;
    }
    
    try {
      await axios.delete(`${backendUrl}api/cart/${userId}/remove/${itemId}`);
     
      setCartItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 h-full w-full z-20" onClick={() => setIsOpen(false)}></div>
      )}
      <div className="relative z-30">
        <div className="flex bg-white rounded-t-2xl">
          <div className="flex items-center gap-4 p-2 px-4">
            <div className="bg-pink-400 px-3 py-1 font-lexend rounded-full text-center">
              {Array.isArray(cartItems) ? cartItems.length : 0}
            </div>
            <img src="/images/cart.png" alt="Cart Icon" className="w-8 h-8" />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex items-center bg-gray-200 p-2 rounded-tr-2xl"
          >
            <img src="/images/arrowdown.png" alt="Arrow Down Icon" className="w-6" />
          </button>
        </div>
        {!isOpen ? (
          <button
            onClick={handleCheckout}
            className="cursor-pointer font-lexend flex items-center justify-between text-white w-full py-2 px-4 bg-blue-600 rounded-b-2xl"
          >
            <span>Checkout</span>
            <img src="/images/next.png" alt="Arrow Right" className="w-8 h-8" />
          </button>
        ) : (
          <div className="absolute right-0 rounded-2xl rounded-tr-none w-64 bg-blue-100 shadow-lg z-30">
            <div className="p-4">
              <h2 className="text-xl mb-4 font-lexend">Shopping Cart</h2>
              <div className="max-h-64 overflow-y-auto">
                {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-yellow-200 p-2 mr-3 rounded">
                          {itemImages[item.itemId] ? (
                            <img 
                              src={itemImages[item.itemId]} 
                              alt={item.itemName} 
                              className="w-8 h-8 object-cover"
                            />
                          ) : (
                            <img src="/images/box.png" alt="Product" className="w-8 h-8" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium font-lexend">{item.itemName}</p>
                          <p className="text-sm">{item.quantity} × ${(item.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItemFromCart(item.itemId)}
                        className="bg-red-200 p-2 rounded"
                      >
                        <img src="/images/del.png" alt="Delete" className="w-6 h-6" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-blue-200 mt-2 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Sub Total</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white w-full py-3 px-4 rounded-lg flex items-center cursor-pointer justify-between"
                >
                  <span className="text-lg">Checkout</span>
                  <img src="/images/next.png" alt="Arrow Right" className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;