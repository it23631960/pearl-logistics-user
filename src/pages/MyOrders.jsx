import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleBar from '../Components/TitleBar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify'; 
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const user = userData?.user;
  const userId = user?.id;
  const token = userData?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to fetch orders');
      }
    };
    if (userId && token) {
      fetchOrders();
    }
  }, [userId, token]);

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'Invalid date';
    const [year, month, day, hour, minute] = dateArray;
    return new Date(year, month - 1, day, hour, minute).toLocaleString();
  };

  
  const saveReportToBackend = async (pdfBytes, orderId) => {
    try {
      const reportRequest = {
        userId: userId,
        reportName: `Invoice-${orderId}.pdf`,
        reportType: 'invoice',
        data: Array.from(pdfBytes)
      };

      await axios.post('http://localhost:8080/api/reports', reportRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      
      toast.success('Invoice saved to your reports');
    } catch (error) {
      console.error('Failed to save report:', error);
      toast.error('Failed to save invoice to reports');
    }
  };

  const downloadInvoice = async (order) => {
    setLoading(true);
  
    const invoiceContainer = document.createElement('div');
    invoiceContainer.style.padding = '40px';
    invoiceContainer.style.fontFamily = 'Arial, sans-serif';
    invoiceContainer.style.width = '800px';
    invoiceContainer.style.backgroundColor = '#fff';
    invoiceContainer.style.color = '#333';
    invoiceContainer.style.margin = '0 auto';
    
    const fullName = order.user ? 
      `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 
      'Customer';
    
    const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    
    const orderDate = formatDate(order.createdAt);
    
    invoiceContainer.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #4a6fdc 0%, #3a4f94 100%);
        padding: 30px;
        border-radius: 10px 10px 0 0;
        color: white;
        text-align: center;
        margin-bottom: 0;
        position: relative;
      ">
        <img src="${window.location.origin}/MainLogo.png" alt="Logo" style="
          width: 80px; 
          height: 80px; 
          background: white; 
          border-radius: 50%; 
          padding: 10px;
          display: block;
          margin: 0 auto 20px auto;
        " />
        <h1 style="margin: 0 0 5px 0; font-size: 28px; font-weight: bold;">Pearl Logistics</h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your Trusted Shipping Partner</p>
      </div>
      
      <div style="
        border: 1px solid #e0e0e0;
        border-top: none;
        border-radius: 0 0 10px 10px;
        padding: 30px;
        background-color: #f9f9f9;
      ">
        <!-- Invoice Header Section -->
        <div style="
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eaeaea;
        ">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                <h2 style="color: #4a6fdc; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">INVOICE</h2>
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: bold; font-size: 14px;">Invoice #:</span>
                  <span style="font-size: 14px; margin-left: 10px;">${order.id}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: bold; font-size: 14px;">Date:</span>
                  <span style="font-size: 14px; margin-left: 10px;">${orderDate}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: bold; font-size: 14px;">Status:</span>
                  <span style="
                    background-color: ${order.orderStatus === 'DELIVERED' ? '#4CAF50' : 
                                     order.orderStatus === 'SHIPPED' ? '#2196F3' : 
                                     order.orderStatus === 'PENDING' ? '#FF9800' : '#9E9E9E'};
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    margin-left: 10px;
                    display: inline-block;
                  ">${order.orderStatus}</span>
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #555; font-size: 16px;">Customer Details</h3>
                <div style="margin-bottom: 8px;">
                  <span style="font-weight: bold; font-size: 14px;">Name:</span>
                  <span style="font-size: 14px; margin-left: 10px;">${fullName}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="font-weight: bold; font-size: 14px;">Email:</span>
                  <span style="font-size: 14px; margin-left: 10px;">${order.user?.email || 'N/A'}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="font-weight: bold; font-size: 14px;">Address:</span>
                  <div style="font-size: 14px; margin-top: 5px; line-height: 1.4;">
                    ${order.user?.street || ''}<br/>
                    ${order.user?.city || ''}, ${order.user?.state || ''} ${order.user?.zipcode || ''}<br/>
                    ${order.user?.country || ''}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Order Items Section -->
        <div style="
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          margin-bottom: 30px;
        ">
          <h3 style="color: #4a6fdc; margin: 0 0 15px 0; font-size: 18px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="
                  padding: 15px 12px; 
                  text-align: left; 
                  border-bottom: 2px solid #eaeaea;
                  font-weight: bold;
                  width: 8%;
                ">#</th>
                <th style="
                  padding: 15px 12px; 
                  text-align: left; 
                  border-bottom: 2px solid #eaeaea;
                  font-weight: bold;
                  width: 40%;
                ">Product</th>
                <th style="
                  padding: 15px 12px; 
                  text-align: center; 
                  border-bottom: 2px solid #eaeaea;
                  font-weight: bold;
                  width: 15%;
                ">Quantity</th>
                <th style="
                  padding: 15px 12px; 
                  text-align: right; 
                  border-bottom: 2px solid #eaeaea;
                  font-weight: bold;
                  width: 18%;
                ">Unit Price</th>
                <th style="
                  padding: 15px 12px; 
                  text-align: right; 
                  border-bottom: 2px solid #eaeaea;
                  font-weight: bold;
                  width: 19%;
                ">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items && order.items.length > 0 ? 
                order.items.map((item, index) => `
                <tr style="${index % 2 === 0 ? 'background-color: #fafafa;' : ''}">
                  <td style="padding: 15px 12px; border-bottom: 1px solid #eaeaea; text-align: left;">${index + 1}</td>
                  <td style="padding: 15px 12px; border-bottom: 1px solid #eaeaea;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${item.itemName}</div>
                    <div style="font-size: 12px; color: #777;">${item.item?.category || 'N/A'}</div>
                  </td>
                  <td style="padding: 15px 12px; text-align: center; border-bottom: 1px solid #eaeaea;">${item.quantity}</td>
                  <td style="padding: 15px 12px; text-align: right; border-bottom: 1px solid #eaeaea;">$${item.price?.toFixed(2) || '0.00'}</td>
                  <td style="padding: 15px 12px; text-align: right; border-bottom: 1px solid #eaeaea; font-weight: 500;">$${item.totalPrice?.toFixed(2) || '0.00'}</td>
                </tr>
              `).join('') : 
              `<tr><td colspan="5" style="padding: 20px 12px; text-align: center; color: #777;">No items available</td></tr>`}
            </tbody>
          </table>
        </div>
        
        <!-- Payment and Total Section -->
        <div style="margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                <div style="
                  background-color: white;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                  height: 120px;
                ">
                  <h3 style="color: #4a6fdc; margin: 0 0 15px 0; font-size: 16px;">Payment Information</h3>
                  <div style="margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 14px;">Payment Method:</span>
                    <span style="font-size: 14px; margin-left: 10px;">${order.paymentMethod?.toUpperCase() || 'N/A'}</span>
                  </div>
                  <div>
                    <span style="font-weight: bold; font-size: 14px;">Payment Status:</span>
                    <span style="
                      background-color: ${order.paymentStatus === 'PAID' ? '#4CAF50' : '#FF9800'};
                      color: white;
                      padding: 4px 8px;
                      border-radius: 4px;
                      font-size: 12px;
                      margin-left: 10px;
                      display: inline-block;
                    ">${order.paymentStatus || 'UNKNOWN'}</span>
                  </div>
                </div>
              </td>
              
              <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                <div style="
                  background-color: white;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                  height: 120px;
                ">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; border: none;">Items Total:</td>
                      <td style="padding: 8px 0; text-align: right; font-size: 14px; border: none;">$${order.itemsTotal?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; border: none;">Shipping:</td>
                      <td style="padding: 8px 0; text-align: right; font-size: 14px; border: none;">$${order.shippingCharges?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; border: none;">Other Charges:</td>
                      <td style="padding: 8px 0; text-align: right; font-size: 14px; border: none;">$${order.otherCharges?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr style="border-top: 2px solid #eaeaea;">
                      <td style="padding: 12px 0 0 0; font-weight: bold; font-size: 16px; border: none;">Total:</td>
                      <td style="padding: 12px 0 0 0; text-align: right; font-weight: bold; font-size: 16px; color: #4a6fdc; border: none;">$${order.totalAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer Section -->
        <div style="
          text-align: center;
          padding: 20px 0;
          border-top: 2px solid #eaeaea;
          color: #777;
          font-size: 14px;
          line-height: 1.5;
        ">
          <p style="margin: 0 0 10px 0; font-weight: 500;">Thank you for shopping with Pearl Logistics!</p>
          <p style="margin: 0;">If you have any questions, please contact us at support@pearllogistics.com</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(invoiceContainer);
    try {
      const canvas = await html2canvas(invoiceContainer, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: invoiceContainer.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`invoice-${order.id}.pdf`);
      
      const pdfBlob = pdf.output('arraybuffer');
      
      await saveReportToBackend(new Uint8Array(pdfBlob), order.id);
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate invoice');
    } finally {
      document.body.removeChild(invoiceContainer);
      setLoading(false);
    }
};

  const getTotalItems = (order) => {
    return order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  };

  return (
    <>
      <TitleBar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Orders</h2>
        <hr className="mb-6" />
        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border mb-4 p-4 flex justify-between items-center rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img
                  src="/parcel_icon.svg"
                  alt="Product"
                  className="w-24 h-24 object-contain"
                />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-lg">Order #{order.id}</p>
                  <p className="mt-1">Items: {getTotalItems(order)} &nbsp; <strong>${order.totalAmount?.toFixed(2)}</strong></p>
                  <p className="mt-1 text-xs">Date: {formatDate(order.createdAt)}</p>
                  <p className="text-xs">Payment: {order.paymentMethod?.toUpperCase() || 'N/A'} ({order.paymentStatus || 'UNKNOWN'})</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className={`border rounded px-4 py-1 ${
                  order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-300' :
                  order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                  order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                  'bg-gray-100 text-gray-700 border-gray-300'
                }`}>
                  {order.orderStatus}
                </button>
                <button className="border rounded px-4 py-1 hover:bg-gray-100">Track Order</button>
                <button
                  onClick={() => downloadInvoice(order)}
                  className="border rounded px-4 py-1 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Download Invoice'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyOrders;
