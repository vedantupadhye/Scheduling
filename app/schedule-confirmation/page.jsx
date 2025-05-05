

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
// import { Button } from "@/components/ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getScheduleConfirmation, saveScheduleConfirmation, getNextScheduleNumber } from "@/app/actions/schedule";

// export default function ScheduleConfirmation() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedData, setSelectedData] = useState([]);
//   const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const handleBack = () => {
//     router.push("/SchedulePool");
//   };
  

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
      
//       try {
//         // Get scheduleNo from URL parameters
//         const scheduleNoFromParams = searchParams.get("scheduleNo");
        
//         // Check for data in sessionStorage first
//         const dataFromStorage = sessionStorage.getItem('selectedScheduleData');
//         if (dataFromStorage) {
//           const parsedData = JSON.parse(dataFromStorage);
//           console.log("Found data in sessionStorage:", parsedData);
//           setSelectedData(parsedData);
          
//           if (scheduleNoFromParams) {
//             // If scheduleNo is in URL, use it
//             setScheduleNo(scheduleNoFromParams);
//           } else {
//             // Only get a new schedule number if we don't have one
//             const newScheduleNoResult = await getNextScheduleNumber();
//             if (!newScheduleNoResult.success) {
//               setError("Failed to generate new schedule number: " + newScheduleNoResult.error);
//             } else {
//               setScheduleNo(newScheduleNoResult.data);
//             }
//           }
//         } else if (scheduleNoFromParams) {
//           // Fetch from DB if navigating directly with a scheduleNo
//           setScheduleNo(scheduleNoFromParams);
//           console.log("Fetching data from DB for schedule:", scheduleNoFromParams);
//           const result = await getScheduleConfirmation(scheduleNoFromParams);
//           if (result.success) {
//             console.log("DB data:", result.data);
//             setSelectedData(result.data);
//           } else {
//             setError("Failed to fetch schedule: " + result.error);
//           }
//         } else {
//           // No data in sessionStorage and no scheduleNo in URL
//           setError("No schedule data available");
//         }
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         setError("An error occurred while loading data");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData();
//   }, [searchParams]);
//   // Add cleanup of sessionStorage when "Final Schedule" is clicked
//   const handleFinalSchedule = async () => {
//     if (selectedData.length === 0) {
//       setError("No items to save.");
//       return;
//     }
  
//     setSaving(true);
//     try {
//       const result = await saveScheduleConfirmation(scheduleNo, selectedData);
  
//       if (result.success) {
//         // Clean up sessionStorage
//         sessionStorage.removeItem('selectedScheduleData');
//         // Redirect back to SchedulePool after saving
//         router.push("/SchedulePool");
//       } else {
//         setError("Failed to save final schedule: " + result.error);
//       }
//     } catch (error) {
//       console.error("Error saving schedule:", error);
//       setError("An unexpected error occurred while saving");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
//       <div className="w-full max-w-[1600px]">
//         <h1 className="text-3xl font-bold mb-6 text-white text-center">
//           Schedule Confirmation - {scheduleNo}
//         </h1>

//         <div className="mb-6 flex items-center justify-between">
//           <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Back
//           </Button>
//           <Button
//             onClick={handleFinalSchedule}
//             className="bg-green-600 text-white hover:bg-green-700"
//             disabled={saving || loading || selectedData.length === 0}
//           >
//             {saving ? "Saving..." : "Final Schedule"}
//           </Button>
//         </div>

//         {loading ? (
//           <p className="text-white text-center">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
//             <div className="overflow-y-auto max-h-[500px]">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Schedule No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Order No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Out Mat No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>
//                       Out Material
//                     </TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>
//                       In Material
//                     </TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Actual Weight</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={12}
//                         className="text-white text-center py-2 border-t border-gray-600"
//                       >
//                         No items found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     selectedData.map((item, index) => (
//                       <TableRow key={index} className="border-b border-gray-600">
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {scheduleNo}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.orderNo}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.outMaterialNo}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.outThickness ?? "-"}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.outWidth ?? "-"}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.outGrade ?? "-"}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.outCoilWeight ?? "-"}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.inMatNo}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.inThickness}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.inWidth}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.inGrade}
//                         </TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">
//                           {item.inactualWeight}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         )}
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
// import { Button } from "@/components/ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getScheduleConfirmation, saveScheduleConfirmation, getNextScheduleNumber } from "@/app/actions/schedule";
// import { getRules } from "@/app/actions/ruleActions";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function ScheduleConfirmation() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedData, setSelectedData] = useState([]);
//   const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [rules, setRules] = useState([]);
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [showRuleDropdown, setShowRuleDropdown] = useState(false);
//   const [visualizationType, setVisualizationType] = useState("output");

//   const handleBack = () => {
//     router.push("/SchedulePool");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const scheduleNoFromParams = searchParams.get("scheduleNo");
//         const dataFromStorage = sessionStorage.getItem('selectedScheduleData');
//         if (dataFromStorage) {
//           const parsedData = JSON.parse(dataFromStorage);
//           setSelectedData(parsedData);
//           if (scheduleNoFromParams) {
//             setScheduleNo(scheduleNoFromParams);
//           } else {
//             const newScheduleNoResult = await getNextScheduleNumber();
//             if (!newScheduleNoResult.success) {
//               setError("Failed to generate new schedule number: " + newScheduleNoResult.error);
//             } else {
//               setScheduleNo(newScheduleNoResult.data);
//             }
//           }
//         } else if (scheduleNoFromParams) {
//           setScheduleNo(scheduleNoFromParams);
//           const result = await getScheduleConfirmation(scheduleNoFromParams);
//           if (result.success) {
//             setSelectedData(result.data);
//           } else {
//             setError("Failed to fetch schedule: " + result.error);
//           }
//         } else {
//           setError("No schedule data available");
//         }

//         const rulesResult = await getRules();
//         if (rulesResult.success) {
//           setRules(rulesResult.data);
//         } else {
//           setError("Failed to fetch rules: " + rulesResult.error);
//         }
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         setError("An error occurred while loading data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchParams]);

//   const handleFinalSchedule = async () => {
//     if (selectedData.length === 0) {
//       setError("No items to save.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const result = await saveScheduleConfirmation(scheduleNo, selectedData);
//       if (result.success) {
//         sessionStorage.removeItem('selectedScheduleData');
//         router.push("/SchedulePool");
//       } else {
//         setError("Failed to save final schedule: " + result.error);
//       }
//     } catch (error) {
//       console.error("Error saving schedule:", error);
//       setError("An unexpected error occurred while saving");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // const applyRulesAndSort = (rule) => {
//   //   if (!rule || selectedData.length === 0) return;
  
//   //   let sortedData = [...selectedData];
  
//   //   // Primary Rules from your specifications
//   //   const firstCoilThicknessMin = 3.5;
//   //   const firstCoilThicknessMax = 5;
//   //   const firstCoilWidthMin = 900;
//   //   const firstCoilWidthMax = 1100;
//   //   const maxWidthJump = 150;
//   //   const maxWidthDown = 200;
//   //   const maxSameWidthRolling = 40000; // 40km in meters
//   //   const maxTotalRollingLength = 80000; // 80km in meters
//   //   const maxTotalTonnage = 600;
//   //   const maxCoils = 50;
  
//   //   // Allowed thickness transitions
//   //   const thicknessDownRanges = [
//   //     [16, 12], [12, 10], [10, 8], [8, 6], [6, 4], [4, 2], [2, 1.2], [1.2, 0.6]
//   //   ];
//   //   const thicknessJumpRanges = [
//   //     [2, 4], [4, 8], [8, 12], [12, 16], [16, 18]
//   //   ];
//   //   const allowedGradeChanges = [
//   //     "E250Br to E350BR", "E350Br to E450BR", "E450BR to E150Br", "E150Br to API X"
//   //   ];
  
//   //   // 1. Ensure first coil meets thickness and width requirements
//   //   sortedData.sort((a, b) => {
//   //     const aMatchesPrimary =
//   //       (a.outThickness >= firstCoilThicknessMin && a.outThickness <= firstCoilThicknessMax) &&
//   //       (a.outWidth >= firstCoilWidthMin && a.outWidth <= firstCoilWidthMax);
//   //     const bMatchesPrimary =
//   //       (b.outThickness >= firstCoilThicknessMin && b.outThickness <= firstCoilThicknessMax) &&
//   //       (b.outWidth >= firstCoilWidthMin && b.outWidth <= firstCoilWidthMax);
//   //     return bMatchesPrimary - aMatchesPrimary;
//   //   });
  
//   //   // 2. Apply thickness and width constraints
//   //   sortedData.sort((a, b) => {
//   //     let scoreA = 0;
//   //     let scoreB = 0;
      
//   //     // Check thickness jumps
//   //     const indexA = sortedData.indexOf(a);
//   //     const indexB = sortedData.indexOf(b);
//   //     if (indexA > 0) {
//   //       const prevThickness = sortedData[indexA - 1].outThickness;
//   //       const thicknessDiff = Math.abs(a.outThickness - prevThickness);
//   //       const isValidJump = thicknessJumpRanges.some(([min, max]) => 
//   //         thicknessDiff >= min && thicknessDiff <= max);
//   //       scoreA += isValidJump ? 1 : -1;
//   //     }
      
//   //     if (indexB > 0) {
//   //       const prevThickness = sortedData[indexB - 1].outThickness;
//   //       const thicknessDiff = Math.abs(b.outThickness - prevThickness);
//   //       const isValidJump = thicknessJumpRanges.some(([min, max]) => 
//   //         thicknessDiff >= min && thicknessDiff <= max);
//   //       scoreB += isValidJump ? 1 : -1;
//   //     }
  
//   //     // Check width constraints
//   //     if (indexA > 0) {
//   //       const prevWidth = sortedData[indexA - 1].outWidth;
//   //       const widthDiff = Math.abs(a.outWidth - prevWidth);
//   //       scoreA += (widthDiff <= maxWidthJump) ? 1 : -1;
//   //       if (a.outWidth < prevWidth) {
//   //         scoreA += (prevWidth - a.outWidth <= maxWidthDown) ? 1 : -1;
//   //       }
//   //     }
  
//   //     if (indexB > 0) {
//   //       const prevWidth = sortedData[indexB - 1].outWidth;
//   //       const widthDiff = Math.abs(b.outWidth - prevWidth);
//   //       scoreB += (widthDiff <= maxWidthJump) ? 1 : -1;
//   //       if (b.outWidth < prevWidth) {
//   //         scoreB += (prevWidth - b.outWidth <= maxWidthDown) ? 1 : -1;
//   //       }
//   //     }
  
//   //     return scoreB - scoreA;
//   //   });
  
//   //   // 3. Apply grade change rules
//   //   sortedData.sort((a, b) => {
//   //     const indexA = sortedData.indexOf(a);
//   //     if (indexA > 0) {
//   //       const prevGrade = sortedData[indexA - 1].outGrade;
//   //       const gradeTransition = `${prevGrade} to ${a.outGrade}`;
//   //       return allowedGradeChanges.includes(gradeTransition) ? -1 : 1;
//   //     }
//   //     return 0;
//   //   });
  
//   //   // 4. Form coffin shape (thicker/wider in middle)
//   //   const midPoint = Math.floor(sortedData.length / 2);
//   //   sortedData.sort((a, b) => {
//   //     const aDist = Math.abs(sortedData.indexOf(a) - midPoint);
//   //     const bDist = Math.abs(sortedData.indexOf(b) - midPoint);
//   //     return aDist - bDist || 
//   //            b.outThickness - a.outThickness || 
//   //            b.outWidth - a.outWidth;
//   //   });
  
//   //   // 5. Validate total constraints
//   //   const totalLength = sortedData.reduce((sum, item) => sum + (item.length || 0), 0);
//   //   const totalWeight = sortedData.reduce((sum, item) => sum + (item.outCoilWeight || 0), 0);
    
//   //   if (totalLength > maxTotalRollingLength || 
//   //       totalWeight > maxTotalTonnage || 
//   //       sortedData.length > maxCoils) {
//   //     console.warn("Schedule exceeds maximum constraints");
//   //   }
  
//   //   setSelectedData(sortedData);
//   //   setShowRuleDropdown(false);
//   // };

  
 
//   const handleAssignRule = () => {
//     setShowRuleDropdown(!showRuleDropdown);
//   };

//   const handleRuleSelection = (rule) => {
//     setSelectedRule(rule);
//     applyRulesAndSort(rule);
//   };



//   // Calculate the width for visualization bars
//   const calculateBarWidth = (value, maxValue) => {
//     if (!value) return 0;
//     // Increased from 50% to 80% for better visibility
//     const percentage = (parseFloat(value) / maxValue) * 180; 
//     return Math.max(percentage, 5); // Ensure minimum 5% width for visibility
//   };

//   // Updated max values calculation for better scaling
//   const getMaxValues = () => {
//     if (selectedData.length === 0) return { maxThickness: 15, maxWidth: 1800 }; // Increased base values
    
//     const maxOutThickness = Math.max(...selectedData.map(item => parseFloat(item.outThickness) || 0));
//     const maxInThickness = Math.max(...selectedData.map(item => parseFloat(item.inThickness) || 0));
//     const maxOutWidth = Math.max(...selectedData.map(item => parseFloat(item.outWidth) || 0));
//     const maxInWidth = Math.max(...selectedData.map(item => parseFloat(item.inWidth) || 0));
    
//     // Added buffer to max values for better visualization
//     return {
//       maxThickness: Math.max(maxOutThickness, maxInThickness, 15) * 1.2,
//       maxWidth: Math.max(maxOutWidth, maxInWidth, 1800) * 1.2
//     };
//   };
//   const { maxThickness, maxWidth } = getMaxValues();

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
//       <div className="w-full max-w-[1600px]">
//         <h1 className="text-3xl font-bold mb-6 text-white text-center">
//           Schedule Confirmation - {scheduleNo}
//         </h1>

//         <div className="mb-6 flex items-center justify-between">
//           <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Back
//           </Button>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <Button
//                 onClick={handleAssignRule}
//                 className="bg-yellow-600 text-white hover:bg-yellow-700"
//                 disabled={loading || selectedData.length === 0}
//               >
//                 Assign Rule
//               </Button>
//               {showRuleDropdown && (
//                 <div className="absolute z-10 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-lg">
//                   {rules.length === 0 ? (
//                     <p className="text-white p-2">No rules available</p>
//                   ) : (
//                     rules.map((rule) => (
//                       <button
//                         key={rule.ruleName}
//                         onClick={() => handleRuleSelection(rule)}
//                         className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
//                       >
//                         {rule.ruleName}
//                       </button>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//             <Button
//               onClick={handleFinalSchedule}
//               className="bg-green-600 text-white hover:bg-green-700"
//               disabled={saving || loading || selectedData.length === 0}
//             >
//               {saving ? "Saving..." : "Final Schedule"}
//             </Button>
//           </div>
//         </div>

//         {!loading && !error && (
//           <div className="mb-6 bg-gray-800 p-4 rounded-lg">
//             <Tabs 
//               defaultValue="output" 
//               value={visualizationType}
//               onValueChange={setVisualizationType}
//               className="w-full"
//             >
//               <TabsList className="grid grid-cols-2 w-64 mx-auto">
//                 <TabsTrigger value="output" className="text-white hover:bg-gray-500 ">Output Values</TabsTrigger>
//                 <TabsTrigger value="input" className="text-white hover:bg-gray-500" >Input Values</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         )}

//         {loading ? (
//           <p className="text-white text-center">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Schedule No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Order No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
//                       Out Mat No
//                     </TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>
//                       Out Material
//                     </TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>
//                       In Material
//                     </TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={2}>
//                       Visualization
//                     </TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Actual Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Thickness Graph</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Width Graph</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={14}
//                         className="text-white text-center py-2 border-t border-gray-600"
//                       >
//                         No items found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     selectedData.map((item, index) => (
//                       <TableRow key={index} className="border-b border-gray-600">
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{scheduleNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.orderNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outMaterialNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outThickness ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outWidth ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outGrade ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outCoilWeight ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inMatNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inThickness}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inWidth}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inGrade}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inactualWeight}</TableCell>
//                         <TableCell className="px-4 py-2 border-r border-gray-600">
//     <div className="flex items-center h-10"> {/* Increased height */}
//       <div className="w-full h-5 bg-gray-900 rounded-lg relative"> {/* Larger bar container */}
//         <div
//           className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
//           style={{
//             width: `${calculateBarWidth(
//               visualizationType === "output" ? item.outThickness : item.inThickness,
//               maxThickness
//             )}%`,
//             left: "50%",
//             transform: "translateX(-50%)",
//             minWidth: '4px' // Ensure very small values are still visible
//           }}
//         ></div>
//         <div
//           className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
//           style={{
//             width: `${calculateBarWidth(
//               visualizationType === "output" ? item.outThickness : item.inThickness,
//               maxThickness
//             )}%`,
//             right: "50%",
//             transform: "translateX(50%)",
//             minWidth: '4px' // Ensure very small values are still visible
//           }}
//         ></div>
//         <span className="absolute text-sm text-white w-full text-center font-medium"> {/* Larger text */}
//           {visualizationType === "output" ? item.outThickness : item.inThickness}
//         </span>
//       </div>
//     </div>
//   </TableCell>

