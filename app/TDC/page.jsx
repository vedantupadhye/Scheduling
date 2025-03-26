"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TDCRollingValidator = () => {
  const [inputMethod, setInputMethod] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [tdcItems, setTdcItems] = useState([]);
  const [error, setError] = useState("");

  const validateCodeFormat = (code) => {
    if (!code.trim()) {
      setError("Code cannot be empty");
      return false;
    }

    // Check for invalid characters
    if (/[^TDC0-9_:]/.test(code)) {
      setError("Invalid characters detected. Only TDC, numbers, underscores and colons allowed.");
      return false;
    }

    // Basic pattern check for TDC codes
    const segmentPattern = /^TDC\d{2}_\d{2}_\d{2}$/;
    const segments = code.split(":");
    
    // Check each segment
    for (const segment of segments) {
      if (!segmentPattern.test(segment)) {
        setError(`Invalid segment format: "${segment}". Expected format like TDC11_05_07`);
        return false;
      }
      
      // Check the numeric parts are 2 digits
      const parts = segment.split("_");
      if (parts.some(part => part.length !== 2 && part !== parts[0])) {
        setError(`All numeric parts must be 2 digits. Error in segment: ${segment}`);
        return false;
      }
    }

    // Check we have between 1 and 6 segments
    if (segments.length < 1 || segments.length > 6) {
      setError(`Expected 1-6 code segments, found ${segments.length}`);
      return false;
    }

    setError("");
    return true;
  };

  const parseCode = (code) => {
    if (!validateCodeFormat(code)) {
      return [];
    }

    const segments = code.split(":");
    const itemNames = [
      "Entry thickness (mm)",
      "Positive tolerance (mm)",
      "Negative tolerance (mm)",
      "Max allowable camber (mm/m)",
      "Flatness Tolerance (%)",
      "Strip Crown",
    ];

    const parsedItems = [];
    segments.forEach((segment, index) => {
      if (index < itemNames.length) {
        const parts = segment.split("_");
        const min = parts.length > 1 ? `0.${parts[1]}` : "";
        const max = parts.length > 2 ? `0.${parts[2]}` : "";

        parsedItems.push({
          name: itemNames[index],
          min,
          max,
          result: "",
          remarks: "",
        });
      }
    });

    // Fill in any missing items
    for (let i = parsedItems.length; i < itemNames.length; i++) {
      parsedItems.push({
        name: itemNames[i],
        min: "",
        max: "",
        result: "",
        remarks: "",
      });
    }

    return parsedItems;
  };

  const handleManualEntry = () => {
    setInputMethod("manual");
    setError("");
    setTdcItems([]);
  };

  const handleBrowse = () => {
    setInputMethod("browse");
    setError("");
    setTdcItems([]);
  };

  const handleCodeSubmit = () => {
    const items = parseCode(codeInput);
    if (items.length > 0) {
      setTdcItems(items);
    }
  };

  const handleResultChange = (index, value) => {
    const updatedItems = [...tdcItems];
    updatedItems[index].result = value;
    setTdcItems(updatedItems);
  };

  const handleRemarksChange = (index, value) => {
    const updatedItems = [...tdcItems];
    updatedItems[index].remarks = value;
    setTdcItems(updatedItems);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Table headers
    const headers = [["Name", "TDC Min", "TDC Max", "Result", "Remarks"]];

    // Table rows
    const data = tdcItems.map((item) => [
      item.name,
      item.min,
      item.max,
      item.result === "Pass" ? "✓" : item.result === "Fail" ? "X" : "",
      item.remarks,
    ]);

    // Add title
    doc.text("TDC Rolling Validation Report", 14, 10);

    // Generate table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: {
        3: { cellWidth: 20 }, // Adjust column width for "Result"
        4: { cellWidth: 40 }, // Adjust column width for "Remarks"
      },
    });

    // Save the PDF
    doc.save("TDC_Rolling_Validation.pdf");
  };

  return (
    <Card className="w-full min-h-screen bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">TDC Rolling Validator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={handleManualEntry}
            variant={inputMethod === "manual" ? "default" : "outline"}
          >
            Enter Manually
          </Button>
          <Button
            onClick={handleBrowse}
            variant={inputMethod === "browse" ? "default" : "outline"}
          >
            Browse
          </Button>
        </div>

        {inputMethod === "manual" && (
          <div className="mb-6">
            <div className="flex space-x-4">
              <Input
                placeholder="Enter code (e.g., TDC11_05_07:TDC12_09_12:TDC13_04_09)"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  setError("");
                }}
                className="flex-1"
              />
              <Button
                className="bg-blue-500 text-white cursor-pointer"
                onClick={handleCodeSubmit}
              >
                Submit
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Format: TDC11_05_07:TDC12_09_12:TDC13_04_09 where:<br/>
              - TDC11 is entry thickness<br/>
              - 05_07 indicates tolerance of 0.5 to 0.7 mm<br/>
              - Separate multiple parameters with colons (:)
            </p>
          </div>
        )}

        {inputMethod === "browse" && (
          <div className="mb-6">
            <Input type="file" className="mb-4" />
            <Button>Upload</Button>
          </div>
        )}

        {tdcItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Validation Results</h3>
            <div className="overflow-x-auto">
              <Table className="w-full border border-gray-700">
                <TableHeader className="bg-gray-700 border-b border-gray-300">
                  <TableRow className="divide-x bg-gray-700">
                    <TableHead className="px-4 py-2">Name</TableHead>
                    <TableHead className="px-4 py-2">TDC Min</TableHead>
                    <TableHead className="px-4 py-2">TDC Max</TableHead>
                    <TableHead className="px-4 py-2">Result</TableHead>
                    <TableHead className="px-4 py-2">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tdcItems.map((item, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-300 divide-x divide-gray-300"
                    >
                      <TableCell className="px-4 py-2">{item.name}</TableCell>
                      <TableCell className="px-4 py-2">{item.min}</TableCell>
                      <TableCell className="px-4 py-2">{item.max}</TableCell>
                      <TableCell className="px-4 py-2">
                        <select
                          className="p-2 border bg-gray-700 border-gray-300 rounded w-full"
                          value={item.result}
                          onChange={(e) =>
                            handleResultChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Result</option>
                          <option
                            value="Pass"
                            className="text-green-500 text-lg font-bold"
                          >
                            ✅ Pass
                          </option>
                          <option
                            value="Fail"
                            className="text-red-500 text-lg font-bold"
                          >
                            ❌ Fail
                          </option>
                        </select>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            handleRemarksChange(index, e.target.value)
                          }
                          placeholder="Add remarks"
                          className="border border-gray-300 rounded p-2 w-full bg-gray-700"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button 
              className="mt-4 bg-green-500 text-white hover:bg-green-600"
              onClick={exportToPDF}
            >
              Export to PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TDCRollingValidator;