

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

  const handleBack = () => {
    router.push("/SchedulePool");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scheduleNoFromParams = searchParams.get("scheduleNo");
        const dataFromStorage = sessionStorage.getItem('selectedScheduleData');
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

  const handleFinalSchedule = async () => {
    if (selectedData.length === 0) {
      setError("No items to save.");
      return;
    }

    setSaving(true);
    try {
      const result = await saveScheduleConfirmation(scheduleNo, selectedData);
      if (result.success) {
        sessionStorage.removeItem('selectedScheduleData');
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

  const applyRulesAndSort = (rule) => {
    console.log("Applying rule:", rule, "Data before sorting:", selectedData);
    if (!rule || selectedData.length === 0) {
      setError("No rule selected or no data to sort");
      return;
    }

    let sortedData = [...selectedData];

    // Primary Rules
    const firstCoilThicknessMin = 3.5;
    const firstCoilThicknessMax = 5;
    const firstCoilWidthMin = 900;
    const firstCoilWidthMax = 1300; //change back to 1100 after testing
    const maxWidthJump = 150;
    const maxWidthDown = 200;

    try {
      // Step 1: Find a valid first coil
      const firstCoilCandidates = sortedData.filter(item => 
        item.outThickness >= firstCoilThicknessMin &&
        item.outThickness <= firstCoilThicknessMax &&
        item.outWidth >= firstCoilWidthMin &&
        item.outWidth <= firstCoilWidthMax
      );

      if (firstCoilCandidates.length === 0) {
        setError("No coils meet initial requirements (Thickness: 3.5-5mm, Width: 900-1100mm)");
        return;
      }

      const firstCoil = firstCoilCandidates[0];
      sortedData = sortedData.filter(item => item !== firstCoil);

      // Step 2: Sort by thickness and width for coffin shape
      sortedData.sort((a, b) => 
        b.outThickness - a.outThickness || b.outWidth - a.outWidth
      );

      // Step 3: Split into ascending and descending halves
      const midPoint = Math.floor(sortedData.length / 2);
      let ascendingHalf = sortedData.slice(0, midPoint);
      let descendingHalf = sortedData.slice(midPoint);

      ascendingHalf.sort((a, b) => 
        a.outThickness - b.outThickness || a.outWidth - b.outWidth
      );
      descendingHalf.sort((a, b) => 
        b.outThickness - a.outThickness || b.outWidth - a.outWidth
      );

      // Step 4: Combine into coffin shape
      sortedData = [firstCoil, ...ascendingHalf, ...descendingHalf];

      // Step 5: Basic validation of width jumps
      for (let i = 1; i < sortedData.length; i++) {
        const prev = sortedData[i - 1];
        const curr = sortedData[i];
        const widthDiff = Math.abs(curr.outWidth - prev.outWidth);
        if (widthDiff > maxWidthJump) {
          console.warn(`Width jump exceeded at index ${i}: ${widthDiff} > ${maxWidthJump}`);
        }
        if (curr.outWidth < prev.outWidth && (prev.outWidth - curr.outWidth) > maxWidthDown) {
          console.warn(`Width down exceeded at index ${i}`);
        }
      }

      console.log("Data after sorting:", sortedData);
      setSelectedData(sortedData); // Update state
      setShowRuleDropdown(false);  // Close dropdown
      setError(null);              // Clear any previous errors
    } catch (error) {
      console.error("Error in applyRulesAndSort:", error);
      setError("Failed to apply rules: " + error.message);
    }
  };

  const handleAssignRule = () => {
    console.log("Toggling rule dropdown");
    setShowRuleDropdown(prev => !prev);
  };

  const handleRuleSelection = (rule) => {
    console.log("Rule selected:", rule);
    setSelectedRule(rule);
    applyRulesAndSort(rule);
  };

  const calculateBarWidth = (value, maxValue) => {
    if (!value) return 0;
    const percentage = (parseFloat(value) / maxValue) * 220;
    return Math.max(percentage, 5);
  };

  const getMaxValues = () => {
    if (selectedData.length === 0) return { maxThickness: 15, maxWidth: 1800 };
    const maxOutThickness = Math.max(...selectedData.map(item => parseFloat(item.outThickness) || 0));
    const maxInThickness = Math.max(...selectedData.map(item => parseFloat(item.inThickness) || 0));
    const maxOutWidth = Math.max(...selectedData.map(item => parseFloat(item.outWidth) || 0));
    const maxInWidth = Math.max(...selectedData.map(item => parseFloat(item.inWidth) || 0));
    return {
      maxThickness: Math.max(maxOutThickness, maxInThickness, 15) * 1.2,
      maxWidth: Math.max(maxOutWidth, maxInWidth, 1800) * 1.2
    };
  };
  const { maxThickness, maxWidth } = getMaxValues();

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1600px]">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
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
                className="bg-yellow-600 text-white hover:bg-yellow-700"
                disabled={loading || selectedData.length === 0}
              >
                Assign Rule
              </Button>
              {showRuleDropdown && (
                <div className="absolute z-10 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-lg">
                  {rules.length === 0 ? (
                    <p className="text-white p-2">No rules available</p>
                  ) : (
                    rules.map((rule, index) => (
                      <button
                        key={rule.ruleName || `rule-${index}`}
                        onClick={() => handleRuleSelection(rule)}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
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
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={saving || loading || selectedData.length === 0}
            >
              {saving ? "Saving..." : "Final Schedule"}
            </Button>
          </div>
        </div>

        {!loading && !error && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg">
            <Tabs
              defaultValue="output"
              value={visualizationType}
              onValueChange={setVisualizationType}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-64 mx-auto">
                <TabsTrigger value="output" className="text-white hover:bg-gray-500">Output Values</TabsTrigger>
                <TabsTrigger value="input" className="text-white hover:bg-gray-500">Input Values</TabsTrigger>
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
                    <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={2}>Visualization</TableHead>
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
                    <TableHead className="px-4 py-2 border-r border-gray-600">Width Graph</TableHead>
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
                      <TableRow key={index} className="border-b border-gray-600">
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600">{scheduleNo}</TableCell>
                        <TableCell className="text-white px-4 py-2 border-r border-gray-600NJ">{item.orderNo}</TableCell>
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
                        <TableCell className="px-4 py-2 border-r border-gray-600">
                          <div className="flex items-center h-10">
                            <div className="w-full h-5 bg-gray-900 rounded-lg relative">
                              <div
                                className="absolute top-0 bottom-0 bg-blue-500 rounded-lg"
                                style={{
                                  width: `${calculateBarWidth(
                                    visualizationType === "output" ? item.outThickness : item.inThickness,
                                    maxThickness
                                  )}%`,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  minWidth: '4px'
                                }}
                              ></div>
                              <span className="absolute text-sm text-white w-full text-center font-medium">
                                {visualizationType === "output" ? item.outThickness : item.inThickness}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-2 border-r border-gray-600">
                          <div className="flex items-center h-10">
                            <div className="w-full h-5 bg-gray-900 rounded-lg relative">
                              <div
                                className="absolute top-0 bottom-0 bg-green-500 rounded-lg"
                                style={{
                                  width: `${calculateBarWidth(
                                    visualizationType === "output" ? item.outWidth : item.inWidth,
                                    maxWidth
                                  )}%`,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  minWidth: '4px'
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