//   <TableCell className="px-4 py-2 border-r border-gray-600">
//     <div className="flex items-center h-10"> {/* Increased height */}
//       <div className="w-full h-5 bg-gray-900 rounded-lg relative"> {/* Larger bar container */}
//         <div
//           className="absolute top-0 bottom-0 bg-green-500 rounded-lg"
//           style={{
//             width: `${calculateBarWidth(
//               visualizationType === "output" ? item.outWidth : item.inWidth,
//               maxWidth
//             )}%`,
//             left: "50%",
//             transform: "translateX(-50%)",
//             minWidth: '4px' // Ensure very small values are still visible
//           }}
//         ></div>
//         <div
//           className="absolute top-0 bottom-0 bg-green-500 rounded-lg"
//           style={{
//             width: `${calculateBarWidth(
//               visualizationType === "output" ? item.outWidth : item.inWidth,
//               maxWidth
//             )}%`,
//             right: "50%",
//             transform: "translateX(50%)",
//             minWidth: '4px' // Ensure very small values are still visible
//           }}
//         ></div>
//         <span className="absolute text-sm text-white w-full text-center font-medium"> {/* Larger text */}
//           {visualizationType === "output" ? item.outWidth : item.inWidth}
//         </span>
//       </div>
//     </div>
//   </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// with multiple sort functions 

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
// import { Button } from "@/components/ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getScheduleConfirmation, saveScheduleConfirmation, getNextScheduleNumber } from "@/app/actions/schedule";
// import { getRules } from "@/app/actions/ruleActions";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Prisma } from "@prisma/client";

// export default function ScheduleConfirmation() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedData, setSelectedData] = useState([]);
//   const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [rules, setRules] = useState([]);
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [showRuleDropdown, setShowRuleDropdown] = useState(false);
//   const [visualizationType, setVisualizationType] = useState("output");

//   const handleBack = () => {
//     router.push("/SchedulePool");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const scheduleNoFromParams = searchParams.get("scheduleNo");
//         const dataFromStorage = sessionStorage.getItem('selectedScheduleData');
//         if (dataFromStorage) {
//           const parsedData = JSON.parse(dataFromStorage);
//           setSelectedData(parsedData);
//           if (scheduleNoFromParams) {
//             setScheduleNo(scheduleNoFromParams);
//           } else {
//             const newScheduleNoResult = await getNextScheduleNumber();
//             if (!newScheduleNoResult.success) {
//               setError("Failed to generate new schedule number: " + newScheduleNoResult.error);
//             } else {
//               setScheduleNo(newScheduleNoResult.data);
//             }
//           }
//         } else if (scheduleNoFromParams) {
//           setScheduleNo(scheduleNoFromParams);
//           const result = await getScheduleConfirmation(scheduleNoFromParams);
//           if (result.success) {
//             setSelectedData(result.data);
//           } else {
//             setError("Failed to fetch schedule: " + result.error);
//           }
//         } else {
//           setError("No schedule data available");
//         }

//         const rulesResult = await getRules();
//         if (rulesResult.success) {
//           setRules(rulesResult.data);
//         } else {
//           setError("Failed to fetch rules: " + rulesResult.error);
//         }
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         setError("An error occurred while loading data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchParams]);

//   const handleFinalSchedule = async () => {
//     if (selectedData.length === 0) {
//       setError("No items to save.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const result = await saveScheduleConfirmation(scheduleNo, selectedData);
//       if (result.success) {
//         sessionStorage.removeItem('selectedScheduleData');
//         router.push("/SchedulePool");
//       } else {
//         setError("Failed to save final schedule: " + result.error);
//       }
//     } catch (error) {
//       console.error("Error saving schedule:", error);
//       setError("An unexpected error occurred while saving");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // via parameters old func
//   // const applyRulesAndSort = (rule) => {
//   //   console.log("Applying rule:", rule, "Data before sorting:", selectedData);
//   //   if (!rule || selectedData.length === 0) {
//   //     setError("No rule selected or no data to sort");
//   //     return;
//   //   }

//   //   let sortedData = [...selectedData];

//   //   // Primary Rules
//   //   const firstCoilThicknessMin = 3.5;
//   //   const firstCoilThicknessMax = 5;
//   //   const firstCoilWidthMin = 900;
//   //   const firstCoilWidthMax = 1100; //change back to 1100 after testing
//   //   const maxWidthJump = 150;
//   //   const maxWidthDown = 200;

//   //   try {
//   //     // Step 1: Find a valid first coil
//   //     const firstCoilCandidates = sortedData.filter(item => 
//   //       item.outThickness >= firstCoilThicknessMin &&
//   //       item.outThickness <= firstCoilThicknessMax &&
//   //       item.outWidth >= firstCoilWidthMin &&
//   //       item.outWidth <= firstCoilWidthMax
//   //     );

//   //     if (firstCoilCandidates.length === 0) {
//   //       setError("No coils meet initial requirements (Thickness: 3.5-5mm, Width: 900-1100mm)");
//   //       return;
//   //     }

//   //     const firstCoil = firstCoilCandidates[0];
//   //     sortedData = sortedData.filter(item => item !== firstCoil);

//   //     // Step 2: Sort by thickness and width for coffin shape
//   //     sortedData.sort((a, b) => 
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );

//   //     // Step 3: Split into ascending and descending halves
//   //     const midPoint = Math.floor(sortedData.length / 2);
//   //     let ascendingHalf = sortedData.slice(0, midPoint);
//   //     let descendingHalf = sortedData.slice(midPoint);

//   //     ascendingHalf.sort((a, b) => 
//   //       a.outThickness - b.outThickness || a.outWidth - b.outWidth
//   //     );
//   //     descendingHalf.sort((a, b) => 
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );

//   //     // Step 4: Combine into coffin shape
//   //     sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];

//   //     // Step 5: Basic validation of width jumps
//   //     for (let i = 1; i < sortedData.length; i++) {
//   //       const prev = sortedData[i - 1];
//   //       const curr = sortedData[i];
//   //       const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
//   //       if (widthDiff > maxWidthJump) {
//   //         console.warn(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
//   //       }
//   //       if (curr.outWidth < prev.outWidth && (prev.outWidth - curr.outWidth) > maxWidthDown) {
//   //         console.warn(`Width down exceeded at index ${i}`);
//   //       }
//   //     }

//   //     console.log("Data after sorting:", sortedData);
//   //     setSelectedData(sortedData); // Update state
//   //     setShowRuleDropdown(false);  // Close dropdown
//   //     setError(null);              // Clear any previous errors
//   //   } catch (error) {
//   //     console.error("Error in applyRulesAndSort:", error);
//   //     setError("Failed to apply rules: " + error.message);
//   //   }
//   // };

//   // via parameters new func
//   // const applyRulesAndSort = (rule) => {
//   //   console.log("Applying rule:", rule, "Data before sorting:", selectedData);
//   //   if (!rule || selectedData.length === 0) {
//   //     setError("No rule selected or no data to sort");
//   //     return;
//   //   }
  
//   //   let sortedData = [...selectedData];
  
