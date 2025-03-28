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

// export default function ScheduleConfirmation() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedData, setSelectedData] = useState([]);
//   const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || "SCH001");
//   const [visualizationType, setVisualizationType] = useState("In");

//   useEffect(() => {
//     const storedData = sessionStorage.getItem("scheduleData");
//     const storedScheduleNo = sessionStorage.getItem("scheduleNo");
//     console.log("Retrieving data from sessionStorage...");
//     console.log("Raw storedData:", storedData);

//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       console.log("Parsed selectedData:", parsedData);
//       console.log("Total items retrieved:", parsedData.length);
//       setSelectedData(parsedData);
//     } else {
//       console.error("No data found in sessionStorage");
//     }

//     if (storedScheduleNo) {
//       console.log("Retrieved scheduleNo:", storedScheduleNo);
//       setScheduleNo(storedScheduleNo);
//     }
//   }, []);

//   const handleBack = () => {
//     console.log("Clearing sessionStorage and navigating back...");
//     sessionStorage.removeItem("scheduleData");
//     sessionStorage.removeItem("scheduleNo");
//     router.push("/SchedulePool");
//   };

//   const maxThickness = Math.max(
//     ...selectedData.map((item) =>
//       visualizationType === "In" ? item.inThickness || 0 : item.outThickness || 0
//     ),
//     1
//   );
//   const maxWidth = Math.max(
//     ...selectedData.map((item) =>
//       visualizationType === "In" ? item.inWidth || 0 : item.outWidth || 0
//     ),
//     1
//   );

//   const scaleValue = (value, maxValue) => {
//     const maxLengthPx = 300; // Max visual length in pixels
//     return Math.min((value / maxValue) * maxLengthPx, maxLengthPx);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Schedule Confirmation - {scheduleNo}</h1>

//         <div className="mb-8 flex items-center gap-4">
//           <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Back to Schedule Pool
//           </Button>
//           <div className="flex items-center gap-4">
//             <label className="text-white font-semibold">Visualization Type:</label>
//             <div className="flex bg-gray-800 rounded-full p-1">
//               <button
//                 onClick={() => setVisualizationType("In")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   visualizationType === "In"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 In Material
//               </button>
//               <button
//                 onClick={() => setVisualizationType("Out")}
//                 className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                   visualizationType === "Out"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-transparent text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Out Material
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="w-full">
//           <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-700">
//                     <TableHead className="text-white px-2 py-1">Order No</TableHead>
//                     <TableHead className="text-white px-2 py-1">Out Mat No</TableHead>
//                     <TableHead className="text-white px-2 py-1">Out Thickness</TableHead>
//                     <TableHead className="text-white px-2 py-1">Out Width</TableHead>
//                     <TableHead className="text-white px-2 py-1">Out Grade</TableHead>
//                     <TableHead className="text-white px-2 py-1">Out Coil Weight</TableHead>
//                     <TableHead className="text-white px-2 py-1">In Mat No</TableHead>
//                     <TableHead className="text-white px-2 py-1">In Thickness</TableHead>
//                     <TableHead className="text-white px-2 py-1">In Width</TableHead>
//                     <TableHead className="text-white px-2 py-1">In Grade</TableHead>
//                     <TableHead className="text-white px-2 py-1">Actual Weight</TableHead>
//                     <TableHead className="text-white px-2 py-1">Thickness Diagram</TableHead>
//                     <TableHead className="text-white px-2 py-1">Width Diagram</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={13} className="text-white text-center py-2">
//                         No items selected for confirmation.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     selectedData.map((item, index) => {
//                       const thickness =
//                         visualizationType === "In" ? item.inThickness || 0 : item.outThickness || 0;
//                       const width =
//                         visualizationType === "In" ? item.inWidth || 0 : item.outWidth || 0;

