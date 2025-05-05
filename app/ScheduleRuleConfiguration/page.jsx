// "use client";
// import { useState, useEffect } from "react";
// import { getRules, createRule, updateRule, deleteRule } from "../actions/ruleActions";

// const RuleTable = () => {
//   const [searchRuleNo, setSearchRuleNo] = useState("");
//   const [searchRuleName, setSearchRuleName] = useState("");
//   const [searchRemark, setSearchRemark] = useState("");
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [rules, setRules] = useState([]);
//   const [parameterValues, setParameterValues] = useState({});
//   const [logicValues, setLogicValues] = useState({});
//   const [parameterStatus, setParameterStatus] = useState({});
//   const [controlParameterValues, setControlParameterValues] = useState({});
//   const [isInserting, setIsInserting] = useState(false);
//   const [newRule, setNewRule] = useState({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
//   const [showCriteriaForm, setShowCriteriaForm] = useState(false);

//   const criteriaList = [
//     "Thickness Change",
//     "Thickness Reduction",
//     "Grade Change",
//     "Initial Thickness",
//     "Rolling Length",
//     "Rolling Tonnage",
//     "No. of Coils",
//   ];

//   const controlParameterOptions = [
//     "Thickness Change - Input Thickness",
//     "Thickness Reduction - Output Thickness",
//     "Grade Change - Input Grade",
//     "Initial Thickness - Input Thickness",
//     "Rolling Length - Constant Value",
//     "Rolling Tonnage - Constant Value",
//     "No. of Coils - Constant Value",
//   ];

//   useEffect(() => {
//     const fetchRules = async () => {
//       const response = await getRules();
//       if (response.success) {
//         setRules(response.data);
//       } else {
//         alert("Failed to fetch rules: " + response.error);
//       }
//     };
//     fetchRules();
//   }, []);

//   const handleRowSelection = (rule) => {
//     setSelectedRule(rule);
//     setIsInserting(false);
//     setShowCriteriaForm(false);
//     const newParameterValues = {};
//     const newLogicValues = {};
//     const newParameterStatus = {};
//     const newControlParameterValues = {};

//     rule.criteria.forEach((crit) => {
//       newParameterValues[crit.criteria] = {
//         type: crit.parameterType,
//         value: crit.parameterValue,
//         min: crit.parameterMin,
//         max: crit.parameterMax,
//       };
//       newLogicValues[crit.criteria] = crit.logic;
//       newParameterStatus[crit.criteria] = crit.parameterStatus;
//       newControlParameterValues[crit.criteria] = {
//         selectedOption: crit.controlParameter,
//         inputType: crit.controlInputType,
//         value: crit.controlValue,
//         min: crit.controlMin,
//         max: crit.controlMax,
//       };
//     });

//     setParameterValues(newParameterValues);
//     setLogicValues(newLogicValues);
//     setParameterStatus(newParameterStatus);
//     setControlParameterValues(newControlParameterValues);
//   };

//   const handleParameterChange = (criteria, type) => {
//     setParameterValues((prev) => ({
//       ...prev,
//       [criteria]: { type, value: "", min: "", max: "" },
//     }));
//   };

//   const handleInputChange = (criteria, field, value) => {
//     setParameterValues((prev) => ({
//       ...prev,
//       [criteria]: { ...prev[criteria], [field]: value },
//     }));
//   };

//   const handleLogicChange = (criteria, value) => {
//     setLogicValues((prev) => ({
//       ...prev,
//       [criteria]: value,
//     }));
//   };

//   const handleParameterStatusChange = (criteria, status) => {
//     setParameterStatus((prev) => ({
//       ...prev,
//       [criteria]: status,
//     }));
//   };

//   const handleControlParameterChange = (criteria, selectedOption) => {
//     setControlParameterValues((prev) => ({
//       ...prev,
//       [criteria]: {
//         selectedOption,
//         inputType: "",
//         value: "",
//         min: "",
//         max: "",
//       },
//     }));
//   };

//   const handleControlInputTypeChange = (criteria, inputType) => {
//     setControlParameterValues((prev) => ({
//       ...prev,
//       [criteria]: {
//         ...prev[criteria],
//         inputType,
//         value: inputType === "Range" ? "" : prev[criteria].value,
//         min: "",
//         max: "",
//       },
//     }));
//   };

//   const handleControlInputValueChange = (criteria, field, value) => {
//     setControlParameterValues((prev) => ({
//       ...prev,
//       [criteria]: {
//         ...prev[criteria],
//         [field]: value,
//       },
//     }));
//   };

//   const isConstantValueParameter = (selectedOption) => {
//     return selectedOption && selectedOption.includes("Constant Value");
//   };

//   const handleInsert = () => {
//     setIsInserting(true);
//     setSelectedRule(null);
//     setShowCriteriaForm(false);
//     setNewRule({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
//     setParameterValues({});
//     setLogicValues({});
//     setParameterStatus({});
//     setControlParameterValues({});
//   };

//   const handleSaveInsert = async () => {
//     const response = await createRule({
//       ...newRule,
//       criteria: [], // Initially no criteria
//     });

//     if (response.success) {
//       setRules((prev) => [...prev, response.data]);
//       setSelectedRule(response.data);
//       setIsInserting(false);
//       setShowCriteriaForm(true); // Show criteria form after insert
//       alert("Rule inserted successfully! Now add criteria.");
//     } else {
//       alert("Failed to insert rule: " + response.error);
//     }
//   };

//   const handleSaveCriteria = async () => {
//     if (selectedRule) {
//       const criteriaData = criteriaList.map((criteria) => ({
//         criteria,
//         parameterValues: parameterValues[criteria] || {},
//         logicValues: logicValues[criteria] || "<",
//         controlParameterValues: controlParameterValues[criteria] || {},
//         parameterStatus: parameterStatus[criteria] || "Enable",
//       }));

//       const response = await updateRule(selectedRule.ruleName, {
//         ruleNo: selectedRule.ruleNo,
//         ruleName: selectedRule.ruleName,
//         remark: selectedRule.remark,
//         criteria: criteriaData,
//       });

//       if (response.success) {
//         setRules((prev) =>
//           prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
//         );
//         setSelectedRule(response.data);
//         setShowCriteriaForm(false);
//         alert("Criteria saved successfully!");
//       } else {
//         alert("Failed to save criteria: " + response.error);
//       }
//     }
//   };

//   const handleUpdate = async () => {
//     if (selectedRule) {
//       const criteriaData = criteriaList.map((criteria) => ({
//         criteria,
//         parameterValues: parameterValues[criteria] || {},
//         logicValues: logicValues[criteria] || "<",
//         controlParameterValues: controlParameterValues[criteria] || {},
//         parameterStatus: parameterStatus[criteria] || "Enable",
//       }));