//   //   // Primary Rules
//   //   const firstCoilThicknessMin = 3.5;
//   //   const firstCoilThicknessMax = 5;
//   //   const firstCoilWidthMin = 900;
//   //   const firstCoilWidthMax = 1100;
//   //   const maxWidthJump = 150;
//   //   const maxWidthDown = 200;
//   //   const maxSameWidthRolling = 40; // km
//   //   const maxTotalRollingLength = 80; // km
//   //   const maxTotalTonnage = 600; // tons
//   //   const maxCoils = 50;
  
//   //   const thicknessDownAllowed = [
//   //     [16, 12], [12, 10], [10, 8], [8, 6], [6, 4], [4, 2], [2, 1.2], [1.2, 0.6]
//   //   ];
//   //   const thicknessJumpAllowed = [
//   //     [2, 4], [4, 8], [8, 12], [12, 16], [16, 18]
//   //   ];
//   //   const gradeChangeAllowed = [
//   //     ["E250Br", "E350Br"],
//   //     ["E350Br", "E450Br"],
//   //     ["E450Br", "E150Br"],
//   //     ["E150Br", "API X"]
//   //   ];
  
//   //   try {
//   //     // Step 1: Find a valid first coil
//   //     const firstCoilCandidates = sortedData.filter(item => 
//   //       item.outThickness >= firstCoilThicknessMin &&
//   //       item.outThickness <= firstCoilThicknessMax &&
//   //       item.outWidth >= firstCoilWidthMin &&
//   //       item.outWidth <= firstCoilWidthMax
//   //     );
  
//   //     if (firstCoilCandidates.length === 0) {
//   //       setError("No coils meet initial requirements (Thickness: 3.5-5mm, Width: 900-1100mm)");
//   //       return;
//   //     }
  
//   //     const firstCoil = firstCoilCandidates[0];
//   //     sortedData = sortedData.filter(item => item !== firstCoil);
  
//   //     // Step 2: Sort by thickness and width for coffin shape
//   //     sortedData.sort((a, b) => 
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );
  
//   //     // Step 3: Split into ascending and descending halves
//   //     const midPoint = Math.floor(sortedData.length / 2);
//   //     let ascendingHalf = sortedData.slice(0, midPoint);
//   //     let descendingHalf = sortedData.slice(midPoint);
  
//   //     ascendingHalf.sort((a, b) => 
//   //       a.outThickness - b.outThickness || a.outWidth - b.outWidth
//   //     );
//   //     descendingHalf.sort((a, b) => 
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );
  
//   //     // Step 4: Combine into coffin shape
//   //     sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
  
//   //     // Step 5: Additional Validations
//   //     let totalRollingLength = 0;
//   //     let totalTonnage = 0;
//   //     let currentSameWidthRolling = 0;
//   //     let previousWidth = null;
  
//   //     for (let i = 0; i < sortedData.length; i++) {
//   //       const prev = sortedData[i - 1];
//   //       const curr = sortedData[i];
  
//   //       totalRollingLength += curr.rollingLength;
//   //       totalTonnage += curr.tonnage;
  
//   //       if (prev) {
//   //         // Width Jump and Down Validation
//   //         const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
//   //         if (widthDiff > maxWidthJump) {
//   //           setError(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
//   //           return;
//   //         }
//   //         if (curr.outWidth < prev.outWidth && (prev.outWidth - curr.outWidth) > maxWidthDown) {
//   //           setError(`Width down exceeded at index ${i}`);
//   //           return;
//   //         }
  
//   //         // Thickness Down Validation
//   //         if (!thicknessDownAllowed.some(([max, min]) => prev.outThickness === max && curr.outThickness === min)) {
//   //           setError(`Invalid thickness down transition at index ${i}: ${prev.outThickness} → ${curr.outThickness}`);
//   //           return;
//   //         }
  
//   //         // Thickness Jump Validation
//   //         if (!thicknessJumpAllowed.some(([min, max]) => prev.outThickness === min && curr.outThickness === max)) {
//   //           setError(`Invalid thickness jump at index ${i}: ${prev.outThickness} → ${curr.outThickness}`);
//   //           return;
//   //         }
  
//   //         // Grade Change Validation
//   //         if (!gradeChangeAllowed.some(([prevGrade, nextGrade]) => prev.grade === prevGrade && curr.grade === nextGrade)) {
//   //           setError(`Invalid grade change at index ${i}: ${prev.grade} → ${curr.grade}`);
//   //           return;
//   //         }
//   //       }
  
//   //       // Same Width Rolling Validation
//   //       if (curr.outWidth === previousWidth) {
//   //         currentSameWidthRolling += curr.rollingLength;
//   //         if (currentSameWidthRolling > maxSameWidthRolling) {
//   //           setError(`Same width rolling exceeded 40 km at index ${i}`);
//   //           return;
//   //         }
//   //       } else {
//   //         currentSameWidthRolling = curr.rollingLength;
//   //         previousWidth = curr.outWidth;
//   //       }
//   //     }
  
//   //     // Final Limits Check
//   //     if (totalRollingLength > maxTotalRollingLength) {
//   //       setError(`Total rolling length exceeded: ${totalRollingLength} km > ${maxTotalRollingLength} km`);
//   //       return;
//   //     }
//   //     if (totalTonnage > maxTotalTonnage) {
//   //       setError(`Total rolling tonnage exceeded: ${totalTonnage} tons > ${maxTotalTonnage} tons`);
//   //       return;
//   //     }
//   //     if (sortedData.length > maxCoils) {
//   //       setError(`Total number of coils exceeded: ${sortedData.length} > ${maxCoils}`);
//   //       return;
//   //     }
  
//   //     console.log("Data after sorting:", sortedData);
//   //     setSelectedData(sortedData); // Update state
//   //     setShowRuleDropdown(false);  // Close dropdown
//   //     setError(null);              // Clear any previous errors
//   //   } catch (error) {
//   //     console.error("Error in applyRulesAndSort:", error);
//   //     setError("Failed to apply rules: " + error.message);
//   //   }
//   // };
  

//   // via rules from DB
//   // const applyRulesAndSort = (rule) => {
//   //   console.log("Applying rule:", rule, "Data before sorting:", selectedData);
//   //   if (!rule || selectedData.length === 0) {
//   //     setError("No rule selected or no data to sort");
//   //     return;
//   //   }
  
//   //   let sortedData = [...selectedData];
  
//   //   // Hardcoded rules for the first coil
//   //   const firstCoilThicknessMin = 3.5;
//   //   const firstCoilThicknessMax = 5;
//   //   const firstCoilWidthMin = 900;
//   //   const firstCoilWidthMax = 1100;
  
//   //   try {
//   //     // Step 1: Find a valid first coil based on hardcoded rules
//   //     const firstCoilCandidates = sortedData.filter(item =>
//   //       item.outThickness >= firstCoilThicknessMin &&
//   //       item.outThickness <= firstCoilThicknessMax &&
//   //       item.outWidth >= firstCoilWidthMin &&
//   //       item.outWidth <= firstCoilWidthMax
//   //     );
  
//   //     if (firstCoilCandidates.length === 0) {
//   //       setError("No coils meet initial requirements (Thickness: 3.5-5mm, Width: 900-1100mm)");
//   //       return;
//   //     }
  
//   //     const firstCoil = firstCoilCandidates[0];
//   //     sortedData = sortedData.filter(item => item !== firstCoil);
  
//   //     // Step 2: Apply dynamic rules from ScheduleRuleConfiguration
//   //     const maxWidthJump = rule.criteria.find(crit => crit.criteria === "Max Width Jump")?.parameterValue
//   //       ? parseFloat(rule.criteria.find(crit => crit.criteria === "Max Width Jump").parameterValue)
//   //       : 150; // Default value if not specified
//   //     const maxWidthDown = rule.criteria.find(crit => crit.criteria === "Max Width Down")?.parameterValue
//   //       ? parseFloat(rule.criteria.find(crit => crit.criteria === "Max Width Down").parameterValue)
//   //       : 200; // Default value if not specified
  
//   //     // Step 3: Sort remaining data by thickness and width for coffin shape
//   //     sortedData.sort((a, b) =>
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );
  
//   //     // Step 4: Split into ascending and descending halves
//   //     const midPoint = Math.floor(sortedData.length / 2);
//   //     let ascendingHalf = sortedData.slice(0, midPoint);
//   //     let descendingHalf = sortedData.slice(midPoint);
  
//   //     // Sort ascending half (gradual increase)
//   //     ascendingHalf.sort((a, b) =>
//   //       a.outThickness - b.outThickness || a.outWidth - b.outWidth
//   //     );
  
//   //     // Sort descending half (gradual decrease)
//   //     descendingHalf.sort((a, b) =>
//   //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   //     );
  
//   //     // Step 5: Combine into coffin shape: first coil, ascending, descending
//   //     sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
  
//   //     // Step 6: Validate width jumps and width down using dynamic rules
//   //     for (let i = 1; i < sortedData.length; i++) {
//   //       const prev = sortedData[i - 1];
//   //       const curr = sortedData[i];
//   //       const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
  
//   //       if (widthDiff > maxWidthJump) {
//   //         console.warn(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
//   //         setError(`Width jump exceeded between coils ${i-1} and ${i}: ${widthDiff}mm > ${maxWidthJump}mm`);
//   //         return;
//   //       }
  
//   //       if (curr.outWidth < prev.outWidth && (prev.outWidth - curr.outWidth) > maxWidthDown) {
//   //         console.warn(`Width down exceeded at index ${i}: ${prev.outWidth - curr.outWidth} > ${maxWidthDown}`);
//   //         setError(`Width decrease exceeded between coils ${i-1} and ${i}: ${prev.outWidth - curr.outWidth}mm > ${maxWidthDown}mm`);
//   //         return;
//   //       }
//   //     }
  
//   //     console.log("Data after sorting:", sortedData);
//   //     setSelectedData(sortedData); // Update state with sorted data
//   //     setShowRuleDropdown(false);  // Close dropdown
//   //     setError(null);              // Clear any previous errors
//   //   } catch (error) {
//   //     console.error("Error in applyRulesAndSort:", error);
//   //     setError("Failed to apply rules: " + error.message);
//   //   }
//   // };


//   // // via rules from DB new func

//   // // const applyRulesAndSort = async (rule) => {
//   // //   console.log("Applying rule:", rule, "Data before sorting:", selectedData);
//   // //   if (!rule || selectedData.length === 0) {
//   // //     setError("No rule selected or no data to sort");
//   // //     return;
//   // //   }
  
//   // //   try {
//   // //     let sortedData = [...selectedData];
  
//   // //     // Fixed values for first coil criteria
//   // //     const firstCoilThicknessMin = 3.5;
//   // //     const firstCoilThicknessMax = 5;
//   // //     const firstCoilWidthMin = 900;
//   // //     const firstCoilWidthMax = 1100;
  
//   // //     // Fetch all the rules from database based on the selected rule
//   // //     const ruleDetails = await fetchRuleDetails(rule.ruleName);
      
//   // //     // Step 1: Find a valid first coil using fixed criteria
//   // //     const firstCoilCandidates = sortedData.filter(item => 
//   // //       item.outThickness >= firstCoilThicknessMin &&
//   // //       item.outThickness <= firstCoilThicknessMax &&
//   // //       item.outWidth >= firstCoilWidthMin &&
//   // //       item.outWidth <= firstCoilWidthMax
//   // //     );
  
//   // //     if (firstCoilCandidates.length === 0) {
//   // //       setError(`No coils meet initial requirements (Thickness: ${firstCoilThicknessMin}-${firstCoilThicknessMax}mm, Width: ${firstCoilWidthMin}-${firstCoilWidthMax}mm)`);
//   // //       return;
//   // //     }
  
//   // //     const firstCoil = firstCoilCandidates[0];
//   // //     sortedData = sortedData.filter(item => item !== firstCoil);
  
//   // //     // Step 2: Sort by thickness and width for coffin shape
//   // //     sortedData.sort((a, b) => 
//   // //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   // //     );
  
//   // //     // Step 3: Split into ascending and descending halves
//   // //     const midPoint = Math.floor(sortedData.length / 2);
//   // //     let ascendingHalf = sortedData.slice(0, midPoint);
//   // //     let descendingHalf = sortedData.slice(midPoint);
  
