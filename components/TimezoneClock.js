"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

const TimezoneClock = ({ timezone, label, className = "" }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
      setTime(localTime)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  // Calculate angles for clock hands
  const secondAngle = time.getSeconds() * 6 - 90 // 6 degrees per second
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90 // 6 degrees per minute
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90 // 30 degrees per hour

  // Generate clock numbers
  const clockNumbers = Array.from({ length: 12 }, (_, i) => {
    const number = i === 0 ? 12 : i
    const angle = i * 30 - 90
    const x = 50 + 35 * Math.cos((angle * Math.PI) / 180)
    const y = 50 + 35 * Math.sin((angle * Math.PI) / 180)
    return { number, x, y }
  })

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30
    const x1 = 50 + 40 * Math.cos((angle * Math.PI) / 180)
    const y1 = 50 + 40 * Math.sin((angle * Math.PI) / 180)
    const x2 = 50 + 45 * Math.cos((angle * Math.PI) / 180)
    const y2 = 50 + 45 * Math.sin((angle * Math.PI) / 180)
    return { x1, y1, x2, y2 }
  })

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Analog Clock */}
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-lg">
            {/* Clock Face */}
            <circle cx="50" cy="50" r="48" fill="#1f2937" stroke="#374151" strokeWidth="2" />

            {/* Inner circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4b5563" strokeWidth="0.5" />

            {/* Hour markers */}
            {hourMarkers.map((marker, i) => (
              <line
                key={i}
                x1={marker.x1}
                y1={marker.y1}
                x2={marker.x2}
                y2={marker.y2}
                stroke="#9ca3af"
                strokeWidth="1"
              />
            ))}

            {/* Clock numbers */}
            {clockNumbers.map((item, i) => (
              <text
                key={i}
                x={item.x}
                y={item.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-xs font-bold"
                style={{ fontSize: "4px" }}
              >
                {item.number}
              </text>
            ))}

            {/* Brand name */}
            <text
              x="50"
              y="35"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-blue-400 text-xs font-bold"
              style={{ fontSize: "6px" }}
            >
              TEAM MASTER
            </text>

            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 25 * Math.cos((hourAngle * Math.PI) / 180)}
              y2={50 + 25 * Math.sin((hourAngle * Math.PI) / 180)}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 35 * Math.cos((minuteAngle * Math.PI) / 180)}
              y2={50 + 35 * Math.sin((minuteAngle * Math.PI) / 180)}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Second hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 38 * Math.cos((secondAngle * Math.PI) / 180)}
              y2={50 + 38 * Math.sin((secondAngle * Math.PI) / 180)}
              stroke="#ef4444"
              strokeWidth="0.5"
              strokeLinecap="round"
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="2" fill="#ffffff" />
            <circle cx="50" cy="50" r="1" fill="#ef4444" />
          </svg>
        </div>

        {/* Digital time display */}
        <div className="mt-4 text-center">
          <div className="text-lg font-mono text-white">
            {time.toLocaleTimeString("en-US", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-xs text-gray-400 mt-1">{dateString}</div>
        </div>
      </div>
    </div>
  )
}

export default TimezoneClock
