"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLead } from "@/LeadContext"

const timezones = ["EST", "CST", "MST", "PST", "UTC"]

export default function EditLeadModal({ isOpen, onClose, lead, statusOptions }) {
  const { updateLead } = useLead()

  const [formData, setFormData] = useState({
    clientNumber: "",
    myNumber: "",
    teamMember: "",
    status: "",
    remarks: "",
  })
  const [reminderData, setReminderData] = useState({
    datetime: "",
    timezone: "",
    reason: "",
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    if (lead) {
      setFormData({
        clientNumber: lead.clientNumber || "",
        myNumber: lead.myNumber || "",
        teamMember: lead.teamMember || "",
        status: lead.status || "",
        remarks: lead.remarks || "",
      })
      setErrors({})
      setSubmitError("")
    }
  }, [lead])

  const handleReminderChange = (field, value) => {
    setReminderData((prev) => ({ ...prev, [field]: value }))
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.clientNumber.trim()) newErrors.clientNumber = "Client number is required"
    if (!formData.myNumber.trim()) newErrors.myNumber = "Your number is required"
    if (!formData.teamMember.trim()) newErrors.teamMember = "Team member name is required"
    if (!formData.status) newErrors.status = "Status is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    setSubmitError("")

    try {
      await updateLead(lead._id || lead.id, {
        ...formData,
        reminder: reminderData,
      })
      onClose()
    } catch (err) {
      setSubmitError(err.message || "Failed to update lead")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !lead) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Lead</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="clientNumber" className="text-gray-200">Client Number</Label>
            <Input
              id="clientNumber"
              value={formData.clientNumber}
              onChange={(e) => handleChange("clientNumber", e.target.value)}
              placeholder="+92-300-1234567"
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {errors.clientNumber && <p className="text-red-400 text-sm mt-1">{errors.clientNumber}</p>}
          </div>

          <div>
            <Label htmlFor="myNumber" className="text-gray-200">My Number</Label>
            <Input
              id="myNumber"
              value={formData.myNumber}
              onChange={(e) => handleChange("myNumber", e.target.value)}
              placeholder="+92-301-9876543"
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {errors.myNumber && <p className="text-red-400 text-sm mt-1">{errors.myNumber}</p>}
          </div>

          <div>
            <Label htmlFor="teamMember" className="text-gray-200">Team Member</Label>
            <Input
              id="teamMember"
              value={formData.teamMember}
              onChange={(e) => handleChange("teamMember", e.target.value)}
              placeholder="Enter team member name"
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {errors.teamMember && <p className="text-red-400 text-sm mt-1">{errors.teamMember}</p>}
          </div>

          <div>
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


            {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
          </div>

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

          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium text-white mb-2">Set Reminder (Optional)</h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="reminderDatetime" className="text-gray-200">Reminder Date & Time</Label>
                <Input
                  id="reminderDatetime"
                  type="datetime-local"
                  value={reminderData.datetime}
                  onChange={(e) => handleReminderChange("datetime", e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="reminderTimezone" className="text-gray-200">Timezone</Label>
                <select
                  id="reminderTimezone"
                  value={reminderData.timezone}
                  onChange={(e) => handleReminderChange("timezone", e.target.value)}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="">Select timezone</option>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="reminderReason" className="text-gray-200">Reminder Note</Label>
                <Textarea
                  id="reminderReason"
                  value={reminderData.reason}
                  onChange={(e) => handleReminderChange("reason", e.target.value)}
                  placeholder="Why are you setting this reminder?"
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[60px]"
                />
              </div>
            </div>
          </div>

          {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? "Updating..." : "Update Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