//   // //     ascendingHalf.sort((a, b) => 
//   // //       a.outThickness - b.outThickness || a.outWidth - b.outWidth
//   // //     );
//   // //     descendingHalf.sort((a, b) => 
//   // //       b.outThickness - a.outThickness || b.outWidth - a.outWidth
//   // //     );
  
//   // //     // Step 4: Combine into coffin shape
//   // //     sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
  
//   // //     // Step 5: Apply rules and validations
//   // //     await applyRuleValidations(sortedData, ruleDetails);
  
//   // //     console.log("Data after sorting:", sortedData);
//   // //     setSelectedData(sortedData); // Update state
//   // //     setShowRuleDropdown(false);  // Close dropdown
//   // //     setError(null);              // Clear any previous errors
//   // //   } catch (error) {
//   // //     console.error("Error in applyRulesAndSort:", error);
//   // //     setError("Failed to apply rules: " + error.message);
//   // //   }
//   // // };


  
//   //new via quen
//   // const applyRulesAndSort = async (ruleName) => {
//   //   console.log("Applying rule:", ruleName, "Data before sorting:", selectedData);
  
//   //   if (!ruleName || selectedData.length === 0) {
//   //     setError("No rule selected or no data to sort");
//   //     return;
//   //   }
  
//   //   // Fetch rules from the database
//   //   const rules = await fetchRules();
//   //   if (!rules) return;
  
//   //   // Find the specific rule by ruleName
//   //   const selectedRule = rules.find((rule) => rule.ruleName === ruleName);
//   //   if (!selectedRule) {
//   //     setError(`Rule "${ruleName}" not found`);
//   //     return;
//   //   }
  
//   //   let sortedData = [...selectedData];
//   //   try {
//   //     // Extract enabled criteria for the selected rule
//   //     const criteria = selectedRule.criteria.filter((crit) => crit.parameterStatus === "Enable");
  
//   //     // Helper function to check if a value falls within a range
//   //     const isWithinRange = (value, min, max) => {
//   //       return value >= parseFloat(min) && value <= parseFloat(max);
//   //     };
  
//   //     // Step 1: Find a valid first coil
//   //     const firstCoilCandidates = sortedData.filter((item) => {
//   //       return criteria.every((crit) => {
//   //         const { criteria: field, parameterType, parameterValue, ranges } = crit;
  
//   //         if (parameterType === "Input Value") {
//   //           // Exact match for input values
//   //           return item[field] == parameterValue;
//   //         } else if (parameterType === "Range" && ranges.length > 0) {
//   //           // Check if the value falls within any of the ranges
//   //           return ranges.some((range) =>
//   //             isWithinRange(item[field], range.parameterMin, range.parameterMax)
//   //           );
//   //         }
//   //         return true; // Default to true if no condition matches
//   //       });
//   //     });
  
//   //     console.log("First coil candidates:", firstCoilCandidates); // Debugging log
  
//   //     if (firstCoilCandidates.length === 0) {
//   //       setError("No coils meet the initial requirements based on the selected rule");
//   //       return;
//   //     }
  
//   //     // Prioritize by grade order if multiple candidates exist
//   //     const gradeChangeAllowed = criteria
//   //       .find((crit) => crit.criteria === "Grade Change")
//   //       ?.ranges.map((range) => [range.parameterMin, range.parameterMax]) || [];
//   //     const gradeOrder = gradeChangeAllowed.flat();
  
//   //     const getGradePriority = (grade, gradeOrder) => {
//   //       return gradeOrder.indexOf(grade);
//   //     };
  
//   //     firstCoilCandidates.sort((a, b) => {
//   //       const priorityA = getGradePriority(a.outGrade, gradeOrder);
//   //       const priorityB = getGradePriority(b.outGrade, gradeOrder);
//   //       return priorityA - priorityB;
//   //     });
  
//   //     const firstCoil = firstCoilCandidates[0];
//   //     sortedData = sortedData.filter((item) => item !== firstCoil);
  
//   //     // Step 2: Sort by thickness and width for coffin shape
//   //     sortedData.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth);
  
//   //     // Step 3: Split into ascending and descending halves
//   //     const midPoint = Math.floor(sortedData.length / 2);
//   //     let ascendingHalf = sortedData.slice(0, midPoint);
//   //     let descendingHalf = sortedData.slice(midPoint);
  
//   //     ascendingHalf.sort((a, b) => a.outThickness - b.outThickness || a.outWidth - b.outWidth);
//   //     descendingHalf.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth);
  
//   //     // Step 4: Combine into coffin shape
//   //     sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
  
//   //     // Step 5: Additional validations (same as before)
//   //     let totalRollingLength = 0;
//   //     let totalTonnage = 0;
//   //     let currentSameWidthRolling = 0;
//   //     let previousWidth = null;
  
//   //     for (let i = 0; i < sortedData.length; i++) {
//   //       const prev = sortedData[i - 1];
//   //       const curr = sortedData[i];
  
//   //       totalRollingLength += curr.rollingLength;
//   //       totalTonnage += curr.tonnage;
  
//   //       if (prev) {
//   //         // Validate transitions based on criteria
//   //         const isValidTransition = criteria.every((crit) => {
//   //           const { criteria: field, parameterType, ranges } = crit;
  
//   //           if (parameterType === "Range" && ranges.length > 0) {
//   //             return ranges.some((range) =>
//   //               isWithinRange(curr[field], range.parameterMin, range.parameterMax)
//   //             );
//   //           }
//   //           return true; // Default to true if no condition matches
//   //         });
  
//   //         if (!isValidTransition) {
//   //           setError(`Invalid transition at index ${i}`);
//   //           return;
//   //         }
//   //       }
  
//   //       if (curr.outWidth === previousWidth) {
//   //         currentSameWidthRolling += curr.rollingLength;
//   //         const maxSameWidthRolling = parseFloat(
//   //           criteria.find((c) => c.criteria === "maxSameWidthRolling")?.parameterValue || 40
//   //         );
//   //         if (currentSameWidthRolling > maxSameWidthRolling) {
//   //           setError(`Same width rolling exceeded at index ${i}`);
//   //           return;
//   //         }
//   //       } else {
//   //         currentSameWidthRolling = curr.rollingLength;
//   //         previousWidth = curr.outWidth;
//   //       }
//   //     }
  
//   //     // Final limits check
//   //     const maxTotalRollingLength = parseFloat(
//   //       criteria.find((c) => c.criteria === "maxTotalRollingLength")?.parameterValue || 80
//   //     );
//   //     const maxTotalTonnage = parseFloat(
//   //       criteria.find((c) => c.criteria === "maxTotalTonnage")?.parameterValue || 600
//   //     );
//   //     const maxCoils = parseInt(
//   //       criteria.find((c) => c.criteria === "maxCoils")?.parameterValue || 50
//   //     );
  
//   //     if (totalRollingLength > maxTotalRollingLength) {
//   //       setError(`Total rolling length exceeded: ${totalRollingLength} km > ${maxTotalRollingLength} km`);
//   //       return;
//   //     }
//   //     if (totalTonnage > maxTotalTonnage) {
//   //       setError(`Total rolling tonnage exceeded: ${totalTonnage} tons > ${maxTotalTonnage} tons`);
//   //       return;
//   //     }
//   //     if (sortedData.length > maxCoils) {
//   //       setError(`Total number of coils exceeded: ${sortedData.length} > ${maxCoils}`);
//   //       return;
//   //     }
  
//   //     // Update state and clear errors
//   //     console.log("Data after sorting:", sortedData);
//   //     setSelectedData(sortedData);
//   //     setShowRuleDropdown(false);
//   //     setError(null);
//   //   } catch (error) {
//   //     console.error("Error in applyRulesAndSort:", error);
//   //     setError("Failed to apply rules: " + error.message);
//   //   }
//   // };


//   // grok - 
//   const applyRulesAndSort = async (ruleName) => {
//     console.log("Applying rule:", ruleName, "Data before sorting:", selectedData);
  
//     if (!ruleName || selectedData.length === 0) {
//       setError("No rule selected or no data to sort");
//       return;
//     }
  
//     // Fetch rules from the database
//     const rules = await fetchRules();
//     if (!rules) return;
  
//     // Find the specific rule by ruleName
//     const selectedRule = rules.find((rule) => rule.ruleName === ruleName);
//     if (!selectedRule) {
//       setError(`Rule "${ruleName}" not found`);
//       return;
//     }
  
//     let sortedData = [...selectedData];
//     try {
//       // Step 1: Extract enabled criteria and their ranges/values
//       const criteria = selectedRule.criteria.filter((crit) => crit.parameterStatus === "Enable");
//       const criteriaMap = new Map(criteria.map(crit => [crit.criteria, crit]));
  
//       // Helper function to check if a value is within a range
//       const isWithinRange = (value, min, max) => {
//         if (min === null || max === null) return false;
//         const numValue = parseFloat(value);
//         const numMin = parseFloat(min);
//         const numMax = parseFloat(max);
//         return !isNaN(numValue) && numValue >= numMin && numValue <= numMax;
//       };
  
//       // Helper function to check if a grade transition is valid
//       const isValidGradeTransition = (prevGrade, currGrade, gradeRanges) => {
//         if (!prevGrade || gradeRanges.length === 0) return true;
//         const gradeOrder = gradeRanges.map(range => ({ from: range.parameterMin, to: range.parameterMax }));
//         const prevIndex = gradeOrder.findIndex(g => g.from === prevGrade);
//         if (prevIndex === -1) return true; // No restriction if previous grade isn't in the sequence
//         return gradeOrder[prevIndex].to === currGrade;
//       };
  
//       // Helper function to check if a thickness transition is valid
//       const isValidThicknessTransition = (prevThickness, currThickness, ranges, isJump) => {
//         if (!ranges || ranges.length === 0) return true;
//         const prevNum = parseFloat(prevThickness);
//         const currNum = parseFloat(currThickness);
//         return ranges.some(range => {
//           const min = parseFloat(range.parameterMin);
//           const max = parseFloat(range.parameterMax);
//           if (isJump) {
//             // For "Thickness jump" (ascending), prev must be in range and curr must be next range
//             return prevNum >= min && prevNum <= max && currNum > max && currNum <= parseFloat(ranges[ranges.indexOf(range) + 1]?.parameterMax || Infinity);
//           } else {
//             // For "Thickness down" (descending), curr must be in range and prev must be previous range
//             return currNum >= min && currNum <= max && prevNum > min && prevNum <= parseFloat(ranges[ranges.indexOf(range) - 1]?.parameterMax || Infinity);
//           }
//         });
//       };
  
//       // Step 2: Select the first coil based on Initial Thickness, Width range, and Grade change priority
//       const initialThicknessCrit = criteriaMap.get("Initial Thickness");
//       const widthRangeCrit = criteriaMap.get("Width range");
//       const gradeChangeCrit = criteriaMap.get("Grade change");
  
//       const firstCoilCandidates = sortedData.filter(item => {
//         const thicknessMatch = initialThicknessCrit?.parameterType === "Range" && initialThicknessCrit.ranges.length > 0
//           ? initialThicknessCrit.ranges.some(range => isWithinRange(item.outThickness, range.parameterMin, range.parameterMax))
//           : true;
//         const widthMatch = widthRangeCrit?.parameterType === "Range" && widthRangeCrit.ranges.length > 0
//           ? widthRangeCrit.ranges.some(range => isWithinRange(item.outWidth, range.parameterMin, range.parameterMax))
//           : true;
//         return thicknessMatch && widthMatch;
//       });
  
//       if (firstCoilCandidates.length === 0) {
//         setError("No coils meet the Initial Thickness and Width range requirements");
//         return;
//       }
  
//       // Prioritize by grade if multiple candidates
//       let firstCoil;
//       if (firstCoilCandidates.length > 1 && gradeChangeCrit?.ranges.length > 0) {
//         const gradeOrder = gradeChangeCrit.ranges.map(range => range.parameterMin);
//         firstCoil = firstCoilCandidates.reduce((prev, curr) => {
//           const prevGradeIndex = gradeOrder.indexOf(prev.grade);
//           const currGradeIndex = gradeOrder.indexOf(curr.grade);
//           if (prevGradeIndex === -1) return curr;
//           if (currGradeIndex === -1) return prev;
//           return currGradeIndex < prevGradeIndex ? curr : prev;
//         });
//       } else {
//         firstCoil = firstCoilCandidates[0];
//       }
  
