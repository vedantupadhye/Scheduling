// "use client"
// import { useState, useEffect } from "react";
// import { getOrders } from "../actions/orders";
// import { getInputMaterials } from "../actions/InputMaterial";

// export default function Page() {
//   // State for data fetched from database
//   const [orders, setOrders] = useState([]);
//   const [inputMaterials, setInputMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Static data for Required Material only
//   const requiredMaterials = [
//     {
//       id: 1,
//       thicknessRange: "5-7 mm",
//       width: "1000-1500 mm",
//       grade: "E250Br",
//       number: 50,
//       weight: 1100,
//       requirementDate: "2024-04-10",
//     },
//     {
//       id: 2,
//       thicknessRange: "2-3.5 mm",
//       width: "1200-1400 mm",
//       grade: "E350Br",
//       number: 30,
//       weight: 750,
//       requirementDate: "2024-05-05",
//     },
//     {
//       id: 3,
//       thicknessRange: "6-9 mm",
//       width: "900-1100 mm",
//       grade: "E150Br",
//       number: 40,
//       weight: 1300,
//       requirementDate: "2024-06-15"
//     },
//       {
//         id: 4,
//         thicknessRange: "3-7 mm",
//         width: "900-1400 mm",
//         grade: "E150Br",
//         number: 10,
//         weight: 900,
//         requirementDate: "2024-06-15",
//       },
//   ];

//   // Mock supplier data with detailed ratings
//   const supplierData = {
//     1: [
//       { name: "SteelMaster Inc.", deliveryTime: 4.6, cost: 4.2, defects: 4.9 },
//       { name: "MetalWorks Ltd.", deliveryTime: 4.8, cost: 4.0, defects: 4.5 },
//       { name: "PrimeSteel Co.", deliveryTime: 4.3, cost: 4.7, defects: 4.6 }
//     ],
//     2: [
//       { name: "MetalWorks Ltd.", deliveryTime: 4.7, cost: 4.5, defects: 4.4 },
//       { name: "Global Steel Corp.", deliveryTime: 4.3, cost: 4.8, defects: 4.2 },
//       { name: "PrecisionMetal Inc.", deliveryTime: 4.9, cost: 4.2, defects: 4.7 }
//     ],
//     3: [
//       { name: "PrimeSteel Co.", deliveryTime: 4.8, cost: 4.6, defects: 4.7 },
//       { name: "MetalPro Industries", deliveryTime: 4.5, cost: 4.8, defects: 4.3 },
//       { name: "SteelMaster Inc.", deliveryTime: 4.4, cost: 4.7, defects: 4.5 }
//     ],
//   };

//   // State for UI
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [showProductionOrder, setShowProductionOrder] = useState(false);
//   const [priorities, setPriorities] = useState({
//     deliveryTime: 2, // Medium priority
//     cost: 1,         // Highest priority
//     defects: 3,      // Lowest priority
//   });
//   const [selectedSuppliers, setSelectedSuppliers] = useState({});
//   const [poNumbers, setPoNumbers] = useState({});

//   // Fetch data using server actions when component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const ordersData = await getOrders();
//         setOrders(ordersData);
        
//         const materialsData = await getInputMaterials();
//         setInputMaterials(materialsData);
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load inventory data. Please try again later.");
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Set default selected suppliers when materials are selected
//   useEffect(() => {
//     const newSelectedSuppliers = {};
//     selectedMaterials.forEach(materialId => {
//       if (!selectedSuppliers[materialId]) {
//         const suppliers = calculateSupplierRatings(supplierData[materialId]);
//         newSelectedSuppliers[materialId] = suppliers[0].name;
//       }
//     });
//     setSelectedSuppliers(prev => ({ ...prev, ...newSelectedSuppliers }));
//   }, [selectedMaterials, priorities]);

//   const handleSelect = (id) => {
//     setSelectedMaterials((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   // Generate a PO number in the format PO07120102202501
//   const generatePONumber = (materialId) => {
//     const currentDate = new Date();
//     const day = String(currentDate.getDate()).padStart(2, '0');
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//     const year = String(currentDate.getFullYear());
    
