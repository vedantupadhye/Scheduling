// "use client"
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// // Initial data with 3 schedules and corresponding materials
// const initialScheduleData = [
//   { id: '1', scheduleNo: 'SCH001', status: 'In Progress', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, EstimatedTime: '3h', madeBy: 'John', createdDate: '2025-03-24' },
//   { id: '2', scheduleNo: 'SCH002', status: 'Completed', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, EstimatedTime: '3h', madeBy: 'Jane', createdDate: '2025-03-23' },
//   { id: '3', scheduleNo: 'SCH003', status: 'Pending', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, EstimatedTime: '3h', madeBy: 'Mike', createdDate: '2025-03-25' }
// ];

// const initialMaterialData = [
//   // Materials for SCH001
//   { id: 'm1', scheduleNo: 'SCH001', sequenceNo: '001', outMatMo: 'MAT1', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 1', inMatNo: 'IN1', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm2', scheduleNo: 'SCH001', sequenceNo: '002', outMatMo: 'MAT2', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 2', inMatNo: 'IN2', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm3', scheduleNo: 'SCH001', sequenceNo: '003', outMatMo: 'MAT3', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 3', inMatNo: 'IN3', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm4', scheduleNo: 'SCH001', sequenceNo: '004', outMatMo: 'MAT4', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 4', inMatNo: 'IN4', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm5', scheduleNo: 'SCH001', sequenceNo: '005', outMatMo: 'MAT5', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 5', inMatNo: 'IN5', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm6', scheduleNo: 'SCH001', sequenceNo: '006', outMatMo: 'MAT6', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 6', inMatNo: 'IN6', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm7', scheduleNo: 'SCH001', sequenceNo: '007', outMatMo: 'MAT7', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 7', inMatNo: 'IN7', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm8', scheduleNo: 'SCH001', sequenceNo: '008', outMatMo: 'MAT8', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 8', inMatNo: 'IN8', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm9', scheduleNo: 'SCH001', sequenceNo: '009', outMatMo: 'MAT9', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 9', inMatNo: 'IN9', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   // Materials for SCH002
//   { id: 'm10', scheduleNo: 'SCH002', sequenceNo: '001', outMatMo: 'MAT10', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 10', inMatNo: 'IN10', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm11', scheduleNo: 'SCH002', sequenceNo: '002', outMatMo: 'MAT11', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 11', inMatNo: 'IN11', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm12', scheduleNo: 'SCH002', sequenceNo: '003', outMatMo: 'MAT12', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 12', inMatNo: 'IN12', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm13', scheduleNo: 'SCH002', sequenceNo: '004', outMatMo: 'MAT13', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 13', inMatNo: 'IN13', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm14', scheduleNo: 'SCH002', sequenceNo: '005', outMatMo: 'MAT14', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 14', inMatNo: 'IN14', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm15', scheduleNo: 'SCH002', sequenceNo: '006', outMatMo: 'MAT15', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 15', inMatNo: 'IN15', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm16', scheduleNo: 'SCH002', sequenceNo: '007', outMatMo: 'MAT16', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 16', inMatNo: 'IN16', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm17', scheduleNo: 'SCH002', sequenceNo: '008', outMatMo: 'MAT17', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 17', inMatNo: 'IN17', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm18', scheduleNo: 'SCH002', sequenceNo: '009', outMatMo: 'MAT18', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 18', inMatNo: 'IN18', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   // Materials for SCH003
//   { id: 'm19', scheduleNo: 'SCH003', sequenceNo: '001', outMatMo: 'MAT19', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 19', inMatNo: 'IN19', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm20', scheduleNo: 'SCH003', sequenceNo: '002', outMatMo: 'MAT20', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 20', inMatNo: 'IN20', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm21', scheduleNo: 'SCH003', sequenceNo: '003', outMatMo: 'MAT21', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 21', inMatNo: 'IN21', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm22', scheduleNo: 'SCH003', sequenceNo: '004', outMatMo: 'MAT22', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 22', inMatNo: 'IN22', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm23', scheduleNo: 'SCH003', sequenceNo: '005', outMatMo: 'MAT23', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 23', inMatNo: 'IN23', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm24', scheduleNo: 'SCH003', sequenceNo: '006', outMatMo: 'MAT24', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 24', inMatNo: 'IN24', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm25', scheduleNo: 'SCH003', sequenceNo: '007', outMatMo: 'MAT25', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 25', inMatNo: 'IN25', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm26', scheduleNo: 'SCH003', sequenceNo: '008', outMatMo: 'MAT26', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 26', inMatNo: 'IN26', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
//   { id: 'm27', scheduleNo: 'SCH003', sequenceNo: '009', outMatMo: 'MAT27', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 27', inMatNo: 'IN27', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
// ];

// export default function QueryCondition() {
//   const [selectedSchedules, setSelectedSchedules] = useState([]);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [scheduleData, setScheduleData] = useState(initialScheduleData);
//   const [materialData, setMaterialData] = useState(initialMaterialData);
//   const [isSequenceDialogOpen, setIsSequenceDialogOpen] = useState(false);
//   const [newPositionValue, setNewPositionValue] = useState("");
//   const [sequenceChangeMode, setSequenceChangeMode] = useState("start");
//   const [referencePosition, setReferencePosition] = useState("");
//   const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
//   const [swapToPosition, setSwapToPosition] = useState("");
//   const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
//   const [splitDivisions, setSplitDivisions] = useState('');
//   const [splitPreview, setSplitPreview] = useState(null);
//   const [ruleCheckHighlighted, setRuleCheckHighlighted] = useState(false);

//   const handleScheduleSelect = (id) => {
//     setSelectedSchedules(prev => 
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//     setSelectedMaterials([]);
//   };

//   const handleMaterialSelect = (id) => {
//     setSelectedMaterials(prev =>
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//   };

//   const getAvailableReferencePositions = () => {
//     const scheduleMaterials = materialData.filter(m => 
//       selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id)
//     );
//     return scheduleMaterials
//       .filter(m => !selectedMaterials.includes(m.id))
//       .map(m => ({
//         value: m.sequenceNo,
//         label: `${m.sequenceNo} - ${m.outMatMo}`
//       }));
//   };

//   const openSequenceDialog = () => {
//     if (selectedMaterials.length === 0) {
//       alert("Please select at least one material to change sequence");
//       return;
//     }
//     setNewPositionValue("1");
//     setSequenceChangeMode("start");
//     setReferencePosition("");
//     setIsSequenceDialogOpen(true);
//   };

//   const handleSequenceChange = () => {
//     if (selectedMaterials.length === 0) return;

