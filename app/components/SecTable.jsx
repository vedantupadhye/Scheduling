'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import BtnControls from './BtnControls';

const initialData = [
  {
    id: 1,
    PLAN_NO: "PLN001",
    IN_MAT_NO: "IMN001",
    IN_MAT_TYPE: "Steel",
    UNRULL_FLAG: "Yes",
    MAT_SEQ_NO: "SEQ001",
    PLAN_STATUS: "Pending",
    PONO: "PO12345",
    STEL_GRADE: "A36",
    OUT_MAT_WIDTH: "1200mm",
    OUT_MAT_THICK: "10mm",
    IN_MAT_THICK: "15mm",
    IN_MAT_WIDTH: "1100mm",
    IN_MAT_LEN: "5000mm",
    IN_MAT_WT: "250kg",
    ORDER_NO: "ORD001",
    POSITION: "A1",
    LAYERNO: "2",
    OUT_MAT_NO: "OMN001",
    PRE_FLAG: "No",
    ROLL_LEN: "30m",
    PLAN_FUR_MODE: "Auto",
    SAMPLE_LOT_NO: "SLOT001",
    DEL_REASON_CODE: "N/A",
    REMARK_PS: "Urgent",
    ALLOCATIONORDERTIME: "2024-03-03 10:00:00",
  },
  {
    id: 2,
    PLAN_NO: "PLN002",
    IN_MAT_NO: "IMN002",
    IN_MAT_TYPE: "Aluminum",
    UNRULL_FLAG: "No",
    MAT_SEQ_NO: "SEQ002",
    PLAN_STATUS: "Completed",
    PONO: "PO54321",
    STEL_GRADE: "6061",
    OUT_MAT_WIDTH: "1300mm",
    OUT_MAT_THICK: "12mm",
    IN_MAT_THICK: "18mm",
    IN_MAT_WIDTH: "1200mm",
    IN_MAT_LEN: "5500mm",
    IN_MAT_WT: "300kg",
    ORDER_NO: "ORD002",
    POSITION: "B2",
    LAYERNO: "3",
    OUT_MAT_NO: "OMN002",
    PRE_FLAG: "Yes",
    ROLL_LEN: "25m",
    PLAN_FUR_MODE: "Manual",
    SAMPLE_LOT_NO: "SLOT002",
    DEL_REASON_CODE: "QC",
    REMARK_PS: "Check Quality",
    ALLOCATIONORDERTIME: "2024-03-04 11:30:00",
  },
  {
    id: 3,
    PLAN_NO: "PLN003",
    IN_MAT_NO: "IMN003",
    IN_MAT_TYPE: "Copper",
    UNRULL_FLAG: "Yes",
    MAT_SEQ_NO: "SEQ003",
    PLAN_STATUS: "In Progress",
    PONO: "PO67890",
    STEL_GRADE: "C110",
    OUT_MAT_WIDTH: "1400mm",
    OUT_MAT_THICK: "15mm",
    IN_MAT_THICK: "20mm",
    IN_MAT_WIDTH: "1300mm",
    IN_MAT_LEN: "6000mm",
    IN_MAT_WT: "350kg",
    ORDER_NO: "ORD003",
    POSITION: "C3",
    LAYERNO: "1",
    OUT_MAT_NO: "OMN003",
    PRE_FLAG: "No",
    ROLL_LEN: "40m",
    PLAN_FUR_MODE: "Semi-Auto",
    SAMPLE_LOT_NO: "SLOT003",
    DEL_REASON_CODE: "N/A",
    REMARK_PS: "On Schedule",
    ALLOCATIONORDERTIME: "2024-03-05 14:00:00",
  },
  {
    id: 4,
    PLAN_NO: "PLN004",
    IN_MAT_NO: "IMN004",
    IN_MAT_TYPE: "Copper",
    UNRULL_FLAG: "Yes",
    MAT_SEQ_NO: "SEQ003",
    PLAN_STATUS: "In Progress",
    PONO: "PO67890",
    STEL_GRADE: "C110",
    OUT_MAT_WIDTH: "1200mm",
    OUT_MAT_THICK: "25mm",
    IN_MAT_THICK: "20mm",
    IN_MAT_WIDTH: "1300mm",
    IN_MAT_LEN: "9000mm",
    IN_MAT_WT: "350kg",
    ORDER_NO: "ORD004",
    POSITION: "C3",
    LAYERNO: "1",
    OUT_MAT_NO: "OMN004",
    PRE_FLAG: "No",
    ROLL_LEN: "40m",
    PLAN_FUR_MODE: "Semi-Auto",
    SAMPLE_LOT_NO: "SLOT003",
    DEL_REASON_CODE: "N/A",
    REMARK_PS: "On Schedule",
    ALLOCATIONORDERTIME: "2024-03-05 14:00:00",
  },
  {
    id: 5,
    PLAN_NO: "PLN005",
    IN_MAT_NO: "IMN005",
    IN_MAT_TYPE: "Copper",
    UNRULL_FLAG: "Yes",
    MAT_SEQ_NO: "SEQ003",
    PLAN_STATUS: "In Progress",
    PONO: "PO67890",
    STEL_GRADE: "C110",
    OUT_MAT_WIDTH: "1400mm",
    OUT_MAT_THICK: "15mm",
    IN_MAT_THICK: "20mm",
    IN_MAT_WIDTH: "1300mm",
    IN_MAT_LEN: "6000mm",
    IN_MAT_WT: "350kg",
    ORDER_NO: "ORD005",
    POSITION: "C3",
    LAYERNO: "1",
    OUT_MAT_NO: "OMN005",
    PRE_FLAG: "No",
    ROLL_LEN: "40m",
    PLAN_FUR_MODE: "Semi-Auto",
    SAMPLE_LOT_NO: "SLOT003",
    DEL_REASON_CODE: "N/A",
    REMARK_PS: "On Schedule",
    ALLOCATIONORDERTIME: "2024-03-05 14:00:00",
  },
];

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredData = initialData.filter(row =>
    (filterStatus === "All" || row.PLAN_STATUS === filterStatus) &&
    Object.values(row).some(value => value.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  return (
    <div className='py-4 px-6'>
      <Button className="bg-green-500 mr-4 mb-2 cursor-pointer">Hot rolling schedule detail</Button>
      <Button className="bg-blue-700 cursor-pointer">Quality process</Button>
      <div className="  text-black ">
        <div className="overflow-x-auto">
          <Table className="w-full bg-gray-800 text-white shadow-md rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-gray-900 text-left">
                {["id", "PLAN_NO", "IN_MAT_NO", "IN_MAT_TYPE", "UNRULL_FLAG", "MAT_SEQ_NO", "PLAN_STATUS", "PONO", "STEL_GRADE", "OUT_MAT_WIDTH", "OUT_MAT_THICK", "IN_MAT_THICK", "IN_MAT_WIDTH", "IN_MAT_LEN", "IN_MAT_WT", "ORDER_NO", "POSITION","LAYERNO","OUT_MAT_NO","PRE_FLAG","ROLL_LEN","PLAN_FUR_MODE","SAMPLE_LOT_NO","DEL_REASON_CODE","REMARK_PS","ALLOCATIONORDERTIME"].map(column => (
                  <TableHead key={column} className="p-3 cursor-pointer border-r border-gray-700" onClick={() => handleSort(column)}>
                    {column.charAt(0).toUpperCase() + column.slice(1)} {sortColumn === column ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-700 border-b border-gray-700">
                  <TableCell className="p-3 border-r border-gray-700">{row.id}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.PLAN_NO}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.IN_MAT_NO}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.IN_MAT_TYPE}</TableCell>
                  <TableCell className="p-3 font-semibold text-green-400 border-r border-gray-700">{row.UNRULL_FLAG}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.MAT_SEQ_NO}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.PLAN_STATUS}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.PONO}</TableCell>
                  <TableCell className="p-3 border-r border-gray-700">{row.STEL_GRADE}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.OUT_MAT_WIDTH}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.OUT_MAT_THICK}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.IN_MAT_THICK}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.IN_MAT_WIDTH}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.IN_MAT_LEN}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.IN_MAT_WT}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.ORDER_NO}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.POSITION}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.LAYERNO}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.OUT_MAT_NO}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.PRE_FLAG}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.ROLL_LEN}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.PLAN_FUR_MODE}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.SAMPLE_LOT_NO}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.DEL_REASON_CODE}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.REMARK_PS}</TableCell>
                  <TableCell className="p- border-r border-gray-700">{row.ALLOCATIONORDERTIME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <BtnControls />     
        </div>
      </div>
    </div>
  );
}