//       const response = await updateRule(selectedRule.ruleName, {
//         ruleNo: selectedRule.ruleNo,
//         ruleName: selectedRule.ruleName,
//         remark: selectedRule.remark,
//         criteria: criteriaData,
//       });

//       if (response.success) {
//         setRules((prev) =>
//           prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
//         );
//         setSelectedRule(response.data);
//         alert("Rule updated successfully!");
//       } else {
//         alert("Failed to update rule: " + response.error);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedRule) {
//       const response = await deleteRule(selectedRule.ruleName);
//       if (response.success) {
//         setRules((prev) => prev.filter((r) => r.ruleName !== selectedRule.ruleName));
//         setSelectedRule(null);
//         alert("Rule deleted successfully!");
//       } else {
//         alert("Failed to delete rule: " + response.error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-900 text-white">   
//       {/* Search Inputs */}
//       <div className="mb-4 grid grid-cols-3 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Rule No."
//           value={searchRuleNo}
//           onChange={(e) => setSearchRuleNo(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//         <input
//           type="text"
//           placeholder="Search by Rule Name"
//           value={searchRuleName}
//           onChange={(e) => setSearchRuleName(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//         <input
//           type="text"
//           placeholder="Search by Remark"
//           value={searchRemark}
//           onChange={(e) => setSearchRemark(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//       </div>

//       {/* Main Table */}
//       <table className="min-w-full border border-gray-300">
//         <thead>
//           <tr className="bg-gray-700">
//             <th className="border p-2"><input type="checkbox" /></th>
//             <th className="border p-2">Rule No.</th>
//             <th className="border p-2">Rule Name</th>
//             <th className="border p-2">Remark</th>
//             <th className="border p-2">Modify Date</th>
//             <th className="border p-2">Create Date</th>
//             <th className="border p-2">Created By</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rules.map((row) => (
//             <tr
//               key={row.id}
//               className={`cursor-pointer ${selectedRule?.ruleName === row.ruleName ? "bg-gray-700" : ""}`}
//               onClick={() => handleRowSelection(row)}
//             >
//               <td className="border p-2"><input type="checkbox" /></td>
//               <td className="border p-2">{row.ruleNo}</td>
//               <td className="border p-2">{row.ruleName}</td>
//               <td className="border p-2">{row.remark}</td>
//               <td className="border p-2">{new Date(row.modifyDate).toLocaleDateString()}</td>
//               <td className="border p-2">{new Date(row.createDate).toLocaleDateString()}</td>
//               <td className="border p-2">{row.createdBy}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="mb-4 flex space-x-4 mt-4">
//         <button onClick={handleInsert} className="bg-purple-400 text-white px-4 py-2 rounded">
//           Insert
//         </button>
//         <button
//           onClick={handleUpdate}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={!selectedRule || isInserting}
//         >
//           Update 
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//           disabled={!selectedRule || isInserting}
//         >
//           Delete 
//         </button>
//       </div>

//       {/* Insert Form */}
//       {isInserting && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">Insert New Rule</h3>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Rule No."
//               value={newRule.ruleNo}
//               onChange={(e) => setNewRule({ ...newRule, ruleNo: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Rule Name"
//               value={newRule.ruleName}
//               onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Remark"
//               value={newRule.remark}
//               onChange={(e) => setNewRule({ ...newRule, remark: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Created By"
//               value={newRule.createdBy}
//               onChange={(e) => setNewRule({ ...newRule, createdBy: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//           <button
//             onClick={handleSaveInsert}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Save New Rule
//           </button>
//         </div>
//       )}

