import React, { useState, useEffect } from "react";
import TitleBar from "../Components/TitleBar";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  const paymentMethods = [
    { id: "cod", name: "Cash On Delivery" },
    { id: "stripe", name: "Stripe" },
    { id: "card", name: "Visa / Master Card" }
  ];

 
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


  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    fetchCart(userId);
  }, []);

  const fetchCart = (userId) => {
    setLoading(true);
    fetch(`${backendUrl}api/cart/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        return response.json();
      })
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items");
        setLoading(false);
      });
  };

  const handleRemove = (itemId) => {
    const userId = getUserId();
    if (!userId) return;
    
    fetch(`${backendUrl}api/cart/${userId}/remove/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove item");
        }
        setCart(cart.filter((item) => item.itemId !== itemId));
      })
      .catch((err) => {
        console.error("Error removing item:", err);
        alert("Failed to remove item from cart");
      });
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


  const handleQuantityChange = (itemId, newQuantity) => {
    const userId = getUserId();
    if (!userId) return;
    
    fetch(`${backendUrl}api/cart/${userId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        itemId: itemId,
        quantity: newQuantity
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update quantity");
        }
        return response.json();
      })
      .then((updatedItem) => {
        setCart(
          cart.map((item) => (item.itemId === itemId ? updatedItem : item))
        );
      })
      .catch((err) => {
        console.error("Error updating quantity:", err);
        alert("Failed to update quantity");
      });
  };
  
  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const clearCart = (userId) => {
    if (!userId) return;
    
    fetch(`${backendUrl}api/cart/${userId}/clear`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to clear cart");
        }
        return response.json();
      })
      .then(data => {
        console.log("Cart cleared successfully");
      
        setCart([]);
      })
      .catch(err => {
        console.error("Error clearing cart:", err);
      });
  };

  const handlePlaceOrder = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method before proceeding");
      return;
    }
    
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    const userId = getUserId();
    if (!userId) {
      alert("You need to be logged in to place an order");
      navigate("/login");
      return;
    }
    
  
    const orderRequest = {
      userId: userId,
      paymentMethod: selectedPaymentMethod,
      itemsTotal: itemsTotal,
      shippingCharges: shipping,
      otherCharges: otherCharges,
      totalAmount: totalPayable,
      items: cart.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      }))
    };
    
  
    createOrder(orderRequest);
  };
  
  const createOrder = (orderRequest) => {
    setLoading(true);
    const userId = getUserId();
    
    fetch(`${backendUrl}api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(orderRequest)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to create order");
        }
        return response.json();
      })
      .then(data => {
       
        clearCart(userId);
        
       
        sessionStorage.setItem("latestOrderId", data.id);
        
        
        navigate("/order-confirmation");
      })
      .catch(err => {
        console.error("Error creating order:", err);
        alert("Failed to place your order. Please try again.");
        setLoading(false);
      });
  };
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const itemsTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 50;
  const otherCharges = 20;
  const totalPayable = itemsTotal + shipping + otherCharges;

  if (loading) return <div className="text-center p-6">Loading cart...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div>
      <TitleBar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-center mb-6">My Cart 🛒</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center border-b pb-4 mb-4"
                >
                  <div className="ml-4 flex-1">
                    <p className="text-lg font-semibold">{product.itemName}</p>
                    <p className="text-gray-600">Item ID: {product.itemId}</p>
                  </div>
                  <p className="text-lg font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                  <select
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product.itemId, parseInt(e.target.value))
                    }
                    className="mx-4 p-2 border rounded-md"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                  <p className="text-lg font-semibold w-24 text-center">
                    ${product.totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(product.itemId)}
                    className="text-red-500 text-xl"
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
            <p className="text-gray-700 mb-2">
              Total Items: <span className="font-bold">{totalItems}</span>
            </p>
            <p className="text-gray-700 mb-2">
              Items Total:{" "}
              <span className="font-bold">${itemsTotal.toFixed(2)}</span>
            </p>
            <p className="text-gray-700 mb-2">
              Shipping Charges: <span className="font-bold">${shipping.toFixed(2)}</span>
            </p>
            <p className="text-gray-700 mb-2">
              Other Charges:{" "}
              <span className="font-bold">${otherCharges.toFixed(2)}</span>
            </p>
            <hr className="my-2" />
            <h4 className="text-lg font-bold mb-4">
              Total Payable: ${totalPayable.toFixed(2)}
            </h4>
            <hr className="my-2" />
            
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`border rounded-md py-2 px-4 flex-1 text-center cursor-pointer transition ${
                    selectedPaymentMethod === method.id
                      ? "bg-black text-white border-black"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  {method.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={handlePlaceOrder}
              className={`w-full py-2 rounded-lg ${
                cart.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-700 cursor-pointer transition"
              }`}
              disabled={cart.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;