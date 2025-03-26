
// "use client";
// import { useState, useEffect } from "react";
// import { getOrders, addOrder, deleteOrder } from "../actions/orders";
// import StackedBarChart from "../components/StackedBarChart";
// import StackedBarChartServer from "../components/StackedBarChartServer";

// export default function OrderManagement() {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [error, setError] = useState("");

//   const [newOrder, setNewOrder] = useState({
//     SrNo:"",
//     orderNo: "",
//     weight: "",
//     quantity: "",
//     orderDeliveryDate: "",
//     grade: "",
//     thickness: "",
//     width: "",
//     orderThickness: "",
//     orderWidth: "",
//     tdc: "",
//     deliveryPlace: "",
//     customerName: "",
//     shippedBy: "",
//     createdBy: "",
//   });

//   useEffect(() => {
//     async function fetchOrders() {
//       const data = await getOrders();
//       setOrders(data);
//     }
//     fetchOrders();
//   }, []);

//   const filteredOrders = orders.filter(
//     (order) =>
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.deliveryPlace.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleInsert = async (e) => {
//     e.preventDefault();

//     // Check if any field is empty
//     for (const key in newOrder) {
//       if (!newOrder[key].trim()) {
//         setError(`Error: ${key} is required.`);
//         return;
//       }
//     }

//     try {
//       const addedOrder = await addOrder(newOrder);
//       setOrders([...orders, addedOrder]);
//       setShowForm(false);
//       setError("");

//       setNewOrder({
//         SrNo:"",
//         orderNo: "",
//         weight: "",
//         quantity: "",
//         orderDeliveryDate: "",
//         grade: "",
//         thickness: "",
//         width: "",
//         orderThickness: "",
//         orderWidth: "",
//         tdc: "",
//         deliveryPlace: "",
//         customerName: "",
//         shippedBy: "",
//         createdBy: "",
//       });
//     } catch (error) {
//       console.error("Error adding order:", error);
//       setError("Failed to insert order. Please try again.");
//     }
//   };

//   const handleDelete = async (id) => {
//     await deleteOrder(id);
//     setOrders(orders.filter((order) => order.id !== id));
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Order Management</h1>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search orders..."
//         className="border p-2 mb-4 w-full"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {/* Table */}
//       <table className="w-full border border-gray-300">
//       <thead>
//   <tr className="bg-gray-200">
//     <th className="border p-2">Sr. No.</th>
//     <th className="border p-2">Order No.</th>
//     <th className="border p-2" colSpan={2}>Quantity</th>
//     <th className="border p-2">Order Delivery Date</th>
//     <th className="border p-2">Grade</th>
//     <th className="border p-2" colSpan={4}>Dimensions</th>
//     <th className="border p-2">TDC</th>
//     <th className="border p-2">Delivery Place</th>
//     <th className="border p-2">Customer Name</th>
//     <th className="border p-2">Shipped By</th>
//     <th className="border p-2">Created By</th>
//   </tr>
//   <tr className="bg-gray-100">
//     <th className="border p-2" colSpan={2}></th>
//     <th className="border p-2">Weight (kg)</th>
//     <th className="border p-2">Quantity</th>
//     <th className="border p-2" colSpan={2}></th>
//     <th className="border p-2">Thickness</th>
//     <th className="border p-2">Width</th>
//     <th className="border p-2">Order Thickness</th>
//     <th className="border p-2">Order Width</th>
//     <th className="border p-2" colSpan={5}></th>
//   </tr>
// </thead>

//   <tbody>
//     {filteredOrders.map((order, index) => (
//       <tr key={order.id || index} className="text-center">
//         <td className="border p-2">{index + 1}</td>
//         <td className="border p-2">{order.orderNo}</td>
//         <td className="border p-2">{order.weight}</td>
//         <td className="border p-2">{order.quantity}</td>
//         <td className="border p-2">
//           {order.orderDeliveryDate
//             ? new Date(order.orderDeliveryDate).toLocaleDateString()
//             : "N/A"}
//         </td>
//         <td className="border p-2">{order.grade}</td>
//         <td className="border p-2">{order.thickness}</td>
//         <td className="border p-2">{order.width}</td>
//         <td className="border p-2">{order.orderThickness}</td>
//         <td className="border p-2">{order.orderWidth}</td>
//         <td className="border p-2">{order.tdc}</td>
//         <td className="border p-2">{order.deliveryPlace}</td>
//         <td className="border p-2">{order.customerName}</td>
//         <td className="border p-2">{order.shippedBy}</td>
//         <td className="border p-2">{order.createdBy}</td>
//       </tr>
//     ))}
//   </tbody>
// </table>
// <div className="flex justify-center gap-4 mt-4">
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Insert
//         </button>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           Update
//         </button>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Delete
//         </button>
       
//       </div>
// <div>
//   <StackedBarChartServer />
// </div>
//       {/* Insert Button */}
    

//       {/* Modal for Insert Form */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
//             <h2 className="text-lg font-bold mb-4">Add New Order</h2>
//             {error && <p className="text-red-500 mb-2">{error}</p>}
//             <form onSubmit={handleInsert} className="grid grid-cols-2 gap-4">
//               {Object.keys(newOrder).map((key) => (
//                 <div key={key} className="flex flex-col">
//                   <label className="text-sm font-semibold">
//                     {key} <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="border p-2 rounded"
//                     value={newOrder[key]}
//                     onChange={(e) =>
//                       setNewOrder({ ...newOrder, [key]: e.target.value })
//                     }
//                   />
//                 </div>
//               ))}
//               <div className="col-span-2 flex justify-end gap-4 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setError("");
//                   }}
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { getOrders, addOrder, updateOrder, deleteOrder } from "../actions/orders";
import * as XLSX from "xlsx";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("insert"); // "insert" or "update"
  const [error, setError] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchGrade, setSearchGrade] = useState("");
  const [searchDeliveryPlace, setSearchDeliveryPlace] = useState("");
  const [searchThickness, setSearchThickness] = useState("");
  const [searchWidth, setSearchWidth] = useState("");

  const [formData, setFormData] = useState({
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
    shippedBy: "Vagun", // Default value
    createdBy: "User", // Default value
  });

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);


  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    const requiredFields = ["orderNo", "grade", "orderDeliveryDate", "deliveryPlace", "createdBy"];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        setError(`Error: ${field} is required.`);
        return;
      }
    }

    try {
      if (formMode === "insert") {
        // Convert data types to match schema
        const orderData = {
          ...formData,
          orderNo: BigInt(formData.orderNo),
          SrNo: parseInt(formData.SrNo),
          weight: formData.weight ? parseInt(formData.weight) : null,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          orderDeliveryDate: new Date(formData.orderDeliveryDate),
          thickness: formData.thickness ? parseInt(formData.thickness) : null,
          width: formData.width ? parseInt(formData.width) : null,
          orderThickness: formData.orderThickness ? parseInt(formData.orderThickness) : null,
          orderWidth: formData.orderWidth ? parseInt(formData.orderWidth) : null,
        };

        const addedOrder = await addOrder(orderData);
        setOrders([...orders, addedOrder]);
      } else if (formMode === "update") {
        // Only one order should be selected for update
        if (selectedOrders.length !== 1) {
          setError("Please select exactly one order to update.");
          return;
        }

        const orderId = selectedOrders[0];
        const orderToUpdate = orders.find(order => order.orderNo.toString() === orderId.toString());
        
        // Check if the order is created by System
        if (orderToUpdate.createdBy === "System") {
          setError("Orders created by System cannot be updated.");
          return;
        }

        // Convert data types to match schema
        const updateData = {
          ...formData,
          orderNo: BigInt(formData.orderNo),
          SrNo: parseInt(formData.SrNo),
          weight: formData.weight ? parseInt(formData.weight) : null,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          orderDeliveryDate: new Date(formData.orderDeliveryDate),
          thickness: formData.thickness ? parseInt(formData.thickness) : null,
          width: formData.width ? parseInt(formData.width) : null,
          orderThickness: formData.orderThickness ? parseInt(formData.orderThickness) : null,
          orderWidth: formData.orderWidth ? parseInt(formData.orderWidth) : null,
        };

        await updateOrder(orderId, updateData);
        const updatedOrders = orders.map(order => 
          order.orderNo.toString() === orderId.toString() ? { ...order, ...updateData } : order
        );
        setOrders(updatedOrders);
      }

      // Reset form and state
      setShowForm(false);
      setError("");
      setSelectedOrders([]);
      setFormData({
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
        shippedBy: "Vagun",
        createdBy: "User",
      });
    } catch (error) {
      console.error("Error processing order:", error);
      setError(`Failed to ${formMode} order. Please try again.`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      setError("Please select at least one order to delete.");
      return;
    }

    try {
      // Check if any selected order was created by System
      const systemCreatedSelected = orders.some(
        order => selectedOrders.includes(order.orderNo.toString()) && order.createdBy === "System"
      );

      if (systemCreatedSelected) {
        setError("Orders created by System cannot be deleted.");
        return;
      }

      for (const orderId of selectedOrders) {
        await deleteOrder(orderId);
      }

      setOrders(orders.filter(order => !selectedOrders.includes(order.orderNo.toString())));
      setSelectedOrders([]);
      setError("");
    } catch (error) {
      console.error("Error deleting orders:", error);
      setError("Failed to delete orders. Please try again.");
    }
  };
  
