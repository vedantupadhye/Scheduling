'use client';

import { useState } from 'react';

export default function InventoryClient({ initialInventory }) {
  const [inventory] = useState(initialInventory || []);
  const [filters, setFilters] = useState({
    materialName: '',
    manufacturingLocation: '',
    manufacturer: '',
    thickness: { min: '', max: '' },
    width: { min: '', max: '' },
    weight: { min: '', max: '' },
  });

  // Apply filters to the data
  const filteredInventory = inventory.filter(item => {
    // Text-based filters
    const nameMatch = item.IN_MaterialName.toLowerCase().includes(filters.materialName.toLowerCase());
    const locationMatch = item.Manufacturing_Location.toLowerCase().includes(filters.manufacturingLocation.toLowerCase());
    const manufacturerMatch = item.Manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase());
    
    // Range filters
    const thicknessMatch = 
      (filters.thickness.min === '' || item.IN_Thickness >= parseFloat(filters.thickness.min)) &&
      (filters.thickness.max === '' || item.IN_Thickness <= parseFloat(filters.thickness.max));
    
    const widthMatch = 
      (filters.width.min === '' || item.IN_Width >= parseFloat(filters.width.min)) &&
      (filters.width.max === '' || item.IN_Width <= parseFloat(filters.width.max));
    
    const weightMatch = 
      (filters.weight.min === '' || item.IN_Weight >= parseFloat(filters.weight.min)) &&
      (filters.weight.max === '' || item.IN_Weight <= parseFloat(filters.weight.max));
    
    return nameMatch && locationMatch && manufacturerMatch && thicknessMatch && widthMatch && weightMatch;
  });

  // Format date consistently for both server and client
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  // Update filter values
  const handleFilterChange = (e, filterType, rangeType) => {
    if (rangeType) {
      setFilters({
        ...filters,
        [filterType]: {
          ...filters[filterType],
          [rangeType]: e.target.value
        }
      });
    } else {
      setFilters({
        ...filters,
        [filterType]: e.target.value
      });
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      materialName: '',
      manufacturingLocation: '',
      manufacturer: '',
      thickness: { min: '', max: '' },
      width: { min: '', max: '' },
      weight: { min: '', max: '' },
    });
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-4">Inventory</h1>
      
      {/* Filters Section */}
      <div className="bg-gray-900 p-4 mb-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Text search filters */}
          <div>
            <label className="block text-sm font-medium mb-1">Material Name</label>
            <input
              type="text"
              value={filters.materialName}
              onChange={(e) => handleFilterChange(e, 'materialName')}
              className="w-full p-2 border rounded"
              placeholder="Search material name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Manufacturing Location</label>
            <input
              type="text"
              value={filters.manufacturingLocation}
              onChange={(e) => handleFilterChange(e, 'manufacturingLocation')}
              className="w-full p-2 border rounded"
              placeholder="Search location..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer</label>
            <input
              type="text"
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange(e, 'manufacturer')}
              className="w-full p-2 border rounded"
              placeholder="Search manufacturer..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Range filters */}
          <div>
            <label className="block text-sm font-medium mb-1">Thickness Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.thickness.min}
                onChange={(e) => handleFilterChange(e, 'thickness', 'min')}
                className="w-full p-2 border rounded"
                placeholder="Min"
                step="0.1"
              />
              <input
                type="number"
                value={filters.thickness.max}
                onChange={(e) => handleFilterChange(e, 'thickness', 'max')}
                className="w-full p-2 border rounded"
                placeholder="Max"
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Width Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.width.min}
                onChange={(e) => handleFilterChange(e, 'width', 'min')}
                className="w-full p-2 border rounded"
                placeholder="Min"
                step="0.1"
              />
              <input
                type="number"
                value={filters.width.max}
                onChange={(e) => handleFilterChange(e, 'width', 'max')}
                className="w-full p-2 border rounded"
                placeholder="Max"
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Weight Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.weight.min}
                onChange={(e) => handleFilterChange(e, 'weight', 'min')}
                className="w-full p-2 border rounded"
                placeholder="Min"
                step="0.1"
              />
              <input
                type="number"
                value={filters.weight.max}
                onChange={(e) => handleFilterChange(e, 'weight', 'max')}
                className="w-full p-2 border rounded"
                placeholder="Max"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-500 text-gray-800 rounded cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Showing {filteredInventory.length} of {inventory.length} items
        </p>
      </div>
      
      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-700">
              <th className="border p-2">Material Name</th>
              <th className="border p-2">Thickness</th>
              <th className="border p-2">Width</th>
              <th className="border p-2">Weight</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Actual Weight</th>
              <th className="border p-2">Production Date</th>
              <th className="border p-2">Yard Arrival Date</th>
              <th className="border p-2">Residence in Yard</th>
              <th className="border p-2">Yard No</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Manufacturing Location</th>
              <th className="border p-2">Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.IN_MaterialName} className="text-center hover:bg-gray-800">
                  <td className="border p-2">{item.IN_MaterialName}</td>
                  <td className="border p-2">{item.IN_Thickness}</td>
                  <td className="border p-2">{item.IN_Width}</td>
                  <td className="border p-2">{item.IN_Weight}</td>
                  <td className="border p-2">{item.IN_Grade}</td>
                  <td className="border p-2">{item.ActuallWeight}</td>
                  <td className="border p-2">
                    {formatDate(item.In_ProductionDate)}
                  </td>
                  <td className="border p-2">
                    {formatDate(item.YardArrivalDate)}
                  </td>
                  <td className="border p-2">{item.Residence_INYard}</td>
                  <td className="border p-2">{item.YardNO}</td>
                  <td className="border p-2">{item.Position}</td>
                  <td className="border p-2">{item.Manufacturing_Location}</td>
                  <td className="border p-2">{item.Manufacturer}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="border p-2 text-center">
                  No inventory data found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
