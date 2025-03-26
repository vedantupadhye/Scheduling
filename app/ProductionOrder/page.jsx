"use client"
import { useState, useEffect } from "react";
import { getOrders } from "../actions/orders";
import { getInputMaterials } from "../actions/InputMaterial";

export default function Page() {
  // State for data fetched from database
  const [orders, setOrders] = useState([]);
  const [inputMaterials, setInputMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static data for Required Material only
  const requiredMaterials = [
    {
      id: 1,
      thicknessRange: "5-10 mm",
      width: "1000-1500 mm",
      grade: "A36",
      number: 50,
      weight: 1200,
      requirementDate: "2024-04-10",
    },
    {
      id: 2,
      thicknessRange: "8-12 mm",
      width: "1200-1800 mm",
      grade: "S275",
      number: 30,
      weight: 900,
      requirementDate: "2024-05-05",
    },
    {
      id: 3,
      thicknessRange: "6-9 mm",
      width: "900-1400 mm",
      grade: "SS400",
      number: 40,
      weight: 1100,
      requirementDate: "2024-06-15",
    },
  ];

  // Mock supplier data with detailed ratings
  const supplierData = {
    1: [
      { name: "SteelMaster Inc.", deliveryTime: 4.6, cost: 4.2, defects: 4.9 },
      { name: "MetalWorks Ltd.", deliveryTime: 4.8, cost: 4.0, defects: 4.5 },
      { name: "PrimeSteel Co.", deliveryTime: 4.3, cost: 4.7, defects: 4.6 }
    ],
    2: [
      { name: "MetalWorks Ltd.", deliveryTime: 4.7, cost: 4.5, defects: 4.4 },
      { name: "Global Steel Corp.", deliveryTime: 4.3, cost: 4.8, defects: 4.2 },
      { name: "PrecisionMetal Inc.", deliveryTime: 4.9, cost: 4.2, defects: 4.7 }
    ],
    3: [
      { name: "PrimeSteel Co.", deliveryTime: 4.8, cost: 4.6, defects: 4.7 },
      { name: "MetalPro Industries", deliveryTime: 4.5, cost: 4.8, defects: 4.3 },
      { name: "SteelMaster Inc.", deliveryTime: 4.4, cost: 4.7, defects: 4.5 }
    ],
  };

  // State for UI
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showProductionOrder, setShowProductionOrder] = useState(false);
  const [priorities, setPriorities] = useState({
    deliveryTime: 2, // Medium priority
    cost: 1,         // Highest priority
    defects: 3,      // Lowest priority
  });
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [poNumbers, setPoNumbers] = useState({});

  // Fetch data using server actions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const ordersData = await getOrders();
        setOrders(ordersData);
        
        const materialsData = await getInputMaterials();
        setInputMaterials(materialsData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load inventory data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Set default selected suppliers when materials are selected
  useEffect(() => {
    const newSelectedSuppliers = {};
    selectedMaterials.forEach(materialId => {
      if (!selectedSuppliers[materialId]) {
        const suppliers = calculateSupplierRatings(supplierData[materialId]);
        newSelectedSuppliers[materialId] = suppliers[0].name;
      }
    });
    setSelectedSuppliers(prev => ({ ...prev, ...newSelectedSuppliers }));
  }, [selectedMaterials, priorities]);

  const handleSelect = (id) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate a PO number in the format PO07120102202501
  const generatePONumber = (materialId) => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    
    // Unique identifier based on material ID and timestamp
    const uniqueId = String(materialId).padStart(2, '0') + 
                     String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    return `PO${day}${month}${year}${uniqueId}`;
  };

  const handleGenerateProductionOrder = () => {
    if (selectedMaterials.length > 0) {
      // Generate PO numbers for all selected materials
      const newPoNumbers = {};
      selectedMaterials.forEach(materialId => {
        newPoNumbers[materialId] = generatePONumber(materialId);
      });
      setPoNumbers(newPoNumbers);
      setShowProductionOrder(true);
    } else {
      alert("Please select at least one material to generate a production order.");
    }
  };

  const handleBackToInventory = () => {
    setShowProductionOrder(false);
  };

  const handlePriorityChange = (factor, value) => {
    // Create a new priorities object
    const newPriorities = { ...priorities };
    
    // Get the current priority of the changed factor
    const oldPriority = newPriorities[factor];
    
    // Find the factor that currently has the new priority value
    const swapFactor = Object.keys(newPriorities).find(
      (key) => newPriorities[key] === parseInt(value)
    );
    
    // Swap the priorities
    if (swapFactor) {
      newPriorities[swapFactor] = oldPriority;
    }
    
    // Set the new priority for the changed factor
    newPriorities[factor] = parseInt(value);
    
    setPriorities(newPriorities);
  };

  const handleSupplierChange = (materialId, supplierName) => {
    setSelectedSuppliers(prev => ({
      ...prev,
      [materialId]: supplierName
    }));
  };

  // Calculate weighted rating based on priorities
  const calculateWeightedRating = (supplier) => {
    // Define weights based on priorities (higher priority gets higher weight)
    const weights = {
      1: 0.6, // Highest priority gets 60% weight
      2: 0.3, // Medium priority gets 30% weight
      3: 0.1, // Lowest priority gets 10% weight
    };

    // Calculate weighted rating
    const rating = (
      supplier.deliveryTime * weights[priorities.deliveryTime] +
      supplier.cost * weights[priorities.cost] +
      supplier.defects * weights[priorities.defects]
    );

    return parseFloat(rating.toFixed(1));
  };

  // Sort and rank suppliers based on weighted ratings
  const calculateSupplierRatings = (suppliers) => {
    return suppliers
      .map(supplier => ({
        ...supplier,
        weightedRating: calculateWeightedRating(supplier)
      }))
      .sort((a, b) => b.weightedRating - a.weightedRating);
  };

  // Function to get selected required materials with supplier data
  const getSelectedMaterials = () => {
    return requiredMaterials
      .filter((material) => selectedMaterials.includes(material.id))
      .map((material) => {
        const suppliers = calculateSupplierRatings(supplierData[material.id]);
        const selectedSupplier = suppliers.find(s => s.name === selectedSuppliers[material.id]) || suppliers[0];
        
        return {
          ...material,
          suppliers: suppliers,
          bestSupplier: selectedSupplier.name,
          rating: selectedSupplier.weightedRating,
          deliveryTimeRating: selectedSupplier.deliveryTime,
          costRating: selectedSupplier.cost,
          defectsRating: selectedSupplier.defects,
          poNumber: poNumbers[material.id] || generatePONumber(material.id)
        };
      });
  };

  // Render priority label with indicator
  const renderPriorityLabel = (priority) => {
    let label;
    switch(priority) {
      case 1: label = "High Priority"; break;
      case 2: label = "Medium Priority"; break;
      case 3: label = "Low Priority"; break;
      default: label = "Not Set";
    }
    return label;
  };

  // Display loading state
  if (loading) {
    return <div className="p-6 text-center bg-gray-900 text-white min-h-screen">Loading inventory data...</div>;
  }

  // Display error state
  if (error) {
    return <div className="p-6 text-center bg-gray-900 text-red-400 min-h-screen">{error}</div>;
  }

  if (showProductionOrder) {
    const selectedMaterialsWithSuppliers = getSelectedMaterials();
    
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-400">Production Order</h1>
          <button
            onClick={handleBackToInventory}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Inventory
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded">
          <h2 className="text-lg font-semibold mb-2 text-blue-300">Set Rating Priorities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Delivery Time: {renderPriorityLabel(priorities.deliveryTime)}</label>
              <select 
                value={priorities.deliveryTime} 
                onChange={(e) => handlePriorityChange('deliveryTime', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Cost: {renderPriorityLabel(priorities.cost)}</label>
              <select 
                value={priorities.cost} 
                onChange={(e) => handlePriorityChange('cost', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              >
                 <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Defects: {renderPriorityLabel(priorities.defects)}</label>
              <select 
                value={priorities.defects} 
                onChange={(e) => handlePriorityChange('defects', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              >
                  <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Production Record: {renderPriorityLabel(priorities.defects)}</label>
              <select 
                value={priorities.defects} 
                onChange={(e) => handlePriorityChange('defects', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              >
                  <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Quality: {renderPriorityLabel(priorities.defects)}</label>
              <select 
                value={priorities.defects} 
                onChange={(e) => handlePriorityChange('defects', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              >
                  <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-300">Selected Materials</h2>
          <table className="w-full border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2">PO Number</th>
                <th className="border border-gray-700 p-2">ID</th>
                <th className="border border-gray-700 p-2" colSpan="2">Dimensions Range</th>
                <th className="border border-gray-700 p-2">Grade</th>
                <th className="border border-gray-700 p-2">Number</th>
                <th className="border border-gray-700 p-2">Weight</th>
                <th className="border border-gray-700 p-2">Requirement Date</th>
                <th className="border border-gray-700 p-2">Supplier</th>
                <th className="border border-gray-700 p-2">Overall Rating</th>
                <th className="border border-gray-700 p-2">Rating Details</th>
              </tr>
            </thead>
            <tbody>
              {selectedMaterialsWithSuppliers.map((material) => (
                <tr key={material.id} className="text-center">
                  <td className="border border-gray-700 p-2 font-mono text-green-400">{material.poNumber}</td>
                  <td className="border border-gray-700 p-2">{material.id}</td>
                  <td className="border border-gray-700 p-2">{material.thicknessRange}</td>
                  <td className="border border-gray-700 p-2">{material.width}</td>
                  <td className="border border-gray-700 p-2">{material.grade}</td>
                  <td className="border border-gray-700 p-2">{material.number}</td>
                  <td className="border border-gray-700 p-2">{material.weight}</td>
                  <td className="border border-gray-700 p-2">
                    {new Date(material.requirementDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-700 p-2">
                    <select
                      value={selectedSuppliers[material.id]}
                      onChange={(e) => handleSupplierChange(material.id, e.target.value)}
                      className="w-full p-1 border rounded bg-gray-700 text-white border-gray-600"
                    >
                      {material.suppliers.map((supplier) => (
                        <option key={supplier.name} value={supplier.name}>
                          {supplier.name} ({supplier.weightedRating})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-700 p-2 font-bold text-yellow-300">{material.rating}</td>
                  <td className="border border-gray-700 p-2 text-xs">
                    <div>Delivery: {material.deliveryTimeRating} {priorities.deliveryTime === 1 ? "⭐" : ""}</div>
                    <div>Cost: {material.costRating} {priorities.cost === 1 ? "⭐" : ""}</div>
                    <div>Quality: {material.defectsRating} {priorities.defects === 1 ? "⭐" : ""}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-300">Production Order Summary</h2>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <p><strong>Total Items:</strong> {selectedMaterialsWithSuppliers.length}</p>
            <p><strong>Total Weight:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.weight, 0)} kg</p>
            <p><strong>Total Quantity:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.number, 0)} pieces</p>
            <p><strong>Earliest Requirement Date:</strong> {
              new Date(Math.min(...selectedMaterialsWithSuppliers.map(item => new Date(item.requirementDate)))).toLocaleDateString()
            }</p>
            <p><strong>Priority Ranking:</strong> 
              {priorities.deliveryTime === 1 ? " Delivery Time," : ""}
              {priorities.cost === 1 ? " Cost," : ""}
              {priorities.defects === 1 ? " Quality," : ""}
              {priorities.deliveryTime === 2 ? " Delivery Time," : ""}
              {priorities.cost === 2 ? " Cost," : ""}
              {priorities.defects === 2 ? " Quality," : ""}
              {priorities.deliveryTime === 3 ? " Delivery Time" : ""}
              {priorities.cost === 3 ? " Cost" : ""}
              {priorities.defects === 3 ? " Quality" : ""}
            </p>
          </div>
        </div>

        <button 
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          onClick={() => alert("Production order has been submitted!")}
        >
          Submit Production Order
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-blue-400">Production Order</h1>

      {/* Order Details Table - Data from Database */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-blue-300">Order Details</h2>
      <table className="w-full border border-gray-700 mb-6">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 p-2">Order No.</th>
            <th className="border border-gray-700 p-2">Thickness</th>
            <th className="border border-gray-700 p-2">Width</th>
            <th className="border border-gray-700 p-2">Order Weight</th>
            <th className="border border-gray-700 p-2">Number</th>
            <th className="border border-gray-700 p-2">Grade</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.orderNo} className="text-center">
                <td className="border border-gray-700 p-2">{order.orderNo}</td>
                <td className="border border-gray-700 p-2">{order.thickness}</td>
                <td className="border border-gray-700 p-2">{order.width}</td>
                <td className="border border-gray-700 p-2">{order.weight}</td>
                <td className="border border-gray-700 p-2">{order.quantity}</td>
                <td className="border border-gray-700 p-2">{order.grade}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border border-gray-700 p-2 text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Input Material Table - Data from Database */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-blue-300">Input Material</h2>
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 p-2">Weight</th>
            <th className="border border-gray-700 p-2">Number</th>
            <th className="border border-gray-700 p-2">Grade</th>
            <th className="border border-gray-700 p-2">Thickness Range</th>
            <th className="border border-gray-700 p-2">Width</th>
          </tr>
        </thead>
        <tbody>
          {inputMaterials.length > 0 ? (
            inputMaterials.map((material, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-700 p-2">{material.weight}</td>
                <td className="border border-gray-700 p-2">{material.number}</td>
                <td className="border border-gray-700 p-2">{material.grade}</td>
                <td className="border border-gray-700 p-2">{material.thicknessRange}</td>
                <td className="border border-gray-700 p-2">{material.width}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border border-gray-700 p-2 text-center">No input materials found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Required Material Table - Static Dummy Data */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-blue-300">Required Material</h2>
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 p-2">Select</th>
            <th className="border border-gray-700 p-2" colSpan="2">Dimensions Range</th>
            <th className="border border-gray-700 p-2">Grade</th>
            <th className="border border-gray-700 p-2">Number</th>
            <th className="border border-gray-700 p-2">Weight</th>
            <th className="border border-gray-700 p-2">Material Requirement Date</th>
          </tr>
        </thead>
        <tbody>
          {requiredMaterials.map((material) => (
            <tr key={material.id} className="text-center">
              <td className="border border-gray-700 p-2">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => handleSelect(material.id)}
                  className="h-4 w-4 accent-blue-500"
                />
              </td>
              <td className="border border-gray-700 p-2">{material.thicknessRange}</td>
              <td className="border border-gray-700 p-2">{material.width}</td>
              <td className="border border-gray-700 p-2">{material.grade}</td>
              <td className="border border-gray-700 p-2">{material.number}</td>
              <td className="border border-gray-700 p-2">{material.weight}</td>
              <td className="border border-gray-700 p-2">
                {new Date(material.requirementDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Generate Production Order Button */}
      <div className="mt-6">
        <button
          onClick={handleGenerateProductionOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={selectedMaterials.length === 0}
        >
          Generate Production Order
        </button>
      </div>
    </div>
  );
}