"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const LeadContext = createContext()

export function LeadProvider({ children }) {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    // const host = "http://localhost:3001"
    const host = "https://lead-management-backend-master.vercel.app"

    const fetchLeads = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${host}/api/leads/fetchLeads`)
            if (!res.ok) throw new Error("Failed to fetch leads")
            const data = await res.json()
            setLeads(data)
        } catch (err) {
            setError(err.message || "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    const addLead = async (lead) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${host}/api/leads/addLead`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientNumber: lead.clientNumber,
                    myNumber: lead.myNumber,
                    teamMember: lead.teamMember,
                    status: lead.status,
                    remarks: lead.remarks,
                    image: lead.image || "", // base64 string if any
                }),
            })

            if (!res.ok) throw new Error("Failed to add lead")
            const newLead = await res.json()
            setLeads((prev) => [...prev, newLead])
        } catch (err) {
            setError(err.message || "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    const updateLead = async (id, updatedData) => {
        try {
            const res = await fetch(`${host}/api/leads/updateLead/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            })

            if (!res.ok) throw new Error("Failed to update lead")
            const updated = await res.json()

            setLeads((prev) => prev.map((lead) => (lead._id === id ? updated : lead)))
        } catch (err) {
            throw err
        }
    }

    const deleteLead = async (id) => {
        try {
            const res = await fetch(`${host}/api/leads/deleteLead/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to delete lead")
            setLeads((prev) => prev.filter((lead) => lead._id !== id))
        } catch (err) {
            throw err
        }
    }

    // New: delete image from lead
    const deleteImage = async (leadId) => {
        try {
            const res = await fetch(`${host}/api/leads/deleteLeadImage/${leadId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to delete image")
            // Refresh leads after deleting image
            await fetchLeads()
        } catch (err) {
            throw err
        }
    }

    // Upload image to existing lead
    const uploadImageToLead = async (leadId, base64Image) => {
        try {
            const res = await fetch(`${host}/api/leads/uploadImage/${leadId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: base64Image }),
            })
            if (!res.ok) throw new Error("Failed to upload image")
            await fetchLeads()
        } catch (err) {
            throw err
        }
    }


    useEffect(() => {
        fetchLeads()
    }, [])

    return (
        <LeadContext.Provider
            value={{
                leads,
                loading,
                error,
                fetchLeads,
                addLead,
                updateLead,
                deleteLead,
                deleteImage,
                uploadImageToLead
            }}
        >
            {children}
        </LeadContext.Provider>
    )
}

export function useLead() {
    const context = useContext(LeadContext)
    if (!context) throw new Error("useLead must be used within LeadProvider")
    return context
}
