// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { getOrdersByDate, getMatchingInventory } from "../actions";

// export default function SchedulePool() {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [inventoryMatches, setInventoryMatches] = useState({});
//   const [selectedInventory, setSelectedInventory] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showInventory, setShowInventory] = useState(false);
//   const [priorityType, setPriorityType] = useState("Position"); // Default to Position as high priority

//   const yardPriority = {
//     "Section A": 1,
//     "Section B": 2,
//     "Section C": 3,
//   };

//   const parsePosition = (position) => {
//     if (!position || position.length < 9) return { yard: "Y99", col: 999, row: "ZZ", layer: 999 };
//     const yard = position.slice(0, 3); // e.g., "Y01"
//     const col = parseInt(position.slice(3, 5), 10) || 999; // e.g., "01"
//     const row = position.slice(5, 7) || "ZZ"; // e.g., "0C"
//     const layer = parseInt(position.slice(7, 9), 10) || 999; // e.g., "01"
//     return { yard, col, row, layer };
//   };

//   const comparePositions = (pos1, pos2) => {
//     const p1 = parsePosition(pos1);
//     const p2 = parsePosition(pos2);
//     if (p1.yard !== p2.yard) return p1.yard.localeCompare(p2.yard); // Sort by yard name
//     if (p1.col !== p2.col) return p1.col - p2.col; // Lower column first
//     if (p1.row !== p2.row) return p1.row.localeCompare(p2.row); // Alphabetical row
//     return p2.layer - p1.layer; // Higher layer first (e.g., 02 > 01)
//   };

//   const daysInYard = (arrivalDate) => {
//     const today = new Date();
//     const arrival = new Date(arrivalDate);
//     const diffTime = today - arrival;
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const sortInventory = (inventory) => {
//     return inventory.sort((a, b) => {
//       // Assign weights based on user-selected priority
//       const positionWeight = priorityType === "Position" ? 0.6 : 0.4;
//       const residenceWeight = priorityType === "Residence_INYard" ? 0.6 : 0.4;

//       // Calculate position score (lower is better, but reverse layer for higher priority)
//       const posA = parsePosition(a.Position);
//       const posB = parsePosition(b.Position);
//       const posScoreA = (posA.yard === "Y99" ? 999 : parseInt(posA.yard.slice(1))) * 10000 + posA.col * 100 + posA.row.charCodeAt(0) - (posA.layer * 0.1); // Higher layer reduces score
//       const posScoreB = (posB.yard === "Y99" ? 999 : parseInt(posB.yard.slice(1))) * 10000 + posB.col * 100 + posB.row.charCodeAt(0) - (posB.layer * 0.1);

//       // Calculate residence score (lower is better)
//       const resScoreA = yardPriority[a.Residence_INYard] || 999;
//       const resScoreB = yardPriority[b.Residence_INYard] || 999;

//       // Combined weighted score
//       const scoreA = (positionWeight * posScoreA) + (residenceWeight * resScoreA);
//       const scoreB = (positionWeight * posScoreB) + (residenceWeight * resScoreB);

//       if (scoreA !== scoreB) return scoreA - scoreB;

//       // Tiebreaker: days in yard (older items first)
//       return daysInYard(b.YardArrivalDate) - daysInYard(a.YardArrivalDate);
//     });
//   };

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true);
//       setError(null);
//       try {
//         const fetchedOrders = await getOrdersByDate(selectedDate);
//         if (fetchedOrders.length === 0) {
//           setError("No orders found for the selected date.");
//         }
//         const ordersWithStatus = fetchedOrders.map(order => ({
//           ...order,
//           status: "Not Allocated",
//         }));
//         setOrders(ordersWithStatus);
//         setSelectedOrders([]);
//         setInventoryMatches({});
//         setSelectedInventory({});
//         setShowInventory(false);
//       } catch (err) {
//         setError("Failed to fetch orders: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [selectedDate]);

//   const handleFindMaterial = async () => {
//     if (selectedOrders.length === 0) {
//       setInventoryMatches({});
//       setSelectedInventory({});
//       setShowInventory(false);
//       setError("Please select at least one order.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const matches = {};
//     const defaultSelections = {};

//     try {
//       for (const orderNo of selectedOrders) {
//         const order = orders.find(o => o.orderNo === orderNo);
//         if (order) {
//           const inventory = await getMatchingInventory(order);
//           if (inventory.length === 0) {
//             setError(prev => prev ? prev + " No matching inventory for Order " + orderNo : "No matching inventory for Order " + orderNo);
//           }
//           const sortedInventory = sortInventory([...inventory]);
//           matches[orderNo] = sortedInventory;

//           const quantity = order.quantity || 0;
//           if (quantity > 0 && sortedInventory.length > 0) {
//             defaultSelections[orderNo] = sortedInventory
//               .slice(0, Math.min(quantity, sortedInventory.length))
//               .map(item => `${orderNo}-${item.IN_MaterialName}`);
//           } else {
//             defaultSelections[orderNo] = [];
//           }
//         }
//       }
//       setInventoryMatches(matches);
//       setSelectedInventory(defaultSelections);
//       setShowInventory(true);
//     } catch (err) {
//       setError("Failed to fetch inventory: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderSelect = (orderNo) => {
//     setSelectedOrders(prev =>
//       prev.includes(orderNo) ? prev.filter(id => id !== orderNo) : [...prev, orderNo]
//     );
//   };

//   const handleInventorySelect = (orderNo, materialName) => {
//     const key = `${orderNo}-${materialName}`;
//     setSelectedInventory(prev => ({
//       ...prev,
//       [orderNo]: prev[orderNo]?.includes(key)
//         ? prev[orderNo].filter(id => id !== key)
//         : [...(prev[orderNo] || []), key],
//     }));
//   };

//   const handleStatusChange = (orderNo, newStatus) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.orderNo === orderNo ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   const handleQuery = () => {
//     console.log("Query button clicked");
//   };

//   const handleOrderAllocation = () => {
//     console.log("Order Allocation button clicked");
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

//         <div className="mb-8 flex flex-col gap-4">
//           <div className="flex items-center gap-4">
//             <label className="text-white mr-4">Select Least Production Date:</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
//             />
            
