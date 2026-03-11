// src/modules/inventory/EditInventory.jsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProperty, clearCurrent,
  selectCurrentProperty, selectDetailLoading, selectDetailError,
} from '../../redux/slices/inventorySlice'
import { propertyToFormValues } from './inventoryUtils'
import InventoryForm from './Inventoryform'

const RED = '#E8431A'

export default function EditInventory() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const property      = useSelector(selectCurrentProperty)
  const loading       = useSelector(selectDetailLoading)
  const error         = useSelector(selectDetailError)

  useEffect(() => {
    if (id) dispatch(fetchProperty(id))
    return () => { dispatch(clearCurrent()) }
  }, [id, dispatch])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-block w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: RED }} />
        <p className="text-sm text-gray-400">Loading property…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-lg font-bold text-gray-800 mb-2">Could not load property</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button onClick={() => navigate(-1)}
          className="text-sm font-semibold px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          ← Go back
        </button>
      </div>
    </div>
  )

  if (!property) return null

  return (
    <InventoryForm
      mode="edit"
      propertyId={id}
      initialValues={propertyToFormValues(property)}
      existingImages={property.basicDetails?.images ?? []}
      existingVideoUrl={property.basicDetails?.videoUrl ?? null}
      onSuccess={() => navigate(`/property/details/${id}`)}
    />
  )
}