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
  const [logicValues, setLogicValues] = useState({});
  const [parameterStatus, setParameterStatus] = useState({});
  const [controlParameterValues, setControlParameterValues] = useState({});
  const [isInserting, setIsInserting] = useState(false);
  const [newRule, setNewRule] = useState({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);

  const criteriaList = [
    "Thickness Change",
    "Thickness Reduction",
    "Grade Change",
    "Initial Thickness",
    "Rolling Length",
    "Rolling Tonnage",
    "No. of Coils",
  ];

  const controlParameterOptions = [
    "Thickness Change - Input Thickness",
    "Thickness Reduction - Output Thickness",
    "Grade Change - Input Grade",
    "Initial Thickness - Input Thickness",
    "Rolling Length - Constant Value",
    "Rolling Tonnage - Constant Value",
    "No. of Coils - Constant Value",
  ];

  useEffect(() => {
    const fetchRules = async () => {
      const response = await getRules();
      if (response.success) {
        setRules(response.data);
      } else {
        alert("Failed to fetch rules: " + response.error);
      }
    };
    fetchRules();
  }, []);

  const handleRowSelection = (rule) => {
    setSelectedRule(rule);
    setIsInserting(false);
    setShowCriteriaForm(false);
    const newParameterValues = {};
    const newLogicValues = {};
    const newParameterStatus = {};
    const newControlParameterValues = {};

    rule.criteria.forEach((crit) => {
      newParameterValues[crit.criteria] = {
        type: crit.parameterType,
        value: crit.parameterValue,
        min: crit.parameterMin,
        max: crit.parameterMax,
      };
      newLogicValues[crit.criteria] = crit.logic;
      newParameterStatus[crit.criteria] = crit.parameterStatus;
      newControlParameterValues[crit.criteria] = {
        selectedOption: crit.controlParameter,
        inputType: crit.controlInputType,
        value: crit.controlValue,
        min: crit.controlMin,
        max: crit.controlMax,
      };
    });

    setParameterValues(newParameterValues);
    setLogicValues(newLogicValues);
    setParameterStatus(newParameterStatus);
    setControlParameterValues(newControlParameterValues);
  };

  const handleParameterChange = (criteria, type) => {
    setParameterValues((prev) => ({
      ...prev,
      [criteria]: { type, value: "", min: "", max: "" },
    }));
  };

  const handleInputChange = (criteria, field, value) => {
    setParameterValues((prev) => ({
      ...prev,
      [criteria]: { ...prev[criteria], [field]: value },
    }));
  };

  const handleLogicChange = (criteria, value) => {
    setLogicValues((prev) => ({
      ...prev,
      [criteria]: value,
    }));
  };

  const handleParameterStatusChange = (criteria, status) => {
    setParameterStatus((prev) => ({
      ...prev,
      [criteria]: status,
    }));
  };

  const handleControlParameterChange = (criteria, selectedOption) => {
    setControlParameterValues((prev) => ({
      ...prev,
      [criteria]: {
        selectedOption,
        inputType: "",
        value: "",
        min: "",
        max: "",
      },
    }));
  };

  const handleControlInputTypeChange = (criteria, inputType) => {
    setControlParameterValues((prev) => ({
      ...prev,
      [criteria]: {
        ...prev[criteria],
        inputType,
        value: inputType === "Range" ? "" : prev[criteria].value,
        min: "",
        max: "",
      },
    }));
  };

  const handleControlInputValueChange = (criteria, field, value) => {
    setControlParameterValues((prev) => ({
      ...prev,
      [criteria]: {
        ...prev[criteria],
        [field]: value,
      },
    }));
  };

  const isConstantValueParameter = (selectedOption) => {
    return selectedOption && selectedOption.includes("Constant Value");
  };

  const handleInsert = () => {
    setIsInserting(true);
    setSelectedRule(null);
    setShowCriteriaForm(false);
    setNewRule({ ruleNo: "", ruleName: "", remark: "", createdBy: "" });
    setParameterValues({});
    setLogicValues({});
    setParameterStatus({});
    setControlParameterValues({});
  };

  const handleSaveInsert = async () => {
    const response = await createRule({
      ...newRule,
      criteria: [], // Initially no criteria
    });

    if (response.success) {
      setRules((prev) => [...prev, response.data]);
      setSelectedRule(response.data);
      setIsInserting(false);
      setShowCriteriaForm(true); // Show criteria form after insert
      alert("Rule inserted successfully! Now add criteria.");
    } else {
      alert("Failed to insert rule: " + response.error);
    }
  };

  const handleSaveCriteria = async () => {
    if (selectedRule) {
      const criteriaData = criteriaList.map((criteria) => ({
        criteria,
        parameterValues: parameterValues[criteria] || {},
        logicValues: logicValues[criteria] || "<",
        controlParameterValues: controlParameterValues[criteria] || {},
        parameterStatus: parameterStatus[criteria] || "Enable",
      }));

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
        alert("Criteria saved successfully!");
      } else {
        alert("Failed to save criteria: " + response.error);
      }
    }
  };

  const handleUpdate = async () => {
    if (selectedRule) {
      const criteriaData = criteriaList.map((criteria) => ({
        criteria,
        parameterValues: parameterValues[criteria] || {},
        logicValues: logicValues[criteria] || "<",
        controlParameterValues: controlParameterValues[criteria] || {},
        parameterStatus: parameterStatus[criteria] || "Enable",
      }));

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
        alert("Rule updated successfully!");
      } else {
        alert("Failed to update rule: " + response.error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedRule) {
      const response = await deleteRule(selectedRule.ruleName);
      if (response.success) {
        setRules((prev) => prev.filter((r) => r.ruleName !== selectedRule.ruleName));
        setSelectedRule(null);
        alert("Rule deleted successfully!");
      } else {
        alert("Failed to delete rule: " + response.error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white">   
      {/* Search Inputs */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Rule No."
          value={searchRuleNo}
          onChange={(e) => setSearchRuleNo(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Rule Name"
          value={searchRuleName}
          onChange={(e) => setSearchRuleName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Remark"
          value={searchRemark}
          onChange={(e) => setSearchRemark(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Main Table */}
      <table className="min-w-full border border-gray-300">
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
          {rules.map((row) => (
            <tr
              key={row.id}
              className={`cursor-pointer ${selectedRule?.ruleName === row.ruleName ? "bg-gray-700" : ""}`}
              onClick={() => handleRowSelection(row)}
            >
              <td className="border p-2"><input type="checkbox" /></td>
              <td className="border p-2">{row.ruleNo}</td>
              <td className="border p-2">{row.ruleName}</td>
              <td className="border p-2">{row.remark}</td>
              <td className="border p-2">{new Date(row.modifyDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(row.createDate).toLocaleDateString()}</td>
              <td className="border p-2">{row.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-4 flex space-x-4 mt-4">
        <button onClick={handleInsert} className="bg-purple-400 text-white px-4 py-2 rounded">
          Insert
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!selectedRule || isInserting}
        >
          Update 
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
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

      {/* Criteria Form or Secondary Table */}
      {(showCriteriaForm || selectedRule) && !isInserting && (
        <div className="mt-6 text-white">
          <h3 className="text-lg font-semibold mb-2">
            {showCriteriaForm ? `Add Criteria for ${selectedRule.ruleName}` : `Details for ${selectedRule.ruleName}`}
          </h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-700">
                <th className="border p-2">Criteria</th>
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Logic</th>
                <th className="border p-2">Control Parameter</th>
                <th className="border p-2">Parameter Status</th>
              </tr>
            </thead>
            <tbody>
              {criteriaList.map((criteria) => (
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
                      {parameterValues[criteria]?.type === "Range" ? (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            className="p-1 border border-gray-300 rounded w-20"
                            value={parameterValues[criteria]?.min || ""}
                            onChange={(e) => handleInputChange(criteria, "min", e.target.value)}
                            disabled={parameterStatus[criteria] === "Disable"}
                          />
                          <span>to</span>
                          <input
                            type="number"
                            placeholder="Max"
                            className="p-1 border border-gray-300 rounded w-20"
                            value={parameterValues[criteria]?.max || ""}
                            onChange={(e) => handleInputChange(criteria, "max", e.target.value)}
                            disabled={parameterStatus[criteria] === "Disable"}
                          />
                        </div>
                      ) : (
                        parameterValues[criteria]?.type === "Input Value" && (
                          <input
                            type="text"
                            placeholder="Enter Value"
                            className="p-1 border border-gray-300 rounded w-full"
                            value={parameterValues[criteria]?.value || ""}
                            onChange={(e) => handleInputChange(criteria, "value", e.target.value)}
                            disabled={parameterStatus[criteria] === "Disable"}
                          />
                        )
                      )}
                    </div>
                  </td>
                  <td className="border p-2">
                    <select
                      className="p-1 border border-gray-300 rounded text-white"
                      value={logicValues[criteria] || "<"}
                      onChange={(e) => handleLogicChange(criteria, e.target.value)}
                      disabled={parameterStatus[criteria] === "Disable"}
                    >
                      <option value="<" className="text-black">less than</option>
                      <option value="<=" className="text-black">≤</option>
                      <option value=">" className="text-black">greater than</option>
                      <option value=">=" className="text-black">≥</option>
                      <option value="=" className="text-black">=</option>
                      <option value="between" className="text-black">In Between</option>
                      <option value="not-between" className="text-black">Not In Between</option>
                    </select>
                  </td>
                  <td className="border p-2 ">
                    <div className="flex flex-col space-y-2">
                      <select
                        className="p-1 border border-gray-300 rounded text-white"
                        value={controlParameterValues[criteria]?.selectedOption || ""}
                        onChange={(e) => handleControlParameterChange(criteria, e.target.value)}
                        disabled={parameterStatus[criteria] === "Disable"}
                      >
                        <option value="" className="text-black">Select Control Parameter</option>
                        {controlParameterOptions.map((option) => (
                          <option key={option} value={option} className="text-black">
                            {option}
                          </option>
                        ))}
                      </select>
                      {isConstantValueParameter(controlParameterValues[criteria]?.selectedOption) && (
                        <div className="space-y-2">
                          <select
                            className="p-1 border border-gray-300 rounded text-white"
                            value={controlParameterValues[criteria]?.inputType || ""}
                            onChange={(e) => handleControlInputTypeChange(criteria, e.target.value)}
                            disabled={parameterStatus[criteria] === "Disable"}
                          >
                            <option value="" className="text-black">Select Input Type</option>
                            <option value="Value" className="text-black">Value</option>
                            <option value="Range" className="text-black">Range</option>
                          </select>
                          {controlParameterValues[criteria]?.inputType === "Range" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                placeholder="Min"
                                className="p-1 border border-gray-300 rounded w-20"
                                value={controlParameterValues[criteria]?.min || ""}
                                onChange={(e) => handleControlInputValueChange(criteria, "min", e.target.value)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                              <span className="text-white">to</span>
                              <input
                                type="number"
                                placeholder="Max"
                                className="p-1 border border-gray-300 rounded w-20"
                                value={controlParameterValues[criteria]?.max || ""}
                                onChange={(e) => handleControlInputValueChange(criteria, "max", e.target.value)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                            </div>
                          ) : (
                            controlParameterValues[criteria]?.inputType === "Value" && (
                              <input
                                type="text"
                                placeholder="Enter Value"
                                className="p-1 border border-gray-300 rounded w-full"
                                value={controlParameterValues[criteria]?.value || ""}
                                onChange={(e) => handleControlInputValueChange(criteria, "value", e.target.value)}
                                disabled={parameterStatus[criteria] === "Disable"}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </td>
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
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Criteria
          </button>
        </div>
      )}
    </div>
  );
};

export default RuleTable;

      
           