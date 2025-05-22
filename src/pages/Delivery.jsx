import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TitleBar from "../Components/TitleBar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Delivery = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 50;
  const otherCharges = 20;
  const totalPayable = itemsTotal + shipping + otherCharges;

  
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
    const userId = getUserId();
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    
    axios.get(`${backendUrl}api/cart/${userId}`, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    })
    .then(response => {
      setCartItems(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart items");
      setLoading(false);
    });
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert("Please log in to place an order");
      return;
    }

    setLoading(true);

   
    const orderRequest = {
      userId: userId,
      paymentMethod: paymentMethod,
      shippingCharges: shipping,
      otherCharges: otherCharges
    };

    axios.post(`${backendUrl}api/orders/place`, orderRequest, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    })
    .then(response => {
      setLoading(false);
      
      if (response.data.success) {
        alert("Order placed successfully!");
        navigate("/order-confirmation", { 
          state: { 
            orderId: response.data.orderId,
            totalAmount: response.data.totalAmount,
            paymentMethod: paymentMethod 
          } 
        });
      } else {
        alert(`Failed to place order: ${response.data.message}`);
      }
    })
    .catch(err => {
      console.error("Error placing order:", err);
      setLoading(false);
      alert("Failed to place order. Please try again.");
    });
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div>
      <TitleBar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>
        
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-xl border-b pb-2 mb-4">
              <span className="text-gray-500">Cart</span> <span className="font-bold">Total</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items :</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Total :</span>
                <span>$ {itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges :</span>
                <span>$ {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Charges :</span>
                <span>$ {otherCharges.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total Payable :</span>
                <span className="underline">$ {totalPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl border-b pb-2 mb-4">
              <span className="text-gray-500">Payment</span> <span className="font-bold">Method</span>
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePaymentMethodSelect("Cash On Delivery")}
                className={`border py-2 px-3 rounded ${paymentMethod === "Cash On Delivery" ? "border-black" : "border-gray-300"}`}
              >
                Cash On Delivery
              </button>
              <button 
                onClick={() => handlePaymentMethodSelect("Stripe")}
                className={`border py-2 px-3 rounded ${paymentMethod === "Stripe" ? "border-black" : "border-gray-300"}`}
              >
                Stripe
              </button>
              <button 
                onClick={() => handlePaymentMethodSelect("Visa / Master Card")}
                className={`border py-2 px-3 rounded ${paymentMethod === "Visa / Master Card" ? "border-black" : "border-gray-300"}`}
              >
                Visa / Master Card
              </button>
            </div>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={!paymentMethod}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;