//       {/* Criteria Form or Secondary Table */}
//       {(showCriteriaForm || selectedRule) && !isInserting && (
//         <div className="mt-6 text-white">
//           <h3 className="text-lg font-semibold mb-2">
//             {showCriteriaForm ? `Add Criteria for ${selectedRule.ruleName}` : `Details for ${selectedRule.ruleName}`}
//           </h3>
//           <table className="min-w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-700">
//                 <th className="border p-2">Criteria</th>
//                 <th className="border p-2">Parameter</th>
//                 <th className="border p-2">Logic</th>
//                 <th className="border p-2">Control Parameter</th>
//                 <th className="border p-2">Parameter Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {criteriaList.map((criteria) => (
//                 <tr
//                   key={criteria}
//                   className={`${parameterStatus[criteria] === "Disable" ? "bg-gray-500" : ""}`}
//                 >
//                   <td className="border p-2">{criteria}</td>
//                   <td className="border p-2">
//                     <div className="flex flex-col space-y-2">
//                       <select
//                         className="p-1 border border-gray-300 rounded text-white"
//                         value={parameterValues[criteria]?.type || ""}
//                         onChange={(e) => handleParameterChange(criteria, e.target.value)}
//                         disabled={parameterStatus[criteria] === "Disable"}
//                       >
//                         <option value="" className="text-black">Select</option>
//                         <option value="Input Value" className="text-black">Input Value</option>
//                         <option value="Range" className="text-black">Range</option>
//                       </select>
//                       {parameterValues[criteria]?.type === "Range" ? (
//                         <div className="flex space-x-2">
//                           <input
//                             type="number"
//                             placeholder="Min"
//                             className="p-1 border border-gray-300 rounded w-20"
//                             value={parameterValues[criteria]?.min || ""}
//                             onChange={(e) => handleInputChange(criteria, "min", e.target.value)}
//                             disabled={parameterStatus[criteria] === "Disable"}
//                           />
//                           <span>to</span>
//                           <input
//                             type="number"
//                             placeholder="Max"
//                             className="p-1 border border-gray-300 rounded w-20"
//                             value={parameterValues[criteria]?.max || ""}
//                             onChange={(e) => handleInputChange(criteria, "max", e.target.value)}
//                             disabled={parameterStatus[criteria] === "Disable"}
//                           />
//                         </div>
//                       ) : (
//                         parameterValues[criteria]?.type === "Input Value" && (
//                           <input
//                             type="text"
//                             placeholder="Enter Value"
//                             className="p-1 border border-gray-300 rounded w-full"
//                             value={parameterValues[criteria]?.value || ""}
//                             onChange={(e) => handleInputChange(criteria, "value", e.target.value)}
//                             disabled={parameterStatus[criteria] === "Disable"}
//                           />
//                         )
//                       )}
//                     </div>
//                   </td>
//                   <td className="border p-2">
//                     <select
//                       className="p-1 border border-gray-300 rounded text-white"
//                       value={logicValues[criteria] || "<"}
//                       onChange={(e) => handleLogicChange(criteria, e.target.value)}
//                       disabled={parameterStatus[criteria] === "Disable"}
//                     >
//                       <option value="<" className="text-black">less than</option>
//                       <option value="<=" className="text-black">≤</option>
//                       <option value=">" className="text-black">greater than</option>
//                       <option value=">=" className="text-black">≥</option>
//                       <option value="=" className="text-black">=</option>
//                       <option value="between" className="text-black">In Between</option>
//                       <option value="not-between" className="text-black">Not In Between</option>
//                     </select>
//                   </td>
//                   <td className="border p-2 ">
//                     <div className="flex flex-col space-y-2">
//                       <select
//                         className="p-1 border border-gray-300 rounded text-white"
//                         value={controlParameterValues[criteria]?.selectedOption || ""}
//                         onChange={(e) => handleControlParameterChange(criteria, e.target.value)}
//                         disabled={parameterStatus[criteria] === "Disable"}
//                       >
//                         <option value="" className="text-black">Select Control Parameter</option>
//                         {controlParameterOptions.map((option) => (
//                           <option key={option} value={option} className="text-black">
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                       {isConstantValueParameter(controlParameterValues[criteria]?.selectedOption) && (
//                         <div className="space-y-2">
//                           <select
//                             className="p-1 border border-gray-300 rounded text-white"
//                             value={controlParameterValues[criteria]?.inputType || ""}
//                             onChange={(e) => handleControlInputTypeChange(criteria, e.target.value)}
//                             disabled={parameterStatus[criteria] === "Disable"}
//                           >
//                             <option value="" className="text-black">Select Input Type</option>
//                             <option value="Value" className="text-black">Value</option>
//                             <option value="Range" className="text-black">Range</option>
//                           </select>
//                           {controlParameterValues[criteria]?.inputType === "Range" ? (
//                             <div className="flex items-center space-x-2">
//                               <input
//                                 type="number"
//                                 placeholder="Min"
//                                 className="p-1 border border-gray-300 rounded w-20"
//                                 value={controlParameterValues[criteria]?.min || ""}
//                                 onChange={(e) => handleControlInputValueChange(criteria, "min", e.target.value)}
//                                 disabled={parameterStatus[criteria] === "Disable"}
//                               />
//                               <span className="text-white">to</span>
//                               <input
//                                 type="number"
//                                 placeholder="Max"
//                                 className="p-1 border border-gray-300 rounded w-20"
//                                 value={controlParameterValues[criteria]?.max || ""}
//                                 onChange={(e) => handleControlInputValueChange(criteria, "max", e.target.value)}
//                                 disabled={parameterStatus[criteria] === "Disable"}
//                               />
//                             </div>
//                           ) : (
//                             controlParameterValues[criteria]?.inputType === "Value" && (
//                               <input
//                                 type="text"
//                                 placeholder="Enter Value"
//                                 className="p-1 border border-gray-300 rounded w-full"
//                                 value={controlParameterValues[criteria]?.value || ""}
//                                 onChange={(e) => handleControlInputValueChange(criteria, "value", e.target.value)}
//                                 disabled={parameterStatus[criteria] === "Disable"}
//                               />
//                             )
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="border p-2">
//                     <select
//                       className="p-1 border border-gray-300 rounded text-white"
//                       value={parameterStatus[criteria] || "Enable"}
//                       onChange={(e) => handleParameterStatusChange(criteria, e.target.value)}
//                     >
//                       <option value="Enable" className="text-black">Enable</option>
//                       <option value="Disable" className="text-black">Disable</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             onClick={handleSaveCriteria}
//             className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Save Criteria
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RuleTable;

      






// "use client";
// import { useState, useEffect } from "react";
// import { getRules, createRule, updateRule, deleteRule } from "../actions/ruleActions";

// const RuleTable = () => {
//   const [searchRuleNo, setSearchRuleNo] = useState("");
//   const [searchRuleName, setSearchRuleName] = useState("");
//   const [searchRemark, setSearchRemark] = useState("");
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [rules, setRules] = useState([]);
//   const [parameterValues, setParameterValues] = useState({});
//   const [parameterStatus, setParameterStatus] = useState({});
//   const [isInserting, setIsInserting] = useState(false);
//   const [newRule, setNewRule] = useState({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
//   const [showCriteriaForm, setShowCriteriaForm] = useState(false);

//   const criteriaList = [
//     { criteria: "Initial Thickness", controlParameter: "Output Thickness" },
//     { criteria: "Width range", controlParameter: "Output Width" },
//     { criteria: "Width jump", controlParameter: "Output Width" },
//     { criteria: "Width Down", controlParameter: "Output Width" },
//     { criteria: "Same Width limitaRolling", controlParameter: "Output Width" },
//     { criteria: "Thickness jump", controlParameter: "Output Thickness" },
//     { criteria: "Thickness down", controlParameter: "Output Thickness" },
//     { criteria: "Grade change", controlParameter: "Output grade" },
//     { criteria: "Rolling Length", controlParameter: "Total Rolling length of coils in a schedule" },
//     { criteria: "Tonnage", controlParameter: "Out mat weight" },
//     { criteria: "Number of coils", controlParameter: "count of total coils in a schedule" },
//   ];

//   const multiRangeCriteria = ["Width jump", "Width Down", "Thickness jump", "Thickness down", "Grade change"];

//   useEffect(() => {
//     const fetchRules = async () => {
//       const response = await getRules();
//       if (response.success) {
//         setRules(response.data);
//       } else {
//         alert("Failed to fetch rules: " + response.error);
//       }
//     };
//     fetchRules();
//   }, []);

//   const handleRowSelection = (rule) => {
//     setSelectedRule(rule);
//     setIsInserting(false);
//     setShowCriteriaForm(false);
//     const newParameterValues = {};
//     const newParameterStatus = {};

//     rule.criteria.forEach((crit) => {
//       newParameterValues[crit.criteria] = {
//         type: crit.parameterType,
//         value: crit.parameterValue,
//         ranges: crit.ranges.map((range) => ({ min: range.parameterMin, max: range.parameterMax })) || [],
//       };
//       newParameterStatus[crit.criteria] = crit.parameterStatus;
//     });

//     setParameterValues(newParameterValues);
//     setParameterStatus(newParameterStatus);
//   };

//   const handleParameterChange = (criteria, type) => {
//     setParameterValues((prev) => ({
//       ...prev,
//       [criteria]: { type, value: "", ranges: type === "Range" ? [{ min: "", max: "" }] : [] },
//     }));
//   };

//   const handleInputChange = (criteria, field, value, rangeIndex = 0) => {
//     setParameterValues((prev) => {
//       const current = prev[criteria] || { type: "", value: "", ranges: [] };
//       if (field === "value") {
//         return { ...prev, [criteria]: { ...current, value } };
//       } else {
//         const newRanges = [...current.ranges];
//         newRanges[rangeIndex] = { ...newRanges[rangeIndex], [field]: value };
//         return { ...prev, [criteria]: { ...current, ranges: newRanges } };
//       }
//     });
//   };

//   const addRange = (criteria) => {
//     setParameterValues((prev) => {
//       const current = prev[criteria] || { type: "Range", value: "", ranges: [] };
//       return {
//         ...prev,
//         [criteria]: {
//           ...current,
//           ranges: [...current.ranges, { min: "", max: "" }],
//         },
//       };
//     });
//   };

//   const handleParameterStatusChange = (criteria, status) => {
//     setParameterStatus((prev) => ({
//       ...prev,
//       [criteria]: status,
//     }));
//   };

//   const handleInsert = () => {
//     setIsInserting(true);
//     setSelectedRule(null);
//     setShowCriteriaForm(false);
//     setNewRule({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
//     setParameterValues({});
//     setParameterStatus({});
//   };

//   const handleSaveInsert = async () => {
//     const response = await createRule({
//       ...newRule,
//       criteria: [],
//     });

//     if (response.success) {
//       setRules((prev) => [...prev, response.data]);
//       setSelectedRule(response.data);
//       setIsInserting(false);
//       setShowCriteriaForm(true);
//       alert("Rule inserted successfully! Now add criteria.");
//     } else {
//       alert("Failed to insert rule: " + response.error);
//     }
//   };

  // const handleSaveCriteria = async () => {
  //   if (selectedRule) {
  //     const criteriaData = criteriaList.map(({ criteria, controlParameter }) => ({
  //       criteria,
  //       parameterValues: parameterValues[criteria] || { type: "", value: "", ranges: [] },
  //       controlParameterValues: { selectedOption: controlParameter },
  //       parameterStatus: parameterStatus[criteria] || "Enable",
  //     }));

  //     const response = await updateRule(selectedRule.ruleName, {
  //       ruleNo: selectedRule.ruleNo,
  //       ruleName: selectedRule.ruleName,
  //       remark: selectedRule.remark,
  //       criteria: criteriaData,
  //     });

  //     if (response.success) {
  //       setRules((prev) =>
  //         prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
  //       );
  //       setSelectedRule(response.data);
  //       setShowCriteriaForm(false);
  //       alert("Criteria saved successfully!");
  //     } else {
  //       alert("Failed to save criteria: " + response.error);
  //     }
  //   }
  // };

//   const handleUpdate = async () => {
//     if (selectedRule) {
//       const criteriaData = criteriaList.map(({ criteria, controlParameter }) => ({
//         criteria,
//         parameterValues: parameterValues[criteria] || { type: "", value: "", ranges: [] },
//         controlParameterValues: { selectedOption: controlParameter },
//         parameterStatus: parameterStatus[criteria] || "Enable",
//       }));

//       const response = await updateRule(selectedRule.ruleName, {
//         ruleNo: selectedRule.ruleNo,
//         ruleName: selectedRule.ruleName,
//         remark: selectedRule.remark,
//         criteria: criteriaData,
//       });

//       if (response.success) {
//         setRules((prev) =>
//           prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
//         );
//         setSelectedRule(response.data);
//         alert("Rule updated successfully!");
//       } else {
//         alert("Failed to update rule: " + response.error);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedRule) {
//       const response = await deleteRule(selectedRule.ruleName);
//       if (response.success) {
//         setRules((prev) => prev.filter((r) => r.ruleName !== selectedRule.ruleName));
//         setSelectedRule(null);
//         alert("Rule deleted successfully!");
//       } else {
//         alert("Failed to delete rule: " + response.error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-900 text-white">
//       {/* Search Inputs */}
//       <div className="mb-4 grid grid-cols-3 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Rule No."
//           value={searchRuleNo}
//           onChange={(e) => setSearchRuleNo(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//         <input
//           type="text"
//           placeholder="Search by Rule Name"
//           value={searchRuleName}
//           onChange={(e) => setSearchRuleName(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//         <input
//           type="text"
//           placeholder="Search by Remark"
//           value={searchRemark}
//           onChange={(e) => setSearchRemark(e.target.value)}
//           className="p-2 border border-gray-300 rounded w-full"
//         />
//       </div>

//       {/* Main Table */}
//       <table className="min-w-full border border-gray-300">
//         <thead>
//           <tr className="bg-gray-700">
//             <th className="border p-2"><input type="checkbox" /></th>
//             <th className="border p-2">Rule No.</th>
//             <th className="border p-2">Rule Name</th>
//             <th className="border p-2">Remark</th>
//             <th className="border p-2">Modify Date</th>
//             <th className="border p-2">Create Date</th>
//             <th className="border p-2">Created By</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rules.map((row) => (
//             <tr
//               key={row.id}
//               className={`cursor-pointer ${selectedRule?.ruleName === row.ruleName ? "bg-gray-700" : ""}`}
//               onClick={() => handleRowSelection(row)}
//             >
//               <td className="border p-2"><input type="checkbox" /></td>
//               <td className="border p-2">{row.ruleNo}</td>
//               <td className="border p-2">{row.ruleName}</td>
//               <td className="border p-2">{row.remark}</td>
//               <td className="border p-2">{new Date(row.modifyDate).toLocaleDateString()}</td>
//               <td className="border p-2">{new Date(row.createDate).toLocaleDateString()}</td>
//               <td className="border p-2">{row.createdBy}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="mb-4 flex space-x-4 mt-4">
//         <button onClick={handleInsert} className="bg-purple-400 text-white px-4 py-2 rounded">
//           Insert
//         </button>
//         <button
//           onClick={handleUpdate}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={!selectedRule || isInserting}
//         >
//           Update
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//           disabled={!selectedRule || isInserting}
//         >
//           Delete
//         </button>
//       </div>

//       {/* Insert Form */}
//       {isInserting && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">Insert New Rule</h3>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Rule No."
//               value={newRule.ruleNo}
//               onChange={(e) => setNewRule({ ...newRule, ruleNo: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Rule Name"
//               value={newRule.ruleName}
//               onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Remark"
//               value={newRule.remark}
//               onChange={(e) => setNewRule({ ...newRule, remark: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Created By"
//               value={newRule.createdBy}
//               onChange={(e) => setNewRule({ ...newRule, createdBy: e.target.value })}
//               className="p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//           <button
//             onClick={handleSaveInsert}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Save New Rule
//           </button>
//         </div>
//       )}

//       {/* Criteria Form */}
//       {(showCriteriaForm || selectedRule) && !isInserting && (
//         <div className="mt-6 text-white">
//           <h3 className="text-lg font-semibold mb-2">
//             {showCriteriaForm ? `Add Criteria for ${selectedRule.ruleName}` : `Details for ${selectedRule.ruleName}`}
//           </h3>
//           <table className="min-w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-700">
//                 <th className="border p-2">Criteria</th>
//                 <th className="border p-2">Parameter</th>
//                 <th className="border p-2">Control Parameter</th>
//                 <th className="border p-2">Parameter Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {criteriaList.map(({ criteria, controlParameter }) => (
//                 <tr
//                   key={criteria}
//                   className={`${parameterStatus[criteria] === "Disable" ? "bg-gray-500" : ""}`}
//                 >
//                   <td className="border p-2">{criteria}</td>
//                   <td className="border p-2">
//                     <div className="flex flex-col space-y-2">
//                       <select
//                         className="p-1 border border-gray-300 rounded text-white"
//                         value={parameterValues[criteria]?.type || ""}
//                         onChange={(e) => handleParameterChange(criteria, e.target.value)}
//                         disabled={parameterStatus[criteria] === "Disable"}
//                       >
//                         <option value="" className="text-black">Select</option>
//                         <option value="Input Value" className="text-black">Input Value</option>
//                         <option value="Range" className="text-black">Range</option>
//                       </select>
//                       {parameterValues[criteria]?.type === "Range" ? (
//                         <div className="space-y-2">
//                           {parameterValues[criteria]?.ranges.map((range, index) => (
//                             <div key={index} className="flex space-x-2">
//                               <input
//                                 type="number"
//                                 placeholder="Min"
//                                 className="p-1 border border-gray-300 rounded w-20"
//                                 value={range.min || ""}
//                                 onChange={(e) => handleInputChange(criteria, "min", e.target.value, index)}
//                                 disabled={parameterStatus[criteria] === "Disable"}
//                               />
//                               <span>to</span>
//                               <input
//                                 type="number"
//                                 placeholder="Max"
//                                 className="p-1 border border-gray-300 rounded w-20"
//                                 value={range.max || ""}
//                                 onChange={(e) => handleInputChange(criteria, "max", e.target.value, index)}
//                                 disabled={parameterStatus[criteria] === "Disable"}
//                               />
//                             </div>
//                           ))}
//                           {multiRangeCriteria.includes(criteria) && (
//                             <button
//                               onClick={() => addRange(criteria)}
//                               className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
//                               disabled={parameterStatus[criteria] === "Disable" || parameterValues[criteria]?.ranges.length >= 6}
//                             >
//                               Add Range
//                             </button>
//                           )}
//                         </div>
//                       ) : (
//                         parameterValues[criteria]?.type === "Input Value" && (
//                           <input
//                             type="text"
//                             placeholder="Enter Value"
//                             className="p-1 border border-gray-300 rounded w-full"
//                             value={parameterValues[criteria]?.value || ""}
//                             onChange={(e) => handleInputChange(criteria, "value", e.target.value)}
//                             disabled={parameterStatus[criteria] === "Disable"}
//                           />
//                         )
//                       )}
//                     </div>
//                   </td>
//                   <td className="border p-2">{controlParameter}</td>
//                   <td className="border p-2">
//                     <select
//                       className="p-1 border border-gray-300 rounded text-white"
//                       value={parameterStatus[criteria] || "Enable"}
//                       onChange={(e) => handleParameterStatusChange(criteria, e.target.value)}
//                     >
//                       <option value="Enable" className="text-black">Enable</option>
//                       <option value="Disable" className="text-black">Disable</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             onClick={handleSaveCriteria}
//             className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Save Criteria
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RuleTable;







"use client";
import { useState, useEffect } from "react";
import { getRules, createRule, updateRule, deleteRule } from "../actions/ruleActions";

const RuleTable = () => {
  const [searchRuleNo, setSearchRuleNo] = useState("");
  const [searchRuleName, setSearchRuleName] = useState("");
  const [searchRemark, setSearchRemark] = useState("");
  const [selectedRule, setSelectedRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [parameterStatus, setParameterStatus] = useState({});
  const [isInserting, setIsInserting] = useState(false);
  const [newRule, setNewRule] = useState({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [error, setError] = useState(null); // Added for error handling

  const criteriaList = [
    { criteria: "Initial Thickness", controlParameter: "Output Thickness" },
    { criteria: "Width range", controlParameter: "Output Width" },
    { criteria: "Width jump", controlParameter: "Output Width" },
    { criteria: "Width Down", controlParameter: "Output Width" },
    { criteria: "Same Width limitaRolling", controlParameter: "Output Width" },
    { criteria: "Thickness jump", controlParameter: "Output Thickness" },
    { criteria: "Thickness down", controlParameter: "Output Thickness" },
    { criteria: "Grade change", controlParameter: "Output grade" },
    { criteria: "Rolling Length", controlParameter: "Total Rolling length of coils in a schedule" },
    { criteria: "Tonnage", controlParameter: "Out mat weight" },
    { criteria: "Number of coils", controlParameter: "count of total coils in a schedule" },
  ];

  const multiRangeCriteria = ["Width jump", "Width Down", "Thickness jump", "Thickness down", "Grade change"];

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await getRules();
        if (response.success) {
          setRules(response.data || []); // Ensure rules is always an array
        } else {
          setError("Failed to fetch rules: " + response.error);
        }
      } catch (err) {
        setError("Error fetching rules: " + err.message);
      }
    };
    fetchRules();
  }, []);

  const handleRowSelection = (rule) => {
    setSelectedRule(rule);
    setIsInserting(false);
    setShowCriteriaForm(false);
    const newParameterValues = {};
    const newParameterStatus = {};

    rule.criteria.forEach((crit) => {
      if (crit.criteria === "Grade change") {
        newParameterValues[crit.criteria] = {
          type: crit.parameterType,
          value: crit.parameterType === "Input Value" ? crit.parameterValue || "" : "",
          ranges: crit.parameterType === "Range" 
            ? crit.ranges.map((range) => ({ fromGrade: range.parameterMin || "", toGrade: range.parameterMax || "" }))
            : [],
        };
      } else {
        newParameterValues[crit.criteria] = {
          type: crit.parameterType,
          value: crit.parameterValue || "",
          ranges: crit.ranges.map((range) => ({ min: range.parameterMin || "", max: range.parameterMax || "" })) || [],
        };
      }
      newParameterStatus[crit.criteria] = crit.parameterStatus;
    });

    setParameterValues(newParameterValues);
    setParameterStatus(newParameterStatus);
  };

  const handleParameterChange = (criteria, type) => {
    setParameterValues((prev) => ({
      ...prev,
      [criteria]: {
        type,
        value: type === "Input Value" ? "" : "",
        ranges: criteria === "Grade change" && type === "Range" 
          ? [{ fromGrade: "", toGrade: "" }] 
          : criteria !== "Grade change" && type === "Range" 
            ? [{ min: "", max: "" }] 
            : [],
      },
    }));
  };

  const handleInputChange = (criteria, field, value, rangeIndex = 0) => {
    setParameterValues((prev) => {
      const current = prev[criteria] || { type: "", value: "", ranges: [] };
      if (criteria === "Grade change") {
        if (field === "value") {
          return { ...prev, [criteria]: { ...current, value } };
        } else {
          const newRanges = [...current.ranges];
          newRanges[rangeIndex] = { ...newRanges[rangeIndex], [field]: value };
          return { ...prev, [criteria]: { ...current, ranges: newRanges } };
        }
      } else if (field === "value") {
        return { ...prev, [criteria]: { ...current, value } };
      } else {
        const newRanges = [...current.ranges];
        newRanges[rangeIndex] = { ...newRanges[rangeIndex], [field]: value };
        return { ...prev, [criteria]: { ...current, ranges: newRanges } };
      }
    });
  };

  const addRange = (criteria) => {
    setParameterValues((prev) => {
      const current = prev[criteria] || { type: "Range", value: "", ranges: [] };
      return {
        ...prev,
        [criteria]: {
          ...current,
          ranges: criteria === "Grade change" 
            ? [...current.ranges, { fromGrade: "", toGrade: "" }]
            : [...current.ranges, { min: "", max: "" }],
        },
      };
    });
  };

  const handleParameterStatusChange = (criteria, status) => {
    setParameterStatus((prev) => ({
      ...prev,
      [criteria]: status,
    }));
  };

  const handleInsert = () => {
    setIsInserting(true);
    setSelectedRule(null);
    setShowCriteriaForm(false);
    setNewRule({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
    setParameterValues({});
    setParameterStatus({});
  };

  const handleSaveInsert = async () => {
    try {
      const response = await createRule({
        ...newRule,
        criteria: [],
      });

      if (response.success) {
        setRules((prev) => [...prev, response.data]);
        setSelectedRule(response.data);
        setIsInserting(false);
        setShowCriteriaForm(true);
        alert("Rule inserted successfully! Now add criteria.");
      } else {
        setError("Failed to insert rule: " + response.error);
      }
    } catch (err) {
      setError("Error inserting rule" ,err.message);
    }
  };

  // const handleSaveCriteria = async () => {
  //   if (!selectedRule) return;
  //   try {
  //     const criteriaData = criteriaList.map(({ criteria, controlParameter }) => {
  //       const paramValues = parameterValues[criteria] || { type: "", value: "", ranges: [] };
  //       const sanitizedRanges = paramValues.ranges.map((range) => {
  //         if (criteria === "Grade change") {
  //           return {
  //             fromGrade: range.fromGrade || "",
  //             toGrade: range.toGrade || "",
  //           };
  //         } else {
  //           return {
  //             min: range.min !== undefined && range.min !== null ? String(range.min) : "",
  //             max: range.max !== undefined && range.max !== null ? String(range.max) : "",
  //           };
  //         }
  //       });
  
  //       return {
  //         criteria,
  //         parameterValues: criteria === "Grade change" && paramValues.type === "Range"
  //           ? { type: paramValues.type, ranges: sanitizedRanges }
  //           : {
  //               type: paramValues.type,
  //               value: paramValues.value || "",
  //               ranges: sanitizedRanges,
  //             },
  //         controlParameterValues: { selectedOption: controlParameter },
  //         parameterStatus: parameterStatus[criteria] || "Enable",
  //       };
  //     });
  
  //     console.log("Criteria Data to Save:", JSON.stringify(criteriaData, null, 2));
  
  //     const response = await updateRule(selectedRule.ruleName, {
  //       ruleNo: selectedRule.ruleNo,
  //       ruleName: selectedRule.ruleName,
  //       remark: selectedRule.remark || "",
  //       criteria: criteriaData,
  //     });
  
  //     if (response.success) {
  //       setRules((prev) =>
  //         prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
  //       );
  //       setSelectedRule(response.data);
  //       setShowCriteriaForm(false);
  //       alert("Criteria saved successfully!");
  //     } else {
  //       setError("Failed to save criteria: " + response.error);
  //     }
  //   } catch (err) {
  //     setError("Error saving criteria: " + err.message);
  //     console.error("Error in handleSaveCriteria:", err);
  //   }
  // };
  


  // const handleSaveCriteria = async () => {
  //   if (selectedRule) {
  //     const criteriaData = criteriaList.map(({ criteria, controlParameter }) => ({
  //       criteria,
  //       parameterValues: parameterValues[criteria] || { type: "", value: "", ranges: [] },
  //       controlParameterValues: { selectedOption: controlParameter },
  //       parameterStatus: parameterStatus[criteria] || "Enable",
  //     }));

  //     const response = await updateRule(selectedRule.ruleName, {
  //       ruleNo: selectedRule.ruleNo,
  //       ruleName: selectedRule.ruleName,
  //       remark: selectedRule.remark,
  //       criteria: criteriaData,
  //     });

  //     if (response.success) {
  //       setRules((prev) =>
  //         prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
  //       );
  //       setSelectedRule(response.data);
  //       setShowCriteriaForm(false);
  //       alert("Criteria saved successfully!");
  //     } else {
  //       alert("Failed to save criteria: " + response.error);
  //     }
  //   }
  // };


  const handleSaveCriteria = async () => {
    if (!selectedRule) return;
    try {
      const criteriaData = criteriaList.map(({ criteria, controlParameter }) => {
        const paramValues = parameterValues[criteria] || { type: "", value: "", ranges: [] };
        let processedParamValues = paramValues;
  
        if (paramValues.type === "Range" && Array.isArray(paramValues.ranges)) {
          const cleanedRanges = paramValues.ranges
            .filter(range => range !== null && typeof range === 'object')
            .map(range => {
              // Handle "Grade change" specifically
              if (criteria === "Grade change" && range.fromGrade && range.toGrade) {
                return {
                  min: String(range.fromGrade).trim(),
                  max: String(range.toGrade).trim()
                };
              }
              // Handle other criteria with min/max
              return {
                min: range.min !== undefined && range.min !== null ? String(range.min).trim() : null,
                max: range.max !== undefined && range.max !== null ? String(range.max).trim() : null
              };
            })
            .filter(range => range.min !== null || range.max !== null);
  
          console.log(`Criteria ${criteria} - cleaned ranges:`, JSON.stringify(cleanedRanges, null, 2));
  
          processedParamValues = {
            ...paramValues,
            ranges: cleanedRanges
          };
        }
  
        return {
          criteria,
          parameterValues: processedParamValues,
          controlParameterValues: { selectedOption: controlParameter },
          parameterStatus: parameterStatus[criteria] || "Enable",
        };
      });
  
      console.log("Sending criteria data to backend from handleSaveCriteria:", JSON.stringify(criteriaData, null, 2));
  
      const response = await updateRule(selectedRule.ruleName, {
        ruleNo: selectedRule.ruleNo,
        ruleName: selectedRule.ruleName,
        remark: selectedRule.remark,
        criteria: criteriaData,
      });
  
      if (response.success) {
        setRules((prev) =>
          prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
        );
        setSelectedRule(response.data);
        setShowCriteriaForm(false);
  
        const rangesSaved = response.data.criteria.some(crit => crit.ranges && crit.ranges.length > 0);
        if (rangesSaved) {
          alert("Criteria saved successfully with ranges!");
        } else {
          alert("Criteria saved but no ranges were saved. Check console for details.");
        }
      } else {
        setError("Failed to save criteria: " + response.error);
      }
    } catch (err) {
      setError("Error saving criteria: " + err.message);
      console.error("Error in handleSaveCriteria:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRule) return;
    try {
      const criteriaData = criteriaList.map(({ criteria, controlParameter }) => {
        const paramValues = parameterValues[criteria] || { type: "", value: "", ranges: [] };
        let processedParamValues = paramValues;
  
        if (paramValues.type === "Range" && Array.isArray(paramValues.ranges)) {
          const cleanedRanges = paramValues.ranges
            .filter(range => range !== null && typeof range === 'object')
            .map(range => {
              // Handle "Grade change" specifically
              if (criteria === "Grade change" && range.fromGrade && range.toGrade) {
                return {
                  min: String(range.fromGrade).trim(),
                  max: String(range.toGrade).trim()
                };
              }
              // Handle other criteria with min/max
              return {
                min: range.min !== undefined && range.min !== null ? String(range.min).trim() : null,
                max: range.max !== undefined && range.max !== null ? String(range.max).trim() : null
              };
            })
            .filter(range => range.min !== null || range.max !== null);
  
          console.log(`Criteria ${criteria} - cleaned ranges:`, JSON.stringify(cleanedRanges, null, 2));
  
          processedParamValues = {
            ...paramValues,
            ranges: cleanedRanges
          };
        }
  
        return {
          criteria,
          parameterValues: processedParamValues,
          controlParameterValues: { selectedOption: controlParameter },
          parameterStatus: parameterStatus[criteria] || "Enable",
        };
      });
  
      console.log("Sending criteria data to backend:", JSON.stringify(criteriaData, null, 2));
  
      const response = await updateRule(selectedRule.ruleName, {
        ruleNo: selectedRule.ruleNo,
        ruleName: selectedRule.ruleName,
        remark: selectedRule.remark,
        criteria: criteriaData,
      });
  
      if (response.success) {
        setRules((prev) =>
          prev.map((r) => (r.ruleName === selectedRule.ruleName ? response.data : r))
        );
        setSelectedRule(response.data);
  
        const rangesSaved = response.data.criteria.some(crit => crit.ranges && crit.ranges.length > 0);
        if (rangesSaved) {
          alert("Rule updated successfully with ranges!");
        } else {
          alert("Rule updated but no ranges were saved. Check console for details.");
        }
      } else {
        setError("Failed to update rule: " + response.error);
      }
    } catch (err) {
      setError("Error updating rule: " + err.message);
    }
  };

/**
 * Additional helper function to check if your ranges are properly formed in the UI
 */
const validateRanges = () => {
  let isValid = true;
  const validationErrors = [];
  
  criteriaList.forEach(({ criteria }) => {
    const paramValues = parameterValues[criteria] || { type: "", value: "", ranges: [] };
    
    if (paramValues.type === "Range") {
      if (!Array.isArray(paramValues.ranges)) {
        validationErrors.push(`${criteria}: Ranges is not an array`);
        isValid = false;
      } else if (paramValues.ranges.length === 0) {
        validationErrors.push(`${criteria}: No ranges defined`);
        isValid = false;
      } else {
        paramValues.ranges.forEach((range, index) => {
          if (range.min === undefined || range.min === "") {
            validationErrors.push(`${criteria} range ${index+1}: Missing min value`);
            isValid = false;
          }
          if (range.max === undefined || range.max === "") {
            validationErrors.push(`${criteria} range ${index+1}: Missing max value`);
            isValid = false;
          }
        });
      }
    }
  });
  
  return { isValid, errors: validationErrors };
};

// Add this to your handleUpdate function before sending the request
// const { isValid, errors } = validateRanges();
// if (!isValid) {
//   console.error("Range validation errors:", errors);
//   // alert("Please fix the following issues with your ranges:\n" + errors.join("\n"));
//   return;
// }
  const handleDelete = async () => {
    if (!selectedRule) return;
    try {
      const response = await deleteRule(selectedRule.ruleName);
      if (response.success) {
        setRules((prev) => prev.filter((r) => r.ruleName !== selectedRule.ruleName));
        setSelectedRule(null);
        alert("Rule deleted successfully!");
      } else {
        setError("Failed to delete rule: " + response.error);
      }
    } catch (err) {
      setError("Error deleting rule: " + err.message);
    }
  };

  // Render nothing if there's an error or loading state
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4  text-white">
      {/* Search Inputs */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Rule No."
          value={searchRuleNo}
          onChange={(e) => setSearchRuleNo(e.target.value)}
          className="p-2 border border-black text-black rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Rule Name"
          value={searchRuleName}
          onChange={(e) => setSearchRuleName(e.target.value)}
          className="p-2 border border-black text-black rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Remark"
          value={searchRemark}
          onChange={(e) => setSearchRemark(e.target.value)}
          className="p-2 border border-black text-black rounded w-full"
        />
      </div>

      {/* Main Table */}
      <table className="min-w-full border border-gray-300  bg-gray-900">
        <thead>
          <tr className="bg-gray-700">
            <th className="border p-2"><input type="checkbox" /></th>
            <th className="border p-2">Rule No.</th>
            <th className="border p-2">Rule Name</th>
            <th className="border p-2">Remark</th>
            <th className="border p-2">Modify Date</th>
            <th className="border p-2">Create Date</th>
            <th className="border p-2">Created By</th>
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td colSpan={7} className="border p-2 text-center">No rules found</td>
            </tr>
          ) : (
            rules.map((row) => (
              <tr
                key={row.id}
                className={`cursor-pointer ${selectedRule?.ruleName === row.ruleName ? "bg-gray-700" : ""}`}
                onClick={() => handleRowSelection(row)}
              >
                <td className="border p-2"><input type="checkbox" /></td>
                <td className="border p-2">{row.ruleNo}</td>
                <td className="border p-2">{row.ruleName}</td>
                <td className="border p-2">{row.remark || "N/A"}</td>
                <td className="border p-2">{new Date(row.modifyDate).toLocaleDateString()}</td>
                <td className="border p-2">{new Date(row.createDate).toLocaleDateString()}</td>
                <td className="border p-2">{row.createdBy}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mb-4 flex space-x-4 mt-4">
        <button onClick={handleInsert} className="bg-blue-600 text-white px-4 py-2 rounded">
          Insert
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!selectedRule || isInserting}
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-orange-500 text-white px-4 py-2 rounded"
          disabled={!selectedRule || isInserting}
        >
          Delete
        </button>
      </div>

      {/* Insert Form */}
      {isInserting && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Insert New Rule</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Rule No."
              value={newRule.ruleNo}
              onChange={(e) => setNewRule({ ...newRule, ruleNo: e.target.value })}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Rule Name"
              value={newRule.ruleName}
              onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Remark"
              value={newRule.remark}
              onChange={(e) => setNewRule({ ...newRule, remark: e.target.value })}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Created By"
              value={newRule.createdBy}
              onChange={(e) => setNewRule({ ...newRule, createdBy: e.target.value })}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <button
            onClick={handleSaveInsert}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save New Rule
          </button>
        </div>
      )}

      {/* Criteria Form */}
      {(showCriteriaForm || selectedRule) && !isInserting && (
        <div className="mt-6 text-white">
          <h3 className="text-lg font-semibold mb-2">
            {showCriteriaForm ? `Add Criteria for ${selectedRule?.ruleName}` : `Details for ${selectedRule?.ruleName}`}
          </h3>
          <table className="min-w-full border border-gray-300 bg-gray-900">
            <thead>
              <tr className="bg-gray-700">
                <th className="border p-2">Criteria</th>
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Control Parameter</th>
                <th className="border p-2">Parameter Status</th>
              </tr>
            </thead>
            <tbody>
              {criteriaList.map(({ criteria, controlParameter }) => (
                <tr
                  key={criteria}
                  className={`${parameterStatus[criteria] === "Disable" ? "bg-gray-500" : ""}`}
                >
                  <td className="border p-2">{criteria}</td>
                  <td className="border p-2">
                    <div className="flex flex-col space-y-2">
                      <select
                        className="p-1 border border-gray-300 rounded text-white"
                        value={parameterValues[criteria]?.type || ""}
                        onChange={(e) => handleParameterChange(criteria, e.target.value)}
                        disabled={parameterStatus[criteria] === "Disable"}
                      >
                        <option value="" className="text-black">Select</option>
                        <option value="Input Value" className="text-black">Input Value</option>
                        <option value="Range" className="text-black">Range</option>
                      </select>
                      {criteria === "Grade change" && parameterValues[criteria]?.type === "Range" ? (
                        <div className="space-y-2">
                          {parameterValues[criteria]?.ranges.map((range, index) => (
                            <div key={index} className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="From Grade (e.g., E250BR)"
                                className="p-1 border border-gray-300 rounded w-32"
                                value={range.fromGrade || ""}
                                onChange={(e) => handleInputChange(criteria, "fromGrade", e.target.value, index)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                              <span>to</span>
                              <input
                                type="text"
                                placeholder="To Grade (e.g., E350BR)"
                                className="p-1 border border-gray-300 rounded w-32"
                                value={range.toGrade || ""}
                                onChange={(e) => handleInputChange(criteria, "toGrade", e.target.value, index)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => addRange(criteria)}
                            className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                            disabled={parameterStatus[criteria] === "Disable" || parameterValues[criteria]?.ranges.length >= 6}
                          >
                            Add Range
                          </button>
                        </div>
                      ) : parameterValues[criteria]?.type === "Range" ? (
                        <div className="space-y-2">
                          {parameterValues[criteria]?.ranges.map((range, index) => (
                            <div key={index} className="flex space-x-2">
                              <input
                                type="number"
                                placeholder="Min"
                                className="p-1 border border-gray-300 rounded w-20"
                                value={range.min || ""}
                                onChange={(e) => handleInputChange(criteria, "min", e.target.value, index)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                              <span>to</span>
                              <input
                                type="number"
                                placeholder="Max"
                                className="p-1 border border-gray-300 rounded w-20"
                                value={range.max || ""}
                                onChange={(e) => handleInputChange(criteria, "max", e.target.value, index)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                            </div>
                          ))}
                          {multiRangeCriteria.includes(criteria) && (
                            <button
                              onClick={() => addRange(criteria)}
                              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                              disabled={parameterStatus[criteria] === "Disable" || parameterValues[criteria]?.ranges.length >= 6}
                            >
                              Add Range
                            </button>
                          )}
                        </div>
                      ) : (
                        parameterValues[criteria]?.type === "Input Value" && (
                          <input
                            type="text"
                            placeholder={criteria === "Grade change" ? "Enter Grade (e.g., E250BR)" : "Enter Value"}
                            className="p-1 border border-gray-300 rounded w-full"
                            value={parameterValues[criteria]?.value || ""}
                            onChange={(e) => handleInputChange(criteria, "value", e.target.value)}
                            disabled={parameterStatus[criteria] === "Disable"}
                          />
                        )
                      )}
                    </div>
                  </td>
                  <td className="border p-2">{controlParameter}</td>
                  <td className="border p-2">
                    <select
                      className="p-1 border border-gray-300 rounded text-white"
                      value={parameterStatus[criteria] || "Enable"}
                      onChange={(e) => handleParameterStatusChange(criteria, e.target.value)}
                    >
                      <option value="Enable" className="text-black">Enable</option>
                      <option value="Disable" className="text-black">Disable</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSaveCriteria}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
          >
            Save Criteria
          </button>
        </div>
      )}
    </div>
  );
};

export default RuleTable;