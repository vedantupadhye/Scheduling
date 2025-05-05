"use client";

import React, { useState, useEffect } from "react";
import { getOrders } from "../actions/orders";
import StackedBarChartServer from "../components/StackedBarChartServer";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      console.log("Fetched Orders:", data);
      setOrders(data);
    }
    fetchOrders();
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (sortConfig.key.includes("Date")) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (!isNaN(Number(aValue))) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        return aValue < bValue
          ? sortConfig.direction === "ascending" ? -1 : 1
          : aValue > bValue
          ? sortConfig.direction === "ascending" ? 1 : -1
          : 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const getSortIndicator = (columnName) => {
    if (sortConfig.key !== columnName) return "⇅";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Order Analysis</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="border border-gray-600 p-3 cursor-pointer" onClick={() => requestSort("orderNo")}>
                Order No. {getSortIndicator("orderNo")}
              </th>
              <th className="border border-gray-600 p-3 cursor-pointer" onClick={() => requestSort("quantity")}>
                Quantity {getSortIndicator("quantity")}
              </th>
              <th className="border border-gray-600 p-3">Produced Quantity (Weight)</th>
              <th className="border border-gray-600 p-3">Produced Quantity (Number)</th>
              <th className="border border-gray-600 p-3">Balance (Weight)</th>
              <th className="border border-gray-600 p-3">Balance (Number)</th>
              <th className="border border-gray-600 p-3 cursor-pointer" onClick={() => requestSort("leastProductionDate")}>
                Least Production Date {getSortIndicator("leastProductionDate")}
              </th>
              <th className="border border-gray-600 p-3 cursor-pointer" onClick={() => requestSort("orderDeliveryDate")}>
                Delivery Date {getSortIndicator("orderDeliveryDate")}
              </th>
            </tr>
          </thead>
          <tbody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order, index) => {
              const dateDiff = order.leastProductionDate
                ? (new Date(order.leastProductionDate) - new Date()) / (1000 * 60 * 60 * 24)
                : null;

              const rowColor =
                dateDiff !== null
                  ? dateDiff <= 2
                    ? "bg-red-700 text-white"
                    : dateDiff <= 5
                    ? "bg-red-500 text-white"
                    : ""
                  : "";

              return (
                <tr
                  key={index}
                  className={`text-center border border-gray-600 hover:bg-gray-700 transition ${rowColor}`}
                >
                  <td className="p-3 border border-gray-600">{order.orderNo}</td>
                  <td className="p-3 border border-gray-600">{order.quantity}</td>
                  <td className="p-3 border border-gray-600">{order.producedQuantityWeight}</td>
                  <td className="p-3 border border-gray-600">{order.producedQuantityNumber}</td>
                  <td className="p-3 border border-gray-600">{order.balanceWeight}</td>
                  <td className="p-3 border border-gray-600">{order.balanceNumber}</td>
                  <td className="p-3 border border-gray-600">
                    {order.leastProductionDate ? new Date(order.leastProductionDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 border border-gray-600">
                    {order.orderDeliveryDate ? new Date(order.orderDeliveryDate).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-400">
                No orders available
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <div>
        <StackedBarChartServer />
      </div>
    </div>
  );
};

export default Page;
