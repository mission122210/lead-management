"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, Upload, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LeadTable from "@/components/lead-table"
import AddLeadModal from "@/components/add-lead-modal"
import EditLeadModal from "@/components/edit-lead-modal"
import DeleteConfirmModal from "@/components/delete-confirm-modal"
import TimezoneClock from "@/components/TimezoneClock"
import { LeadProvider, useLead } from "@/LeadContext"
import TeamPerformance from "@/components/team-performance"

// Status options
const statusOptions = ["On Training", "On Deposit", "Blocked", "Opened", "Follow Up", "Not Interested"]

// Month options (January - December)
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function DashboardContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [apiHost, setApiHost] = useState("")


  const { leads, loading, error, addLead, fetchLeads, setCurrentMonth, currentMonth } = useLead()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredLeads, setFilteredLeads] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads()
    }
  }, [isAuthenticated])

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()

      filtered = filtered.filter((lead) => {
        const dateString = new Date(lead.createdAt || lead.date).toLocaleDateString()

        return (
          lead.clientNumber.toLowerCase().includes(lowerSearch) ||
          lead.teamMember.toLowerCase().includes(lowerSearch) ||
          lead.remarks.toLowerCase().includes(lowerSearch) ||
          dateString.includes(searchTerm)
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()

    let selectedHost = ""

    if (passwordInput === "Master122") {
      selectedHost = "https://lead-management-backend-master1.vercel.app"
    } else if (passwordInput === "Ramish107") {
      selectedHost = "https://ramish-lead-backkend1.vercel.app"
    } else if (passwordInput === "Jutt113") {
      selectedHost = "https://jutt-lead-backend1.vercel.app"
    } else {
      setPasswordError("Invalid password. Please try again.")
      setPasswordInput("")
      return
    }

    setApiHost(selectedHost)
    setIsAuthenticated(true)
    setPasswordError("")
  }

  const handleAddLead = async (newLead) => {
    await addLead(newLead)
    setIsAddModalOpen(false)
  }

  const handleEditLead = (updatedLead) => {
    setIsEditModalOpen(false)
    setSelectedLead(null)
  }

  const handleDeleteLead = () => {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Lead Management System</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enter Password</label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    )
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
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
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
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {leads.filter((lead) => lead.status === "On Training").length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">On Deposit</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {leads.filter((lead) => lead.status === "On Deposit").length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">Opened</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">
              {leads.filter((lead) => lead.status === "Opened").length}
            </p>
          </div>
        </div>

        <TeamPerformance leads={leads} />

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
              {/* Month dropdown */}
              <Select value={currentMonth} onValueChange={setCurrentMonth}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={month} className="text-white hover:bg-gray-600">
                      {month}
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
            onDelete={openDeleteModal}
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
        leadId={selectedLead?._id}
        leadClientNumber={selectedLead?.clientNumber}
      />
    </div>
  )
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [apiHost, setApiHost] = useState("")

  const handlePasswordSubmit = (e) => {
    e.preventDefault()

    let selectedHost = ""

    if (passwordInput === "Master122") {
      selectedHost = "https://lead-management-backend-master1.vercel.app"
    } else if (passwordInput === "Ramish107") {
      selectedHost = "https://ramish-lead-backkend1.vercel.app"
    } else if (passwordInput === "Jutt113") {
      selectedHost = "https://jutt-lead-backend1.vercel.app"
    } else {
      setPasswordError("Invalid password. Please try again.")
      setPasswordInput("")
      return
    }

    setApiHost(selectedHost)
    setIsAuthenticated(true)
    setPasswordError("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Lead Management System</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enter Password</label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <LeadProvider apiHost={apiHost}>
      <DashboardContent />
    </LeadProvider>
  )
}