//     const scheduleMaterials = materialData.filter(m => 
//       selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id)
//     );
    
//     const materialsToMove = scheduleMaterials.filter(m => selectedMaterials.includes(m.id));
//     const remainingMaterials = scheduleMaterials.filter(m => !selectedMaterials.includes(m.id));
    
//     let insertionIndex = 0;
    
//     if (sequenceChangeMode === "start") {
//       insertionIndex = parseInt(newPositionValue) - 1;
//       if (insertionIndex < 0) insertionIndex = 0;
//       if (insertionIndex > remainingMaterials.length) insertionIndex = remainingMaterials.length;
//     } else if (sequenceChangeMode === "after" && referencePosition) {
//       const refIndex = remainingMaterials.findIndex(m => m.sequenceNo === referencePosition);
//       insertionIndex = refIndex === -1 ? remainingMaterials.length : refIndex + 1;
//     } else if (sequenceChangeMode === "before" && referencePosition) {
//       const refIndex = remainingMaterials.findIndex(m => m.sequenceNo === referencePosition);
//       insertionIndex = refIndex === -1 ? 0 : refIndex;
//     }
    
//     const reorderedScheduleMaterials = [
//       ...remainingMaterials.slice(0, insertionIndex),
//       ...materialsToMove,
//       ...remainingMaterials.slice(insertionIndex)
//     ];
    
//     const updatedMaterialData = [...materialData];
//     const scheduleMaterialIds = new Set(reorderedScheduleMaterials.map(m => m.id));
//     let scheduleIndex = 0;
    
//     for (let i = 0; i < updatedMaterialData.length; i++) {
//       if (scheduleMaterialIds.has(updatedMaterialData[i].id)) {
//         updatedMaterialData[i] = reorderedScheduleMaterials[scheduleIndex];
//         scheduleIndex++;
//       }
//     }

//     setMaterialData(updatedMaterialData);
//     setIsSequenceDialogOpen(false);
//     setSelectedMaterials([]);
//     setRuleCheckHighlighted(true);
//   };

//   const openSwapDialog = () => {
//     if (selectedMaterials.length === 0) {
//       alert("Please select at least one material to swap");
//       return;
//     }
//     setSwapToPosition("");
//     setIsSwapDialogOpen(true);
//   };

//   const handleSwap = () => {
//     if (!swapToPosition || selectedMaterials.length === 0) return;

//     const scheduleMaterials = materialData.filter(m => 
//       selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id)
//     );
//     const updatedMaterialData = [...materialData];

//     // Get indices of selected materials in the filtered schedule materials
//     const selectedIndices = selectedMaterials.map(id => 
//       scheduleMaterials.findIndex(m => m.id === id)
//     ).sort((a, b) => a - b);

//     // Parse the target position (1-based, so subtract 1 for 0-based index)
//     const swapStartIndex = parseInt(swapToPosition) - 1;

//     if (isNaN(swapStartIndex) || swapStartIndex < 0) {
//       alert("Please enter a valid position number");
//       return;
//     }

//     if (swapStartIndex >= scheduleMaterials.length) {
//       alert("Swap position exceeds the number of materials in the schedule");
//       return;
//     }

//     if (selectedIndices.some(index => index >= swapStartIndex && 
//         index < swapStartIndex + selectedMaterials.length)) {
//       alert("Cannot swap with overlapping positions");
//       return;
//     }

//     if (swapStartIndex + selectedMaterials.length > scheduleMaterials.length) {
//       alert("Swap range exceeds available materials");
//       return;
//     }

//     // Get the indices in the filtered array to swap with
//     const swapIndices = Array.from(
//       { length: selectedMaterials.length }, 
//       (_, i) => swapStartIndex + i
//     );

//     // Map these indices back to the full materialData array
//     const selectedGlobalIndices = selectedIndices.map(idx => 
//       updatedMaterialData.findIndex(m => m.id === scheduleMaterials[idx].id)
//     );
//     const swapGlobalIndices = swapIndices.map(idx => 
//       updatedMaterialData.findIndex(m => m.id === scheduleMaterials[idx].id)
//     );

//     // Perform the swap
//     const selectedItems = selectedGlobalIndices.map(i => updatedMaterialData[i]);
//     const swapItems = swapGlobalIndices.map(i => updatedMaterialData[i]);

//     selectedGlobalIndices.forEach((index, i) => {
//       updatedMaterialData[index] = swapItems[i];
//     });

//     swapGlobalIndices.forEach((index, i) => {
//       updatedMaterialData[index] = selectedItems[i];
//     });

//     setMaterialData(updatedMaterialData);
//     setIsSwapDialogOpen(false);
//     setSelectedMaterials([]);
//     setRuleCheckHighlighted(true);
//   };

//   const openSplitDialog = () => {
//     if (selectedSchedules.length === 0) {
//       alert("Please select at least one schedule first");
//       return;
//     }
//     const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
//     if (selectedSchedule.status !== 'Pending') {
//       alert("Split is only available for schedules with 'Pending' status");
//       return;
//     }
//     const allMaterialIds = materialData
//       .filter(m => selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id))
//       .map(m => m.id);
//     setSelectedMaterials(allMaterialIds);
//     setSplitDivisions('');
//     setSplitPreview(null);
//     setIsSplitDialogOpen(true);
//   };

//   const generateSplitPreview = () => {
//     if (!splitDivisions || isNaN(splitDivisions) || splitDivisions < 1) {
//       alert("Please enter a valid number of divisions");
//       return;
//     }

//     const divisions = parseInt(splitDivisions);
//     const scheduleMaterials = materialData.filter(m => 
//       selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id)
//     );
    
//     if (scheduleMaterials.length === 0) {
//       alert("No materials available to split");
//       return;
//     }

//     const itemsPerDivision = Math.ceil(scheduleMaterials.length / divisions);
//     const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
//     const preview = [];

//     for (let i = 0; i < divisions; i++) {
//       const startIndex = i * itemsPerDivision;
//       const endIndex = Math.min((i + 1) * itemsPerDivision, scheduleMaterials.length);
//       const subScheduleItems = scheduleMaterials.slice(startIndex, endIndex).map((item, index) => ({
//         ...item,
//         sequenceNo: (index + 1).toString().padStart(3, '0')
//       }));
      
//       preview.push({
//         newScheduleNo: `${selectedSchedule.scheduleNo}-${(i + 1).toString().padStart(2, '0')}`,
//         items: subScheduleItems,
//         totalMaterialNumber: subScheduleItems.length,
//         totalMatWeight: subScheduleItems.reduce((sum, item) => sum + (parseFloat(item.outActualWeight) || 0), 0)
//       });
//     }

