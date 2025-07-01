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
        const zone = timezoneMap[timezone] || "UTC"

        // STEP 1: parse datetime as UTC
        const targetUtc = DateTime.fromISO(datetime, { zone: "utc" })

        // STEP 2: convert it to selected zone for display/comparison
        const target = targetUtc.setZone(zone)

        const now = DateTime.now().setZone(zone)

        if (!target.isValid || !now.isValid) return "Invalid time"
        if (target <= now) return "Reminder time reached"

        const diff = target.diff(now, ["days", "hours", "minutes", "seconds"]).toObject()
        const { days = 0, hours = 0, minutes = 0, seconds = 0 } = diff

        return `${days > 0 ? `${Math.floor(days)}d ` : ""}${hours > 0 ? `${Math.floor(hours)}h ` : ""}${Math.floor(minutes)}m ${Math.floor(seconds)}s`
    }

    useEffect(() => {
        if (!reminder?.datetime || !reminder?.timezone) return

        const updateTime = () => {
            const text = getTimeRemaining(reminder.datetime, reminder.timezone)
            setRemainingTime(text)
        }

        updateTime() // initial run
        const intervalId = setInterval(updateTime, 1000)

        return () => clearInterval(intervalId)
    }, [reminder?.datetime, reminder?.timezone])

    useEffect(() => {
        if (!reminder?.datetime || !reminder?.timezone) return

        const zone = timezoneMap[reminder.timezone] || "UTC"

        // STEP 1: parse as UTC
        const targetUtc = DateTime.fromISO(reminder.datetime, { zone: "utc" })

        // STEP 2: convert to selected zone
        const target = targetUtc.setZone(zone)
        const now = DateTime.now().setZone(zone)

        if (!target.isValid || !now.isValid) return

        const msDiff = target.toMillis() - now.toMillis()
        if (msDiff <= 0) return

        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        }

        const timeoutId = setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification(`Reminder Alert for ${lead.teamMember}`, {
                    body: `Reminder for ${lead.clientNumber}`,
                })
            }
        }, msDiff)

        return () => clearTimeout(timeoutId)
    }, [reminder?.datetime, reminder?.timezone])


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