const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length > 0) {
      setFormData(jsonData[0]); // Take the first row for now (modify as needed)
    }
  };
  reader.readAsArrayBuffer(file);
};
  const handleUpdate = () => {
    if (selectedOrders.length !== 1) {
      setError("Please select exactly one order to update.");
      return;
    }

    const orderToUpdate = orders.find(order => order.orderNo.toString() === selectedOrders[0].toString());
    
    // Check if the order is created by System
    if (orderToUpdate.createdBy === "System") {
      setError("Orders created by System cannot be updated.");
      return;
    }

    // Format date to YYYY-MM-DD for the date input
    const formattedDate = new Date(orderToUpdate.orderDeliveryDate)
      .toISOString()
      .split("T")[0];

    setFormData({
      ...orderToUpdate,
      orderDeliveryDate: formattedDate,
      orderNo: orderToUpdate.orderNo.toString(),
      SrNo: orderToUpdate.SrNo?.toString() || "",
      weight: orderToUpdate.weight?.toString() || "",
      quantity: orderToUpdate.quantity?.toString() || "",
      thickness: orderToUpdate.thickness?.toString() || "",
      width: orderToUpdate.width?.toString() || "",
      orderThickness: orderToUpdate.orderThickness?.toString() || "",
      orderWidth: orderToUpdate.orderWidth?.toString() || "",
    });

    setFormMode("update");
    setShowForm(true);
    setError("");
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (searchGrade ? order.grade?.toLowerCase().includes(searchGrade.toLowerCase()) : true) &&
      (searchDeliveryPlace ? order.deliveryPlace?.toLowerCase().includes(searchDeliveryPlace.toLowerCase()) : true) &&
      (searchThickness ? order.thickness?.toString() === searchThickness : true) &&
      (searchWidth ? order.width?.toString() === searchWidth : true)
    );
  });

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Management</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Grade"
          className="border border-white p-2 rounded text-white"
          value={searchGrade}
          onChange={(e) => setSearchGrade(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Delivery Place"
          className="border border-white p-2 rounded text-white"
          value={searchDeliveryPlace}
          onChange={(e) => setSearchDeliveryPlace(e.target.value)}
        />
        <input
          type="number"
          placeholder="Thickness"
          className="border border-white p-2 rounded text-white"
          value={searchThickness}
          onChange={(e) => setSearchThickness(e.target.value)}
        />
        <input
          type="number"
          placeholder="Width"
          className="border border-white p-2 rounded text-white"
          value={searchWidth}
          onChange={(e) => setSearchWidth(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="border p-2">Select</th>
              <th className="border p-2">Sr. No.</th>
              <th className="border p-2">Order No.</th>
              <th className="border p-2" colSpan={2}>Quantity</th>
              <th className="border p-2">Order Delivery Date</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2" colSpan={4}>Dimensions</th>
              <th className="border p-2">TDC</th>
              <th className="border p-2">Delivery Place</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Shipped By</th>
              <th className="border p-2">Created By</th>
            </tr>
            <tr className="bg-gray-700">
              <th className="border p-2"></th>
              <th className="border p-2" colSpan={2}></th>
              <th className="border p-2">Weight (kg)</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2" colSpan={2}></th>
              <th className="border p-2">Thickness</th>
              <th className="border p-2">Width</th>
              <th className="border p-2">Order Thickness</th>
              <th className="border p-2">Order Width</th>
              <th className="border p-2" colSpan={5}></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.orderNo.toString() || index} className="text-center">
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.orderNo.toString())}
                    onChange={() => handleCheckboxChange(order.orderNo.toString())}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border p-2">{order.SrNo}</td>
                <td className="border p-2">{order.orderNo.toString()}</td>
                <td className="border p-2">{order.weight}</td>
                <td className="border p-2">{order.quantity}</td>
                <td className="border p-2">
                  {order.orderDeliveryDate
                    ? new Date(order.orderDeliveryDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border p-2">{order.grade}</td>
                <td className="border p-2">{order.thickness}</td>
                <td className="border p-2">{order.width}</td>
                <td className="border p-2">{order.orderThickness}</td>
                <td className="border p-2">{order.orderWidth}</td>
                <td className="border p-2">{order.tdc}</td>
                <td className="border p-2">{order.deliveryPlace}</td>
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">{order.shippedBy}</td>
                <td className="border p-2">{order.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => {
            setFormMode("insert");
            setShowForm(true);
            setError("");
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Insert
        </button>
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>

      {/* Modal for Insert/Update Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto text-black">
            <h2 className="text-lg font-bold mb-4">
              {formMode === "insert" ? "Add New Order" : "Update Order"}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sr. No */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Sr. No
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.SrNo}
                  onChange={(e) => setFormData({ ...formData, SrNo: e.target.value })}
                />
              </div>
              
              {/* Order No */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Order No <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.orderNo}
                  onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                  required
                />
              </div>
              
              {/* Weight */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              
              {/* Quantity */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              
              {/* Order Delivery Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Order Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={formData.orderDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, orderDeliveryDate: e.target.value })}
                  required
                />
              </div>
              
              {/* Grade */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  required
                />
              </div>
              
              {/* Thickness */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Thickness
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                />
              </div>
              
              {/* Width */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Width
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                />
              </div>
              
              {/* Order Thickness */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Order Thickness
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.orderThickness}
                  onChange={(e) => setFormData({ ...formData, orderThickness: e.target.value })}
                />
              </div>
              
              {/* Order Width */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Order Width
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  value={formData.orderWidth}
                  onChange={(e) => setFormData({ ...formData, orderWidth: e.target.value })}
                />
              </div>
              
              {/* TDC */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  TDC
                </label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={formData.tdc}
                  onChange={(e) => setFormData({ ...formData, tdc: e.target.value })}
                />
              </div>
              
              {/* Delivery Place */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Delivery Place <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={formData.deliveryPlace}
                  onChange={(e) => setFormData({ ...formData, deliveryPlace: e.target.value })}
                  required
                />
              </div>
              
              {/* Customer Name */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              
              {/* Shipped By */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Shipped By
                </label>
                <select
                  className="border p-2 rounded"
                  value={formData.shippedBy}
                  onChange={(e) => setFormData({ ...formData, shippedBy: e.target.value })}
                >
                  <option value="Vagun">Vagun</option>
                  <option value="Road">Road</option>
                </select>
              </div>
              
              {/* Created By */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Created By <span className="text-red-500">*</span>
                </label>
                <select
                  className="border p-2 rounded"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  required
                >
                  <option value="User">User</option>
                  <option value="System">System</option>
                </select>
              </div>
              
              <div className="col-span-full flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  {formMode === "insert" ? "Submit" : "Update"}
                </button>
           
              <input
                type="file"
                accept=".xlsx, .xls"
                className="border p-2 text-white rounded-md bg-blue-500 w-24 "
                onChange={handleFileUpload}
              />
              </div>
            </form>
          </div>
        </div>
      )}
     
    </div>
  );
}