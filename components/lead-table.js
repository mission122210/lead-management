"use client"

import { Edit, Trash2, Phone, MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const statusColors = {
  "On Training": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "On Deposit": "bg-green-500/20 text-green-400 border-green-500/30",
  Blocked: "bg-red-500/20 text-red-400 border-red-500/30",
  Opened: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Follow Up": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Not Interested": "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export default function LeadTable({ leads = [], loading, error, onEdit, onDelete }) {
  const handleWhatsAppClick = (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, "")
    window.open(`https://wa.me/${cleanNumber}`, "_blank")
  }

  const handleCallClick = (number) => {
    window.open(`tel:${number}`, "_self")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 text-gray-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading leads...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        <p className="text-lg font-semibold">Error loading leads</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 text-lg mb-2">No leads found</div>
        <div className="text-gray-500 text-sm">Try adding some or adjust your filters</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-700 border-b border-gray-600">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-200">Client Number</th>
            <th className="text-left p-4 font-semibold text-gray-200">My Number</th>
            <th className="text-left p-4 font-semibold text-gray-200">Team Member</th>
            <th className="text-left p-4 font-semibold text-gray-200">Status</th>
            <th className="text-left p-4 font-semibold text-gray-200">Remarks</th>
            <th className="text-left p-4 font-semibold text-gray-200">Date</th>
            <th className="text-left p-4 font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={lead._id || index}
              className={`border-b border-gray-700 hover:bg-gray-750 transition-colors ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"}`}
            >
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{lead.clientNumber}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCallClick(lead.clientNumber)}
                      className="h-6 w-6 p-0 text-green-400 hover:bg-green-500/20"
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleWhatsAppClick(lead.clientNumber)}
                      className="h-6 w-6 p-0 text-green-400 hover:bg-green-500/20"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-300">{lead.myNumber}</td>
              <td className="p-4 text-white">{lead.teamMember}</td>
              <td className="p-4">
                <Badge className={statusColors[lead.status] || statusColors["Not Interested"]}>
                  {lead.status}
                </Badge>
              </td>
              <td className="p-4 text-gray-300 text-sm max-w-xs truncate">{lead.remarks}</td>
              <td className="p-4 text-gray-400 text-sm">
                {new Date(lead.createdAt || lead.date).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(lead)}
                    className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(lead)}
                    className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
