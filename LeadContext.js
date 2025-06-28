"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const LeadContext = createContext()

export function LeadProvider({ children }) {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const host = "http://localhost:5000"
    // const host = "https://lead-management-backend-two.vercel.app"

    // Fetch all leads from API
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

    // Add a new lead
    const addLead = async (lead) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${host}/api/leads/addLead`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lead),
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

            setLeads((prev) =>
                prev.map((lead) => (lead._id === id ? updated : lead))
            )
        } catch (err) {
            throw err
        }
    }

    // ✅ Delete a lead
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

    // You can add updateLead, deleteLead similarly

    // Fetch leads once on component mount
    useEffect(() => {
        fetchLeads()
    }, [])

    return (
        <LeadContext.Provider value={{ leads, loading, error, fetchLeads, addLead, updateLead, deleteLead }}>
            {children}
        </LeadContext.Provider>
    )
}

export function useLead() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error("useLead must be used within LeadProvider");
    }
    return context;
}