"use client"

import React, { useEffect, useState } from 'react'
import { DateTime } from "luxon"

const timezoneMap = {
    EST: "America/New_York",
    CST: "America/Chicago",
    MST: "America/Denver",
    PST: "America/Los_Angeles",
    UTC: "UTC"
}

const ReminderBadge = ({ lead }) => {
    const reminder = lead?.reminder
    const [remainingTime, setRemainingTime] = useState("")

    const getTimeRemaining = (datetime, timezone) => {
        const target = DateTime.fromISO(datetime, { zone: timezoneMap[timezone] || "UTC" })
        const now = DateTime.now().setZone(timezoneMap[timezone] || "UTC")

        const diff = target.diff(now, ["days", "hours", "minutes", "seconds"]).toObject()

        if (target <= now) return "Reminder time reached"

        const { days = 0, hours = 0, minutes = 0, seconds = 0 } = diff

        return `${days > 0 ? `${Math.floor(days)}d ` : ""}${hours > 0 ? `${Math.floor(hours)}h ` : ""}${Math.floor(minutes)}m ${Math.floor(seconds)}s`
    }

    useEffect(() => {
        if (!reminder?.datetime || !reminder?.timezone) return

        const update = () => {
            const text = getTimeRemaining(reminder.datetime, reminder.timezone)
            setRemainingTime(text)
        }

        update() // initial call

        const interval = setInterval(update, 1000)

        return () => clearInterval(interval)
    }, [reminder])

    useEffect(() => {
        if (!reminder?.datetime || !reminder?.timezone) return

        const target = DateTime.fromISO(reminder.datetime, { zone: timezoneMap[reminder.timezone] || "UTC" })
        const now = DateTime.now()
        const msDiff = target.toMillis() - now.toMillis()

        if (msDiff <= 0) return

        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        }

        const timeout = setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification(`Reminder Alert for ${lead.teamMember}`, {
                    body: `Reminder for ${lead.clientNumber}`,
                })
            }
        }, msDiff)

        return () => clearTimeout(timeout)
    }, [reminder])

    return (
        <td className="p-4">
            <div className="flex flex-col items-start space-y-1">
                {reminder?.datetime && reminder?.timezone && (
                    <span
                        className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full whitespace-nowrap"
                        title={`Reminder: ${reminder.datetime} (${reminder.timezone})`}
                    >
                        {remainingTime}
                    </span>
                )}
                <span className="text-white font-medium">{lead.clientNumber}</span>
            </div>
        </td>
    )
}

export default ReminderBadge
