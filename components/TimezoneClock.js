"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

const TimezoneClock = ({ timezone, label, className = "" }) => {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      const dateString = now.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      setTime(timeString)
      setDate(dateString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [timezone])

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="digital-clock text-2xl font-bold text-white mb-1">{time}</div>
      <div className="text-xs text-gray-400">{date}</div>
    </div>
  )
}

export default TimezoneClock