//     // Unique identifier based on material ID and timestamp
//     const uniqueId = String(materialId).padStart(2, '0') + 
//                      String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
//     return `PO${day}${month}${year}${uniqueId}`;
//   };

//   const handleGenerateProductionOrder = () => {
//     if (selectedMaterials.length > 0) {
//       // Generate PO numbers for all selected materials
//       const newPoNumbers = {};
//       selectedMaterials.forEach(materialId => {
//         newPoNumbers[materialId] = generatePONumber(materialId);
//       });
//       setPoNumbers(newPoNumbers);
//       setShowProductionOrder(true);
//     } else {
//       alert("Please select at least one material to generate a production order.");
//     }
//   };

//   const handleBackToInventory = () => {
//     setShowProductionOrder(false);
//   };

//   const handlePriorityChange = (factor, value) => {
//     // Create a new priorities object
//     const newPriorities = { ...priorities };
    
//     // Get the current priority of the changed factor
//     const oldPriority = newPriorities[factor];
    
//     // Find the factor that currently has the new priority value
//     const swapFactor = Object.keys(newPriorities).find(
//       (key) => newPriorities[key] === parseInt(value)
//     );
    
//     // Swap the priorities
//     if (swapFactor) {
//       newPriorities[swapFactor] = oldPriority;
//     }
    
//     // Set the new priority for the changed factor
//     newPriorities[factor] = parseInt(value);
    
//     setPriorities(newPriorities);
//   };

//   const handleSupplierChange = (materialId, supplierName) => {
//     setSelectedSuppliers(prev => ({
//       ...prev,
//       [materialId]: supplierName
//     }));
//   };

//   // Calculate weighted rating based on priorities
//   const calculateWeightedRating = (supplier) => {
//     // Define weights based on priorities (higher priority gets higher weight)
//     const weights = {
//       1: 0.6, // Highest priority gets 60% weight
//       2: 0.3, // Medium priority gets 30% weight
//       3: 0.1, // Lowest priority gets 10% weight
//     };

//     // Calculate weighted rating
//     const rating = (
//       supplier.deliveryTime * weights[priorities.deliveryTime] +
//       supplier.cost * weights[priorities.cost] +
//       supplier.defects * weights[priorities.defects]
//     );

//     return parseFloat(rating.toFixed(1));
//   };

//   // Sort and rank suppliers based on weighted ratings
//   const calculateSupplierRatings = (suppliers) => {
//     return suppliers
//       .map(supplier => ({
//         ...supplier,
//         weightedRating: calculateWeightedRating(supplier)
//       }))
//       .sort((a, b) => b.weightedRating - a.weightedRating);
//   };

//   // Function to get selected required materials with supplier data
//   const getSelectedMaterials = () => {
//     return requiredMaterials
//       .filter((material) => selectedMaterials.includes(material.id))
//       .map((material) => {
//         const suppliers = calculateSupplierRatings(supplierData[material.id]);
//         const selectedSupplier = suppliers.find(s => s.name === selectedSuppliers[material.id]) || suppliers[0];
        
//         return {
//           ...material,
//           suppliers: suppliers,
//           bestSupplier: selectedSupplier.name,
//           rating: selectedSupplier.weightedRating,
//           deliveryTimeRating: selectedSupplier.deliveryTime,
//           costRating: selectedSupplier.cost,
//           defectsRating: selectedSupplier.defects,
//           poNumber: poNumbers[material.id] || generatePONumber(material.id)
//         };
//       });
//   };

//   // Render priority label with indicator
//   const renderPriorityLabel = (priority) => {
//     let label;
//     switch(priority) {
//       case 1: label = "High Priority"; break;
//       case 2: label = "Medium Priority"; break;
//       case 3: label = "Low Priority"; break;
//       default: label = "Not Set";
//     }
//     return label;
//   };

//   // Display loading state
//   if (loading) {
//     return <div className="p-6 text-center bg-gray-900 text-white min-h-screen">Loading inventory data...</div>;
//   }