//     setSplitPreview(preview);
//   };

//   const handleSplitConfirm = () => {
//     if (!splitPreview) return;

//     const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
//     const updatedScheduleData = scheduleData.filter(s => s.id !== selectedSchedules[0]);
    
//     const currentDate = new Date().toISOString().split('T')[0];
//     const newSchedules = splitPreview.map((preview, index) => ({
//       ...selectedSchedule,
//       id: `${selectedSchedule.id}-${(index + 1).toString().padStart(2, '0')}`,
//       scheduleNo: preview.newScheduleNo,
//       totalMaterialNumber: preview.totalMaterialNumber,
//       totalMatWeight: preview.totalMatWeight,
//       totalRollingLength: Math.round(selectedSchedule.totalRollingLength * (preview.totalMaterialNumber / selectedSchedule.totalMaterialNumber)),
//       EstimatedTime: `${Math.round((parseInt(selectedSchedule.EstimatedTime) * preview.totalMaterialNumber / selectedSchedule.totalMaterialNumber))}h`,
//       createdDate: currentDate
//     }));

//     const updatedMaterialData = materialData.map(material => {
//       const newSchedule = splitPreview.find(p => 
//         p.items.some(item => item.id === material.id)
//       );
//       return newSchedule ? { 
//         ...material, 
//         scheduleNo: newSchedule.newScheduleNo,
//         sequenceNo: newSchedule.items.find(item => item.id === material.id).sequenceNo
//       } : material;
//     });

//     setScheduleData([...updatedScheduleData, ...newSchedules]);
//     setMaterialData(updatedMaterialData);
//     setIsSplitDialogOpen(false);
//     setSelectedSchedules([]);
//     setSelectedMaterials([]);
//     setSplitPreview(null);
//     setRuleCheckHighlighted(true);
//   };

//   const handleUpdate = () => {
//     alert("Update functionality not implemented yet");
//     setRuleCheckHighlighted(true);
//   };

//   const handleDelete = () => {
//     if (selectedMaterials.length === 0) {
//       alert("Please select at least one material to delete");
//       return;
//     }

//     const updatedMaterialData = materialData.filter(m => !selectedMaterials.includes(m.id));
//     const updatedScheduleData = scheduleData.map(schedule => {
//       const materialsInSchedule = updatedMaterialData.filter(m => m.scheduleNo === schedule.scheduleNo);
//       return {
//         ...schedule,
//         totalMaterialNumber: materialsInSchedule.length,
//         totalMatWeight: materialsInSchedule.reduce((sum, m) => sum + (parseFloat(m.outActualWeight) || 0), 0),
//         totalRollingLength: Math.round(schedule.totalRollingLength * (materialsInSchedule.length / schedule.totalMaterialNumber)),
//         EstimatedTime: `${Math.round((parseInt(schedule.EstimatedTime) * materialsInSchedule.length / schedule.totalMaterialNumber))}h`
//       };
//     }).filter(schedule => schedule.totalMaterialNumber > 0);

//     setMaterialData(updatedMaterialData);
//     setScheduleData(updatedScheduleData);
//     setSelectedMaterials([]);
//     setRuleCheckHighlighted(true);
//   };

//   const getScheduleMaterialCount = () => {
//     return materialData.filter(m => 
//       selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id)
//     ).length;
//   };

//   const isSplitAllowed = () => {
//     return selectedSchedules.length === 1 && scheduleData.find(s => s.id === selectedSchedules[0])?.status === 'Pending';
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-[95%] mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-white">Query Condition</h1>
        
//         {/* First Table - Schedules */}
//         <div className="text-white shadow-lg overflow-hidden mb-8 border border-white rounded-lg">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-700">
//                   <th className="px-6 py-4 border border-white"></th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Schedule No.</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Total Material Number</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Total Mat Weight</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Total Rolling Length</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Estimated Time</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Made By</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Created Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {scheduleData.map((schedule) => (
//                   <tr key={schedule.id} className="hover:bg-indigo-600/20 transition-colors">
//                     <td className="px-6 py-4 border border-white">
//                       <Checkbox
//                         checked={selectedSchedules.includes(schedule.id)}
//                         onCheckedChange={() => handleScheduleSelect(schedule.id)}
//                       />
//                     </td>
//                     <td className="px-6 py-4 border border-white">{schedule.scheduleNo}</td>
//                     <td className="px-6 py-4 border border-white">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         schedule.status === "Completed" ? "bg-green-600 text-white" :
//                         schedule.status === "In Progress" ? "bg-blue-600 text-white" :
//                         "bg-yellow-600 text-white"
//                       }`}>
//                         {schedule.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 border border-white">{schedule.totalMaterialNumber}</td>
//                     <td className="px-6 py-4 border border-white">{schedule.totalMatWeight}</td>
//                     <td className="px-6 py-4 border border-white">{schedule.totalRollingLength}</td>
//                     <td className="px-6 py-4 border border-white">{schedule.EstimatedTime}</td>
//                     <td className="px-6 py-4 border border-white">{schedule.madeBy}</td>
//                     <td className="px-6 py-4 border border-white">{schedule.createdDate}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-4 flex justify-end gap-4">
//             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Query</Button>
//             <Button variant="outline" className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white">Rollback</Button>
//           </div>
//         </div>