//       sortedData = sortedData.filter(item => item !== firstCoil);
  
//       // Step 3: Sort remaining coils into ascending and descending halves for coffin shape
//       sortedData.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth); // Sort by thickness, then width descending
//       const midPoint = Math.floor(sortedData.length / 2);
//       let ascendingHalf = sortedData.slice(0, midPoint);
//       let descendingHalf = sortedData.slice(midPoint);
  
//       ascendingHalf.sort((a, b) => a.outThickness - b.outThickness || a.outWidth - b.outWidth); // Ascending
//       descendingHalf.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth); // Descending
  
//       // Step 4: Combine into coffin shape and validate transitions
//       sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
//       let totalRollingLength = 0;
//       let totalTonnage = 0;
//       let currentSameWidthRolling = 0;
//       let previousWidth = null;
//       let previousGrade = null;
//       let previousThickness = null;
  
//       for (let i = 0; i < sortedData.length; i++) {
//         const prev = sortedData[i - 1];
//         const curr = sortedData[i];
  
//         totalRollingLength += curr.rollingLength || 0;
//         totalTonnage += curr.tonnage || 0;
  
//         if (prev) {
//           // Width jump limit
//           const widthJumpCrit = criteriaMap.get("Width jump");
//           if (widthJumpCrit?.parameterType === "Input Value" && widthJumpCrit.parameterValue) {
//             const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
//             if (widthDiff > parseFloat(widthJumpCrit.parameterValue)) {
//               setError(`Width jump exceeded at index ${i}: ${widthDiff} > ${widthJumpCrit.parameterValue}`);
//               return;
//             }
//           }
  
//           // Width Down limit (assuming it’s a max decrease)
//           const widthDownCrit = criteriaMap.get("Width Down");
//           if (widthDownCrit?.parameterType === "Input Value" && widthDownCrit.parameterValue) {
//             const widthDecrease = prev.outWidth - curr.outWidth;
//             if (widthDecrease > parseFloat(widthDownCrit.parameterValue)) {
//               setError(`Width decrease exceeded at index ${i}: ${widthDecrease} > ${widthDownCrit.parameterValue}`);
//               return;
//             }
//           }
  
//           // Thickness jump validation
//           const thicknessJumpCrit = criteriaMap.get("Thickness jump");
//           if (thicknessJumpCrit?.parameterType === "Range" && thicknessJumpCrit.ranges.length > 0 && curr.outThickness > prev.outThickness) {
//             if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessJumpCrit.ranges, true)) {
//               setError(`Invalid thickness jump at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
//               return;
//             }
//           }
  
//           // Thickness down validation
//           const thicknessDownCrit = criteriaMap.get("Thickness down");
//           if (thicknessDownCrit?.parameterType === "Range" && thicknessDownCrit.ranges.length > 0 && curr.outThickness < prev.outThickness) {
//             if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessDownCrit.ranges, false)) {
//               setError(`Invalid thickness decrease at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
//               return;
//             }
//           }
  
//           // Grade change validation
//           const gradeChangeCrit = criteriaMap.get("Grade change");
//           if (gradeChangeCrit?.parameterType === "Range" && gradeChangeCrit.ranges.length > 0) {
//             if (!isValidGradeTransition(prev.grade, curr.grade, gradeChangeCrit.ranges)) {
//               setError(`Invalid grade transition at index ${i}: ${prev.grade} to ${curr.grade}`);
//               return;
//             }
//           }
  
//           // Same Width limitaRolling
//           const sameWidthCrit = criteriaMap.get("Same Width limitaRolling");
//           if (curr.outWidth === previousWidth) {
//             currentSameWidthRolling += curr.rollingLength || 0;
//             const maxSameWidth = parseFloat(sameWidthCrit?.parameterValue || 40);
//             if (currentSameWidthRolling > maxSameWidth) {
//               setError(`Same width rolling exceeded at index ${i}: ${currentSameWidthRolling} > ${maxSameWidth}`);
//               return;
//             }
//           } else {
//             currentSameWidthRolling = curr.rollingLength || 0;
//             previousWidth = curr.outWidth;
//           }
  
//           previousGrade = curr.grade;
//           previousThickness = curr.outThickness;
//         } else {
//           previousWidth = curr.outWidth;
//           previousGrade = curr.grade;
//           previousThickness = curr.outThickness;
//         }
//       }
  
//       // Step 5: Final limits check
//       const rollingLengthCrit = criteriaMap.get("Rolling Length");
//       const tonnageCrit = criteriaMap.get("Tonnage");
//       const coilsCrit = criteriaMap.get("Number of coils");
  
//       const maxRollingLength = parseFloat(rollingLengthCrit?.parameterValue || 80);
//       const maxTonnage = parseFloat(tonnageCrit?.parameterValue || 600);
//       const maxCoils = parseInt(coilsCrit?.parameterValue || 50);
  
//       if (totalRollingLength > maxRollingLength) {
//         setError(`Total rolling length exceeded: ${totalRollingLength} km > ${maxRollingLength} km`);
//         return;
//       }
//       if (totalTonnage > maxTonnage) {
//         setError(`Total tonnage exceeded: ${totalTonnage} tons > ${maxTonnage} tons`);
//         return;
//       }
//       if (sortedData.length > maxCoils) {
//         setError(`Total number of coils exceeded: ${sortedData.length} > ${maxCoils}`);
//         return;
//       }
  
//       // Step 6: Update state and clear errors
//       console.log("Data after sorting:", sortedData);
//       setSelectedData(sortedData);
//       setShowRuleDropdown(false);
//       setError(null);
//     } catch (error) {
//       console.error("Error in applyRulesAndSort:", error);
//       setError("Failed to apply rules: " + error.message);
//     }
//   };

//   const fetchRules = async () => {
//     try {
//       const response = await getRules();
//       if (response.success) {
//         return response.data; // Array of rules with criteria and ranges
//       } else {
//         console.error("Failed to fetch rules:", response.error);
//         setError("Failed to fetch rules: " + response.error);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching rules:", error);
//       setError("An unexpected error occurred while fetching rules");
//       return null;
//     }
//   };


//   const handleRuleSelection = (selectedRule) => {
//     const ruleName = selectedRule.ruleName; // Extract only the ruleName
//     applyRulesAndSort(ruleName); // Pass only the ruleName string
//   };


//   const handleAssignRule = () => {
//     console.log("Toggling rule dropdown");
//     setShowRuleDropdown(prev => !prev);
//   };


//   const calculateBarWidth = (value, maxValue) => {
//     if (!value) return 0;
//     const percentage = (parseFloat(value) / maxValue) * 220;
//     return Math.max(percentage, 5);
//   };

//   const getMaxValues = () => {
//     if (selectedData.length === 0) return { maxThickness: 15, maxWidth: 1800 };
//     const maxOutThickness = Math.max(...selectedData.map(item => parseFloat(item.outThickness) || 0));
//     const maxInThickness = Math.max(...selectedData.map(item => parseFloat(item.inThickness) || 0));
//     const maxOutWidth = Math.max(...selectedData.map(item => parseFloat(item.outWidth) || 0));
//     const maxInWidth = Math.max(...selectedData.map(item => parseFloat(item.inWidth) || 0));
//     return {
//       maxThickness: Math.max(maxOutThickness, maxInThickness, 15) * 1.2,
//       maxWidth: Math.max(maxOutWidth, maxInWidth, 1800) * 1.2
//     };
//   };
//   const { maxThickness, maxWidth } = getMaxValues();

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
//       <div className="w-full max-w-[1600px]">
//         <h1 className="text-3xl font-bold mb-6 text-white text-center">
//           Schedule Confirmation - {scheduleNo}
//         </h1>

//         <div className="mb-6 flex items-center justify-between">
//           <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Back
//           </Button>
//           <div className="flex space-x-4">
//       {/* Assign Rule Button with Dropdown */}
//       <div className="relative">
//         <Button
//           onClick={handleAssignRule}
//           className="bg-yellow-600 text-white hover:bg-yellow-700 px-4 py-2 rounded-md"
//           disabled={loading || selectedData.length === 0}
//         >
//           Assign Rule
//         </Button>

//         {/* Dropdown List */}
//         {showRuleDropdown && (
//           <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg overflow-hidden">
//             {rules.length === 0 ? (
//               <p className="text-white p-3 text-center">No rules available</p>
//             ) : (
//               rules.map((rule, index) => (
//                 <button
//                   key={rule.ruleName || `rule-${index}`}
//                   onClick={() => handleRuleSelection(rule)}
//                   className={`block w-full text-left px-4 py-2 text-white transition-all ${
//                     selectedRule?.ruleName === rule.ruleName
//                       ? "bg-blue-500"
//                       : "hover:bg-gray-700"
//                   }`}
//                 >
//                   {rule.ruleName || `Rule ${index + 1}`}
//                 </button>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Final Schedule Button */}
//       <Button
//         onClick={handleFinalSchedule}
//         className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
//         disabled={saving || loading || selectedData.length === 0}
//       >
//         {saving ? "Saving..." : "Final Schedule"}
//       </Button>
//               </div>

//             </div>

//             {!loading && !error && (
//             <div className="mb-6 p-4 rounded-lg flex justify-end">
//               <Tabs
//                 defaultValue="output"
//                 value={visualizationType}
//                 onValueChange={setVisualizationType}
//                 className="w-full"
//               >
//                 <TabsList className="grid grid-cols-2 w-64 left-0 bg-gray-300 rounded-xl mt-4 ml-auto ">
//                   <TabsTrigger
//                     value="output"
//                     className={`text-black px-4  rounded-lg transition-all ${
//                       visualizationType === "output" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
//                     }`}
//                   >
//                     Output Values
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="input"
//                     className={`text-black px-4  rounded-lg transition-all ${
//                       visualizationType === "input" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
//                     }`}
//                   >
//                     Input Values
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             )}

//         {loading ? (
//           <p className="text-white text-center">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Schedule No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Order No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Out Mat No</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>Out Material</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>In Material</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={2}>Visualization</TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Actual Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Thickness Graph</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Width Graph</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={14} className="text-white text-center py-2 border-t border-gray-600">
//                         No items found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     selectedData.map((item, index) => (
//                       <TableRow key={index} className="border-b border-gray-600">
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{scheduleNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600NJ">{item.orderNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outMaterialNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outThickness ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outWidth ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outGrade ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outCoilWeight ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inMatNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inThickness}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inWidth}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inGrade}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inactualWeight}</TableCell>
//                         <TableCell className="px-4 py-2 border-r border-gray-600">
//                           <div className="flex items-center h-10">
//                             <div className="w-full h-5 bg-gray-900 rounded-lg relative">
//                               <div
//                                 className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
//                                 style={{
//                                   width: `${calculateBarWidth(
//                                     visualizationType === "output" ? item.outThickness : item.inThickness,
//                                     maxThickness
//                                   )}%`,
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   minWidth: '4px'
//                                 }}
//                               ></div>
//                               <span className="absolute text-sm text-white w-full text-center font-medium">
//                                 {visualizationType === "output" ? item.outThickness : item.inThickness}
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="px-4 py-2 border-r border-gray-600">
//                           <div className="flex items-center h-10">
//                             <div className="w-full h-5 bg-gray-900 rounded-lg relative">
//                               <div
//                                 className="absolute top-0 bottom-0 bg-green-500 rounded-lg"
//                                 style={{
//                                   width: `${calculateBarWidth(
//                                     visualizationType === "output" ? item.outWidth : item.inWidth,
//                                     maxWidth
//                                   )}%`,
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   minWidth: '4px'
//                                 }}
//                               ></div>
//                               <span className="absolute text-sm text-white w-full text-center font-medium">
//                                 {visualizationType === "output" ? item.outWidth : item.inWidth}
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         )}
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
// import { Button } from "@/components/ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getScheduleConfirmation, saveScheduleConfirmation, getNextScheduleNumber } from "@/app/actions/schedule";
// import { getRules } from "@/app/actions/ruleActions";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function ScheduleConfirmation() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedData, setSelectedData] = useState([]);
//   const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [rules, setRules] = useState([]);
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [showRuleDropdown, setShowRuleDropdown] = useState(false);
//   const [visualizationType, setVisualizationType] = useState("output");

