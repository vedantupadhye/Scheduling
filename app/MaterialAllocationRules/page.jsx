"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getMaterialAllocationRules, upsertMaterialAllocationRule } from "../actions";

export default function MaterialAllocationRulesPage() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    orderParameter: "Order Thickness",
    logic: "Equal To",
    parameter: "",
    materialParameter: "IN_Thickness",
    status: "Active",
  });
  const [editingRule, setEditingRule] = useState(null);
  const [error, setError] = useState(null);

  // Fetch rules on mount and after updates
  const fetchRules = async () => {
    try {
      const fetchedRules = await getMaterialAllocationRules();
      setRules(fetchedRules);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rules: " + err.message);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleInputChange = (field, value) => {
    setNewRule(prev => ({
      ...prev,
      [field]: value,
      ...(field === "orderParameter" && {
        materialParameter: value === "Order Thickness" ? "IN_Thickness" : "IN_Width",
      }),
      ...(field === "logic" && value === "Equal To" && { parameter: "Equal to or same" }),
      ...(field === "logic" && value !== "Equal To" && prev.logic === "Equal To" && { parameter: "" }),
    }));
  };

  const handleAddRule = async () => {
    if (newRule.logic !== "Equal To" && (!newRule.parameter || isNaN(newRule.parameter))) {
      setError("Please enter a valid numeric parameter");
      return;
    }

    try {
      const ruleToAdd = { 
        ...newRule, 
        parameter: newRule.logic === "Equal To" ? 0 : parseFloat(newRule.parameter) // Default to 0 for "Equal To"
      };
      await upsertMaterialAllocationRule(ruleToAdd);
      await fetchRules();
      setNewRule({
        orderParameter: "Order Thickness",
        logic: "Equal To",
        parameter: "",
        materialParameter: "IN_Thickness",
        status: "Active",
      });
      setError(null);
    } catch (err) {
      setError("Failed to add rule: " + err.message);
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule || (newRule.logic !== "Equal To" && (!newRule.parameter || isNaN(newRule.parameter)))) {
      setError("Please enter a valid numeric parameter");
      return;
    }

    try {
      const ruleToUpdate = { 
        ...newRule, 
        id: editingRule.id, 
        parameter: newRule.logic === "Equal To" ? 0 : parseFloat(newRule.parameter) 
      };
      await upsertMaterialAllocationRule(ruleToUpdate);
      await fetchRules();
      setNewRule({
        orderParameter: "Order Thickness",
        logic: "Equal To",
        parameter: "",
        materialParameter: "IN_Thickness",
        status: "Active",
      });
      setEditingRule(null);
      setError(null);
    } catch (err) {
      setError("Failed to update rule: " + err.message);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await upsertMaterialAllocationRule({ id, status: "Inactive" });
      await fetchRules();
      setError(null);
    } catch (err) {
      setError("Failed to delete rule: " + err.message);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      orderParameter: rule.orderParameter,
      logic: rule.logic,
      parameter: rule.logic === "Equal To" ? "Equal to or same" : rule.parameter.toString(),
      materialParameter: rule.materialParameter,
      status: rule.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setNewRule({
      orderParameter: "Order Thickness",
      logic: "Equal To",
      parameter: "",
      materialParameter: "IN_Thickness",
      status: "Active",
    });
    setError(null);
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Material Allocation Rules</h1>

        {/* Rule Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-white mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingRule ? "Edit Rule" : "Add New Rule"}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              value={newRule.orderParameter}
              onValueChange={(value) => handleInputChange("orderParameter", value)}
            >
              <SelectTrigger className="bg-gray-700 text-white border-indigo-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-indigo-300">
                <SelectItem value="Order Thickness">Order Thickness</SelectItem>
                <SelectItem value="Order Width">Order Width</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newRule.logic}
              onValueChange={(value) => handleInputChange("logic", value)}
            >
              <SelectTrigger className="bg-gray-700 text-white border-indigo-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-indigo-300">
                <SelectItem value="Less Than">Less Than</SelectItem>
                <SelectItem value="Less Than Equal To">Less Than Equal To</SelectItem>
                <SelectItem value="Equal To">Equal To</SelectItem>
                <SelectItem value="More Than">More Than</SelectItem>
                <SelectItem value="More Than Equal To">More Than Equal To</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text" // Changed to text to display "Equal to or same"
              value={newRule.parameter}
              onChange={(e) => newRule.logic !== "Equal To" && handleInputChange("parameter", e.target.value)}
              placeholder={newRule.logic === "Equal To" ? "Equal to or same" : "Parameter (e.g., 0.5)"}
              disabled={newRule.logic === "Equal To"}
              className="bg-gray-700 text-white border-indigo-300"
            />

            <Input
              value={newRule.materialParameter}
              disabled
              className="bg-gray-700 text-white border-indigo-300"
            />

            <Select
              value={newRule.status}
              onValueChange={(value) => handleInputChange("logic", value)}
            >
              <SelectTrigger className="bg-gray-700 text-white border-indigo-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-indigo-300">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-4">
            {!editingRule && (
              <Button
                onClick={handleAddRule}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Insert Rule
              </Button>
            )}
            {editingRule && (
              <>
                <Button
                  onClick={handleUpdateRule}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Update Rule
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-white text-white"
                >
                  Cancel Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700">
                  <TableHead className="text-white px-4 py-2">Order Parameter</TableHead>
                  <TableHead className="text-white px-4 py-2">Logic</TableHead>
                  <TableHead className="text-white px-4 py-2">Parameter</TableHead>
                  <TableHead className="text-white px-4 py-2">Material Parameter</TableHead>
                  <TableHead className="text-white px-4 py-2">Status</TableHead>
                  <TableHead className="text-white px-4 py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-white text-center">
                      No active rules found
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id} className="hover:bg-indigo-600/20">
                      <TableCell className="text-white px-4 py-2">{rule.orderParameter}</TableCell>
                      <TableCell className="text-white px-4 py-2">{rule.logic}</TableCell>
                      <TableCell className="text-white px-4 py-2">
                        {rule.logic === "Equal To" ? "Equal to or same" : rule.parameter}
                      </TableCell>
                      <TableCell className="text-white px-4 py-2">{rule.materialParameter}</TableCell>
                      <TableCell className="text-white px-4 py-2">{rule.status}</TableCell>
                      <TableCell className="text-white px-4 py-2 flex gap-2">
                        <Button
                          onClick={() => handleEditRule(rule)}
                          variant="outline"
                          className="border-white text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteRule(rule.id)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}