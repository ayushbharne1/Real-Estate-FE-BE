// src/modules/inventory/AddInventory.jsx
import { useNavigate } from 'react-router-dom'
import InventoryForm from './Inventoryform'

export default function AddInventory() {
  const navigate = useNavigate()

  return (
    <InventoryForm
      mode="add"
      onSuccess={() => navigate('/')}
    />
  )
}