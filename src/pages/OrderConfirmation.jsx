import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../Components/TitleBar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const invoiceRef = useRef();

  useEffect(() => {
    const orderId = sessionStorage.getItem("latestOrderId");
    if (!orderId) {
      setError("No order information found");
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderId);
  }, []);

  const fetchOrderDetails = (orderId) => {
    fetch(`${backendUrl}api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to fetch order");
        setLoading(false);
      });
  };

  const getToken = () => {
    try {
      const data = JSON.parse(sessionStorage.getItem("userData"));
      return data?.token || "";
    } catch {
      return "";
    }
  };

  const formatDate = (arr) => {
    if (!Array.isArray(arr)) return "Invalid date";
    const [y, m, d, h, min, s, ns] = arr;
    const ms = Math.floor(ns / 1_000_000);
    const date = new Date(y, m - 1, d, h, min, s, ms);
    return isNaN(date) ? "Invalid date" : date.toLocaleString("en-US");
  };

  const downloadInvoice = () => {
   
   
    if (typeof window.html2pdf === "undefined") {
      
      alert("PDF generation library not loaded. Please include the html2pdf.js script.");
      return;
    }
    
    const element = invoiceRef.current;
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: `Invoice_${order.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    
    
    window.html2pdf().set(opt).from(element).save();
  };

  const handleContinueShopping = () => navigate("/");

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div>
      <TitleBar />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <span className="text-green-500 text-5xl">✓</span>
            <h2 className="text-2xl font-bold mt-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mt-2">Your order #{order.id} has been placed.</p>
          </div>
          <div className="mt-6 space-x-4 text-center">
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={downloadInvoice}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Download Invoice
            </button>
          </div>
        </div>
     
        <div ref={invoiceRef} className="max-w-2xl mx-auto bg-white mt-8 p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Invoice</h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </div>
            <div>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>
          </div>
          <table className="w-full text-sm text-left border-t border-b mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.itemName}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">${item.price.toFixed(2)}</td>
                  <td className="p-2 border">${item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span>${order.itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charges:</span>
              <span>${order.shippingCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Charges:</span>
              <span>${order.otherCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;