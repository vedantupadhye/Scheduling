// app/Inventory/page.jsx - Server Component
import InventoryClient from './inventory-client';
import { getInventory } from '../actions/inventory';

export default async function InventoryPage() {
  // Fetch data on the server
  const initialInventory = await getInventory();
  
  return <InventoryClient initialInventory={initialInventory} />;
}