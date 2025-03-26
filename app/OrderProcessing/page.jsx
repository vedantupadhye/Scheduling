"use client";

import { useState, useEffect } from "react";
import { getOrders } from "../actions/orders"; // ✅ Import direct DB query

export default function OrderProcessingTable() {
  const [orders, setOrders] = useState([]);

  // Fetch orders when component mounts
  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders(); // ✅ Fetch data
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Order Processing</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order No.</th>
            <th className="border p-2">Time to Ship</th>
            <th className="border p-2">Time for Quality Check</th>
            <th className="border p-2">Least Production Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="border p-2">{order.orderNo}</td>
              <td className="border p-2">
                {order.timeToShip
                  ? new Date(order.timeToShip).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="border p-2">
                {order.timeForQualityCheck
                  ? new Date(order.timeForQualityCheck).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="border p-2">
                {order.leastProductionDate
                  ? new Date(order.leastProductionDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