//                       return (
//                         <TableRow key={index} className="border-b-0">
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.orderNo}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.outMaterialNo}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">
//                             {item.outThickness || "-"}
//                           </TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.outWidth || "-"}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.outGrade || "-"}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">
//                             {item.outCoilWeight || "-"}
//                           </TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.inMatNo || "-"}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">
//                             {item.inThickness || "-"}
//                           </TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.inWidth || "-"}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">{item.inGrade || "-"}</TableCell>
//                           <TableCell className="text-white px-2 py-0 align-middle">
//                             {item.actualWeight || "-"}
//                           </TableCell>
//                           <TableCell className="px-2 py-0 align-middle">
//                             <div
//                               style={{
//                                 width: `${scaleValue(thickness, maxThickness)}px`, // Thickness as length
//                                 height: "15px", // Fixed height
//                                 backgroundColor: "#4B5EAA",
//                                 border: "1px solid rgba(255, 255, 255, 0.2)",
//                                 boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
//                                 borderRadius: "2px",
//                                 margin: "1px 0",
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell className="px-2 py-0 align-middle">
//                             <div
//                               style={{
//                                 width: `${scaleValue(width, maxWidth)}px`, // Width as length
//                                 height: "15px", // Fixed height
//                                 backgroundColor: "#4B5EAA",
//                                 border: "1px solid rgba(255, 255, 255, 0.2)",
//                                 boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
//                                 borderRadius: "2px",
//                                 margin: "1px 0",
//                               }}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
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
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function ScheduleConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedData, setSelectedData] = useState([]);
  const [scheduleNo, setScheduleNo] = useState(searchParams.get("scheduleNo") || "SCH001");
  const [visualizationType, setVisualizationType] = useState("In");

  useEffect(() => {
    const storedData = sessionStorage.getItem("scheduleData");
    const storedScheduleNo = sessionStorage.getItem("scheduleNo");
    if (storedData) {
      setSelectedData(JSON.parse(storedData));
    }
    if (storedScheduleNo) {
      setScheduleNo(storedScheduleNo);
    }
  }, []);

  const handleBack = () => {
    sessionStorage.removeItem("scheduleData");
    sessionStorage.removeItem("scheduleNo");
    router.push("/schedule-pool");
  };

  const maxThickness = Math.max(
    ...selectedData.map((item) => (visualizationType === "In" ? item.inThickness || 0 : item.outThickness || 0)),
    1
  );
  const maxWidth = Math.max(
    ...selectedData.map((item) => (visualizationType === "In" ? item.inWidth || 0 : item.outWidth || 0)),
    1
  );

  const scaleValue = (value, maxValue) => (value / maxValue) * 200; // Total width (100px left + 100px right)

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1600px]">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Schedule Confirmation - {scheduleNo}</h1>

        <div className="mb-6 flex items-center justify-between">
          <Button onClick={handleBack} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Back
          </Button>
          <div className="flex items-center gap-4">
            <label className="text-white font-semibold">Visualization Type:</label>
            <div className="flex bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setVisualizationType("In")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  visualizationType === "In" ? "bg-indigo-600 text-white" : "text-gray-300"
                }`}
              >
                In
              </button>
              <button
                onClick={() => setVisualizationType("Out")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  visualizationType === "Out" ? "bg-indigo-600 text-white" : "text-gray-300"
                }`}
              >
                Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
          <div className="overflow-y-auto max-h-[500px]">
            <Table>
              <TableHeader>
                {/* First Row: Group Headers */}
                <TableRow className="bg-gray-700 text-white">
                  <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
                    Order No
                  </TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
                    Out Mat No
                  </TableHead>
                  <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={4}>
                    Out Material
                  </TableHead>
                  <TableHead className="px-4 py-2 text-center border-r border-gray-600" colSpan={5}>
                    In Material
                  </TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600" rowSpan={2}>
                    Thickness Diagram
                  </TableHead>
                  <TableHead className="px-4 py-2" rowSpan={2}>
                    Width Diagram
                  </TableHead>
                </TableRow>
                {/* Second Row: Sub-Headers */}
                <TableRow className="bg-gray-700 text-white">
                  <TableHead className="px-4 py-2 border-r border-gray-600">Out Thickness</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">Out Width</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">Out Grade</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">Out Coil Weight</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">In Mat No</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">In Thickness</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">In Width</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">In Grade</TableHead>
                  <TableHead className="px-4 py-2 border-r border-gray-600">Actual Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-white text-center py-2 border-t border-gray-600">
                      No items selected.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedData.map((item, index) => {
                    const thickness =
                      visualizationType === "In" ? item.inThickness || 0 : item.outThickness || 0;
                    const width = visualizationType === "In" ? item.inWidth || 0 : item.outWidth || 0;

                    return (
                      <TableRow key={index} className="border-b border-gray-600">
                        {[
                          item.orderNo,
                          item.outMaterialNo,
                          item.outThickness,
                          item.outWidth,
                          item.outGrade,
                          item.outCoilWeight,
                          item.inMatNo,
                          item.inThickness,
                          item.inWidth,
                          item.inGrade,
                          item.actualWeight,
                        ].map((val, idx) => (
                          <TableCell
                            key={idx}
                            className="text-white px-4 py-2 border-r border-gray-600"
                          >
                            {val || "-"}
                          </TableCell>
                        ))}
                        <TableCell className="px-4 py-2 border-r border-gray-600">
                          <div
                            style={{
                              width: `${scaleValue(thickness, maxThickness)}px`,
                              height: "15px",
                              backgroundColor: "#32CD32",
                              borderRadius: "2px",
                              position: "relative",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <div
                            style={{
                              width: `${scaleValue(width, maxWidth)}px`,
                              height: "15px",
                              backgroundColor: "#32CD32",
                              borderRadius: "2px",
                              position: "relative",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}