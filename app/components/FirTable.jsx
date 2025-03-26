'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
// import SecTable from './SecTable';

const initialData = [
  { id: 1, PLAN_NO: "Alice Brown", PLAN_EXEC_SEQ_NO: "alice@example.com", PLAN_FUR_MODE: "Engineer", PLAN_STATUS: "Active", TOTAL_MAT_NUM: "IT", TOTAL_WAT_WT: "New York", TOTAL_WAT_LEN: "2023-01-15",TOTAL_RUN_TIME :"20",REMARK_PS:"1",ROLL_CHG_FLAG:"Yes" ,ROLL_CHG_FLAG:"Yes",PLAN_FUR_NUM:"yes",EQU_NO:"345",PLAN_MAKE_TIME:"2021-05-22",RESER_START_TIME:"2021-05-22",RESER_END_TIME:"2021-05-22",DEL_RESEN_CODE:"yes"},
  { id: 2, PLAN_NO: "Bob Smith", PLAN_EXEC_SEQ_NO: "bob@example.com", PLAN_FUR_MODE: "Manager", PLAN_STATUS: "Inactive", TOTAL_MAT_NUM: "HR", TOTAL_WAT_WT: "Chicago", TOTAL_WAT_LEN: "2021-05-22",TOTAL_RUN_TIME :"20",REMARK_PS:"1",ROLL_CHG_FLAG:"Yes",PLAN_FUR_NUM:"yes",EQU_NO:"345",PLAN_MAKE_TIME:"2021-05-22",RESER_START_TIME:"2021-05-22",RESER_END_TIME:"2021-05-22",DEL_RESEN_CODE:"yes"}, 
  { id: 3, PLAN_NO: "Charlie Johnson", PLAN_EXEC_SEQ_NO: "charlie@example.com", PLAN_FUR_MODE: "Analyst", PLAN_STATUS: "Active", TOTAL_MAT_NUM: "Finance", TOTAL_WAT_WT: "San Francisco", TOTAL_WAT_LEN: "2022-07-30",TOTAL_RUN_TIME :"20",REMARK_PS:"1",ROLL_CHG_FLAG:"Yes",PLAN_FUR_NUM:"yes",EQU_NO:"345",PLAN_MAKE_TIME:"2021-05-22",RESER_START_TIME:"2021-05-22",RESER_END_TIME:"2021-05-22",DEL_RESEN_CODE:"yes"}, 
  { id: 4, PLAN_NO: "Diana Prince", PLAN_EXEC_SEQ_NO: "diana@example.com", PLAN_FUR_MODE: "Designer", PLAN_STATUS: "Active", TOTAL_MAT_NUM: "Marketing", TOTAL_WAT_WT: "Los Angeles", TOTAL_WAT_LEN: "2020-09-18",TOTAL_RUN_TIME :"20",REMARK_PS:"1",ROLL_CHG_FLAG:"Yes",PLAN_FUR_NUM:"yes",EQU_NO:"345",PLAN_MAKE_TIME:"2021-05-22",RESER_START_TIME:"2021-05-22",RESER_END_TIME:"2021-05-22",DEL_RESEN_CODE:"yes"}, 
  { id: 5, PLAN_NO: "Ethan Hunt", PLAN_EXEC_SEQ_NO: "ethan@example.com", PLAN_FUR_MODE: "Agent", PLAN_STATUS: "Inactive", TOTAL_MAT_NUM: "Security", TOTAL_WAT_WT: "Washington", TOTAL_WAT_LEN: "2019-11-03",TOTAL_RUN_TIME :"20",REMARK_PS:"1",ROLL_CHG_FLAG:"Yes",PLAN_FUR_NUM:"yes",EQU_NO:"345",PLAN_MAKE_TIME:"2021-05-22",RESER_START_TIME:"2021-05-22",RESER_END_TIME:"2021-05-22",DEL_RESEN_CODE:"yes"}, 
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
    <div className='bg-gray-400'>
       <p className='text-black text-2xl p-4'>Query condition</p>
      <div className='flex p-4'>
        <p className='text-black mx-2'>Backlog Code</p>  
        <select className='w-80 border-2 border-black rounded-md mx-8'>
          <option value="All">C201</option>
          <option value="All">C202</option>
          <option value="All">C203</option>
          <option value="All">C204</option>
          <option value="All">C205</option>
         </select>    
        <Input placeholder='Hot Rolling Work' className="w-60 mx-12 text-black border-2 border-black"/>
        <Input placeholder='Hot Rolling Work'  className="w-60 mx-12 border-black border-2"/>
       
      </div>
    <div className="px-6 pt-6 bg-gray-100 text-black ">
      <div className="flex items-center gap-4 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 p-2 border rounded-md shadow-sm" />
        <select
          className="p-2 border rounded-md shadow-sm bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full bg-gray-800 text-white shadow-md rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-900 text-left">
              {["id", "PLAN_NO", "PLAN_EXEC_SEQ_NO", "PLAN_FUR_MODE", "PLAN_STATUS", "TOTAL_MAT_NUM", "TOTAL_WAT_WT", "TOTAL_WAT_LEN", "TOTAL_RUN_TIME", "REMARK_PS","ROLL_CHG_FLAG","PLAN_FUR_NUM","EQU_NO","PLAN_MAKE_TIME","RESER_START_TIME","RESER_END_TIME","DEL_RESEN_CODE"].map(column => (
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
                <TableCell className="p-3 border-r border-gray-700">{row.PLAN_EXEC_SEQ_NO}</TableCell>
                <TableCell className="p-3 border-r border-gray-700">{row.PLAN_FUR_MODE}</TableCell>
                <TableCell className="p-3 font-semibold text-green-400 border-r border-gray-700">{row.PLAN_STATUS}</TableCell>
                <TableCell className="p-3 border-r border-gray-700">{row.TOTAL_MAT_NUM}</TableCell>
                <TableCell className="p-3 border-r border-gray-700">{row.TOTAL_WAT_WT}</TableCell>
                <TableCell className="p-3 border-r border-gray-700">{row.TOTAL_WAT_LEN}</TableCell>
                <TableCell className="p-3 border-r border-gray-700">{row.TOTAL_RUN_TIME}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.REMARK_PS}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.ROLL_CHG_FLAG}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.PLAN_FUR_NUM}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.EQU_NO}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.PLAN_MAKE_TIME}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.RESER_START_TIME}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.RESER_END_TIME}</TableCell>
                <TableCell className="p- border-r border-gray-700">{row.DEL_RESEN_CODE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* <SecTable/>       */}
    </div>
    </div>
  );
}
