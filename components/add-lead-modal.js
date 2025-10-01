"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLead } from "@/LeadContext"

export default function AddLeadModal({ isOpen, onClose, onAdd, statusOptions }) {
  const { addLead, loading, error } = useLead()

  const [formData, setFormData] = useState({
    clientNumber: "",
    myNumber: "",
    teamMember: "",
    status: "",
    remarks: "",
    image: "", // base64 image string
  })

  const [errors, setErrors] = useState({})
  const [localError, setLocalError] = useState("")

  const imageInputRef = useRef(null) // Ref for the image upload div

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // Clipboard paste handler for the image upload block
  useEffect(() => {
    if (!isOpen) return

    const handlePaste = (e) => {
      const clipboardItems = e.clipboardData.items
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i]
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }))
          }
          reader.readAsDataURL(blob)
          e.preventDefault()
          break
        }
      }
    }

    const el = imageInputRef.current
    if (el) {
      el.addEventListener("paste", handlePaste)
    }

    return () => {
      if (el) {
        el.removeEventListener("paste", handlePaste)
      }
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    const newErrors = {}
    if (!formData.clientNumber.trim()) newErrors.clientNumber = "Client number is required"
    if (!formData.myNumber.trim()) newErrors.myNumber = "Your number is required"
    if (!formData.teamMember.trim()) newErrors.teamMember = "Team member name is required"
    if (!formData.status) newErrors.status = "Status is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await addLead(formData)
      setFormData({
        clientNumber: "",
        myNumber: "",
        teamMember: "",
        status: "",
        remarks: "",
        image: "",
      })
      setErrors({})
      onClose()
    } catch (err) {
      setLocalError("Failed to add lead. Please try again.")
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add New Lead</h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative">
          {localError || error ? (
            <p className="text-red-400 text-sm text-center">
              {localError || error}
            </p>
          ) : null}

          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            {/* Text Inputs */}
            <InputBlock label="Client Number" field="clientNumber" value={formData.clientNumber} onChange={handleChange} error={errors.clientNumber} />
            <InputBlock label="My Number" field="myNumber" value={formData.myNumber} onChange={handleChange} error={errors.myNumber} />
            <InputBlock label="Team Member" field="teamMember" value={formData.teamMember} onChange={handleChange} error={errors.teamMember} />

            {/* Status Dropdown */}
            <div>
              <Label htmlFor="status" className="text-gray-200">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="mt-1 w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
              >
                <option value="">Select status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* Remarks */}
            <div>
              <Label htmlFor="remarks" className="text-gray-200">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Enter any remarks or notes..."
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
              />
            </div>

            {/* Image Upload with Clipboard Paste Support */}
            <div
              ref={imageInputRef}
              tabIndex={0} // Make div focusable to capture paste events
              className="focus:outline-none"
            >
              <Label htmlFor="image" className="text-gray-200">Upload Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 text-white file:bg-gray-600 file:border-none file:px-3 file:py-1 file:text-white"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 rounded border border-gray-600 w-full max-h-40 object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Adding..." : "Add Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ✅ Reusable input block
function InputBlock({ label, field, value, onChange, error }) {
  return (
    <div>
      <Label htmlFor={field} className="text-gray-200">{label}</Label>
      <Input
        id={field}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
