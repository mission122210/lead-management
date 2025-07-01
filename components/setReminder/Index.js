import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const timezones = ["EST", "CST", "MST", "PST", "UTC"]

const Index = ({ reminderData, handleReminderChange }) => {
    return (
        <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium text-white mb-2">Set Reminder (Optional)</h3>

            <div className="space-y-3">
                <div>
                    <Label htmlFor="reminderDatetime" className="text-gray-200">Reminder Date & Time</Label>
                    <Input
                        id="reminderDatetime"
                        type="datetime-local"
                        value={reminderData.datetimeLocal}
                        onChange={(e) => handleReminderChange("datetimeLocal", e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />

                </div>

                <div>
                    <Label htmlFor="reminderTimezone" className="text-gray-200">Timezone</Label>
                    <select
                        id="reminderTimezone"
                        value={reminderData.timezone}
                        onChange={(e) => handleReminderChange("timezone", e.target.value)}
                        className="mt-1 w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                    >
                        <option value="">Select timezone</option>
                        {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label htmlFor="reminderReason" className="text-gray-200">Reminder Note</Label>
                    <Textarea
                        id="reminderReason"
                        value={reminderData.reason}
                        onChange={(e) => handleReminderChange("reason", e.target.value)}
                        placeholder="Why are you setting this reminder?"
                        className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[60px]"
                    />
                </div>
            </div>
        </div>
    )
}

export default Index
