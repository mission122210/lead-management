"use client"

import { useState } from "react"
import { AlertTriangle, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLead } from "@/LeadContext" // adjust the import path as needed

export default function DeleteConfirmModal({ isOpen, onClose, leadId, leadClientNumber }) {
  const { deleteLead } = useLead()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      await deleteLead(leadId)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to delete lead")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Confirm Delete</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-lg font-medium text-white">Delete Lead</h3>
              <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-gray-300 text-sm">Are you sure you want to delete the lead for client number:</p>
            <p className="text-white font-medium mt-1">{leadClientNumber}</p>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Lead"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