//   // Display error state
//   if (error) {
//     return <div className="p-6 text-center bg-gray-900 text-red-400 min-h-screen">{error}</div>;
//   }

//   if (showProductionOrder) {
//     const selectedMaterialsWithSuppliers = getSelectedMaterials();
    
//     return (
//       <div className="p-6 bg-gray-900 text-white min-h-screen">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-xl font-bold text-blue-400">Production Order</h1>
//           <button
//             onClick={handleBackToInventory}
//             className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
//           >
//             Back to Inventory
//           </button>
//         </div>

//         <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded">
//           <h2 className="text-lg font-semibold mb-2 text-blue-300">Set Rating Priorities</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block mb-1">Delivery Time: {renderPriorityLabel(priorities.deliveryTime)}</label>
//               <select 
//                 value={priorities.deliveryTime} 
//                 onChange={(e) => handlePriorityChange('deliveryTime', e.target.value)}
//                 className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
//               >
//                 <option value={1}>1</option>
//                 <option value={2}>2</option>
//                 <option value={3}>3</option>
//                 <option value={4}>4</option>
//                 <option value={5}>5</option>
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1">Cost: {renderPriorityLabel(priorities.cost)}</label>
//               <select 
//                 value={priorities.cost} 
//                 onChange={(e) => handlePriorityChange('cost', e.target.value)}
//                 className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
//               >
//                  <option value={1}>1</option>
//                 <option value={2}>2</option>
//                 <option value={3}>3</option>
//                 <option value={4}>4</option>
//                 <option value={5}>5</option>
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1">Defects: {renderPriorityLabel(priorities.defects)}</label>
//               <select 
//                 value={priorities.defects} 
//                 onChange={(e) => handlePriorityChange('defects', e.target.value)}
//                 className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
//               >
//                   <option value={1}>1</option>
//                 <option value={2}>2</option>
//                 <option value={3}>3</option>
//                 <option value={4}>4</option>
//                 <option value={5}>5</option>
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1">Production Record: {renderPriorityLabel(priorities.defects)}</label>
//               <select 
//                 value={priorities.defects} 
//                 onChange={(e) => handlePriorityChange('defects', e.target.value)}
//                 className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
//               >
//                   <option value={1}>1</option>
//                 <option value={2}>2</option>
//                 <option value={3}>3</option>
//                 <option value={4}>4</option>
//                 <option value={5}>5</option>
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1">Quality: {renderPriorityLabel(priorities.defects)}</label>
//               <select 
//                 value={priorities.defects} 
//                 onChange={(e) => handlePriorityChange('defects', e.target.value)}
//                 className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
//               >
//                   <option value={1}>1</option>
//                 <option value={2}>2</option>
//                 <option value={3}>3</option>
//                 <option value={4}>4</option>
//                 <option value={5}>5</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <h2 className="text-lg font-semibold mb-2 text-blue-300">Selected Materials</h2>
//           <table className="w-full border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 p-2">PO Number</th>
//                 <th className="border border-gray-700 p-2">ID</th>
//                 <th className="border border-gray-700 p-2" colSpan="2">Dimensions Range</th>
//                 <th className="border border-gray-700 p-2">Grade</th>
//                 <th className="border border-gray-700 p-2">Number</th>
//                 <th className="border border-gray-700 p-2">Weight</th>
//                 <th className="border border-gray-700 p-2">Requirement Date</th>
//                 <th className="border border-gray-700 p-2">Supplier</th>
//                 <th className="border border-gray-700 p-2">Overall Rating</th>
//                 <th className="border border-gray-700 p-2">Rating Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedMaterialsWithSuppliers.map((material) => (
//                 <tr key={material.id} className="text-center">
//                   <td className="border border-gray-700 p-2 font-mono text-green-400">{material.poNumber}</td>
//                   <td className="border border-gray-700 p-2">{material.id}</td>
//                   <td className="border border-gray-700 p-2">{material.thicknessRange}</td>
//                   <td className="border border-gray-700 p-2">{material.width}</td>
//                   <td className="border border-gray-700 p-2">{material.grade}</td>
//                   <td className="border border-gray-700 p-2">{material.number}</td>
//                   <td className="border border-gray-700 p-2">{material.weight}</td>
//                   <td className="border border-gray-700 p-2">
//                     {new Date(material.requirementDate).toLocaleDateString()}
//                   </td>
//                   <td className="border border-gray-700 p-2">
//                     <select
//                       value={selectedSuppliers[material.id]}
//                       onChange={(e) => handleSupplierChange(material.id, e.target.value)}
//                       className="w-full p-1 border rounded bg-gray-700 text-white border-gray-600"
//                     >
//                       {material.suppliers.map((supplier) => (
//                         <option key={supplier.name} value={supplier.name}>
//                           {supplier.name} ({supplier.weightedRating})
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="border border-gray-700 p-2 font-bold text-yellow-300">{material.rating}</td>
//                   <td className="border border-gray-700 p-2 text-xs">
//                     <div>Delivery: {material.deliveryTimeRating} {priorities.deliveryTime === 1 ? "⭐" : ""}</div>
//                     <div>Cost: {material.costRating} {priorities.cost === 1 ? "⭐" : ""}</div>
//                     <div>Quality: {material.defectsRating} {priorities.defects === 1 ? "⭐" : ""}</div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6">
//           <h2 className="text-lg font-semibold mb-2 text-blue-300">Production Order Summary</h2>
//           <div className="bg-gray-800 p-4 rounded border border-gray-700">
//             <p><strong>Total Items:</strong> {selectedMaterialsWithSuppliers.length}</p>
//             <p><strong>Total Weight:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.weight, 0)} kg</p>
//             <p><strong>Total Quantity:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.number, 0)} pieces</p>
//             <p><strong>Earliest Requirement Date:</strong> {
//               new Date(Math.min(...selectedMaterialsWithSuppliers.map(item => new Date(item.requirementDate)))).toLocaleDateString()
//             }</p>
//             <p><strong>Priority Ranking:</strong> 
//               {priorities.deliveryTime === 1 ? " Delivery Time," : ""}
//               {priorities.cost === 1 ? " Cost," : ""}
//               {priorities.defects === 1 ? " Quality," : ""}
//               {priorities.deliveryTime === 2 ? " Delivery Time," : ""}
//               {priorities.cost === 2 ? " Cost," : ""}
//               {priorities.defects === 2 ? " Quality," : ""}
//               {priorities.deliveryTime === 3 ? " Delivery Time" : ""}
//               {priorities.cost === 3 ? " Cost" : ""}
//               {priorities.defects === 3 ? " Quality" : ""}
//             </p>
//           </div>
//         </div>