//         {/* Second Table - Materials */}
//         {selectedSchedules.length > 0 && (
//           <div className="bg-gray-900 shadow-lg overflow-hidden border text-white border-white rounded-lg">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-700">
//                     <th className="px-6 py-4 border border-indigo-300"></th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Number</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Sequence No.</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Mat Mo.</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Thickness</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Width</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Grade</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Coil Weight</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Out Actual Weight</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Material Summary</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">In Mat No.</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">In Thickness</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">In Width</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Grade</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Actual Weight</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {materialData
//                     .filter(m => selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id))
//                     .map((material, index) => (
//                       <tr key={material.id} className="hover:bg-indigo-600/20 transition-colors">
//                         <td className="px-6 py-4 border border-white">
//                           <Checkbox
//                             checked={selectedMaterials.includes(material.id)}
//                             onCheckedChange={() => handleMaterialSelect(material.id)}
//                           />
//                         </td>
//                         <td className="px-6 py-4 border border-white">{(index + 1).toString().padStart(2, '0')}</td>
//                         <td className="px-6 py-4 border border-white">{material.sequenceNo}</td>
//                         <td className="px-6 py-4 border border-white">{material.outMatMo}</td>
//                         <td className="px-6 py-4 border border-white">{material.outThickness}</td>
//                         <td className="px-6 py-4 border border-white">{material.outWidth}</td>
//                         <td className="px-6 py-4 border border-white">{material.outGrade}</td>
//                         <td className="px-6 py-4 border border-white">{material.outCoilWeight}</td>
//                         <td className="px-6 py-4 border border-white">{material.outActualWeight}</td>
//                         <td className="px-6 py-4 border border-white">{material.materialSummary}</td>
//                         <td className="px-6 py-4 border border-white">{material.inMatNo}</td>
//                         <td className="px-6 py-4 border border-white">{material.inThickness}</td>
//                         <td className="px-6 py-4 border border-white">{material.inWidth}</td>
//                         <td className="px-6 py-4 border border-white">{material.grade}</td>
//                         <td className="px-6 py-4 border border-white">{material.actualWeight}</td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="p-4 bg-gray-900 flex flex-wrap gap-4">
//               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Query</Button>
//               <Button 
//                 variant="outline" 
//                 className={`border-white text-indigo-300 hover:bg-indigo-600 hover:text-white ${ruleCheckHighlighted ? 'bg-yellow-600 text-white' : ''}`}
//               >
//                 Rule Check
//               </Button>
//               <Button 
//                 onClick={handleUpdate}
//                 variant="outline" 
//                 className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
//               >
//                 Update
//               </Button>    
//               <Button 
//                 onClick={openSequenceDialog}
//                 variant="outline" 
//                 className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
//               >
//                 Sequence Change
//               </Button> 
//               <Button 
//                 onClick={handleDelete}
//                 variant="outline" 
//                 className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
//               >
//                 Delete
//               </Button>
//               {isSplitAllowed() && (
//                 <Button 
//                   onClick={openSplitDialog}
//                   variant="outline" 
//                   className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
//                 >
//                   Split
//                 </Button>
//               )}
//               <Button 
//                 onClick={openSwapDialog}
//                 variant="outline" 
//                 className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
//               >
//                 Swap
//               </Button> 
//               <Button variant="outline" className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white">Release</Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Sequence Change Dialog */}
//       <Dialog open={isSequenceDialogOpen} onOpenChange={setIsSequenceDialogOpen}>
//         <DialogContent className="bg-gray-800 text-white border-indigo-300">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-white">Change Sequence for {selectedMaterials.length} Item(s)</DialogTitle>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Change Mode:</label>
//               <select
//                 value={sequenceChangeMode}
//                 onChange={(e) => setSequenceChangeMode(e.target.value)}
//                 className="w-full p-2 bg-gray-700 border border-indigo-300 rounded text-white"
//               >
//                 <option value="start">Start at Position</option>
//                 <option value="before">Before Item</option>
//                 <option value="after">After Item</option>
//               </select>
//             </div>

//             {sequenceChangeMode === "start" && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Position (1-{getScheduleMaterialCount()}):
//                 </label>
//                 <Input
//                   type="number"
//                   min="1"
//                   max={getScheduleMaterialCount()}
//                   value={newPositionValue}
//                   onChange={(e) => setNewPositionValue(e.target.value)}
//                   className="bg-gray-700 border-indigo-300 text-white"
//                 />
//               </div>
//             )}

//             {(sequenceChangeMode === "before" || sequenceChangeMode === "after") && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Select reference item:
//                 </label>
//                 <select
//                   value={referencePosition}
//                   onChange={(e) => setReferencePosition(e.target.value)}
//                   className="w-full p-2 bg-gray-700 border border-indigo-300 rounded text-white"
//                 >
//                   <option value="">Select an item</option>
//                   {getAvailableReferencePositions().map((pos) => (
//                     <option key={pos.value} value={pos.value}>
//                       {pos.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button 
//               onClick={() => setIsSequenceDialogOpen(false)}
//               variant="outline" 
//               className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSequenceChange}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2"
//             >
//               Apply
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Swap Dialog */}
//       <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
//         <DialogContent className="bg-gray-800 text-white border-indigo-300">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-white">Swap {selectedMaterials.length} Material(s)</DialogTitle>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Moving from positions: {selectedMaterials
//                   .map(id => {
//                     const index = materialData
//                       .filter(m => selectedSchedules.includes(scheduleData.find(s => s.scheduleNo === m.scheduleNo)?.id))
//                       .findIndex(m => m.id === id);
//                     return (index + 1).toString().padStart(2, '0');
//                   })
//                   .join(', ')}
//               </label>
//               <Input
//                 type="number"
//                 min="1"
//                 max={getScheduleMaterialCount()}
//                 value={swapToPosition}
//                 onChange={(e) => setSwapToPosition(e.target.value)}
//                 placeholder={`Enter starting position to swap with (e.g., 1)`}
//                 className="bg-gray-700 border-indigo-300 text-white"
//               />
//               <p className="text-sm text-gray-400 mt-1">
//                 Will swap with {selectedMaterials.length} consecutive position(s) starting from this position
//               </p>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               onClick={() => setIsSwapDialogOpen(false)}
//               variant="outline"
//               className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSwap}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2"
//             >
//               Swap
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Split Dialog */}
//       <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
//         <DialogContent className="bg-gray-800 text-white border-indigo-300 max-w-4xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-white">
//               Split Schedule {selectedSchedules.length === 1 && scheduleData.find(s => s.id === selectedSchedules[0])?.scheduleNo}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Number of Divisions:
//               </label>
//               <div className='flex'>
//               <Input
//                 type="number"
//                 min="1"
//                 value={splitDivisions}
//                 onChange={(e) => setSplitDivisions(e.target.value)}
//                 className="bg-gray-700 border-indigo-300 text-white w-32 px-1"
//                 placeholder="Enter divisions"
//               />
//               <Button 
//                 onClick={generateSplitPreview}
//                 className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white"
//               >
//                 Generate Preview
//               </Button>
//               </div>
//             </div>

//             {splitPreview && (
//               <div className="mt-4">
//                 <h3 className="text-lg font-medium mb-2">Preview:</h3>
//                 <div className="space-y-4 max-h-[50vh] overflow-y-auto">
//                   {splitPreview.map((preview, index) => (
//                     <div key={`${preview.newScheduleNo}-${index}`} className="border border-indigo-300 p-4 rounded">
//                       <h4 className="font-semibold">{preview.newScheduleNo}</h4>
//                       <p>Items: {preview.totalMaterialNumber}</p>
//                       <p>Total Weight: {preview.totalMatWeight}</p>
//                       <div className="mt-2">
//                         <table className="w-full text-sm">
//                           <thead>
//                             <tr className="bg-gray-700">
//                               <th className="p-2">Number</th>
//                               <th className="p-2">Sequence No.</th>
//                               <th className="p-2">Out Mat No.</th>
//                               <th className="p-2">Weight</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {preview.items.map((item, itemIndex) => (
//                               <tr key={`${item.id}-${index}-${itemIndex}`}>
//                                 <td className="p-2">{(itemIndex + 1).toString().padStart(2, '0')}</td>
//                                 <td className="p-2">{item.sequenceNo}</td>
//                                 <td className="p-2">{item.outMatMo}</td>
//                                 <td className="p-2">{item.outActualWeight}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter className="sticky bottom-0 bg-gray-800 py-4">
//             <Button
//               onClick={() => setIsSplitDialogOpen(false)}
//               variant="outline"
//               className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
//             >
//               Cancel
//             </Button>
//             {splitPreview && (
//               <Button
//                 onClick={handleSplitConfirm}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2"
//               >
//                 Confirm Split
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }






