"use client";
import { useState } from "react";
import { addOrder } from "../actions/orders";

export default function OrderForm() {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState({
    SrNo: "",
    orderNo: "",
    weight: "",
    quantity: "",
    orderDeliveryDate: "",
    grade: "",
    thickness: "",
    width: "",
    orderThickness: "",
    orderWidth: "",
    tdc: "",
    deliveryPlace: "",
    customerName: "",
    shippedBy: "",
    createdBy: "Admin", // Default creator
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user types
  };

  // Validate Inputs
  const validateForm = () => {
    let newErrors = {};
    Object.keys(order).forEach((key) => {
      if (!order[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const newOrder = {
        ...order,
        SrNo: parseInt(order.SrNo), 
        orderNo: BigInt(order.orderNo),
        weight: parseFloat(order.weight),
        quantity: parseInt(order.quantity),
        thickness: parseFloat(order.thickness),
        width: parseFloat(order.width),
        orderThickness: parseFloat(order.orderThickness),
        orderWidth: parseFloat(order.orderWidth),
        orderDeliveryDate: new Date(order.orderDeliveryDate),
      };

      await addOrder(newOrder);
      alert("Order Added Successfully!");
      setShowForm(false);
      setOrder({
        SrNo: "",
        orderNo: "",
        weight: "",
        quantity: "",
        orderDeliveryDate: "",
        grade: "",
        thickness: "",
        width: "",
        orderThickness: "",
        orderWidth: "",
        tdc: "",
        deliveryPlace: "",
        customerName: "",
        shippedBy: "",
        createdBy: "Admin",
      });
    } catch (error) {
      console.error("Error inserting order:", error);
      alert("Failed to insert order.");
    }
  };

  return (
    <div className="p-4">
      {/* Insert Button */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Insert Order
      </button>

      {/* Form Popup */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add New Order</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {Object.keys(order).map((key) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium">
                    {key} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={order[key]}
                    onChange={handleChange}
                    required
                    className={`w-full border px-3 py-2 rounded-md ${errors[key] ? "border-red-500" : ""}`}
                  />
                  {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
                </div>
              ))}
              <div className="col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