//   const handleBack = () => {
//     router.push("/SchedulePool");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const scheduleNoFromParams = searchParams.get("scheduleNo");
//         const dataFromStorage = sessionStorage.getItem("selectedScheduleData");
//         if (dataFromStorage) {
//           const parsedData = JSON.parse(dataFromStorage);
//           setSelectedData(parsedData);
//           if (scheduleNoFromParams) {
//             setScheduleNo(scheduleNoFromParams);
//           } else {
//             const newScheduleNoResult = await getNextScheduleNumber();
//             if (!newScheduleNoResult.success) {
//               setError("Failed to generate new schedule number: " + newScheduleNoResult.error);
//             } else {
//               setScheduleNo(newScheduleNoResult.data);
//             }
//           }
//         } else if (scheduleNoFromParams) {
//           setScheduleNo(scheduleNoFromParams);
//           const result = await getScheduleConfirmation(scheduleNoFromParams);
//           if (result.success) {
//             setSelectedData(result.data);
//           } else {
//             setError("Failed to fetch schedule: " + result.error);
//           }
//         } else {
//           setError("No schedule data available");
//         }

//         const rulesResult = await getRules();
//         if (rulesResult.success) {
//           setRules(rulesResult.data);
//         } else {
//           setError("Failed to fetch rules: " + rulesResult.error);
//         }
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         setError("An error occurred while loading data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchParams]);


//   const applyRulesAndSort = async (ruleName) => {
//     console.log("Applying rule:", ruleName, "Data before sorting:", selectedData);
//     if (!ruleName || selectedData.length === 0) {
//       setError("No rule selected or no data to sort");
//       return;
//     }

//     const rulesResult = await getRules();
//     if (!rulesResult.success) {
//       setError("Failed to fetch rules: " + rulesResult.error);
//       return;
//     }

//     const selectedRule = rulesResult.data.find((rule) => rule.ruleName === ruleName);
//     if (!selectedRule) {
//       setError(`Rule "${ruleName}" not found`);
//       return;
//     }

//     let sortedData = [...selectedData];

//     try {
//       // Step 1: Parse enabled criteria into a map
//       const criteriaMap = new Map(
//         selectedRule.criteria
//           .filter((crit) => crit.parameterStatus === "Enable")
//           .map((crit) => [
//             crit.criteria,
//             {
//               value: crit.parameterValue ? parseFloat(crit.parameterValue) : null,
//               ranges: crit.parameterType === "Range" ? crit.ranges.map((r) => ({
//                 min: r.parameterMin ? parseFloat(r.parameterMin) : null,
//                 max: r.parameterMax ? parseFloat(r.parameterMax) : null,
//               })) : [],
//             },
//           ])
//       );
//       console.log("=== CRITERIA MAP ===");
//       console.log("Initial Thickness rules:", criteriaMap.get("Initial Thickness"));
//       console.log("Width range rules:", criteriaMap.get("Width range"));
//       console.log("====================");
//       // Helper Functions
//       const isWithinRange = (value, ranges) => {
//         if (!ranges.length) return true;
//         const numValue = parseFloat(value);
//         return ranges.some((range) => numValue >= range.min && numValue <= range.max);
//       };

//       const isValidGradeTransition = (prevGrade, currGrade, ranges) => {
//         if (!ranges.length) return true;
//         const gradeOrder = ranges.map((r) => ({ from: r.parameterMin, to: r.parameterMax }));
//         const transition = gradeOrder.find((g) => g.from === prevGrade);
//         return !transition || transition.to === currGrade;
//       };

//       // const isValidThicknessTransition = (prevThickness, currThickness, ranges, isJump) => {
//       //   if (!ranges.length) return true;
//       //   const prevNum = parseFloat(prevThickness);
//       //   const currNum = parseFloat(currThickness);
//       //   const sortedRanges = ranges.slice().sort((a, b) => a.min - b.min);
//       //   if (isJump) { // Ascending
//       //     const prevRange = sortedRanges.find((r) => prevNum >= r.min && prevNum <= r.max);
//       //     if (!prevRange) return false;
//       //     const nextRange = sortedRanges[sortedRanges.indexOf(prevRange) + 1];
//       //     return nextRange && currNum >= nextRange.min && currNum <= nextRange.max;
//       //   } else { // Descending
//       //     const currRange = sortedRanges.find((r) => currNum >= r.min && currNum <= r.max);
//       //     if (!currRange) return false;
//       //     const prevRange = sortedRanges[sortedRanges.indexOf(currRange) - 1];
//       //     return prevRange && prevNum >= prevRange.min && prevNum <= prevRange.max;
//       //   }
//       // };

//       const isValidThicknessTransition = (prevThickness, currThickness, ranges, isJump) => {
//         if (!ranges.length) return true; // No rules means all transitions allowed
        
//         const prevNum = parseFloat(prevThickness);
//         const currNum = parseFloat(currThickness);
        
//         // Find which range each thickness belongs to
//         const prevRangeIndex = ranges.findIndex(r => 
//           prevNum <= Math.max(r.min, r.max) && 
//           prevNum >= Math.min(r.min, r.max)
//         );
        
//         const currRangeIndex = ranges.findIndex(r => 
//           currNum <= Math.max(r.min, r.max) && 
//           currNum >= Math.min(r.min, r.max)
//         );
        
//         console.log(`Transition check: ${prevNum}->${currNum}`);
//         console.log(`Prev range index: ${prevRangeIndex}`, ranges[prevRangeIndex]);
//         console.log(`Curr range index: ${currRangeIndex}`, ranges[currRangeIndex]);
        
//         // If either thickness doesn't fit in any range, invalid
//         if (prevRangeIndex === -1 || currRangeIndex === -1) {
//           console.log('Invalid - thickness outside all ranges');
//           return false;
//         }
        
//         // For thickness downs (decreasing), we allow:
//         // 1. Staying in the same range
//         // 2. Moving to the next higher index range (lower thickness range)
//         if (!isJump) {
//           const isValid = currRangeIndex >= prevRangeIndex;
//           console.log(`Thickness down valid: ${isValid}`);
//           return isValid;
//         }
//         // For jumps (increasing), we allow:
//         // 1. Staying in the same range
//         // 2. Moving to the next lower index range (higher thickness range)
//         else {
//           const isValid = currRangeIndex <= prevRangeIndex;
//           console.log(`Thickness jump valid: ${isValid}`);
//           return isValid;
//         }
//       };
//       // Step 2: Select First Coil
//       const initialThicknessRanges = criteriaMap.get("Initial Thickness")?.ranges || [];
//       const initialWidthRanges = criteriaMap.get("Width range")?.ranges || [];
//       const gradeChangeRanges = criteriaMap.get("Grade change")?.ranges || [];
//       console.log("Applying Initial Thickness ranges:", initialThicknessRanges);
// console.log("Applying Width ranges:", initialWidthRanges);
//       const firstCoilCandidates = sortedData.filter((item) =>
//         isWithinRange(item.outThickness, initialThicknessRanges) &&
//         isWithinRange(item.outWidth, initialWidthRanges)
//       );

//       if (firstCoilCandidates.length === 0) {
//         setError("No coils meet Initial Thickness and Width range requirements");
//         return;
//       }

//       let firstCoil;
//       if (firstCoilCandidates.length > 1 && gradeChangeRanges.length) {
//         const gradeOrder = gradeChangeRanges.map((r) => r.parameterMin);
//         firstCoil = firstCoilCandidates.reduce((prev, curr) => {
//           const prevIndex = gradeOrder.indexOf(prev.outGrade);
//           const currIndex = gradeOrder.indexOf(curr.outGrade);
//           return currIndex !== -1 && (prevIndex === -1 || currIndex < prevIndex) ? curr : prev;
//         });
//       } else {
//         firstCoil = firstCoilCandidates[0];
//       }

//       sortedData = sortedData.filter((item) => item !== firstCoil);

//       // Step 3: Sort for Coffin Shape (Increase then Decrease)
//       sortedData.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth); // Descending
//       const midPoint = Math.floor(sortedData.length / 2);
//       let ascendingHalf = sortedData.slice(0, midPoint).sort(
//         (a, b) => a.outThickness - b.outThickness || a.outWidth - b.outWidth
//       ); // Ascending
//       let descendingHalf = sortedData.slice(midPoint).sort(
//         (a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth
//       ); // Descending

//       sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];

//       // Step 4: Validate Rules
//       const maxWidthJump = criteriaMap.get("Width jump")?.value || Infinity;
//       const maxWidthDown = criteriaMap.get("Width Down")?.value || Infinity;
//       const maxSameWidthRolling = criteriaMap.get("Same Width limitaRolling")?.value || Infinity;
//       const thicknessJumpRanges = criteriaMap.get("Thickness jump")?.ranges || [];
//       const thicknessDownRanges = criteriaMap.get("Thickness down")?.ranges || [];
//       const gradeChangeRangesValidated = criteriaMap.get("Grade change")?.ranges || [];
//       const maxRollingLength = criteriaMap.get("Rolling Length")?.value || Infinity;
//       const maxTonnage = criteriaMap.get("Tonnage")?.value || Infinity;
//       const maxCoils = criteriaMap.get("Number of coils")?.value || Infinity;
//       console.log('maxWidthJump',maxWidthJump)
//       console.log('maxWidthDown',maxWidthDown)
//       console.log('thickness down',thicknessDownRanges)
//       console.log('thickness jump',thicknessJumpRanges)
//       let totalRollingLength = 0;
//       let totalTonnage = 0;
//       let currentSameWidthRolling = 0;
//       let previousWidth = null;

//       for (let i = 0; i < sortedData.length; i++) {
//         const prev = sortedData[i - 1];
//         const curr = sortedData[i];

//         // Derive rolling length and tonnage if not provided
//         const rollingLength = curr.rollingLength || (curr.inactualWeight / 1000) * 10; // Example derivation
//         const tonnage = curr.tonnage || curr.inactualWeight / 1000; // Example derivation

//         totalRollingLength += rollingLength;
//         totalTonnage += tonnage;

//         if (prev) {
//           const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
//           if (widthDiff > maxWidthJump) {
//             setError(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
//             return;
//           }

//           const widthDecrease = prev.outWidth - curr.outWidth;
//           if (widthDecrease > 0 && widthDecrease > maxWidthDown) {
//             setError(`Width down exceeded at index ${i}: ${widthDecrease} > ${maxWidthDown}`);
//             return;
//           }

//           if (curr.outWidth === previousWidth) {
//             currentSameWidthRolling += rollingLength;
//             if (currentSameWidthRolling > maxSameWidthRolling) {
//               setError(`Same width rolling exceeded at index ${i}: ${currentSameWidthRolling} > ${maxSameWidthRolling}`);
//               return;
//             }
//           } else {
//             currentSameWidthRolling = rollingLength;
//             previousWidth = curr.outWidth;
//           }

//           if (curr.outThickness > prev.outThickness) {
//             if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessJumpRanges, true)) {
//               setError(`Invalid thickness jump at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
//               return;
//             }
//           } else if (curr.outThickness < prev.outThickness) {
//             if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessDownRanges, false)) {
//               setError(`Invalid thickness down at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
//               return;
//             }
//           }

//           if (!isValidGradeTransition(prev.outGrade, curr.outGrade, gradeChangeRangesValidated)) {
//             setError(`Invalid grade transition at index ${i}: ${prev.outGrade} to ${curr.outGrade}`);
//             return;
//           }
//         } else {
//           previousWidth = curr.outWidth;
//         }
//       }

//       if (totalRollingLength > maxRollingLength) {
//         setError(`Total rolling length exceeded: ${totalRollingLength} km > ${maxRollingLength} km`);
//         return;
//       }
//       if (totalTonnage > maxTonnage) {
//         setError(`Total tonnage exceeded: ${totalTonnage} tons > ${maxTonnage} tons`);
//         return;
//       }
//       if (sortedData.length > maxCoils) {
//         setError(`Total number of coils exceeded: ${sortedData.length} > ${maxCoils}`);
//         return;
//       }

//       console.log("Data after sorting:", sortedData);
//       setSelectedData(sortedData);
//       setShowRuleDropdown(false);
//       setError(null);
//     } catch (error) {
//       console.error("Error in applyRulesAndSort:", error);
//       setError("Failed to apply rules: " + error.message);
//     }
//   };

//   const handleAssignRule = () => {
//     console.log("Toggling rule dropdown");
//     setShowRuleDropdown((prev) => !prev);
//   };

//   const handleRuleSelection = (selectedRule) => {
//     console.log("Rule selected:", selectedRule);
//     setSelectedRule(selectedRule);
//     applyRulesAndSort(selectedRule.ruleName);
//   };

//   const handleFinalSchedule = async () => {
//     if (selectedData.length === 0) {
//       setError("No items to save.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const result = await saveScheduleConfirmation(scheduleNo, selectedData);
//       if (result.success) {
//         sessionStorage.removeItem("selectedScheduleData");
//         router.push("/SchedulePool");
//       } else {
//         setError("Failed to save final schedule: " + result.error);
//       }
//     } catch (error) {
//       console.error("Error saving schedule:", error);
//       setError("An unexpected error occurred while saving");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const calculateBarWidth = (value, maxValue) => {
//     if (!value) return 0;
//     const percentage = (parseFloat(value) / maxValue) * 250;
//     return Math.max(percentage, 5);
//   };

//   const getMaxValues = () => {
//     if (selectedData.length === 0) return { maxThickness: 15, maxWidth: 1800 };
//     const maxOutThickness = Math.max(...selectedData.map((item) => parseFloat(item.outThickness) || 0));
//     const maxInThickness = Math.max(...selectedData.map((item) => parseFloat(item.inThickness) || 0));
//     const maxOutWidth = Math.max(...selectedData.map((item) => parseFloat(item.outWidth) || 0));
//     const maxInWidth = Math.max(...selectedData.map((item) => parseFloat(item.inWidth) || 0));
//     return {
//       maxThickness: Math.max(maxOutThickness, maxInThickness, 15) * 1.2,
//       maxWidth: Math.max(maxOutWidth, maxInWidth, 1800) * 1.2,
//     };
//   };
//   const { maxThickness, maxWidth } = getMaxValues();

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
//       <div className="w-full max-w-[1600px]">
//         <h1 className="text-3xl font-bold mb-6 text-white text-center">
//           Schedule Confirmation - {scheduleNo}
//         </h1>

//         <div className="mb-6 flex items-center justify-between">
//           <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Back
//           </Button>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <Button
//                 onClick={handleAssignRule}
//                 className="bg-yellow-600 text-white hover:bg-yellow-700 px-4 py-2 rounded-md"
//                 disabled={loading || selectedData.length === 0}
//               >
//                 Assign Rule
//               </Button>

//               {showRuleDropdown && (
//                 <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg overflow-hidden">
//                   {rules.length === 0 ? (
//                     <p className="text-white p-3 text-center">No rules available</p>
//                   ) : (
//                     rules.map((rule, index) => (
//                       <button
//                         key={rule.ruleName || `rule-${index}`}
//                         onClick={() => handleRuleSelection(rule)}
//                         className={`block w-full text-left px-4 py-2 text-white transition-all ${
//                           selectedRule?.ruleName === rule.ruleName
//                             ? "bg-blue-500"
//                             : "hover:bg-gray-700"
//                         }`}
//                       >
//                         {rule.ruleName || `Rule ${index + 1}`}
//                       </button>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>

//             <Button
//               onClick={handleFinalSchedule}
//               className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
//               disabled={saving || loading || selectedData.length === 0}
//             >
//               {saving ? "Saving..." : "Confirm Schedule"}
//             </Button>
//           </div>
//         </div>

//         {!loading && !error && (
//           <div className="mb-6 p-4 rounded-lg flex justify-end">
//             <Tabs
//               defaultValue="output"
//               value={visualizationType}
//               onValueChange={setVisualizationType}
//               className="w-full"
//             >
//               <TabsList className="grid grid-cols-2 w-64 left-0 bg-gray-300 rounded-xl mt-4 ml-auto">
//                 <TabsTrigger
//                   value="output"
//                   className={`text-black px-4 rounded-lg transition-all ${
//                     visualizationType === "output" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
//                   }`}
//                 >
//                   Output Values
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="input"
//                   className={`text-black px-4 rounded-lg transition-all ${
//                     visualizationType === "input" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
//                   }`}
//                 >
//                   Input Values
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         )}

