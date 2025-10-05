"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeamPerformance({ leads }) {
  const [expandedMember, setExpandedMember] = useState(null)

  // Calculate team member stats and sort by performance
  const teamStats = useMemo(() => {
    const memberMap = {}

    leads.forEach((lead) => {
      const member = lead.teamMember
      if (!member) return

      if (!memberMap[member]) {
        memberMap[member] = {
          name: member,
          total: 0,
          opened: 0,
          onDeposit: 0,
          onTraining: 0,
          blocked: 0,
          followUp: 0,
          notInterested: 0,
          dateWiseEntries: {},
        }
      }

      memberMap[member].total++

      // Count by status
      const status = lead.status
      if (status === "Opened") memberMap[member].opened++
      else if (status === "On Deposit") memberMap[member].onDeposit++
      else if (status === "On Training") memberMap[member].onTraining++
      else if (status === "Blocked") memberMap[member].blocked++
      else if (status === "Follow Up") memberMap[member].followUp++
      else if (status === "Not Interested") memberMap[member].notInterested++

      // Date-wise entries for current month
      const entryDate = new Date(lead.createdAt || lead.date)
      const now = new Date()

      // Check if entry is from current month
      if (entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()) {
        const dateKey = entryDate.toLocaleDateString()
        memberMap[member].dateWiseEntries[dateKey] = (memberMap[member].dateWiseEntries[dateKey] || 0) + 1
      }
    })

    // Convert to array and sort by performance
    const membersArray = Object.values(memberMap)

    membersArray.sort((a, b) => {
      // Priority 1: Opened (highest first)
      if (b.opened !== a.opened) return b.opened - a.opened
      // Priority 2: On Deposit
      if (b.onDeposit !== a.onDeposit) return b.onDeposit - a.onDeposit
      // Priority 3: On Training
      if (b.onTraining !== a.onTraining) return b.onTraining - a.onTraining
      // Priority 4: Total entries
      return b.total - a.total
    })

    return membersArray
  }, [leads])

  const toggleMemberDetails = (memberName) => {
    setExpandedMember(expandedMember === memberName ? null : memberName)
  }

  const getPerformanceColor = (index) => {
    if (index === 0) return "text-yellow-400" // Top performer
    if (index === 1) return "text-gray-300"
    if (index === 2) return "text-orange-400"
    return "text-gray-400"
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Team Performance</h2>
        <Badge className="bg-blue-600 text-white ml-2">{teamStats.length} Members</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamStats.map((member, index) => (
          <div
            key={member.name}
            className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getPerformanceColor(index)}`}>#{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.total} Total Clients</p>
                </div>
              </div>
              <button
                onClick={() => toggleMemberDetails(member.name)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                {expandedMember === member.name ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800 p-2 rounded">
                <p className="text-xs text-gray-400">Opened</p>
                <p className="text-lg font-bold text-purple-400">{member.opened}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <p className="text-xs text-gray-400">On Deposit</p>
                <p className="text-lg font-bold text-green-400">{member.onDeposit}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <p className="text-xs text-gray-400">On Training</p>
                <p className="text-lg font-bold text-blue-400">{member.onTraining}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <p className="text-xs text-gray-400">Follow Up</p>
                <p className="text-lg font-bold text-yellow-400">{member.followUp}</p>
              </div>
            </div>

            {expandedMember === member.name && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Month Summary</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {Object.keys(member.dateWiseEntries).length > 0 ? (
                    Object.entries(member.dateWiseEntries)
                      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                      .map(([date, count]) => (
                        <div key={date} className="flex justify-between text-sm bg-gray-800 p-2 rounded">
                          <span className="text-gray-400">{date}</span>
                          <span className="text-white font-semibold">{count} new clients</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No entries this month</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {teamStats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No team members found</p>
        </div>
      )}
    </div>
  )
}