"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getSchedulesSummary,getScheduleMaterials,changeSequence,swapMaterials,splitSchedule,deleteMaterials,updateMaterials } from "../actions/scheduleManagement";


export default function QueryCondition() {
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [isSequenceDialogOpen, setIsSequenceDialogOpen] = useState(false);
  const [newPositionValue, setNewPositionValue] = useState("");
  const [sequenceChangeMode, setSequenceChangeMode] = useState("start");
  const [referencePosition, setReferencePosition] = useState("");
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const [swapToPosition, setSwapToPosition] = useState("");
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const [splitDivisions, setSplitDivisions] = useState("");
  const [splitPreview, setSplitPreview] = useState(null);
  const [ruleCheckHighlighted, setRuleCheckHighlighted] = useState(false);

  const [scheduleSortConfig, setScheduleSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [materialSortConfig, setMaterialSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // Sort schedule data
  const getSortedScheduleData = () => {
    if (!scheduleSortConfig.key) return scheduleData;

    return [...scheduleData].sort((a, b) => {
      // Handle numeric fields differently
      const numericFields = ['totalMaterialNumber', 'totalMatWeight', 'totalRollingLength'];
      if (numericFields.includes(scheduleSortConfig.key)) {
        const aValue = parseFloat(a[scheduleSortConfig.key]) || 0;
        const bValue = parseFloat(b[scheduleSortConfig.key]) || 0;
        return scheduleSortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle date fields
      if (scheduleSortConfig.key === 'createdDate') {
        const aDate = new Date(a[scheduleSortConfig.key]);
        const bDate = new Date(b[scheduleSortConfig.key]);
        return scheduleSortConfig.direction === 'ascending' ? aDate - bDate : bDate - aDate;
      }

      // Default string comparison
      if (a[scheduleSortConfig.key] < b[scheduleSortConfig.key]) {
        return scheduleSortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[scheduleSortConfig.key] > b[scheduleSortConfig.key]) {
        return scheduleSortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort material data
  const getSortedMaterialData = () => {
    if (!materialSortConfig.key) return materialData;

    return [...materialData].sort((a, b) => {
      // Handle numeric fields differently
      const numericFields = ['outThickness', 'outWidth', 'outCoilWeight', 'outActualWeight', 
                            'inThickness', 'inWidth', 'actualWeight'];
      if (numericFields.includes(materialSortConfig.key)) {
        const aValue = parseFloat(a[materialSortConfig.key]) || 0;
        const bValue = parseFloat(b[materialSortConfig.key]) || 0;
        return materialSortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle sequence number specially
      if (materialSortConfig.key === 'sequenceNo') {
        const aNum = parseInt(a.sequenceNo);
        const bNum = parseInt(b.sequenceNo);
        return materialSortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
      }

      // Default string comparison
      if (a[materialSortConfig.key] < b[materialSortConfig.key]) {
        return materialSortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[materialSortConfig.key] > b[materialSortConfig.key]) {
        return materialSortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Request sort for schedules
  const requestScheduleSort = (key) => {
    let direction = 'ascending';
    if (scheduleSortConfig.key === key && scheduleSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setScheduleSortConfig({ key, direction });
  };

  // Request sort for materials
  const requestMaterialSort = (key) => {
    let direction = 'ascending';
    if (materialSortConfig.key === key && materialSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setMaterialSortConfig({ key, direction });
  };

  // Render sortable header for schedules
  const renderScheduleSortableHeader = (key, label) => {
    return (
      <th 
        className="px-6 py-4 text-left text-sm font-semibold text-white border border-white cursor-pointer hover:bg-gray-600"
        onClick={() => requestScheduleSort(key)}
      >
        {label}
        {scheduleSortConfig.key === key && (
          <span className="ml-1">
            {scheduleSortConfig.direction === 'ascending' ? '↑' : '↓'}
          </span>
        )}
      </th>
    );
  };

  // Render sortable header for materials
  const renderMaterialSortableHeader = (key, label) => {
    return (
      <th 
        className="px-6 py-4 text-left text-sm font-semibold text-white border border-white cursor-pointer hover:bg-gray-600"
        onClick={() => requestMaterialSort(key)}
      >
        {label}
        {materialSortConfig.key === key && (
          <span className="ml-1">
            {materialSortConfig.direction === 'ascending' ? '↑' : '↓'}
          </span>
        )}
      </th>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const schedulesResult = await getSchedulesSummary();
      if (schedulesResult.success) {
        setScheduleData(schedulesResult.data);
      } else {
        console.error("Failed to load schedules:", schedulesResult.error);
      }
    };
    loadData();
  }, []);

  
  const handleScheduleSelect = async (id) => {
    const newSelected = selectedSchedules.includes(id)
      ? selectedSchedules.filter((i) => i !== id)
      : [...selectedSchedules, id];
    setSelectedSchedules(newSelected);

    if (newSelected.length > 0) {
      const materialsResult = await getScheduleMaterials(newSelected);
      if (materialsResult.success) {
        setMaterialData(materialsResult.data);
      } else {
        console.error("Failed to fetch materials:", materialsResult.error);
        setMaterialData([]);
      }
    } else {
      setMaterialData([]);
    }
    setSelectedMaterials([]);
  };

  const handleMaterialSelect = (id) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getAvailableReferencePositions = () => {
    const scheduleMaterials = materialData.filter((m) =>
      selectedSchedules.includes(scheduleData.find((s) => s.scheduleNo === m.scheduleNo)?.id)
    );
    return scheduleMaterials
      .filter((m) => !selectedMaterials.includes(m.id))
      .map((m) => ({
        value: m.sequenceNo,
        label: `${m.sequenceNo} - ${m.outMatMo}`,
      }));
  };

  const openSequenceDialog = () => {
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material to change sequence");
      return;
    }
    setNewPositionValue("1");
    setSequenceChangeMode("start");
    setReferencePosition("");
    setIsSequenceDialogOpen(true);
  };

  const handleSequenceChange = async () => {
    if (selectedMaterials.length === 0) return;
    const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
    if (!selectedSchedule) {
      alert("Selected schedule not found");
      return;
    }
    console.log("Changing sequence for:", selectedSchedule.scheduleNo);
    const result = await changeSequence(
      selectedSchedule.scheduleNo,
      selectedMaterials,
      newPositionValue,
      sequenceChangeMode,
      referencePosition
    );
    console.log("Sequence change result:", result);
  
    if (result.success) {
      const schedulesResult = await getSchedulesSummary();
      console.log("Updated schedules:", schedulesResult);
      if (schedulesResult.success) {
        setScheduleData(schedulesResult.data);
        const updatedSchedule = schedulesResult.data.find(s => s.scheduleNo === selectedSchedule.scheduleNo);
        if (updatedSchedule) {
          setSelectedSchedules([updatedSchedule.id]);
          const materialsResult = await getScheduleMaterials([updatedSchedule.id]);
          console.log("Fetched materials after sequence change:", materialsResult);
          if (materialsResult.success && materialsResult.data.length > 0) {
            setMaterialData(materialsResult.data);
            setIsSequenceDialogOpen(false);
            setSelectedMaterials([]);
            setRuleCheckHighlighted(true);
          } else {
            console.error("No materials returned after sequence change:", materialsResult.error || "Empty data");
            alert("No materials found after sequence change.");
            setMaterialData([]);
          }
        } else {
          console.error("Updated schedule not found");
          alert("Schedule not found after refresh");
          setSelectedSchedules([]);
          setMaterialData([]);
        }
      } else {
        console.error("Failed to refresh schedules:", schedulesResult.error);
        alert("Failed to refresh schedules: " + schedulesResult.error);
      }
    } else {
      alert("Failed to change sequence: " + result.error);
    }
  };
  const openSwapDialog = () => {
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material to swap");
      return;
    }
    setSwapToPosition("");
    setIsSwapDialogOpen(true);
  };

 const handleSwap = async () => {
  if (!swapToPosition || selectedMaterials.length === 0) {
    alert("Please enter a valid swap position and select materials");
    return;
  }
  const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
  if (!selectedSchedule) {
    alert("Selected schedule not found");
    return;
  }

  console.log("Swapping materials for:", selectedSchedule.scheduleNo, "Selected IDs:", selectedMaterials, "Swap to:", swapToPosition);

  const result = await swapMaterials(selectedSchedule.scheduleNo, selectedMaterials, swapToPosition);
  console.log("Swap result:", result);

  if (result.success) {
    // Refresh scheduleData to get new IDs
    const schedulesResult = await getSchedulesSummary();
    console.log("Updated schedules:", schedulesResult);
    if (schedulesResult.success) {
      setScheduleData(schedulesResult.data);

      // Update selectedSchedules with the new ID for SCH012
      const updatedSchedule = schedulesResult.data.find(s => s.scheduleNo === selectedSchedule.scheduleNo);
      if (updatedSchedule) {
        setSelectedSchedules([updatedSchedule.id]);
        const materialsResult = await getScheduleMaterials([updatedSchedule.id]);
        console.log("Fetched materials after swap:", materialsResult);
        if (materialsResult.success && materialsResult.data.length > 0) {
          setMaterialData(materialsResult.data);
          setIsSwapDialogOpen(false);
          setSelectedMaterials([]);
          setRuleCheckHighlighted(true);
        } else {
          console.error("No materials returned after swap:", materialsResult.error || "Empty data");
          alert("No materials found after swap. Check the schedule.");
          setMaterialData([]);
        }
      } else {
        console.error("Updated schedule not found in refreshed data");
        alert("Schedule not found after refresh");
        setSelectedSchedules([]);
        setMaterialData([]);
      }
    } else {
      console.error("Failed to refresh schedules:", schedulesResult.error);
      alert("Failed to refresh schedules: " + schedulesResult.error);
    }
  } else {
    console.error("Swap failed:", result.error);
    alert("Failed to swap materials: " + result.error);
  }
};
  const openSplitDialog = () => {
    if (selectedSchedules.length === 0) {
      alert("Please select at least one schedule first");
      return;
    }
    const selectedSchedule = scheduleData.find((s) => s.id === selectedSchedules[0]);
    if (selectedSchedule.status !== "Planned") {
      alert("Split is only available for schedules with 'Planned' status");
      return;
    }
    const allMaterialIds = materialData
      .filter((m) =>
        selectedSchedules.includes(scheduleData.find((s) => s.scheduleNo === m.scheduleNo)?.id)
      )
      .map((m) => m.id);
    setSelectedMaterials(allMaterialIds);
    setSplitDivisions("");
    setSplitPreview(null);
    setIsSplitDialogOpen(true);
  };

  const generateSplitPreview = () => {
    if (!splitDivisions || isNaN(splitDivisions) || splitDivisions < 1) {
      alert("Please enter a valid number of divisions");
      return;
    }

    const divisions = parseInt(splitDivisions);
    const scheduleMaterials = materialData.filter((m) =>
      selectedSchedules.includes(scheduleData.find((s) => s.scheduleNo === m.scheduleNo)?.id)
    );

    if (scheduleMaterials.length === 0) {
      alert("No materials available to split");
      return;
    }

    const itemsPerDivision = Math.ceil(scheduleMaterials.length / divisions);
    const selectedSchedule = scheduleData.find((s) => s.id === selectedSchedules[0]);
    const preview = [];

    for (let i = 0; i < divisions; i++) {
      const startIndex = i * itemsPerDivision;
      const endIndex = Math.min((i + 1) * itemsPerDivision, scheduleMaterials.length);
      const subScheduleItems = scheduleMaterials.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        sequenceNo: (index + 1).toString().padStart(3, "0"),
      }));

      preview.push({
        newScheduleNo: `${selectedSchedule.scheduleNo}-${(i + 1).toString().padStart(2, "0")}`,
        items: subScheduleItems,
        totalMaterialNumber: subScheduleItems.length,
        totalMatWeight: subScheduleItems.reduce(
          (sum, item) => sum + (parseFloat(item.outActualWeight) || 0),
          0
        ),
      });
    }

    setSplitPreview(preview);
  };

  const handleSplitConfirm = async () => {
    if (!splitPreview) return;
    const selectedSchedule = scheduleData.find(s => s.id === selectedSchedules[0]);
    if (!selectedSchedule) {
      alert("Selected schedule not found");
      return;
    }
    console.log("Splitting schedule:", selectedSchedule.scheduleNo);
    const result = await splitSchedule(selectedSchedule.scheduleNo, parseInt(splitDivisions));
    console.log("Split result:", result);
  
    if (result.success) {
      const schedulesResult = await getSchedulesSummary();
      console.log("Updated schedules:", schedulesResult);
      if (schedulesResult.success) {
        setScheduleData(schedulesResult.data);
        const newScheduleNos = splitPreview.map(p => p.newScheduleNo);
        const newSchedules = schedulesResult.data.filter(s => newScheduleNos.includes(s.scheduleNo));
        console.log("New schedules after split:", newSchedules);
  
        if (newSchedules.length > 0) {
          const newSelectedIds = newSchedules.map(s => s.id);
          setSelectedSchedules(newSelectedIds);
          const materialsResult = await getScheduleMaterials(newSelectedIds);
          console.log("Materials for new schedules:", materialsResult);
          if (materialsResult.success) {
            setMaterialData(materialsResult.data);
          } else {
            console.error("Failed to fetch materials after split:", materialsResult.error);
            alert("Error fetching materials: " + materialsResult.error);
            setMaterialData([]);
          }
        } else {
          console.log("No new schedules found after split");
          setSelectedSchedules([]);
          setMaterialData([]);
        }
        setIsSplitDialogOpen(false);
        setSelectedMaterials([]);
        setSplitPreview(null);
        setRuleCheckHighlighted(true);
      } else {
        console.error("Failed to refresh schedules after split:", schedulesResult.error);
        alert("Error refreshing schedules: " + schedulesResult.error);
      }
    } else {
      console.error("Split failed:", result.error);
      alert("Failed to split schedule: " + result.error);
    }
  };
  const handleUpdate = async () => {
    const result = await updateMaterials(materialData.filter(m => selectedMaterials.includes(m.id)));
    if (result.success) {
      alert(result.message || "Update successful");
      setRuleCheckHighlighted(true);
    } else {
      alert("Failed to update materials: " + result.error);
    }
  };

  const handleDelete = async () => {
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material to delete");
      return;
    }

    const result = await deleteMaterials(selectedMaterials);
    if (result.success) {
      const schedulesResult = await getSchedulesSummary();
      const materialsResult = await getScheduleMaterials(selectedSchedules);
      if (schedulesResult.success && materialsResult.success) {
        setScheduleData(schedulesResult.data);
        setMaterialData(materialsResult.data);
        setSelectedMaterials([]);
        setRuleCheckHighlighted(true);
      } else {
        console.error("Failed to refresh after delete:", schedulesResult.error, materialsResult.error);
      }
    } else {
      alert("Failed to delete materials: " + result.error);
    }
  };

  const getScheduleMaterialCount = () => {
    return materialData.filter((m) =>
      selectedSchedules.includes(scheduleData.find((s) => s.scheduleNo === m.scheduleNo)?.id)
    ).length;
  };

  const isSplitAllowed = () => {
    return (
      selectedSchedules.length === 1 &&
      scheduleData.find((s) => s.id === selectedSchedules[0])?.status === "Planned"
    );
  };

  return (
    <div className="min-h-screen text-black py-8 px-4">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Schedule Management</h1>

        {/* First Table - Schedules */}
        <div className="text-white shadow-lg overflow-hidden mb-8 border border-white rounded-lg bg-gray-900">
          <div className="overflow-x-auto bg-gray-900">
          <table className="w-full border-collapse bg-gray-900 text-white">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-4 border border-white"></th>
                  {renderScheduleSortableHeader('scheduleNo', 'Schedule No.')}
                  {renderScheduleSortableHeader('status', 'Status')}
                  {renderScheduleSortableHeader('totalMaterialNumber', 'Total Material Number')}
                  {renderScheduleSortableHeader('totalMatWeight', 'Total Mat Weight')}
                  {renderScheduleSortableHeader('totalRollingLength', 'Total Rolling Length')}
                  {renderScheduleSortableHeader('EstimatedTime', 'Estimated Time')}
                  {renderScheduleSortableHeader('madeBy', 'Made By')}
                  {renderScheduleSortableHeader('createdDate', 'Created Date')}
                </tr>
              </thead>
              <tbody>
                {getSortedScheduleData().map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-indigo-600/20 transition-colors">
                    <td className="px-6 py-4 border border-white">
                      <Checkbox
                        checked={selectedSchedules.includes(schedule.id)}
                        onCheckedChange={() => handleScheduleSelect(schedule.id)}
                      />
                    </td>
                    <td className="px-6 py-4 border border-white">{schedule.scheduleNo}</td>
                    <td className="px-6 py-4 border border-white">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          schedule.status === "Completed"
                            ? "bg-green-600 text-white"
                            : schedule.status === "In Progress"
                            ? "bg-blue-600 text-white"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-white">{schedule.totalMaterialNumber}</td>
                    <td className="px-6 py-4 border border-white">{schedule.totalMatWeight}</td>
                    <td className="px-6 py-4 border border-white">{schedule.totalRollingLength}</td>
                    <td className="px-6 py-4 border border-white">{schedule.EstimatedTime}</td>
                    <td className="px-6 py-4 border border-white">{schedule.madeBy}</td>
                    <td className="px-6 py-4 border border-white">{schedule.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex justify-end gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">Query</Button>
            <Button variant="outline" className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
              Rollback
            </Button>
          </div>
        </div>

        {/* Second Table - Materials */}
        {selectedSchedules.length > 0 && (
          <div className="bg-gray-900 shadow-lg overflow-hidden border text-white border-white rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-900 text-white">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-4 border border-indigo-300"></th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Number</th>
                    {renderMaterialSortableHeader('sequenceNo', 'Sequence No.')}
                    {renderMaterialSortableHeader('outMatMo', 'Out Mat Mo.')}
                    {renderMaterialSortableHeader('outThickness', 'Out Thickness')}
                    {renderMaterialSortableHeader('outWidth', 'Out Width')}
                    {renderMaterialSortableHeader('outGrade', 'Out Grade')}
                    {renderMaterialSortableHeader('outCoilWeight', 'Out Coil Weight')}
                    {renderMaterialSortableHeader('outActualWeight', 'Out Actual Weight')}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white border border-white">Material Status</th>
                    {renderMaterialSortableHeader('inMatNo', 'In Mat No.')}
                    {renderMaterialSortableHeader('inThickness', 'In Thickness')}
                    {renderMaterialSortableHeader('inWidth', 'In Width')}
                    {renderMaterialSortableHeader('grade', 'Grade')}
                    {renderMaterialSortableHeader('actualWeight', 'Actual Weight')}
                  </tr>
                </thead>
                <tbody>
                  {getSortedMaterialData().map((material, index) => (
                    <tr key={material.id} className="hover:bg-indigo-600/20 transition-colors">
                      <td className="px-6 py-4 border border-white">
                        <Checkbox
                          checked={selectedMaterials.includes(material.id)}
                          onCheckedChange={() => handleMaterialSelect(material.id)}
                        />
                      </td>
                      <td className="px-6 py-4 border border-white">{(index + 1).toString().padStart(2, "0")}</td>
                      <td className="px-6 py-4 border border-white">{material.sequenceNo}</td>
                      <td className="px-6 py-4 border border-white">{material.outMatMo}</td>
                      <td className="px-6 py-4 border border-white">{material.outThickness}</td>
                      <td className="px-6 py-4 border border-white">{material.outWidth}</td>
                      <td className="px-6 py-4 border border-white">{material.outGrade}</td>
                      <td className="px-6 py-4 border border-white">{material.outCoilWeight}</td>
                      <td className="px-6 py-4 border border-white">{material.outActualWeight}</td>
                      <td className="px-6 py-4 border border-white">Planned</td>
                      <td className="px-6 py-4 border border-white">{material.inMatNo}</td>
                      <td className="px-6 py-4 border border-white">{material.inThickness}</td>
                      <td className="px-6 py-4 border border-white">{material.inWidth}</td>
                      <td className="px-6 py-4 border border-white">{material.grade}</td>
                      <td className="px-6 py-4 border border-white">{material.actualWeight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-900 flex flex-wrap gap-4">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Query</Button>
              <Button
                variant="outline"
                className={`border-white text-indigo-300 hover:bg-indigo-600 hover:text-white ${
                  ruleCheckHighlighted ? "bg-yellow-600 text-white" : ""
                }`}
              >
                Rule Check
              </Button>
              <Button
                onClick={handleUpdate}
                variant="outline"
                className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
              >
                Update
              </Button>
              <Button
                onClick={openSequenceDialog}
                variant="outline"
                className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
              >
                Sequence Change
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
              >
                Delete
              </Button>
              {isSplitAllowed() && (
                <Button
                  onClick={openSplitDialog}
                  variant="outline"
                  className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
                >
                  Split
                </Button>
              )}
              <Button
                onClick={openSwapDialog}
                variant="outline"
                className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white"
              >
                Swap
              </Button>
              <Button variant="outline" className="border-white text-indigo-300 hover:bg-indigo-600 hover:text-white">
                Release
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sequence Change Dialog */}
      <Dialog open={isSequenceDialogOpen} onOpenChange={setIsSequenceDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-indigo-300">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Change Sequence for {selectedMaterials.length} Item(s)
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Change Mode:</label>
              <select
                value={sequenceChangeMode}
                onChange={(e) => setSequenceChangeMode(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-indigo-300 rounded text-white"
              >
                <option value="start">Start at Position</option>
                <option value="before">Before Item</option>
                <option value="after">After Item</option>
              </select>
            </div>

            {sequenceChangeMode === "start" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Position (1-{getScheduleMaterialCount()}):
                </label>
                <Input
                  type="number"
                  min="1"
                  max={getScheduleMaterialCount()}
                  value={newPositionValue}
                  onChange={(e) => setNewPositionValue(e.target.value)}
                  className="bg-gray-700 border-indigo-300 text-white"
                />
              </div>
            )}

            {(sequenceChangeMode === "before" || sequenceChangeMode === "after") && (
              <div>
                <label className="block text-sm font-medium mb-2">Select reference item:</label>
                <select
                  value={referencePosition}
                  onChange={(e) => setReferencePosition(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-indigo-300 rounded text-white"
                >
                  <option value="">Select an item</option>
                  {getAvailableReferencePositions().map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsSequenceDialogOpen(false)}
              variant="outline"
              className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSequenceChange}
              className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-indigo-300">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Swap {selectedMaterials.length} Material(s)
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Moving from positions:{" "}
                {selectedMaterials
                  .map((id) => {
                    const index = materialData.findIndex((m) => m.id === id);
                    return (index + 1).toString().padStart(2, "0");
                  })
                  .join(", ")}
              </label>
              <Input
                type="number"
                min="1"
                max={getScheduleMaterialCount()}
                value={swapToPosition}
                onChange={(e) => setSwapToPosition(e.target.value)}
                placeholder={`Enter starting position to swap with (e.g., 1)`}
                className="bg-gray-700 border-indigo-300 text-white"
              />
              <p className="text-sm text-gray-400 mt-1">
                Will swap with {selectedMaterials.length} consecutive position(s) starting from this
                position
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsSwapDialogOpen(false)}
              variant="outline"
              className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSwap} className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2">
              Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Split Dialog */}
      <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-indigo-300 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Split Schedule{" "}
              {selectedSchedules.length === 1 &&
                scheduleData.find((s) => s.id === selectedSchedules[0])?.scheduleNo}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Divisions:</label>
              <div className="flex">
                <Input
                  type="number"
                  min="1"
                  value={splitDivisions}
                  onChange={(e) => setSplitDivisions(e.target.value)}
                  className="bg-gray-700 border-indigo-300 text-white w-32 px-1"
                  placeholder="Enter divisions"
                />
                <Button
                  onClick={generateSplitPreview}
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Generate Preview
                </Button>
              </div>
            </div>

            {splitPreview && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Preview:</h3>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  {splitPreview.map((preview, index) => (
                    <div key={`${preview.newScheduleNo}-${index}`} className="border border-indigo-300 p-4 rounded">
                      <h4 className="font-semibold">{preview.newScheduleNo}</h4>
                      <p>Items: {preview.totalMaterialNumber}</p>
                      <p>Total Weight: {preview.totalMatWeight}</p>
                      <div className="mt-2">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-700">
                              <th className="p-2">Number</th>
                              <th className="p-2">Sequence No.</th>
                              <th className="p-2">Out Mat No.</th>
                              <th className="p-2">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {preview.items.map((item, itemIndex) => (
                              <tr key={`${item.id}-${index}-${itemIndex}`}>
                                <td className="p-2">{(itemIndex + 1).toString().padStart(2, "0")}</td>
                                <td className="p-2">{item.sequenceNo}</td>
                                <td className="p-2">{item.outMatMo}</td>
                                <td className="p-2">{item.outActualWeight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sticky bottom-0 bg-gray-800 py-4">
            <Button
              onClick={() => setIsSplitDialogOpen(false)}
              variant="outline"
              className="border-indigo-300 text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              Cancel
            </Button>
            {splitPreview && (
              <Button
                onClick={handleSplitConfirm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2"
              >
                Confirm Split
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}