//         <button 
//           className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
//           onClick={() => alert("Production order has been submitted!")}
//         >
//           Submit Production Order
//         </button>
//       </div>
//     );
//   }



"use client";
import { useState, useEffect } from "react";
import { getOrders } from "../actions/orders";
import { getInputMaterials } from "../actions/InputMaterial";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [inputMaterials, setInputMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requiredMaterials = [
    { id: 1, thicknessRange: "5-7 mm", width: "1000-1500 mm", grade: "E250Br", number: 50, weight: 1100, requirementDate: "2024-04-10" },
    { id: 2, thicknessRange: "2-3.5 mm", width: "1200-1400 mm", grade: "E350Br", number: 30, weight: 750, requirementDate: "2024-05-05" },
    { id: 3, thicknessRange: "6-9 mm", width: "900-1100 mm", grade: "E150Br", number: 40, weight: 1300, requirementDate: "2024-06-15" },
    { id: 4, thicknessRange: "3-7 mm", width: "900-1400 mm", grade: "E150Br", number: 10, weight: 900, requirementDate: "2024-06-15" },
  ];

  const supplierData = {
    1: [ // For material id: 1 (5-7 mm, E250Br)
      {
        name: "SteelMaster Inc.",
        thicknessRange: "5-7 mm",
        width: "1000-1500 mm",
        grade: "E250Br",
        marks: { deliveryTime: 80, cost: 90, defects: 75, productionRecord: 98, quality: 81 }
      },
      {
        name: "MetalWorks Ltd.",
        thicknessRange: "5-7 mm",
        width: "1000-1500 mm",
        grade: "E250Br",
        marks: { deliveryTime: 80, cost: 85, defects: 92, productionRecord: 78, quality: 91 }
      },
      {
        name: "PrimeSteel Co.",
        thicknessRange: "5-7 mm",
        width: "1000-1500 mm",
        grade: "E250Br",
        marks: { deliveryTime: 98, cost: 82, defects: 85, productionRecord: 85, quality: 78 }
      }
    ],
    2: [ // For material id: 2 (2-3.5 mm, E350Br)
      {
        name: "MetalWorks Ltd.",
        thicknessRange: "2-3.5 mm",
        width: "1200-1400 mm",
        grade: "E350Br",
        marks: { deliveryTime: 87, cost: 89, defects: 90, productionRecord: 85, quality: 93 }
      },
      {
        name: "Global Steel Corp.",
        thicknessRange: "2-3.5 mm",
        width: "1200-1400 mm",
        grade: "E350Br",
        marks: { deliveryTime: 91, cost: 87, defects: 88, productionRecord: 91, quality: 86 }
      },
      {
        name: "PrecisionMetal Inc.",
        thicknessRange: "2-3.5 mm",
        width: "1200-1400 mm",
        grade: "E350Br",
        marks: { deliveryTime: 89, cost: 91, defects: 87, productionRecord: 89, quality: 90 }
      }
    ],
    3: [ // For material id: 3 (6-9 mm, E150Br)
      {
        name: "PrimeSteel Co.",
        thicknessRange: "6-9 mm",
        width: "900-1100 mm",
        grade: "E150Br",
        marks: { deliveryTime: 90, cost: 88, defects: 91, productionRecord: 87, quality: 92 }
      },
      {
        name: "MetalPro Industries",
        thicknessRange: "6-9 mm",
        width: "900-1100 mm",
        grade: "E150Br",
        marks: { deliveryTime: 86, cost: 90, defects: 89, productionRecord: 93, quality: 88 }
      },
      {
        name: "SteelMaster Inc.",
        thicknessRange: "6-9 mm",
        width: "900-1100 mm",
        grade: "E150Br",
        marks: { deliveryTime: 88, cost: 92, defects: 90, productionRecord: 86, quality: 91 }
      }
    ],
    4: [ // For material id: 4 (3-7 mm, E150Br)
      {
        name: "SteelMaster Inc.",
        thicknessRange: "3-7 mm",
        width: "900-1400 mm",
        grade: "E150Br",
        marks: { deliveryTime: 80, cost: 90, defects: 92, productionRecord: 88, quality: 95 }
      },
      {
        name: "MetalWorks Ltd.",
        thicknessRange: "3-7 mm",
        width: "900-1400 mm",
        grade: "E150Br",
        marks: { deliveryTime: 85, cost: 87, defects: 90, productionRecord: 91, quality: 89 }
      },
      {
        name: "PrimeSteel Co.",
        thicknessRange: "3-7 mm",
        width: "900-1400 mm",
        grade: "E150Br",
        marks: { deliveryTime: 89, cost: 85, defects: 88, productionRecord: 90, quality: 93 }
      }
    ]
  };
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showProductionOrder, setShowProductionOrder] = useState(false);
  const [priorities, setPriorities] = useState({
    deliveryTime: 1,
    cost: 2,
    defects: 3,
    productionRecord: 4,
    quality: 5,
  });
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [poNumbers, setPoNumbers] = useState({});

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

  const generatePONumber = (materialId) => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    const uniqueId = String(materialId).padStart(2, '0') + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `PO${day}${month}${year}${uniqueId}`;
  };

  const handleGenerateProductionOrder = () => {
    if (selectedMaterials.length > 0) {
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
    const newPriorities = { ...priorities };
    const oldPriority = newPriorities[factor];
    const swapFactor = Object.keys(newPriorities).find(key => newPriorities[key] === parseInt(value));
    if (swapFactor) newPriorities[swapFactor] = oldPriority;
    newPriorities[factor] = parseInt(value);
    setPriorities(newPriorities);
  };

  const handleSupplierChange = (materialId, supplierName) => {
    setSelectedSuppliers(prev => ({ ...prev, [materialId]: supplierName }));
  };

  // Convert marks to star rating (out of 5)
  const convertToStarRating = (marks) => (marks / 100) * 5;

  // Calculate weights based on priority formula: w = (6 - Pi) / ∑(6 - Pi)
  const calculateWeights = () => {
    const sum = Object.values(priorities).reduce((acc, pi) => acc + (6 - pi), 0);
    return {
      deliveryTime: (6 - priorities.deliveryTime) / sum,
      cost: (6 - priorities.cost) / sum,
      defects: (6 - priorities.defects) / sum,
      productionRecord: (6 - priorities.productionRecord) / sum,
      quality: (6 - priorities.quality) / sum,
    };
  };

  // Calculate weighted rating for a supplier
  const calculateWeightedRating = (supplier) => {
    const weights = calculateWeights();
    const starRatings = {
      deliveryTime: convertToStarRating(supplier.marks.deliveryTime),
      cost: convertToStarRating(supplier.marks.cost),
      defects: convertToStarRating(supplier.marks.defects),
      productionRecord: convertToStarRating(supplier.marks.productionRecord),
      quality: convertToStarRating(supplier.marks.quality),
    };
    return (
      starRatings.deliveryTime * weights.deliveryTime +
      starRatings.cost * weights.cost +
      starRatings.defects * weights.defects +
      starRatings.productionRecord * weights.productionRecord +
      starRatings.quality * weights.quality
    ).toFixed(1);
  };

  const calculateSupplierRatings = (suppliers) => {
    return suppliers
      .map(supplier => ({
        ...supplier,
        weightedRating: calculateWeightedRating(supplier),
        starRatings: {
          deliveryTime: convertToStarRating(supplier.marks.deliveryTime).toFixed(1),
          cost: convertToStarRating(supplier.marks.cost).toFixed(1),
          defects: convertToStarRating(supplier.marks.defects).toFixed(1),
          productionRecord: convertToStarRating(supplier.marks.productionRecord).toFixed(1),
          quality: convertToStarRating(supplier.marks.quality).toFixed(1),
        }
      }))
      .sort((a, b) => b.weightedRating - a.weightedRating);
  };

  const getSelectedMaterials = () => {
    return requiredMaterials
      .filter(material => selectedMaterials.includes(material.id))
      .map(material => {
        const suppliers = calculateSupplierRatings(supplierData[material.id]);
        const selectedSupplier = suppliers.find(s => s.name === selectedSuppliers[material.id]) || suppliers[0];
        return {
          ...material,
          suppliers,
          bestSupplier: selectedSupplier.name,
          rating: selectedSupplier.weightedRating,
          starRatings: selectedSupplier.starRatings,
          poNumber: poNumbers[material.id] || generatePONumber(material.id),
        };
      });
  };

  const renderPriorityLabel = (priority) => {
    const labels = { 1: "Highest", 2: "High", 3: "Medium", 4: "Low", 5: "Lowest" };
    return labels[priority] || "Not Set";
  };

  if (loading) return <div className="p-6 text-center bg-gray-900 text-white min-h-screen">Loading inventory data...</div>;
  if (error) return <div className="p-6 text-center bg-gray-900 text-red-400 min-h-screen">{error}</div>;

  if (showProductionOrder) {
    const selectedMaterialsWithSuppliers = getSelectedMaterials();

    return (
      <div className="p-6  text-black min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-400">Production Order</h1>
          <button onClick={handleBackToInventory} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
            Back to Inventory
          </button>
        </div>

        <div className="mb-6 p-4 text-black border border-gray-700 rounded">
          <h2 className="text-lg font-semibold mb-2 text-black">Set Rating Priorities</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(priorities).map(factor => (
              <div key={factor}>
                <label className="block mb-1">{factor.charAt(0).toUpperCase() + factor.slice(1)}: {renderPriorityLabel(priorities[factor])}</label>
                <select
                  value={priorities[factor]}
                  onChange={(e) => handlePriorityChange(factor, e.target.value)}
                  className="w-full p-2 border rounded  text-black font-semibold border-gray-600"
                >
                  {[1, 2, 3, 4, 5].map(val => <option key={val} value={val}>{val}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-black">Selected Materials</h2>
          <table className="w-full border border-gray-700 bg-gray-900 text-white ">
            <thead>
              <tr className="bg-gray-700">
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
              {selectedMaterialsWithSuppliers.map(material => (
                <tr key={material.id} className="text-center">
                  <td className="border border-gray-700 p-2 font-mono text-orange-400">{material.poNumber}</td>
                  <td className="border border-gray-700 p-2">{material.id}</td>
                  <td className="border border-gray-700 p-2">{material.thicknessRange}</td>
                  <td className="border border-gray-700 p-2">{material.width}</td>
                  <td className="border border-gray-700 p-2">{material.grade}</td>
                  <td className="border border-gray-700 p-2">{material.number}</td>
                  <td className="border border-gray-700 p-2">{material.weight}</td>
                  <td className="border border-gray-700 p-2">{new Date(material.requirementDate).toLocaleDateString()}</td>
                  <td className="border border-gray-700 p-2">
                    <select
                      value={selectedSuppliers[material.id]}
                      onChange={(e) => handleSupplierChange(material.id, e.target.value)}
                      className="w-full p-1 border rounded bg-gray-700 text-white border-gray-600"
                    >
                      {material.suppliers.map(supplier => (
                        <option key={supplier.name} value={supplier.name}>
                          {supplier.name} ({supplier.weightedRating})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-700 p-2 font-bold text-yellow-300">{material.rating}</td>
                  <td className="border border-gray-700 p-2 text-xs">
                    <div>Delivery: {material.starRatings.deliveryTime} {priorities.deliveryTime === 1 ? "⭐" : ""}</div>
                    <div>Cost: {material.starRatings.cost} {priorities.cost === 1 ? "⭐" : ""}</div>
                    <div>Defects: {material.starRatings.defects} {priorities.defects === 1 ? "⭐" : ""}</div>
                    <div>Prod: {material.starRatings.productionRecord} {priorities.productionRecord === 1 ? "⭐" : ""}</div>
                    <div>Quality: {material.starRatings.quality} {priorities.quality === 1 ? "⭐" : ""}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-bluack">Production Order Summary</h2>
          <div className="p-4 rounded border border-gray-700  text-black ">
            <p><strong>Total Items:</strong> {selectedMaterialsWithSuppliers.length}</p>
            <p><strong>Total Weight:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.weight, 0)} kg</p>
            <p><strong>Total Quantity:</strong> {selectedMaterialsWithSuppliers.reduce((sum, item) => sum + item.number, 0)} pieces</p>
            <p><strong>Earliest Requirement Date:</strong> {
              new Date(Math.min(...selectedMaterialsWithSuppliers.map(item => new Date(item.requirementDate)))).toLocaleDateString()
            }</p>
            <p><strong>Priority Ranking:</strong> {Object.entries(priorities)
              .sort(([, a], [, b]) => a - b)
              .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)).join(", ")}</p>
          </div>
        </div>

        <button
          className="mt-6 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
          onClick={() => alert("Production order has been submitted!")}
        >
          Submit Production Order
        </button>
      </div>
    );
  }
  return (
    <div className="p-6  text-nlack min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-blue-400">Production Order</h1>

      {/* Order Details Table - Data from Database */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">Order Details</h2>
      <table className="w-full border border-gray-700 bg-gray-900 text-white mb-6">
        <thead>
          <tr className="bg-gray-700">
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
      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">Input Material</h2>
      <table className="w-full border border-gray-700 bg-gray-900 text-white ">
        <thead>
          <tr className="bg-gray-700">
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
      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">Required Material</h2>
      <table className="w-full border border-gray-700 bg-gray-900 text-white ">
        <thead>
          <tr className="bg-gray-700">
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
//   return (