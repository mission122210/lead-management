"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LeadTable from "@/components/lead-table"
import AddLeadModal from "@/components/add-lead-modal"
import EditLeadModal from "@/components/edit-lead-modal"
import DeleteConfirmModal from "@/components/delete-confirm-modal"
import { useLead } from "@/LeadContext"
import TimezoneClock from "@/components/TimezoneClock"

const statusOptions = ["On Training", "On Deposit", "Blocked", "Opened", "Follow Up", "Not Interested"]

export default function Dashboard() {
  const { leads, loading, error, addLead, fetchLeads } = useLead()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredLeads, setFilteredLeads] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()

      filtered = filtered.filter((lead) => {
        // format date as locale string, e.g. "10/1/2025"
        const dateString = new Date(lead.createdAt || lead.date).toLocaleDateString()

        return (
          lead.clientNumber.toLowerCase().includes(lowerSearch) ||
          lead.teamMember.toLowerCase().includes(lowerSearch) ||
          lead.remarks.toLowerCase().includes(lowerSearch) ||
          dateString.includes(searchTerm) // date ko bina lower case ke check karen kyun ke date string mein alphabets nahi hain
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter])

  const handleAddLead = async (newLead) => {
    await addLead(newLead)
    setIsAddModalOpen(false)
  }

  const handleEditLead = (updatedLead) => {
    // Implement API call to update lead if needed
    setIsEditModalOpen(false)
    setSelectedLead(null)
  }

  const handleDeleteLead = () => {
    // Implement API call to delete lead if needed
    setIsDeleteModalOpen(false)
    setSelectedLead(null)
  }

  const openEditModal = (lead) => {
    setSelectedLead(lead)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (lead) => {
    setSelectedLead(lead)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Lead Management System</h1>
            <p className="text-gray-400 mt-1">Manage your client leads efficiently</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">



        {/* USA Timezone Clocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TimezoneClock timezone="America/New_York" label="Eastern Time (EST/EDT)" className="hover:bg-gray-750" />
          <TimezoneClock timezone="America/Chicago" label="Central Time (CST/CDT)" className="hover:bg-gray-750" />
          <TimezoneClock timezone="America/Los_Angeles" label="Pacific Time (PST/PDT)" className="hover:bg-gray-750" />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">Total Leads</h3>
            <p className="text-3xl font-bold text-white mt-2">{leads.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">On Training</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{leads.filter((lead) => lead.status === "On Training").length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">On Deposit</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">{leads.filter((lead) => lead.status === "On Deposit").length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">Opened</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">{leads.filter((lead) => lead.status === "Opened").length}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">
                    All Status
                  </SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-gray-600">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </div>
        </div>

        <div>{filteredLeads.length} clients in backup</div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <LeadTable
            leads={filteredLeads}
            loading={loading}
            error={error}
            onEdit={openEditModal}
            onDelete={openDeleteModal}  // expects a lead argument
            setSelectedLead={setSelectedLead}
          />

        </div>
      </main>

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLead}
        statusOptions={statusOptions}
      />

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedLead(null)
        }}
        onEdit={handleEditLead}
        lead={selectedLead}
        statusOptions={statusOptions}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedLead(null)
        }}
        onDelete={handleDeleteLead}
        leadId={selectedLead?._id}              // ✅ Add this line
        leadClientNumber={selectedLead?.clientNumber}
      />
    </div>
  )
}
