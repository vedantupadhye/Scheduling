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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrdersByDate, getMatchingInventory } from "../actions";

export default function SchedulePool() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [inventoryMatches, setInventoryMatches] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch orders when the date changes
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const fetchedOrders = await getOrdersByDate(selectedDate);
      const ordersWithStatus = fetchedOrders.map(order => ({
        ...order,
        orderStatus: order.orderStatus || "Not Allocated",
      }));
      setOrders(ordersWithStatus);
      setSelectedOrders([]);
      setInventoryMatches({});
      setLoading(false);
    }
    fetchOrders();
  }, [selectedDate]);

  // Fetch inventory when selected orders change
  useEffect(() => {
    async function fetchInventoryForSelectedOrders() {
      if (selectedOrders.length === 0) {
        setInventoryMatches({});
        return;
      }

      setLoading(true);
      const matches = {};
      for (const orderNo of selectedOrders) {
        const order = orders.find(o => o.orderNo === orderNo);
        if (order) {
          const inventory = await getMatchingInventory(order);
          matches[orderNo] = inventory;
        }
      }
      setInventoryMatches(matches);
      setLoading(false);
    }
    fetchInventoryForSelectedOrders();
  }, [selectedOrders, orders]);

  const handleOrderSelect = (orderNo) => {
    setSelectedOrders(prev =>
      prev.includes(orderNo) ? prev.filter(id => id !== orderNo) : [...prev, orderNo]
    );
  };

  const handleStatusChange = (orderNo, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderNo === orderNo ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Schedule Pool</h1>

        {/* Date Picker */}
        <div className="mb-8 flex items-center">
          <label className="text-white mr-4">Select Least Production Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-700 text-white border border-indigo-300 rounded p-2"
          />
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto">
          {/* Orders Table */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Orders</h2>
            <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700">
                      <TableHead className="text-white px-4 py-2"></TableHead>
                      <TableHead className="text-white px-4 py-2">Order No</TableHead>
                      <TableHead className="text-white px-4 py-2">Weight</TableHead>
                      <TableHead className="text-white px-4 py-2">Quantity</TableHead>
                      <TableHead className="text-white px-4 py-2">Delivery Date</TableHead>
                      <TableHead className="text-white px-4 py-2">Grade</TableHead>
                      <TableHead className="text-white px-4 py-2">Thickness</TableHead>
                      <TableHead className="text-white px-4 py-2">Width</TableHead>
                      <TableHead className="text-white px-4 py-2">Delivery Place</TableHead>
                      <TableHead className="text-white px-4 py-2">Customer</TableHead>
                      <TableHead className="text-white px-4 py-2">Least Prod. Date</TableHead>
                      <TableHead className="text-white px-4 py-2">Order Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-white text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-white text-center">
                          No orders found for this date
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.orderNo} className="hover:bg-indigo-600/20">
                          <TableCell className="px-4 py-2">
                            <Checkbox
                              checked={selectedOrders.includes(order.orderNo)}
                              onCheckedChange={() => handleOrderSelect(order.orderNo)}
                            />
                          </TableCell>
                          <TableCell className="text-white px-4 py-2">{order.orderNo}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.weight || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.quantity || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.orderDeliveryDate}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.grade}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.orderThickness || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.orderWidth || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.deliveryPlace}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.customerName || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">{order.leastProductionDate || '-'}</TableCell>
                          <TableCell className="text-white px-4 py-2">
                            <Select
                              value={order.orderStatus}
                              onValueChange={(value) => handleStatusChange(order.orderNo, value)}
                            >
                              <SelectTrigger className="bg-gray-700 text-white border-indigo-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 text-white border-indigo-300">
                                <SelectItem value="Not Allocated">Not Allocated</SelectItem>
                                <SelectItem value="Partially Allocated">Partially Allocated</SelectItem>
                                <SelectItem value="Allocated">Allocated</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Inventory Matches Table */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Matching Inventory</h2>
            <div className="bg-gray-800 shadow-lg border border-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700">
                      <TableHead className="text-white px-4 py-2">Material Name</TableHead>
                      <TableHead className="text-white px-4 py-2">Thickness</TableHead>
                      <TableHead className="text-white px-4 py-2">Width</TableHead>
                      <TableHead className="text-white px-4 py-2">Weight</TableHead>
                      <TableHead className="text-white px-4 py-2">Grade</TableHead>
                      <TableHead className="text-white px-4 py-2">Prod. Date</TableHead>
                      <TableHead className="text-white px-4 py-2">Yard Arrival</TableHead>
                      <TableHead className="text-white px-4 py-2">Residence</TableHead>
                      <TableHead className="text-white px-4 py-2">Yard No</TableHead>
                      <TableHead className="text-white px-4 py-2">Position</TableHead>
                      <TableHead className="text-white px-4 py-2">Mfg Location</TableHead>
                      <TableHead className="text-white px-4 py-2">Manufacturer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-white text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : selectedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-white text-center">
                          Select an order to view matching inventory
                        </TableCell>
                      </TableRow>
                    ) : Object.keys(inventoryMatches).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-white text-center">
                          No matching inventory found for selected orders
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedOrders.map((orderNo) => (
                        inventoryMatches[orderNo]?.length > 0 ? (
                          inventoryMatches[orderNo].map((item, index) => (
                            <TableRow key={`${orderNo}-${index}`} className="hover:bg-indigo-600/20">
                              <TableCell className="text-white px-4 py-2">{item.IN_MaterialName}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Thickness}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Width}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Weight}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.IN_Grade}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.In_ProductionDate}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.YardArrivalDate}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Residence_INYard}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.YardNO}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Position}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Manufacturing_Location}</TableCell>
                              <TableCell className="text-white px-4 py-2">{item.Manufacturer}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow key={`${orderNo}-no-match`}>
                            <TableCell colSpan={12} className="text-white text-center">
                              No matching inventory for Order {orderNo}
                            </TableCell>
                          </TableRow>
                        )
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}