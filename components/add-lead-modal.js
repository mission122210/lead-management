"use client"

import { useContext, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  })

  const [errors, setErrors] = useState({})
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    // Validation
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
      onAdd(formData)
      setFormData({
        clientNumber: "",
        myNumber: "",
        teamMember: "",
        status: "",
        remarks: "",
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
            <div>
              <Label htmlFor="clientNumber" className="text-gray-200">
                Client Number
              </Label>
              <Input
                id="clientNumber"
                value={formData.clientNumber}
                onChange={(e) => handleChange("clientNumber", e.target.value)}
                placeholder="+92-300-1234567"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.clientNumber && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.clientNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="myNumber" className="text-gray-200">
                My Number
              </Label>
              <Input
                id="myNumber"
                value={formData.myNumber}
                onChange={(e) => handleChange("myNumber", e.target.value)}
                placeholder="+92-301-9876543"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.myNumber && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.myNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="teamMember" className="text-gray-200">
                Team Member
              </Label>
              <Input
                id="teamMember"
                value={formData.teamMember}
                onChange={(e) => handleChange("teamMember", e.target.value)}
                placeholder="Enter team member name"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.teamMember && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.teamMember}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-gray-200">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {statusOptions.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white hover:bg-gray-600"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-400 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            <div>
              <Label htmlFor="remarks" className="text-gray-200">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Enter any remarks or notes..."
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
              />
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