//         {loading ? (
//           <p className="text-white text-center">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Schedule No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Order No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Out Mat No</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>Out Material</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>In Material</TableHead>
//                     <TableHead className="px-4 py-2 text-center border-r border-gray-600 w-[800]" colSpan={2}>Visualization</TableHead>
//                   </TableRow>
//                   <TableRow className="bg-gray-700 text-white">
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600">In Actual Weight</TableHead>
//                     <TableHead className="px-4 py-2 border-r border-gray-600 ">Thickness Graph</TableHead>
//                     <TableHead className="px-2 py-2 border-r border-gray-600 ">Width Graph</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={14} className="text-white text-center py-2 border-t border-gray-600">
//                         No items found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     selectedData.map((item, index) => (
//                       <TableRow key={index} className="border-b border-gray-600">
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{scheduleNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.orderNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outMaterialNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outThickness ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outWidth ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outGrade ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outCoilWeight ?? "-"}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inMatNo}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inThickness}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inWidth}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inGrade}</TableCell>
//                         <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inactualWeight}</TableCell>
//                         <TableCell className="px-1 py-2 border-r border-gray-600 ">
//                           <div className="flex items-center h-10">
//                             <div className="w-full h-5 rounded-lg relative">
//                               <div
//                                 className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
//                                 style={{
//                                   width: `${calculateBarWidth(
//                                     visualizationType === "output" ? item.outThickness : item.inThickness,
//                                     maxThickness
//                                   )}%`,
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   minWidth: "4px",
//                                 }}
//                               ></div>
//                               <span className="absolute text-sm text-white w-full text-center font-medium">
//                                 {visualizationType === "output" ? item.outThickness : item.inThickness}
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="px-7 py-2 border-r border-gray-600 w-[500px]">
//                           <div className="flex items-center h-10">
//                             <div className="w-full h-5 bg-gray-900 rounded-lg relative">
//                               <div
//                                 className="absolute top-0 bottom-0 bg-green-500 rounded-lg mx-1"
//                                 style={{
//                                   width: `${calculateBarWidth(
//                                     visualizationType === "output" ? item.outWidth : item.inWidth,
//                                     maxWidth
//                                   )}%`,
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   minWidth: "4px",
//                                 }}
//                               ></div>
//                               <span className="absolute text-sm text-white w-full text-center font-medium">
//                                 {visualizationType === "output" ? item.outWidth : item.inWidth}
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// I want to add a functionality to drag and drop to change the order of the items 



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
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getScheduleConfirmation, saveScheduleConfirmation, getNextScheduleNumber } from "@/app/actions/schedule";
import { getRules } from "@/app/actions/ruleActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ScheduleConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedData, setSelectedData] = useState([]);
  const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showRuleDropdown, setShowRuleDropdown] = useState(false);
  const [visualizationType, setVisualizationType] = useState("output");
  const [dragItemIndex, setDragItemIndex] = useState(null);

  const handleBack = () => {
    router.push("/SchedulePool");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scheduleNoFromParams = searchParams.get("scheduleNo");
        const dataFromStorage = sessionStorage.getItem("selectedScheduleData");
        if (dataFromStorage) {
          const parsedData = JSON.parse(dataFromStorage);
          setSelectedData(parsedData);
          if (scheduleNoFromParams) {
            setScheduleNo(scheduleNoFromParams);
          } else {
            const newScheduleNoResult = await getNextScheduleNumber();
            if (!newScheduleNoResult.success) {
              setError("Failed to generate new schedule number: " + newScheduleNoResult.error);
            } else {
              setScheduleNo(newScheduleNoResult.data);
            }
          }
        } else if (scheduleNoFromParams) {
          setScheduleNo(scheduleNoFromParams);
          const result = await getScheduleConfirmation(scheduleNoFromParams);
          if (result.success) {
            setSelectedData(result.data);
          } else {
            setError("Failed to fetch schedule: " + result.error);
          }
        } else {
          setError("No schedule data available");
        }

        const rulesResult = await getRules();
        if (rulesResult.success) {
          setRules(rulesResult.data);
        } else {
          setError("Failed to fetch rules: " + rulesResult.error);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const applyRulesAndSort = async (ruleName) => {
    console.log("Applying rule:", ruleName, "Data before sorting:", selectedData);
    if (!ruleName || selectedData.length === 0) {
      setError("No rule selected or no data to sort");
      return;
    }
  
    const rulesResult = await getRules();
    if (!rulesResult.success) {
      setError("Failed to fetch rules: " + rulesResult.error);
      return;
    }
  
    const selectedRule = rulesResult.data.find((rule) => rule.ruleName === ruleName);
    if (!selectedRule) {
      setError(`Rule "${ruleName}" not found`);
      return;
    }
  
    let sortedData = [...selectedData];
  
    try {
      const criteriaMap = new Map(
        selectedRule.criteria
          .filter((crit) => crit.parameterStatus === "Enable")
          .map((crit) => [
            crit.criteria,
            {
              value: crit.parameterValue ? parseFloat(crit.parameterValue) : null,
              ranges: crit.parameterType === "Range" ? crit.ranges.map((r) => ({
                min: r.parameterMin ? parseFloat(r.parameterMin) : null,
                max: r.parameterMax ? parseFloat(r.parameterMax) : null,
              })) : [],
            },
          ])
      );
  
      const isWithinRange = (value, ranges) => {
        if (!ranges.length) return true;
        const numValue = parseFloat(value);
        return ranges.some((range) => numValue >= range.min && numValue <= range.max);
      };
  
      const isValidGradeTransition = (prevGrade, currGrade, ranges) => {
        if (!ranges.length) return true;
        const gradeOrder = ranges.map((r) => ({ from: r.parameterMin, to: r.parameterMax }));
        const transition = gradeOrder.find((g) => g.from === prevGrade);
        return !transition || transition.to === currGrade;
      };
  
      const isValidThicknessTransition = (prevThickness, currThickness, ranges, isJump) => {
        if (!ranges.length) return true;
        const prevNum = parseFloat(prevThickness);
        const currNum = parseFloat(currThickness);
        
        const prevRangeIndex = ranges.findIndex(r => 
          prevNum <= Math.max(r.min, r.max) && 
          prevNum >= Math.min(r.min, r.max)
        );
        
        const currRangeIndex = ranges.findIndex(r => 
          currNum <= Math.max(r.min, r.max) && 
          currNum >= Math.min(r.min, r.max)
        );
        
        console.log(`Thickness transition: ${prevNum} to ${currNum}, isJump: ${isJump}`);
        console.log(`Ranges:`, ranges);
        console.log(`prevRangeIndex: ${prevRangeIndex}, currRangeIndex: ${currRangeIndex}`);
        
        if (prevRangeIndex === -1 || currRangeIndex === -1) {
          console.log("One or both values not in any range");
          return false;
        }
        
        if (isJump) {
          const valid = currRangeIndex >= prevRangeIndex;
          console.log(`Jump check: ${currRangeIndex} >= ${prevRangeIndex} -> ${valid}`);
          return valid;
        } else {
          const valid = currRangeIndex <= prevRangeIndex;
          console.log(`Down check: ${currRangeIndex} <= ${prevRangeIndex} -> ${valid}`);
          return valid;
        }
      };
  
      const initialThicknessRanges = criteriaMap.get("Initial Thickness")?.ranges || [];
      const initialWidthRanges = criteriaMap.get("Width range")?.ranges || [];
      const gradeChangeRanges = criteriaMap.get("Grade change")?.ranges || [];
  
      console.log("Initial Thickness Ranges:", initialThicknessRanges);
      console.log("Initial Width Ranges:", initialWidthRanges);
      console.log("Grade Change Ranges:", gradeChangeRanges);
  
      const firstCoilCandidates = sortedData.filter((item) =>
        isWithinRange(item.outThickness, initialThicknessRanges) &&
        isWithinRange(item.outWidth, initialWidthRanges)
      );
  
      if (firstCoilCandidates.length === 0) {
        setError("No coils meet Initial Thickness and Width range requirements");
        return;
      }
  
      let firstCoil;
      if (firstCoilCandidates.length > 1 && gradeChangeRanges.length) {
        const gradeOrder = gradeChangeRanges.map((r) => r.parameterMin);
        firstCoil = firstCoilCandidates.reduce((prev, curr) => {
          const prevIndex = gradeOrder.indexOf(prev.outGrade);
          const currIndex = gradeOrder.indexOf(curr.outGrade);
          return currIndex !== -1 && (prevIndex === -1 || currIndex < prevIndex) ? curr : prev;
        });
      } else {
        firstCoil = firstCoilCandidates[0];
      }
  
      sortedData = sortedData.filter((item) => item !== firstCoil);
  
      sortedData.sort((a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth);
      const midPoint = Math.floor(sortedData.length / 2);
      let ascendingHalf = sortedData.slice(0, midPoint).sort(
        (a, b) => a.outThickness - b.outThickness || a.outWidth - b.outWidth
      );
      let descendingHalf = sortedData.slice(midPoint).sort(
        (a, b) => b.outThickness - a.outThickness || b.outWidth - a.outWidth
      );
  
      sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];
  
      const maxWidthJump = criteriaMap.get("Width jump")?.value || Infinity;
      const maxWidthDown = criteriaMap.get("Width Down")?.value || Infinity;
      const maxSameWidthRolling = criteriaMap.get("Same Width limitaRolling")?.value || Infinity;
      const thicknessJumpRanges = criteriaMap.get("Thickness jump")?.ranges || [];
      const thicknessDownRanges = criteriaMap.get("Thickness down")?.ranges || [];
      const gradeChangeRangesValidated = criteriaMap.get("Grade change")?.ranges || [];
      const maxRollingLength = criteriaMap.get("Rolling Length")?.value || Infinity;
      const maxTonnage = criteriaMap.get("Tonnage")?.value || Infinity;
      const maxCoils = criteriaMap.get("Number of coils")?.value || Infinity;
  
      console.log("Thickness Jump Ranges:", thicknessJumpRanges);
      console.log("Thickness Down Ranges:", thicknessDownRanges);
  
      let totalRollingLength = 0;
      let totalTonnage = 0;
      let currentSameWidthRolling = 0;
      let previousWidth = null;
  
      for (let i = 0; i < sortedData.length; i++) {
        const prev = sortedData[i - 1];
        const curr = sortedData[i];
  
        const rollingLength = curr.rollingLength || (curr.inactualWeight / 1000) * 10;
        const tonnage = curr.tonnage || curr.inactualWeight / 1000;
  
        totalRollingLength += rollingLength;
        totalTonnage += tonnage;
  
        if (prev) {
          const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
          if (widthDiff > maxWidthJump) {
            console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
            setError(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
            return;
          }
  
          const widthDecrease = prev.outWidth - curr.outWidth;
          if (widthDecrease > 0 && widthDecrease > maxWidthDown) {
            console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
            setError(`Width down exceeded at index ${i}: ${widthDecrease} > ${maxWidthDown}`);
            return;
          }
  
          if (curr.outWidth === previousWidth) {
            currentSameWidthRolling += rollingLength;
            if (currentSameWidthRolling > maxSameWidthRolling) {
              console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
              setError(`Same width rolling exceeded at index ${i}: ${currentSameWidthRolling} > ${maxSameWidthRolling}`);
              return;
            }
          } else {
            currentSameWidthRolling = rollingLength;
            previousWidth = curr.outWidth;
          }
  
          if (curr.outThickness > prev.outThickness) {
            if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessJumpRanges, true)) {
              console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
              setError(`Invalid thickness jump at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
              return;
            }
          } else if (curr.outThickness < prev.outThickness) {
            if (!isValidThicknessTransition(prev.outThickness, curr.outThickness, thicknessDownRanges, false)) {
              console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
              setError(`Invalid thickness down at index ${i}: ${prev.outThickness} to ${curr.outThickness}`);
              return;
            }
          }
  
          if (!isValidGradeTransition(prev.outGrade, curr.outGrade, gradeChangeRangesValidated)) {
            console.log("Partial schedule before error:", sortedData.slice(0, i + 1));
            setError(`Invalid grade transition at index ${i}: ${prev.outGrade} to ${curr.outGrade}`);
            return;
          }
        } else {
          previousWidth = curr.outWidth;
        }
      }
  
      if (totalRollingLength > maxRollingLength) {
        console.log("Partial schedule before error:", sortedData);
        setError(`Total rolling length exceeded: ${totalRollingLength} km > ${maxRollingLength} km`);
        return;
      }
      if (totalTonnage > maxTonnage) {
        console.log("Partial schedule before error:", sortedData);
        setError(`Total tonnage exceeded: ${totalTonnage} tons > ${maxTonnage} tons`);
        return;
      }
      if (sortedData.length > maxCoils) {
        console.log("Partial schedule before error:", sortedData);
        setError(`Total number of coils exceeded: ${sortedData.length} > ${maxCoils}`);
        return;
      }
  
      console.log("Data after sorting:", sortedData);
      setSelectedData(sortedData);
      setShowRuleDropdown(false);
      setError(null);
    } catch (error) {
      console.error("Error in applyRulesAndSort:", error);
      setError("Failed to apply rules: " + error.message);
    }
  };


  const handleAssignRule = () => {
    console.log("Toggling rule dropdown");
    setShowRuleDropdown((prev) => !prev);
  };

  const handleRuleSelection = (selectedRule) => {
    console.log("Rule selected:", selectedRule);
    setSelectedRule(selectedRule);
    applyRulesAndSort(selectedRule.ruleName);
  };

  const handleFinalSchedule = async () => {
    if (selectedData.length === 0) {
      setError("No items to save.");
      return;
    }

    setSaving(true);
    try {
      const result = await saveScheduleConfirmation(scheduleNo, selectedData);
      if (result.success) {
        sessionStorage.removeItem("selectedScheduleData");
        router.push("/SchedulePool");
      } else {
        setError("Failed to save final schedule: " + result.error);
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      setError("An unexpected error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (index) => (e) => {
    setDragItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragOver = (index) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (index) => (e) => {
    e.preventDefault();
    const fromIndex = dragItemIndex;
    const toIndex = index;

    if (fromIndex === toIndex) return;

    const newData = [...selectedData];
    const [draggedItem] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, draggedItem);
    
    setSelectedData(newData);
    setDragItemIndex(null);
    e.currentTarget.style.opacity = "1";
  };

  const handleDragEnd = (e) => {
    setDragItemIndex(null);
    e.currentTarget.style.opacity = "1";
  };

  const calculateBarWidth = (value, maxValue) => {
    if (!value) return 0;
    const percentage = (parseFloat(value) / maxValue) * 250;
    return Math.max(percentage, 5);
  };

  const getMaxValues = () => {
    if (selectedData.length === 0) return { maxThickness: 15, maxWidth: 1800 };
    const maxOutThickness = Math.max(...selectedData.map((item) => parseFloat(item.outThickness) || 0));
    const maxInThickness = Math.max(...selectedData.map((item) => parseFloat(item.inThickness) || 0));
    const maxOutWidth = Math.max(...selectedData.map((item) => parseFloat(item.outWidth) || 0));
    const maxInWidth = Math.max(...selectedData.map((item) => parseFloat(item.inWidth) || 0));
    return {
      maxThickness: Math.max(maxOutThickness, maxInThickness, 15) * 1.2,
      maxWidth: Math.max(maxOutWidth, maxInWidth, 1800) * 1.2,
    };
  };
  const { maxThickness, maxWidth } = getMaxValues();

  return (
    <div className="min-h-screen  py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1600px]">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">
          Schedule Confirmation - {scheduleNo}
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Back
          </Button>
          <div className="flex space-x-4">
            <div className="relative">
              <Button
                onClick={handleAssignRule}
                className="bg-orange-500 text-white hover:bg-orange-700 px-4 py-2 rounded-md"
                disabled={loading || selectedData.length === 0}
              >
                Assign Rule
              </Button>

              {showRuleDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg overflow-hidden">
                  {rules.length === 0 ? (
                    <p className="text-white p-3 text-center">No rules available</p>
                  ) : (
                    rules.map((rule, index) => (
                      <button
                        key={rule.ruleName || `rule-${index}`}
                        onClick={() => handleRuleSelection(rule)}
                        className={`block w-full text-left px-4 py-2 text-white transition-all ${
                          selectedRule?.ruleName === rule.ruleName
                            ? "bg-blue-500"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        {rule.ruleName || `Rule ${index + 1}`}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleFinalSchedule}
              className="bg-orange-500 text-white hover:bg-orange-700 px-4 py-2 rounded-md"
              disabled={saving || loading || selectedData.length === 0}
            >
              {saving ? "Saving..." : "Confirm Schedule"}
            </Button>
          </div>
        </div>

        {!loading && !error && (
          <div className="mb-6 p-4 rounded-lg flex justify-end">
            <Tabs
              defaultValue="output"
              value={visualizationType}
              onValueChange={setVisualizationType}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-64 left-0 bg-gray-300 rounded-xl mt-4 ml-auto">
                <TabsTrigger
                  value="output"
                  className={`text-black px-4 rounded-lg transition-all ${
                    visualizationType === "output" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
                  }`}
                >
                  Output Values
                </TabsTrigger>
                <TabsTrigger
                  value="input"
                  className={`text-black px-4 rounded-lg transition-all ${
                    visualizationType === "input" ? "bg-blue-500 text-white shadow-md" : "hover:bg-blue-400"
                  }`}
                >
                  Input Values
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-700 text-white">
                    <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Schedule No</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Order No</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>Out Mat No</TableHead>
                    <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>Out Material</TableHead>
                    <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>In Material</TableHead>
                    <TableHead className="px-4 py-2 text-center border-r border-gray-600 w-[800]" colSpan={2}>Visualization</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-700 text-white">
                    <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">In Actual Weight</TableHead>
                    <TableHead className="px-4 py-2 border-r border-gray-600">Thickness Graph</TableHead>
                    <TableHead className="px-2 py-2 border-r border-gray-600 w-96 ">Width Graph Visual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-white text-center py-2 border-t border-gray-600">
                        No items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedData.map((item, index) => (
                      <TableRow
                        key={index}
                        draggable
                        onDragStart={handleDragStart(index)}
                        onDragOver={handleDragOver(index)}
                        onDrop={handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={`border-b border-gray-600 cursor-move hover:bg-gray-700 transition-colors ${
                          dragItemIndex === index ? 'opacity-50' : ''
                        }`}
                      >
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{scheduleNo}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.orderNo}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outMaterialNo}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outThickness ?? "-"}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outWidth ?? "-"}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outGrade ?? "-"}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.outCoilWeight ?? "-"}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inMatNo}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inThickness}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inWidth}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inGrade}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{item.inactualWeight}</TableCell>
                        <TableCell className="px-1 py-2 border-r border-gray-600">
                          <div className="flex items-center h-10">
                            <div className="w-full h-5 rounded-lg relative">
                              <div
                                className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
                                style={{
                                  width: `${calculateBarWidth(
                                    visualizationType === "output" ? item.outThickness : item.inThickness,
                                    maxThickness
                                  )}%`,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  minWidth: "4px",
                                }}
                              ></div>
                              <span className="absolute text-sm text-white w-full text-center font-medium">
                                {visualizationType === "output" ? item.outThickness : item.inThickness}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-7 py-2 border-r border-gray-600 w-[500px]">
                          <div className="flex items-center h-10">
                            <div className="w-full h-5 bg-gray-900 rounded-lg relative">
                              <div
                                className="absolute top-0 bottom-0 bg-orange-400 rounded-lg mx-1"
                                style={{
                                  width: `${calculateBarWidth(
                                    visualizationType === "output" ? item.outWidth : item.inWidth,
                                    maxWidth
                                  )}%`,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  minWidth: "4px",
                                }}
                              ></div>
                              <span className="absolute text-sm text-white w-full text-center font-medium">
                                {visualizationType === "output" ? item.outWidth : item.inWidth}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}