//           </div>
//           <div className="flex items-center gap-4">
//             <label className="text-white">higher Priority:</label>
//             <div className="flex gap-4">
//               <label className="text-white flex items-center">
//                 <input
//                   type="radio"
//                   value="Position"
//                   checked={priorityType === "Position"}
//                   onChange={() => setPriorityType("Position")}
//                   className="mr-2"
//                 />
//                 Position 
//               </label>
//               <label className="text-white flex items-center">
//                 <input
//                   type="radio"
//                   value="Residence_INYard"
//                   checked={priorityType === "Residence_INYard"}
//                   onChange={() => setPriorityType("Residence_INYard")}
//                   className="mr-2"
//                 />
//                 Residence in Yard 
//               </label>
//             </div>
//           </div>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <div className="flex flex-col lg:flex-row gap-8 ">
//           <div className="lg:w-1/2 w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2"></TableHead>
//                       <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Quantity</TableHead>
//                       <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Order Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Order Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
//                       <TableHead className="text-white px-4 py-2">Customer</TableHead>
//                       <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={12} className="text-white text-center">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : orders.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={12} className="text-white text-center">
//                           No orders found for this date
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       orders.map((order) => (
//                         <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
//                           <TableCell className="px-4 py-2">
//                             <Checkbox
//                               checked={selectedOrders.includes(order.orderNo)}
//                               onCheckedChange={() => handleOrderSelect(order.orderNo)}
//                                className='bg-white'
//                             />
//                           </TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderNo}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.weight || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.quantity || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderThickness || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderWidth || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.deliveryPlace || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.customerName || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.leastProductionDate || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">
//                             <select
//                               value={order.status}
//                               onChange={(e) => handleStatusChange(order.orderNo, e.target.value)}
//                               className="bg-gray-700 text-white border border-indigo-300 rounded p-1"
//                             >
//                               <option value="Not Allocated">Not Allocated</option>
//                               <option value="Allocated">Allocated</option>
//                               <option value="Partially Allocated">Partially Allocated</option>
//                             </select>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>

//           <div className="lg:w-1/2 w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2"></TableHead>
//                       <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                       <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                       <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Position</TableHead>
//                       <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                       <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : !showInventory ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Click "Find Material" to view matching inventory
//                         </TableCell>
//                       </TableRow>
//                     ) : selectedOrders.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Select an order to view matching inventory
//                         </TableCell>
//                       </TableRow>
//                     ) : Object.keys(inventoryMatches).length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           No matching inventory found for selected orders
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       selectedOrders.map((orderNo) =>
//                         inventoryMatches[orderNo]?.length > 0 ? (
//                           inventoryMatches[orderNo].map((item) => {
//                             const key = `${orderNo}-${item.IN_MaterialName}`;
//                             return (
//                               <TableRow key={key} className="hover:bg-indigo-600/20">
//                                 <TableCell className="px-4 py-2">
//                                   <Checkbox
//                                     checked={selectedInventory[orderNo]?.includes(key) || false}
//                                     onCheckedChange={() => handleInventorySelect(orderNo, item.IN_MaterialName)}
//                                     className='bg-white'
//                                   />
//                                 </TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                               </TableRow>
//                             );
//                           })
//                         ) : (
//                           <TableRow key={`${orderNo}-no-match`}>
//                             <TableCell colSpan={13} className="text-white text-center">
//                               No matching inventory for Order {orderNo}
//                             </TableCell>
//                           </TableRow>
//                         )
//                       )
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex m-5 ">
//       <Button onClick={handleQuery} className="bg-indigo-600 text-white mx-2">
//               Query
//             </Button>
//             <Button onClick={handleFindMaterial} className="bg-indigo-600 text-white mx-2">
//               Find Material
//             </Button>
//             <Button onClick={handleOrderAllocation} className="bg-indigo-600 text-white mx-2">
//               Order Allocation
//             </Button>
//       </div>
//     </div>
//   );
// }




//final with priority correct . 
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { getOrdersByDate, getMatchingInventory } from "../actions";

// export default function SchedulePool() {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [inventoryMatches, setInventoryMatches] = useState({});
//   const [selectedInventory, setSelectedInventory] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showInventory, setShowInventory] = useState(false);
//   const [priorityType, setPriorityType] = useState("Position"); // Default to Position

//   const parsePosition = (position) => {
//     if (!position || position.length < 9) return { yard: "Y99", col: 999, row: "ZZ", layer: 999 };
//     const yard = position.slice(0, 3); // e.g., "Y01"
//     const col = parseInt(position.slice(3, 5), 10) || 999; // e.g., "01"
//     const row = position.slice(5, 7) || "ZZ"; // e.g., "0C"
//     const layer = parseInt(position.slice(7, 9), 10) || 999; // e.g., "01"
//     return { yard, col, row, layer };
//   };

//   const rowDistanceFromCenter = (row) => {
//     const rows = ["A", "B", "C", "D", "E"]; //  5 rows, C is center
//     const centerIndex = 2; // C is at index 2
//     const rowIndex = rows.indexOf(row[1] || "Z"); // 0C - C
//     if (rowIndex === -1) return 999; // Invalid row
//     return Math.abs(rowIndex - centerIndex); // Distance from C
//   };

//   const daysInYard = (arrivalDate) => {
//     const today = new Date();
//     const arrival = new Date(arrivalDate);
//     const diffTime = today - arrival;
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const sortInventory = (inventory, order) => {
//     return inventory.sort((a, b) => {
//       // Primary: Thickness closeness
//       const thickDiffA = Math.abs(a.IN_Thickness - order.orderThickness);
//       const thickDiffB = Math.abs(b.IN_Thickness - order.orderThickness);
//       if (thickDiffA !== thickDiffB) return thickDiffA - thickDiffB;

//       // Primary: Width closeness
//       const widthDiffA = Math.abs(a.IN_Width - order.orderWidth);
//       const widthDiffB = Math.abs(b.IN_Width - order.orderWidth);
//       if (widthDiffA !== widthDiffB) return widthDiffA - widthDiffB;

//       // Primary: Grade match (exact match required)
//       const gradeMatchA = a.IN_Grade === order.grade ? 0 : 1;
//       const gradeMatchB = b.IN_Grade === order.grade ? 0 : 1;
//       if (gradeMatchA !== gradeMatchB) return gradeMatchA - gradeMatchB;

//       // Secondary: User-selected priority (Position or YardArrivalDate)
//       if (priorityType === "Position") {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         // Position factors: Layer > Row > Column
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer; // Higher layer first
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB; // Closer to C first
//         if (posA.col !== posB.col) return posA.col - posB.col; // Lower column first
//       } else if (priorityType === "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA; // Older first
//       }

//       // Tiebreaker: Use the other factor if not selected as priority
//       if (priorityType !== "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA;
//       } else {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer;
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB;
//         if (posA.col !== posB.col) return posA.col - posB.col;
//       }

//       return 0; // If all else is equal
//     });
//   };

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true);
//       setError(null);
//       try {
//         const fetchedOrders = await getOrdersByDate(selectedDate);
//         if (fetchedOrders.length === 0) {
//           setError("No orders found for the selected date.");
//         }
//         const ordersWithStatus = fetchedOrders.map(order => ({
//           ...order,
//           status: "Not Allocated",
//         }));
//         setOrders(ordersWithStatus);
//         setSelectedOrders([]);
//         setInventoryMatches({});
//         setSelectedInventory({});
//         setShowInventory(false);
//       } catch (err) {
//         setError("Failed to fetch orders: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [selectedDate]);

//   // Re-sort inventory when priorityType changes
//   useEffect(() => {
//     if (!showInventory || Object.keys(inventoryMatches).length === 0) return;

//     const updatedMatches = {};
//     const updatedSelections = {};
//     let hasChanges = false;

//     selectedOrders.forEach(orderNo => {
//       const order = orders.find(o => o.orderNo === orderNo);
//       if (order && inventoryMatches[orderNo]) {
//         const sortedInventory = sortInventory([...inventoryMatches[orderNo]], order);
//         const currentInventory = inventoryMatches[orderNo];
//         // Check if sorting changed the order
//         const isDifferent = sortedInventory.some((item, index) => 
//           item.IN_MaterialName !== currentInventory[index]?.IN_MaterialName
//         );
//         if (isDifferent) {
//           hasChanges = true;
//           updatedMatches[orderNo] = sortedInventory;
//           const quantity = order.quantity || 0;
//           updatedSelections[orderNo] = sortedInventory
//             .slice(0, Math.min(quantity, sortedInventory.length))
//             .map(item => `${orderNo}-${item.IN_MaterialName}`);
//         } else {
//           updatedMatches[orderNo] = currentInventory;
//           updatedSelections[orderNo] = selectedInventory[orderNo] || [];
//         }
//       }
//     });

//     if (hasChanges) {
//       setInventoryMatches(updatedMatches);
//       setSelectedInventory(updatedSelections);
//     }
//   }, [priorityType]); // Only depend on priorityType

//   const handleFindMaterial = async () => {
//     if (selectedOrders.length === 0) {
//       setInventoryMatches({});
//       setSelectedInventory({});
//       setShowInventory(false);
//       setError("Please select at least one order.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const matches = {};
//     const defaultSelections = {};

//     try {
//       for (const orderNo of selectedOrders) {
//         const order = orders.find(o => o.orderNo === orderNo);
//         if (order) {
//           const inventory = await getMatchingInventory(order);
//           if (inventory.length === 0) {
//             setError(prev => prev ? prev + " No matching inventory for Order " + orderNo : "No matching inventory for Order " + orderNo);
//           }
//           const sortedInventory = sortInventory([...inventory], order);
//           matches[orderNo] = sortedInventory;

//           const quantity = order.quantity || 0;
//           if (quantity > 0 && sortedInventory.length > 0) {
//             defaultSelections[orderNo] = sortedInventory
//               .slice(0, Math.min(quantity, sortedInventory.length))
//               .map(item => `${orderNo}-${item.IN_MaterialName}`);
//           } else {
//             defaultSelections[orderNo] = [];
//           }
//         }
//       }
//       setInventoryMatches(matches);
//       setSelectedInventory(defaultSelections);
//       setShowInventory(true);
//     } catch (err) {
//       setError("Failed to fetch inventory: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderSelect = (orderNo) => {
//     setSelectedOrders(prev =>
//       prev.includes(orderNo) ? prev.filter(id => id !== orderNo) : [...prev, orderNo]
//     );
//   };

//   const handleInventorySelect = (orderNo, materialName) => {
//     const key = `${orderNo}-${materialName}`;
//     setSelectedInventory(prev => ({
//       ...prev,
//       [orderNo]: prev[orderNo]?.includes(key)
//         ? prev[orderNo].filter(id => id !== key)
//         : [...(prev[orderNo] || []), key],
//     }));
//   };

//   const handleStatusChange = (orderNo, newStatus) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.orderNo === orderNo ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   const handleQuery = () => {
//     console.log("Query button clicked");
//   };

//   const handleOrderAllocation = () => {
//     console.log("Order Allocation button clicked");
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

//         <div className="mb-8 flex flex-col gap-4">
//           <div className="flex items-center gap-4">
//             <label className="text-white mr-4">Select Least Production Date:</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
//             />
//             <Button onClick={handleQuery} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Query
//             </Button>
//             <Button onClick={handleFindMaterial} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Find Material
//             </Button>
//             <Button onClick={handleOrderAllocation} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Order Allocation
//             </Button>
//           </div>
//           <div className="flex items-center gap-4">
//             <label className="text-white font-semibold">Secondary Priority:</label>
//             <div className="flex bg-gray-800 rounded-full p-1">
//               <button
//                 onClick={() => setPriorityType("Position")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "Position"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Position
//               </button>
//               <button
//                 onClick={() => setPriorityType("YardArrivalDate")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "YardArrivalDate"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Yard Arrival Date
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <div className="flex flex-col lg:flex-row gap-8 ">
//           <div className="lg:w-1/2 w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2"></TableHead>
//                       <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Quantity</TableHead>
//                       <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Order Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Order Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
//                       <TableHead className="text-white px-4 py-2">Customer</TableHead>
//                       <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={12} className="text-white text-center">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : orders.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={12} className="text-white text-center">
//                           No orders found for this date
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       orders.map((order) => (
//                         <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
//                           <TableCell className="px-4 py-2">
//                             <Checkbox
//                               checked={selectedOrders.includes(order.orderNo)}
//                               onCheckedChange={() => handleOrderSelect(order.orderNo)}
//                               className='bg-white'

//                             />
//                           </TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderNo}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.weight || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.quantity || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderThickness || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.orderWidth || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.deliveryPlace || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.customerName || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">{order.leastProductionDate || "-"}</TableCell>
//                           <TableCell className="text-white px-4 py-2">
//                             <select
//                               value={order.status}
//                               onChange={(e) => handleStatusChange(order.orderNo, e.target.value)}
//                               className="bg-gray-700 text-white border border-indigo-300 rounded p-1"
//                             >
//                               <option value="Not Allocated">Not Allocated</option>
//                               <option value="Allocated">Allocated</option>
//                               <option value="Partially Allocated">Partially Allocated</option>
//                             </select>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>

//           <div className="lg:w-1/2 w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2"></TableHead>
//                       <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                       <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                       <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Position</TableHead>
//                       <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                       <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : !showInventory ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Click "Find Material" to view matching inventory
//                         </TableCell>
//                       </TableRow>
//                     ) : selectedOrders.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           Select an order to view matching inventory
//                         </TableCell>
//                       </TableRow>
//                     ) : Object.keys(inventoryMatches).length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={13} className="text-white text-center">
//                           No matching inventory found for selected orders
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       selectedOrders.map((orderNo) =>
//                         inventoryMatches[orderNo]?.length > 0 ? (
//                           inventoryMatches[orderNo].map((item) => {
//                             const key = `${orderNo}-${item.IN_MaterialName}`;
//                             return (
//                               <TableRow key={key} className="hover:bg-indigo-600/20">
//                                 <TableCell className="px-4 py-2">
//                                   <Checkbox
//                                     checked={selectedInventory[orderNo]?.includes(key) || false}
//                                     onCheckedChange={() => handleInventorySelect(orderNo, item.IN_MaterialName)}
//                                     className='bg-white'
//                                   />
//                                 </TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                                 <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                               </TableRow>
//                             );
//                           })
//                         ) : (
//                           <TableRow key={`${orderNo}-no-match`}>
//                             <TableCell colSpan={13} className="text-white text-center">
//                               No matching inventory for Order {orderNo}
//                             </TableCell>
//                           </TableRow>
//                         )
//                       )
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { getOrdersByDate, getMatchingInventory } from "../actions";
// import { useRouter } from "next/navigation";

// export default function SchedulePool() {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [inventoryMatches, setInventoryMatches] = useState({});
//   const [selectedInventory, setSelectedInventory] = useState({});
//   const [scheduleMakerItems, setScheduleMakerItems] = useState({});
//   const [selectedScheduleItems, setSelectedScheduleItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showInventory, setShowInventory] = useState(false);
//   const [priorityType, setPriorityType] = useState("Position");

//   const router = useRouter();

//   const parsePosition = (position) => {
//     if (!position || position.length < 9) return { yard: "Y99", col: 999, row: "ZZ", layer: 999 };
//     const yard = position.slice(0, 3);
//     const col = parseInt(position.slice(3, 5), 10) || 999;
//     const row = position.slice(5, 7) || "ZZ";
//     const layer = parseInt(position.slice(7, 9), 10) || 999;
//     return { yard, col, row, layer };
//   };

//   const rowDistanceFromCenter = (row) => {
//     const rows = ["A", "B", "C", "D", "E"];
//     const centerIndex = 2;
//     const rowIndex = rows.indexOf(row[1] || "Z");
//     if (rowIndex === -1) return 999;
//     return Math.abs(rowIndex - centerIndex);
//   };

//   const daysInYard = (arrivalDate) => {
//     const today = new Date();
//     const arrival = new Date(arrivalDate);
//     const diffTime = today - arrival;
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const sortInventory = (inventory, order) => {
//     return inventory.sort((a, b) => {
//       const thickDiffA = Math.abs(a.IN_Thickness - order.orderThickness);
//       const thickDiffB = Math.abs(b.IN_Thickness - order.orderThickness);
//       if (thickDiffA !== thickDiffB) return thickDiffA - thickDiffB;

//       const widthDiffA = Math.abs(a.IN_Width - order.orderWidth);
//       const widthDiffB = Math.abs(b.IN_Width - order.orderWidth);
//       if (widthDiffA !== widthDiffB) return widthDiffA - widthDiffB;

//       const gradeMatchA = a.IN_Grade === order.grade ? 0 : 1;
//       const gradeMatchB = b.IN_Grade === order.grade ? 0 : 1;
//       if (gradeMatchA !== gradeMatchB) return gradeMatchA - gradeMatchB;

//       if (priorityType === "Position") {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer;
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB;
//         if (posA.col !== posB.col) return posA.col - posB.col;
//       } else if (priorityType === "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA;
//       }

//       if (priorityType !== "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA;
//       } else {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer;
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB;
//         if (posA.col !== posB.col) return posA.col - posB.col;
//       }

//       return 0;
//     });
//   };

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true);
//       setError(null);
//       try {
//         const fetchedOrders = await getOrdersByDate(selectedDate);
//         if (fetchedOrders.length === 0) {
//           setError("No orders found for the selected date.");
//         }
//         const ordersWithStatus = fetchedOrders.map((order) => ({
//           ...order,
//           status: "Not Allocated",
//         }));
//         setOrders(ordersWithStatus);
//         console.log("Fetched Orders:", ordersWithStatus); // Debug orders after fetch
//         setSelectedOrders([]);
//         setInventoryMatches({});
//         setSelectedInventory({});
//         setShowInventory(false);
//       } catch (err) {
//         setError("Failed to fetch orders: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [selectedDate]);

//   useEffect(() => {
//     if (!showInventory || Object.keys(inventoryMatches).length === 0) return;

//     const updatedMatches = {};
//     const updatedSelections = {};
//     let hasChanges = false;

//     selectedOrders.forEach((orderNo) => {
//       const order = orders.find((o) => o.orderNo === orderNo);
//       if (order && inventoryMatches[orderNo]) {
//         const sortedInventory = sortInventory([...inventoryMatches[orderNo]], order);
//         const currentInventory = inventoryMatches[orderNo];
//         const isDifferent = sortedInventory.some(
//           (item, index) => item.IN_MaterialName !== currentInventory[index]?.IN_MaterialName
//         );
//         if (isDifferent) {
//           hasChanges = true;
//           updatedMatches[orderNo] = sortedInventory;
//           const quantity = order.quantity || 0;
//           updatedSelections[orderNo] = sortedInventory
//             .slice(0, Math.min(quantity, sortedInventory.length))
//             .map((item) => `${orderNo}-${item.IN_MaterialName}`);
//         } else {
//           updatedMatches[orderNo] = currentInventory;
//           updatedSelections[orderNo] = selectedInventory[orderNo] || [];
//         }
//       }
//     });

//     if (hasChanges) {
//       setInventoryMatches(updatedMatches);
//       setSelectedInventory(updatedSelections);
//     }
//   }, [priorityType, orders, inventoryMatches, selectedOrders, selectedInventory]);

//   const handleFindMaterial = async () => {
//     if (selectedOrders.length === 0) {
//       setInventoryMatches({});
//       setSelectedInventory({});
//       setShowInventory(false);
//       setError("Please select at least one order.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const matches = {};
//     const defaultSelections = {};

//     try {
//       for (const orderNo of selectedOrders) {
//         const order = orders.find((o) => o.orderNo === orderNo);
//         if (order) {
//           const inventory = await getMatchingInventory(order);
//           if (inventory.length === 0) {
//             setError((prev) =>
//               prev ? prev + " No matching inventory for Order " + orderNo : "No matching inventory for Order " + orderNo
//             );
//           }
//           const sortedInventory = sortInventory([...inventory], order);
//           matches[orderNo] = sortedInventory;

//           const quantity = order.quantity || 0;
//           if (quantity > 0 && sortedInventory.length > 0) {
//             defaultSelections[orderNo] = sortedInventory
//               .slice(0, Math.min(quantity, sortedInventory.length))
//               .map((item) => `${orderNo}-${item.IN_MaterialName}`);
//           } else {
//             defaultSelections[orderNo] = [];
//           }
//         }
//       }
//       setInventoryMatches(matches);
//       setSelectedInventory(defaultSelections);
//       setShowInventory(true);
//     } catch (err) {
//       setError("Failed to fetch inventory: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderSelect = (orderNo) => {
//     setSelectedOrders((prev) =>
//       prev.includes(orderNo) ? prev.filter((id) => id !== orderNo) : [...prev, orderNo]
//     );
//   };

//   const handleInventorySelect = (orderNo, materialName) => {
//     const key = `${orderNo}-${materialName}`;
//     setSelectedInventory((prev) => ({
//       ...prev,
//       [orderNo]: prev[orderNo]?.includes(key)
//         ? prev[orderNo].filter((id) => id !== key)
//         : [...(prev[orderNo] || []), key],
//     }));
//   };

//   const handleScheduleItemSelect = (itemKey) => {
//     setSelectedScheduleItems((prev) =>
//       prev.includes(itemKey) ? prev.filter((id) => id !== itemKey) : [...prev, itemKey]
//     );
//   };

//   const handleSelectAllScheduleItems = () => {
//     const allItemKeys = Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
//       items.map((item) => `${orderNo}-${item.IN_MaterialName}`)
//     );
//     if (selectedScheduleItems.length === allItemKeys.length) {
//       setSelectedScheduleItems([]);
//     } else {
//       setSelectedScheduleItems(allItemKeys);
//     }
//   };

//   const handleStatusChange = (orderNo, newStatus) => {
//     setOrders((prev) =>
//       prev.map((order) =>
//         order.orderNo === orderNo ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   const handleQuery = () => {
//     console.log("Query button clicked");
//   };

//   const handleOrderAllocation = () => {
//     if (selectedOrders.length === 0) {
//       setError("Please select at least one order to allocate.");
//       return;
//     }

//     const newScheduleItems = {};
//     selectedOrders.forEach((orderNo) => {
//       const order = orders.find((o) => o.orderNo === orderNo);
//       if (order && selectedInventory[orderNo]?.length > 0) {
//         const selectedItems = inventoryMatches[orderNo].filter((item) =>
//           selectedInventory[orderNo].includes(`${orderNo}-${item.IN_MaterialName}`)
//         );
//         if (selectedItems.length > 0) {
//           newScheduleItems[orderNo] = selectedItems;
//           handleStatusChange(orderNo, selectedItems.length >= order.quantity ? "Allocated" : "Partially Allocated");
//         }
//       }
//     });

//     setScheduleMakerItems((prev) => {
//       const updated = { ...prev, ...newScheduleItems };
//       console.log("Updated Schedule Maker Items:", updated); // Debug after allocation
//       return updated;
//     });

//     setSelectedOrders([]);
//     setSelectedInventory({});
//     setInventoryMatches({});
//     setShowInventory(false);
//   };

//   const handleCreateSchedule = () => {
//     if (selectedScheduleItems.length === 0) {
//       setError("Please select at least one item from Schedule Maker to create a schedule.");
//       return;
//     }

//     console.log("Selected Schedule Items:", selectedScheduleItems);
//     console.log("Schedule Maker Items:", scheduleMakerItems);
//     console.log("Current Orders State:", orders);

//     const selectedData = {};
//     selectedScheduleItems.forEach((itemKey) => {
//       const [orderNo, materialName] = itemKey.split("-");
//       const order = orders.find((o) => o.orderNo === orderNo);
//       const inventoryItem = scheduleMakerItems[orderNo]?.find(
//         (item) => item.IN_MaterialName === materialName
//       );
//       if (order && inventoryItem) {
//         if (!selectedData[orderNo]) {
//           selectedData[orderNo] = { order, items: [] };
//         }
//         selectedData[orderNo].items.push(inventoryItem);
//       } else {
//         console.warn(`Missing order or inventory item for key: ${itemKey}`, { order, inventoryItem });
//       }
//     });

//     const scheduleNo = `SCH${String(Object.keys(scheduleMakerItems).length + 1).padStart(3, "0")}`;
//     sessionStorage.setItem("scheduleData", JSON.stringify(selectedData));
//     sessionStorage.setItem("scheduleNo", scheduleNo);

//     console.log("Data being sent to ScheduleConfirmation:", {
//       scheduleNo,
//       selectedData,
//     });

//     router.push(`/schedule-confirmation?scheduleNo=${scheduleNo}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

//         <div className="mb-8 flex flex-col gap-4">
//           <div className="flex items-center gap-4">
//             <label className="text-white mr-4">Select Least Production Date:</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
//             />
//             <Button onClick={handleQuery} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Query
//             </Button>
//             <Button onClick={handleFindMaterial} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Find Material
//             </Button>
//             <Button onClick={handleOrderAllocation} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Order Allocation
//             </Button>
//             <Button onClick={handleCreateSchedule} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Create Schedule
//             </Button>
//           </div>
//           <div className="flex items-center gap-4">
//             <label className="text-white font-semibold">Secondary Priority:</label>
//             <div className="flex bg-gray-800 rounded-full p-1">
//               <button
//                 onClick={() => setPriorityType("Position")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "Position"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Position
//               </button>
//               <button
//                 onClick={() => setPriorityType("YardArrivalDate")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "YardArrivalDate"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Yard Arrival Date
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <div className="flex flex-col gap-8">
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="lg:w-1/2 w-full">
//               <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
//               <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-700">
//                         <TableHead className="text-white px-4 py-2"></TableHead>
//                         <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                         <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                         <TableHead className="text-white px-4 py-2">Quantity</TableHead>
//                         <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                         <TableHead className="text-white px-4 py-2">Order Thickness</TableHead>
//                         <TableHead className="text-white px-4 py-2">Order Width</TableHead>
//                         <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
//                         <TableHead className="text-white px-4 py-2">Customer</TableHead>
//                         <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Status</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {loading ? (
//                         <TableRow>
//                           <TableCell colSpan={12} className="text-white text-center">
//                             Loading...
//                           </TableCell>
//                         </TableRow>
//                       ) : orders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={12} className="text-white text-center">
//                             No orders found for this date
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         orders.map((order) => (
//                           <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
//                             <TableCell className="px-4 py-2">
//                               <Checkbox
//                                 checked={selectedOrders.includes(order.orderNo)}
//                                 onCheckedChange={() => handleOrderSelect(order.orderNo)}
//                                 className="bg-white"
//                               />
//                             </TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderNo}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.weight || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.quantity || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderThickness || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderWidth || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.deliveryPlace || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.customerName || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.leastProductionDate || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">
//                               <select
//                                 value={order.status}
//                                 onChange={(e) => handleStatusChange(order.orderNo, e.target.value)}
//                                 className="bg-gray-700 text-white border border-indigo-300 rounded p-1"
//                               >
//                                 <option value="Not Allocated">Not Allocated</option>
//                                 <option value="Allocated">Allocated</option>
//                                 <option value="Partially Allocated">Partially Allocated</option>
//                               </select>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:w-1/2 w-full">
//               <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
//               <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-700">
//                         <TableHead className="text-white px-4 py-2"></TableHead>
//                         <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                         <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                         <TableHead className="text-white px-4 py-2">Width</TableHead>
//                         <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                         <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                         <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                         <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                         <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                         <TableHead className="text-white px-4 py-2">Position</TableHead>
//                         <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                         <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {loading ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Loading...
//                           </TableCell>
//                         </TableRow>
//                       ) : !showInventory ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Click "Find Material" to view matching inventory
//                           </TableCell>
//                         </TableRow>
//                       ) : selectedOrders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Select an order to view matching inventory
//                           </TableCell>
//                         </TableRow>
//                       ) : Object.keys(inventoryMatches).length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             No matching inventory found for selected orders
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         selectedOrders.map((orderNo) =>
//                           inventoryMatches[orderNo]?.length > 0 ? (
//                             inventoryMatches[orderNo].map((item) => {
//                               const key = `${orderNo}-${item.IN_MaterialName}`;
//                               return (
//                                 <TableRow key={key} className="hover:bg-indigo-600/20">
//                                   <TableCell className="px-4 py-2">
//                                     <Checkbox
//                                       checked={selectedInventory[orderNo]?.includes(key) || false}
//                                       onCheckedChange={() => handleInventorySelect(orderNo, item.IN_MaterialName)}
//                                       className="bg-white"
//                                     />
//                                   </TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                                 </TableRow>
//                               );
//                             })
//                           ) : (
//                             <TableRow key={`${orderNo}-no-match`}>
//                               <TableCell colSpan={13} className="text-white text-center">
//                                 No matching inventory for Order {orderNo}
//                               </TableCell>
//                             </TableRow>
//                           )
//                         )
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Schedule Maker</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2">
//                         <Checkbox
//                           checked={
//                             selectedScheduleItems.length ===
//                               Object.values(scheduleMakerItems).flat().length &&
//                             Object.keys(scheduleMakerItems).length > 0
//                           }
//                           onCheckedChange={handleSelectAllScheduleItems}
//                           className="bg-white"
//                         />
//                       </TableHead>
//                       <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                       <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                       <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Position</TableHead>
//                       <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                       <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {Object.keys(scheduleMakerItems).length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={14} className="text-white text-center">
//                           No items in Schedule Maker. Allocate orders to add items.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
//                         items.map((item) => {
//                           const itemKey = `${orderNo}-${item.IN_MaterialName}`;
//                           return (
//                             <TableRow key={itemKey} className="hover:bg-indigo-600/20">
//                               <TableCell className="px-4 py-2">
//                                 <Checkbox
//                                   checked={selectedScheduleItems.includes(itemKey)}
//                                   onCheckedChange={() => handleScheduleItemSelect(itemKey)}
//                                   className="bg-white"
//                                 />
//                               </TableCell>
//                               <TableCell className="text-white px-4 py-2">{orderNo}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                             </TableRow>
//                           );
//                         })
//                       )
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { getOrdersByDate, getMatchingInventory } from "../actions";
// import { useRouter } from "next/navigation";

// export default function SchedulePool() {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [inventoryMatches, setInventoryMatches] = useState({});
//   const [selectedInventory, setSelectedInventory] = useState({});
//   const [scheduleMakerItems, setScheduleMakerItems] = useState({});
//   const [selectedScheduleItems, setSelectedScheduleItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showInventory, setShowInventory] = useState(false);
//   const [priorityType, setPriorityType] = useState("Position");

//   const router = useRouter();

//   const parsePosition = (position) => {
//     if (!position || position.length < 9) return { yard: "Y99", col: 999, row: "ZZ", layer: 999 };
//     const yard = position.slice(0, 3);
//     const col = parseInt(position.slice(3, 5), 10) || 999;
//     const row = position.slice(5, 7) || "ZZ";
//     const layer = parseInt(position.slice(7, 9), 10) || 999;
//     return { yard, col, row, layer };
//   };

//   const rowDistanceFromCenter = (row) => {
//     const rows = ["A", "B", "C", "D", "E"];
//     const centerIndex = 2;
//     const rowIndex = rows.indexOf(row[1] || "Z");
//     if (rowIndex === -1) return 999;
//     return Math.abs(rowIndex - centerIndex);
//   };

//   const daysInYard = (arrivalDate) => {
//     const today = new Date();
//     const arrival = new Date(arrivalDate);
//     const diffTime = today - arrival;
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const sortInventory = (inventory, order) => {
//     return inventory.sort((a, b) => {
//       const thickDiffA = Math.abs(a.IN_Thickness - order.orderThickness);
//       const thickDiffB = Math.abs(b.IN_Thickness - order.orderThickness);
//       if (thickDiffA !== thickDiffB) return thickDiffA - thickDiffB;

//       const widthDiffA = Math.abs(a.IN_Width - order.orderWidth);
//       const widthDiffB = Math.abs(b.IN_Width - order.orderWidth);
//       if (widthDiffA !== widthDiffB) return widthDiffA - widthDiffB;

//       const gradeMatchA = a.IN_Grade === order.grade ? 0 : 1;
//       const gradeMatchB = b.IN_Grade === order.grade ? 0 : 1;
//       if (gradeMatchA !== gradeMatchB) return gradeMatchA - gradeMatchB;

//       if (priorityType === "Position") {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer;
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB;
//         if (posA.col !== posB.col) return posA.col - posB.col;
//       } else if (priorityType === "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA;
//       }

//       if (priorityType !== "YardArrivalDate") {
//         const daysA = daysInYard(a.YardArrivalDate);
//         const daysB = daysInYard(b.YardArrivalDate);
//         if (daysA !== daysB) return daysB - daysA;
//       } else {
//         const posA = parsePosition(a.Position);
//         const posB = parsePosition(b.Position);
//         if (posA.layer !== posB.layer) return posB.layer - posA.layer;
//         const rowDistA = rowDistanceFromCenter(posA.row);
//         const rowDistB = rowDistanceFromCenter(posB.row);
//         if (rowDistA !== rowDistB) return rowDistA - rowDistB;
//         if (posA.col !== posB.col) return posA.col - posB.col;
//       }

//       return 0;
//     });
//   };

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true);
//       setError(null);
//       try {
//         const fetchedOrders = await getOrdersByDate(selectedDate);
//         if (fetchedOrders.length === 0) {
//           setError("No orders found for the selected date.");
//         }
//         const ordersWithStatus = fetchedOrders.map((order) => ({
//           ...order,
//           status: "Not Allocated",
//         }));
//         setOrders(ordersWithStatus);
//         console.log("Fetched Orders:", ordersWithStatus);
//         setSelectedOrders([]);
//         setInventoryMatches({});
//         setSelectedInventory({});
//         setShowInventory(false);
//       } catch (err) {
//         setError("Failed to fetch orders: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [selectedDate]);

//   useEffect(() => {
//     if (!showInventory || Object.keys(inventoryMatches).length === 0) return;

//     const updatedMatches = {};
//     const updatedSelections = {};
//     let hasChanges = false;

//     selectedOrders.forEach((orderNo) => {
//       const order = orders.find((o) => String(o.orderNo) === String(orderNo));
//       if (order && inventoryMatches[orderNo]) {
//         const sortedInventory = sortInventory([...inventoryMatches[orderNo]], order);
//         const currentInventory = inventoryMatches[orderNo];
//         const isDifferent = sortedInventory.some(
//           (item, index) => item.IN_MaterialName !== currentInventory[index]?.IN_MaterialName
//         );
//         if (isDifferent) {
//           hasChanges = true;
//           updatedMatches[orderNo] = sortedInventory;
//           const quantity = order.quantity || 0;
//           updatedSelections[orderNo] = sortedInventory
//             .slice(0, Math.min(quantity, sortedInventory.length))
//             .map((item) => `${orderNo}-${item.IN_MaterialName}`);
//         } else {
//           updatedMatches[orderNo] = currentInventory;
//           updatedSelections[orderNo] = selectedInventory[orderNo] || [];
//         }
//       }
//     });

//     if (hasChanges) {
//       setInventoryMatches(updatedMatches);
//       setSelectedInventory(updatedSelections);
//     }
//   }, [priorityType, orders, inventoryMatches, selectedOrders, selectedInventory]);

//   const handleFindMaterial = async () => {
//     if (selectedOrders.length === 0) {
//       setInventoryMatches({});
//       setSelectedInventory({});
//       setShowInventory(false);
//       setError("Please select at least one order.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     const matches = {};
//     const defaultSelections = {};

//     try {
//       for (const orderNo of selectedOrders) {
//         const order = orders.find((o) => String(o.orderNo) === String(orderNo));
//         if (order) {
//           const inventory = await getMatchingInventory(order);
//           if (inventory.length === 0) {
//             setError((prev) =>
//               prev ? prev + " No matching inventory for Order " + orderNo : "No matching inventory for Order " + orderNo
//             );
//           }
//           const sortedInventory = sortInventory([...inventory], order);
//           matches[orderNo] = sortedInventory;

//           const quantity = order.quantity || 0;
//           if (quantity > 0 && sortedInventory.length > 0) {
//             defaultSelections[orderNo] = sortedInventory
//               .slice(0, Math.min(quantity, sortedInventory.length))
//               .map((item) => `${orderNo}-${item.IN_MaterialName}`);
//           } else {
//             defaultSelections[orderNo] = [];
//           }
//         }
//       }
//       setInventoryMatches(matches);
//       setSelectedInventory(defaultSelections);
//       setShowInventory(true);
//     } catch (err) {
//       setError("Failed to fetch inventory: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderSelect = (orderNo) => {
//     setSelectedOrders((prev) =>
//       prev.includes(orderNo) ? prev.filter((id) => id !== orderNo) : [...prev, orderNo]
//     );
//   };

//   const handleInventorySelect = (orderNo, materialName) => {
//     const key = `${orderNo}-${materialName}`;
//     setSelectedInventory((prev) => ({
//       ...prev,
//       [orderNo]: prev[orderNo]?.includes(key)
//         ? prev[orderNo].filter((id) => id !== key)
//         : [...(prev[orderNo] || []), key],
//     }));
//   };

//   const handleScheduleItemSelect = (itemKey) => {
//     setSelectedScheduleItems((prev) =>
//       prev.includes(itemKey) ? prev.filter((id) => id !== itemKey) : [...prev, itemKey]
//     );
//   };

//   const handleSelectAllScheduleItems = () => {
//     const allItemKeys = Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
//       items.map((item) => `${orderNo}-${item.IN_MaterialName}`)
//     );
//     if (selectedScheduleItems.length === allItemKeys.length) {
//       setSelectedScheduleItems([]);
//     } else {
//       setSelectedScheduleItems(allItemKeys);
//     }
//   };

//   const handleStatusChange = (orderNo, newStatus) => {
//     setOrders((prev) =>
//       prev.map((order) =>
//         String(order.orderNo) === String(orderNo) ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   const handleQuery = () => {
//     console.log("Query button clicked");
//   };

//   const handleOrderAllocation = () => {
//     if (selectedOrders.length === 0) {
//       setError("Please select at least one order to allocate.");
//       return;
//     }

//     const newScheduleItems = {};
//     selectedOrders.forEach((orderNo) => {
//       const order = orders.find((o) => String(o.orderNo) === String(orderNo));
//       if (order && selectedInventory[orderNo]?.length > 0) {
//         const selectedItems = inventoryMatches[orderNo].filter((item) =>
//           selectedInventory[orderNo].includes(`${orderNo}-${item.IN_MaterialName}`)
//         );
//         if (selectedItems.length > 0) {
//           newScheduleItems[orderNo] = selectedItems;
//           handleStatusChange(orderNo, selectedItems.length >= order.quantity ? "Allocated" : "Partially Allocated");
//         }
//       }
//     });

//     setScheduleMakerItems((prev) => {
//       const updated = { ...prev, ...newScheduleItems };
//       console.log("Updated Schedule Maker Items:", updated);
//       return updated;
//     });

//     setSelectedOrders([]);
//     setSelectedInventory({});
//     setInventoryMatches({});
//     setShowInventory(false);
//   };

//   const handleCreateSchedule = () => {
//     if (selectedScheduleItems.length === 0) {
//       setError("Please select at least one item from Schedule Maker to create a schedule.");
//       return;
//     }

//     console.log("Selected Schedule Items:", selectedScheduleItems);
//     console.log("Schedule Maker Items:", scheduleMakerItems);
//     console.log("Current Orders State:", orders);

//     const selectedData = [];
//     selectedScheduleItems.forEach((itemKey, index) => {
//       const [orderNo, materialName] = itemKey.split("-");
//       const order = orders.find((o) => String(o.orderNo) === String(orderNo));
//       const inventoryItem = scheduleMakerItems[orderNo]?.find(
//         (item) => item.IN_MaterialName === materialName
//       );
//       if (order && inventoryItem) {
//         selectedData.push({
//           outMaterialNo: `NA${String(index + 1).padStart(5, "0")}`,
//           outThickness: order.orderThickness,
//           outWidth: order.orderWidth,
//           outGrade: order.grade,
//           outCoilWeight: order.weight,
//           inMatNo: inventoryItem.IN_MaterialName,
//           inThickness: inventoryItem.IN_Thickness,
//           inWidth: inventoryItem.IN_Width,
//           inGrade: inventoryItem.IN_Grade,
//           actualWeight: inventoryItem.IN_Weight,
//         });
//       } else {
//         console.warn(`Missing order or inventory item for key: ${itemKey}`, { order, inventoryItem });
//       }
//     });

//     const scheduleNo = `SCH${String(Object.keys(scheduleMakerItems).length + 1).padStart(3, "0")}`;
//     sessionStorage.setItem("scheduleData", JSON.stringify(selectedData));
//     sessionStorage.setItem("scheduleNo", scheduleNo);

//     console.log("Data being sent to ScheduleConfirmation:", {
//       scheduleNo,
//       selectedData,
//     });

//     router.push(`/schedule-confirmation?scheduleNo=${scheduleNo}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

//         <div className="mb-8 flex flex-col gap-4">
//           <div className="flex items-center gap-4">
//             <label className="text-white mr-4">Select Least Production Date:</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
//             />
//             <Button onClick={handleQuery} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Query
//             </Button>
//             <Button onClick={handleFindMaterial} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Find Material
//             </Button>
//             <Button onClick={handleOrderAllocation} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Order Allocation
//             </Button>
//             <Button onClick={handleCreateSchedule} className="bg-indigo-600 text-white hover:bg-indigo-700">
//               Create Schedule
//             </Button>
//           </div>
//           <div className="flex items-center gap-4">
//             <label className="text-white font-semibold">Secondary Priority:</label>
//             <div className="flex bg-gray-800 rounded-full p-1">
//               <button
//                 onClick={() => setPriorityType("Position")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "Position"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Position
//               </button>
//               <button
//                 onClick={() => setPriorityType("YardArrivalDate")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   priorityType === "YardArrivalDate"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Yard Arrival Date
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <div className="flex flex-col gap-8">
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="lg:w-1/2 w-full">
//               <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
//               <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-700">
//                         <TableHead className="text-white px-4 py-2"></TableHead>
//                         <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                         <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                         <TableHead className="text-white px-4 py-2">Quantity</TableHead>
//                         <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                         <TableHead className="text-white px-4 py-2">Order Thickness</TableHead>
//                         <TableHead className="text-white px-4 py-2">Order Width</TableHead>
//                         <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
//                         <TableHead className="text-white px-4 py-2">Customer</TableHead>
//                         <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Status</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {loading ? (
//                         <TableRow>
//                           <TableCell colSpan={12} className="text-white text-center">
//                             Loading...
//                           </TableCell>
//                         </TableRow>
//                       ) : orders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={12} className="text-white text-center">
//                             No orders found for this date
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         orders.map((order) => (
//                           <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
//                             <TableCell className="px-4 py-2">
//                               <Checkbox
//                                 checked={selectedOrders.includes(String(order.orderNo))}
//                                 onCheckedChange={() => handleOrderSelect(String(order.orderNo))}
//                                 className="bg-white"
//                               />
//                             </TableCell>
//                             <TableCell className="text-white px-4 py-2">{String(order.orderNo)}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.weight || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.quantity || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderThickness || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.orderWidth || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.deliveryPlace || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.customerName || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">{order.leastProductionDate || "-"}</TableCell>
//                             <TableCell className="text-white px-4 py-2">
//                               <select
//                                 value={order.status}
//                                 onChange={(e) => handleStatusChange(String(order.orderNo), e.target.value)}
//                                 className="bg-gray-700 text-white border border-indigo-300 rounded p-1"
//                               >
//                                 <option value="Not Allocated">Not Allocated</option>
//                                 <option value="Allocated">Allocated</option>
//                                 <option value="Partially Allocated">Partially Allocated</option>
//                               </select>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:w-1/2 w-full">
//               <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
//               <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-700">
//                         <TableHead className="text-white px-4 py-2"></TableHead>
//                         <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                         <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                         <TableHead className="text-white px-4 py-2">Width</TableHead>
//                         <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                         <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                         <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                         <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                         <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                         <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                         <TableHead className="text-white px-4 py-2">Position</TableHead>
//                         <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                         <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {loading ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Loading...
//                           </TableCell>
//                         </TableRow>
//                       ) : !showInventory ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Click "Find Material" to view matching inventory
//                           </TableCell>
//                         </TableRow>
//                       ) : selectedOrders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             Select an order to view matching inventory
//                           </TableCell>
//                         </TableRow>
//                       ) : Object.keys(inventoryMatches).length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={13} className="text-white text-center">
//                             No matching inventory found for selected orders
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         selectedOrders.map((orderNo) =>
//                           inventoryMatches[orderNo]?.length > 0 ? (
//                             inventoryMatches[orderNo].map((item) => {
//                               const key = `${orderNo}-${item.IN_MaterialName}`;
//                               return (
//                                 <TableRow key={key} className="hover:bg-indigo-600/20">
//                                   <TableCell className="px-4 py-2">
//                                     <Checkbox
//                                       checked={selectedInventory[orderNo]?.includes(key) || false}
//                                       onCheckedChange={() => handleInventorySelect(orderNo, item.IN_MaterialName)}
//                                       className="bg-white"
//                                     />
//                                   </TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                                   <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                                 </TableRow>
//                               );
//                             })
//                           ) : (
//                             <TableRow key={`${orderNo}-no-match`}>
//                               <TableCell colSpan={13} className="text-white text-center">
//                                 No matching inventory for Order {orderNo}
//                               </TableCell>
//                             </TableRow>
//                           )
//                         )
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Schedule Maker</h2>
//             <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-700">
//                       <TableHead className="text-white px-4 py-2">
//                         <Checkbox
//                           checked={
//                             selectedScheduleItems.length ===
//                               Object.values(scheduleMakerItems).flat().length &&
//                             Object.keys(scheduleMakerItems).length > 0
//                           }
//                           onCheckedChange={handleSelectAllScheduleItems}
//                           className="bg-white"
//                         />
//                       </TableHead>
//                       <TableHead className="text-white px-4 py-2">Order No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Material Name</TableHead>
//                       <TableHead className="text-white px-4 py-2">Thickness</TableHead>
//                       <TableHead className="text-white px-4 py-2">Width</TableHead>
//                       <TableHead className="text-white px-4 py-2">Weight</TableHead>
//                       <TableHead className="text-white px-4 py-2">Grade</TableHead>
//                       <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
//                       <TableHead className="text-white px-4 py-2">Residence</TableHead>
//                       <TableHead className="text-white px-4 py-2">Yard No</TableHead>
//                       <TableHead className="text-white px-4 py-2">Position</TableHead>
//                       <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
//                       <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {Object.keys(scheduleMakerItems).length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={14} className="text-white text-center">
//                           No items in Schedule Maker. Allocate orders to add items.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
//                         items.map((item) => {
//                           const itemKey = `${orderNo}-${item.IN_MaterialName}`;
//                           return (
//                             <TableRow key={itemKey} className="hover:bg-indigo-600/20">
//                               <TableCell className="px-4 py-2">
//                                 <Checkbox
//                                   checked={selectedScheduleItems.includes(itemKey)}
//                                   onCheckedChange={() => handleScheduleItemSelect(itemKey)}
//                                   className="bg-white"
//                                 />
//                               </TableCell>
//                               <TableCell className="text-white px-4 py-2">{orderNo}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
//                               <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
//                             </TableRow>
//                           );
//                         })
//                       )
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getOrdersByDate, getMatchingInventory } from "../actions";
import { useRouter } from "next/navigation";
import { saveScheduleConfirmation } from "../actions/schedule";

export default function SchedulePool() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [inventoryMatches, setInventoryMatches] = useState({});
  const [selectedInventory, setSelectedInventory] = useState({});
  const [scheduleMakerItems, setScheduleMakerItems] = useState({});
  const [selectedScheduleItems, setSelectedScheduleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [priorityType, setPriorityType] = useState("Position");
  const [scheduleCounter, setScheduleCounter] = useState(1);

  const router = useRouter();

  const parsePosition = (position) => {
    if (!position || position.length < 9) return { yard: "Y99", col: 999, row: "ZZ", layer: 999 };
    const yard = position.slice(0, 3);
    const col = parseInt(position.slice(3, 5), 10) || 999;
    const row = position.slice(5, 7) || "ZZ";
    const layer = parseInt(position.slice(7, 9), 10) || 999;
    return { yard, col, row, layer };
  };

  const rowDistanceFromCenter = (row) => {
    const rows = ["A", "B", "C", "D", "E"];
    const centerIndex = 2;
    const rowIndex = rows.indexOf(row[1] || "Z");
    if (rowIndex === -1) return 999;
    return Math.abs(rowIndex - centerIndex);
  };

  const daysInYard = (arrivalDate) => {
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const diffTime = today - arrival;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  

  const sortInventory = (inventory, order) => {
    return inventory.sort((a, b) => {
      // Width difference (top priority)
      const widthDiffA = Math.abs(a.IN_Width - order.orderWidth);
      const widthDiffB = Math.abs(b.IN_Width - order.orderWidth);
      if (widthDiffA !== widthDiffB) return widthDiffA - widthDiffB;

      // Grade match (second priority)
      const gradeMatchA = a.IN_Grade === order.grade ? 0 : 1;
      const gradeMatchB = b.IN_Grade === order.grade ? 0 : 1;
      if (gradeMatchA !== gradeMatchB) return gradeMatchA - gradeMatchB;

      // Thickness logic: prefer IN_Thickness > orderThickness, avoid exact match
      const thickA = a.IN_Thickness;
      const thickB = b.IN_Thickness;
      const orderThick = order.orderThickness;

      // Exact match penalty: push exact matches to the bottom
      const isExactA = thickA === orderThick ? 1 : 0;
      const isExactB = thickB === orderThick ? 1 : 0;
      if (isExactA !== isExactB) return isExactA - isExactB; // Exact matches lose

      // Prefer thickness > orderThickness, then closest above
      const isAboveA = thickA > orderThick ? 0 : 1;
      const isAboveB = thickB > orderThick ? 0 : 1;
      if (isAboveA !== isAboveB) return isAboveA - isAboveB; // Above wins

      const thickDiffA = Math.abs(thickA - orderThick);
      const thickDiffB = Math.abs(thickB - orderThick);
      if (thickDiffA !== thickDiffB) return thickDiffA - thickDiffB;

      // Existing secondary priorities (position, yard arrival date)
      if (priorityType === "Position") {
        const posA = parsePosition(a.Position);
        const posB = parsePosition(b.Position);
        if (posA.layer !== posB.layer) return posB.layer - posA.layer;
        const rowDistA = rowDistanceFromCenter(posA.row);
        const rowDistB = rowDistanceFromCenter(posB.row);
        if (rowDistA !== rowDistB) return rowDistA - rowDistB;
        if (posA.col !== posB.col) return posA.col - posB.col;
      } else if (priorityType === "YardArrivalDate") {
        const daysA = daysInYard(a.YardArrivalDate);
        const daysB = daysInYard(b.YardArrivalDate);
        if (daysA !== daysB) return daysB - daysA;
      }

      if (priorityType !== "YardArrivalDate") {
        const daysA = daysInYard(a.YardArrivalDate);
        const daysB = daysInYard(b.YardArrivalDate);
        if (daysA !== daysB) return daysB - daysA;
      } else {
        const posA = parsePosition(a.Position);
        const posB = parsePosition(b.Position);
        if (posA.layer !== posB.layer) return posB.layer - posA.layer;
        const rowDistA = rowDistanceFromCenter(posA.row);
        const rowDistB = rowDistanceFromCenter(posB.row);
        if (rowDistA !== rowDistB) return rowDistA - rowDistB;
        if (posA.col !== posB.col) return posA.col - posB.col;
      }

      return 0;
    });
  };

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getOrdersByDate(selectedDate);
        if (fetchedOrders.length === 0) {
          setError("No orders found for the selected date.");
        }
        const ordersWithStatus = fetchedOrders.map((order) => ({
          ...order,
          status: "Not Allocated",
        }));
        setOrders(ordersWithStatus);
        console.log("Fetched Orders:", ordersWithStatus);
        setSelectedOrders([]);
        setInventoryMatches({});
        setSelectedInventory({});
        setShowInventory(false);
      } catch (err) {
        setError("Failed to fetch orders: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [selectedDate]);

  useEffect(() => {
    if (!showInventory || Object.keys(inventoryMatches).length === 0) return;

    const updatedMatches = {};
    const updatedSelections = {};
    let hasChanges = false;

    selectedOrders.forEach((orderNo) => {
      const order = orders.find((o) => String(o.orderNo) === String(orderNo));
      if (order && inventoryMatches[orderNo]) {
        const sortedInventory = sortInventory([...inventoryMatches[orderNo]], order);
        const currentInventory = inventoryMatches[orderNo];
        const isDifferent = sortedInventory.some(
          (item, index) => item.IN_MaterialName !== currentInventory[index]?.IN_MaterialName
        );
        if (isDifferent) {
          hasChanges = true;
          updatedMatches[orderNo] = sortedInventory;
          const quantity = order.quantity || 0;
          updatedSelections[orderNo] = sortedInventory
            .slice(0, Math.min(quantity, sortedInventory.length))
            .map((item) => `${orderNo}-${item.IN_MaterialName}`);
        } else {
          updatedMatches[orderNo] = currentInventory;
          updatedSelections[orderNo] = selectedInventory[orderNo] || [];
        }
      }
    });

    if (hasChanges) {
      setInventoryMatches(updatedMatches);
      setSelectedInventory(updatedSelections);
    }
  }, [priorityType, orders, inventoryMatches, selectedOrders, selectedInventory]);

  const handleFindMaterial = async () => {
    if (selectedOrders.length === 0) {
      setInventoryMatches({});
      setSelectedInventory({});
      setShowInventory(false);
      setError("Please select at least one order.");
      return;
    }

    setLoading(true);
    setError(null);
    const matches = {};
    const defaultSelections = {};

    try {
      for (const orderNo of selectedOrders) {
        const order = orders.find((o) => String(o.orderNo) === String(orderNo));
        if (order) {
          const inventory = await getMatchingInventory(order);
          if (inventory.length === 0) {
            setError((prev) =>
              prev ? prev + " No matching inventory for Order " + orderNo : "No matching inventory for Order " + orderNo
            );
          }
          const sortedInventory = sortInventory([...inventory], order);
          matches[orderNo] = sortedInventory;

          const quantity = order.quantity || 0;
          if (quantity > 0 && sortedInventory.length > 0) {
            // Filter out exact thickness matches for default selection
            const eligibleItems = sortedInventory.filter(
              (item) => item.IN_Thickness !== order.orderThickness
            );
            defaultSelections[orderNo] = eligibleItems
              .slice(0, Math.min(quantity, eligibleItems.length))
              .map((item) => `${orderNo}-${item.IN_MaterialName}`);
            console.log(`Default selections for ${orderNo}:`, defaultSelections[orderNo]);
          } else {
            defaultSelections[orderNo] = [];
          }
        }
      }
      setInventoryMatches(matches);
      setSelectedInventory(defaultSelections);
      setShowInventory(true);
    } catch (err) {
      setError("Failed to fetch inventory: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (orderNo) => {
    setSelectedOrders((prev) =>
      prev.includes(orderNo) ? prev.filter((id) => id !== orderNo) : [...prev, orderNo]
    );
  };

  const handleInventorySelect = (orderNo, materialName) => {
    const key = `${orderNo}-${materialName}`;
    setSelectedInventory((prev) => ({
      ...prev,
      [orderNo]: prev[orderNo]?.includes(key)
        ? prev[orderNo].filter((id) => id !== key)
        : [...(prev[orderNo] || []), key],
    }));
  };

  const handleScheduleItemSelect = (itemKey) => {
    setSelectedScheduleItems((prev) =>
      prev.includes(itemKey) ? prev.filter((id) => id !== itemKey) : [...prev, itemKey]
    );
  };

  const handleSelectAllScheduleItems = () => {
    const allItemKeys = Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
      items.map((item) => `${orderNo}-${item.IN_MaterialName}`)
    );
    if (selectedScheduleItems.length === allItemKeys.length) {
      setSelectedScheduleItems([]);
    } else {
      setSelectedScheduleItems(allItemKeys);
    }
  };

  const handleStatusChange = (orderNo, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        String(order.orderNo) === String(orderNo) ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleQuery = () => {
    console.log("Query button clicked");
  };

  const handleOrderAllocation = () => {
    if (selectedOrders.length === 0) {
      setError("Please select at least one order to allocate.");
      return;
    }

    const newScheduleItems = {};
    selectedOrders.forEach((orderNo) => {
      const order = orders.find((o) => String(o.orderNo) === String(orderNo));
      if (order && selectedInventory[orderNo]?.length > 0) {
        const selectedItems = inventoryMatches[orderNo].filter((item) =>
          selectedInventory[orderNo].includes(`${orderNo}-${item.IN_MaterialName}`)
        );
        if (selectedItems.length > 0) {
          // Store order details with each inventory item
          newScheduleItems[orderNo] = selectedItems.map(item => ({
            ...item,
            orderThickness: order.orderThickness,
            orderWidth: order.orderWidth,
            grade: order.grade,
            weight: order.weight,
          }));
          handleStatusChange(orderNo, selectedItems.length >= order.quantity ? "Allocated" : "Partially Allocated");
        }
      }
    });

    setScheduleMakerItems((prev) => {
      const updated = { ...prev, ...newScheduleItems };
      console.log("Updated Schedule Maker Items:", updated);
      return updated;
    });

    setSelectedOrders([]);
    setSelectedInventory({});
    setInventoryMatches({});
    setShowInventory(false);
  };

  const handleCreateSchedule = () => {
    if (selectedScheduleItems.length === 0) {
      setError("Please select at least one item from Schedule Maker to create a schedule.");
      return;
    }

    console.log("Starting handleCreateSchedule...");
    console.log("Selected Schedule Items:", selectedScheduleItems);
    console.log("Schedule Maker Items:", scheduleMakerItems);
    console.log("Current Orders State:", orders);

    const selectedData = [];
    selectedScheduleItems.forEach((itemKey, index) => {
      const [orderNo, materialName] = itemKey.split("-");
      console.log(`Processing item ${index + 1}: ${itemKey}, OrderNo: ${orderNo}, Material: ${materialName}`);

      const inventoryItem = scheduleMakerItems[orderNo]?.find(
        (item) => item.IN_MaterialName === materialName
      );

      if (!inventoryItem) {
        console.warn(`No inventory item found for key: ${itemKey} in scheduleMakerItems`);
        return;
      }

      const itemData = {
        outMaterialNo: `NA${String(index + 1).padStart(5, "0")}`,
        outThickness: inventoryItem.orderThickness || "-", // Use stored order data
        outWidth: inventoryItem.orderWidth || "-",
        outGrade: inventoryItem.grade || "-",
        outCoilWeight: inventoryItem.weight || "-",
        inMatNo: inventoryItem.IN_MaterialName,
        inThickness: inventoryItem.IN_Thickness,
        inWidth: inventoryItem.IN_Width,
        inGrade: inventoryItem.IN_Grade,
        actualWeight: inventoryItem.IN_Weight,
        orderNo: String(orderNo),
      };

      selectedData.push(itemData);
      console.log(`Added item ${index + 1} to selectedData:`, itemData);
    });

    const scheduleNo = `SCH${String(scheduleCounter).padStart(3, "0")}`;
    console.log("Generated scheduleNo:", scheduleNo);
    console.log("Total items in selectedData:", selectedData.length);
    console.log("Final selectedData before storage:", selectedData);

    sessionStorage.setItem("scheduleData", JSON.stringify(selectedData));
    sessionStorage.setItem("scheduleNo", scheduleNo);

    console.log("Data stored in sessionStorage:", {
      scheduleNo,
      selectedData,
    });

    setScheduleCounter((prev) => prev + 1);

    router.push(`/schedule-confirmation?scheduleNo=${scheduleNo}`);
  };
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="text-white mr-4">Select Least Production Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
            />
            <Button onClick={handleQuery} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Query
            </Button>
            <Button onClick={handleFindMaterial} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Find Material
            </Button>
            <Button onClick={handleOrderAllocation} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Order Allocation
            </Button>
            <Button onClick={handleCreateSchedule} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Create Schedule
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-white font-semibold">Secondary Priority:</label>
            <div className="flex bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setPriorityType("Position")}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  priorityType === "Position"
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-300 hover:text-white"
                }`}
              >
                Position
              </button>
              <button
                onClick={() => setPriorityType("YardArrivalDate")}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  priorityType === "YardArrivalDate"
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-300 hover:text-white"
                }`}
              >
                Yard Arrival Date
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 w-full">
              <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
              <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-700">
                        <TableHead className="text-white px-4 py-2"></TableHead>
                        <TableHead className="text-white px-4 py-2">Order No</TableHead>
                        <TableHead className="text-white px-4 py-2">Weight</TableHead>
                        <TableHead className="text-white px-4 py-2">Quantity</TableHead>
                        <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
                        <TableHead className="text-white px-4 py-2">Grade</TableHead>
                        <TableHead className="text-white px-4 py-2">Order Thickness</TableHead>
                        <TableHead className="text-white px-4 py-2">Order Width</TableHead>
                        <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
                        <TableHead className="text-white px-4 py-2">Customer</TableHead>
                        <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
                        <TableHead className="text-white px-4 py-2">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-white text-center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-white text-center">
                            No orders found for this date
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
                            <TableCell className="px-4 py-2">
                              <Checkbox
                                checked={selectedOrders.includes(String(order.orderNo))}
                                onCheckedChange={() => handleOrderSelect(String(order.orderNo))}
                                className="bg-white"
                              />
                            </TableCell>
                            <TableCell className="text-white px-4 py-2">{String(order.orderNo)}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.weight || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.quantity || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.orderThickness || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.orderWidth || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.deliveryPlace || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.customerName || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">{order.leastProductionDate || "-"}</TableCell>
                            <TableCell className="text-white px-4 py-2">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(String(order.orderNo), e.target.value)}
                                className="bg-gray-700 text-white border border-indigo-300 rounded p-1"
                              >
                                <option value="Not Allocated">Not Allocated</option>
                                <option value="Allocated">Allocated</option>
                                <option value="Partially Allocated">Partially Allocated</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
              <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-700">
                        <TableHead className="text-white px-4 py-2"></TableHead>
                        <TableHead className="text-white px-4 py-2">Material Name</TableHead>
                        <TableHead className="text-white px-4 py-2">Thickness</TableHead>
                        <TableHead className="text-white px-4 py-2">Width</TableHead>
                        <TableHead className="text-white px-4 py-2">Weight</TableHead>
                        <TableHead className="text-white px-4 py-2">Grade</TableHead>
                        <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
                        <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
                        <TableHead className="text-white px-4 py-2">Residence</TableHead>
                        <TableHead className="text-white px-4 py-2">Yard No</TableHead>
                        <TableHead className="text-white px-4 py-2">Position</TableHead>
                        <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
                        <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-white text-center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : !showInventory ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-white text-center">
                            Click "Find Material" to view matching inventory
                          </TableCell>
                        </TableRow>
                      ) : selectedOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-white text-center">
                            Select an order to view matching inventory
                          </TableCell>
                        </TableRow>
                      ) : Object.keys(inventoryMatches).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-white text-center">
                            No matching inventory found for selected orders
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedOrders.map((orderNo) =>
                          inventoryMatches[orderNo]?.length > 0 ? (
                            inventoryMatches[orderNo].map((item) => {
                              const key = `${orderNo}-${item.IN_MaterialName}`;
                              return (
                                <TableRow key={key} className="hover:bg-indigo-600/20">
                                  <TableCell className="px-4 py-2">
                                    <Checkbox
                                      checked={selectedInventory[orderNo]?.includes(key) || false}
                                      onCheckedChange={() => handleInventorySelect(orderNo, item.IN_MaterialName)}
                                      className="bg-white"
                                    />
                                  </TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
                                  <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow key={`${orderNo}-no-match`}>
                              <TableCell colSpan={13} className="text-white text-center">
                                No matching inventory for Order {orderNo}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Schedule Maker</h2>
            <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700">
                      <TableHead className="text-white px-4 py-2">
                        <Checkbox
                          checked={
                            selectedScheduleItems.length ===
                              Object.values(scheduleMakerItems).flat().length &&
                            Object.keys(scheduleMakerItems).length > 0
                          }
                          onCheckedChange={handleSelectAllScheduleItems}
                          className="bg-white"
                        />
                      </TableHead>
                      <TableHead className="text-white px-4 py-2">Order No</TableHead>
                      <TableHead className="text-white px-4 py-2">Material Name</TableHead>
                      <TableHead className="text-white px-4 py-2">Thickness</TableHead>
                      <TableHead className="text-white px-4 py-2">Width</TableHead>
                      <TableHead className="text-white px-4 py-2">Weight</TableHead>
                      <TableHead className="text-white px-4 py-2">Grade</TableHead>
                      <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
                      <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
                      <TableHead className="text-white px-4 py-2">Residence</TableHead>
                      <TableHead className="text-white px-4 py-2">Yard No</TableHead>
                      <TableHead className="text-white px-4 py-2">Position</TableHead>
                      <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
                      <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(scheduleMakerItems).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-white text-center">
                          No items in Schedule Maker. Allocate orders to add items.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(scheduleMakerItems).flatMap(([orderNo, items]) =>
                        items.map((item) => {
                          const itemKey = `${orderNo}-${item.IN_MaterialName}`;
                          return (
                            <TableRow key={itemKey} className="hover:bg-indigo-600/20">
                              <TableCell className="px-4 py-2">
                                <Checkbox
                                  checked={selectedScheduleItems.includes(itemKey)}
                                  onCheckedChange={() => handleScheduleItemSelect(itemKey)}
                                  className="bg-white"
                                />
                              </TableCell>
                              <TableCell className="text-white px-4 py-2">{orderNo}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
                            </TableRow>
                          );
                        })
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}