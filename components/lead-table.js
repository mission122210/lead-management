"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Edit,
  Trash2,
  Loader2,
  ImageIcon,
  Trash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLead } from "@/LeadContext"
import Reminder from './reminder/Index'

const statusColors = {
  "On Training": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "On Deposit": "bg-green-500/20 text-green-400 border-green-500/30",
  Blocked: "bg-red-500/20 text-red-400 border-red-500/30",
  Opened: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Follow Up": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Not Interested": "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export default function LeadTable({ onEdit, leads, onDelete, setSelectedLead }) {
  const {
    loading,
    error,
    deleteImage,
    uploadImageToLead,
  } = useLead()

  const [modalImage, setModalImage] = useState(null)
  const [modalLeadId, setModalLeadId] = useState(null)
  const [uploadModalLeadId, setUploadModalLeadId] = useState(null)
  const [deletingImage, setDeletingImage] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Ref to the upload modal container for paste listening
  const uploadModalRef = useRef(null)

  const openImageModal = (url, id) => {
    setModalImage(url)
    setModalLeadId(id)
  }

  const closeImageModal = () => {
    setModalImage(null)
    setModalLeadId(null)
  }

  const handleDeleteImage = async () => {
    if (!modalLeadId) return
    setDeletingImage(true)
    try {
      await deleteImage(modalLeadId)
      closeImageModal()
    } catch {
      alert("Failed to delete image")
    } finally {
      setDeletingImage(false)
    }
  }

  const handleDeleteLead = (lead) => {
    onDelete(lead)
  }

  const handleUploadImage = async (fileOrBase64) => {
    if (!fileOrBase64 || !uploadModalLeadId) return

    setUploadingImage(true)
    try {
      // if fileOrBase64 is File, read as base64, else assume it's base64 string
      if (fileOrBase64 instanceof File) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          await uploadImageToLead(uploadModalLeadId, reader.result)
          setUploadModalLeadId(null)
          setUploadingImage(false)
        }
        reader.readAsDataURL(fileOrBase64)
      } else {
        await uploadImageToLead(uploadModalLeadId, fileOrBase64)
        setUploadModalLeadId(null)
        setUploadingImage(false)
      }
    } catch {
      alert("Failed to upload image")
      setUploadingImage(false)
    }
  }

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUploadImage(file)
    }
  }

  // Clipboard paste handler inside the upload modal
  useEffect(() => {
    if (!uploadModalLeadId) return // Only active when upload modal is open

    const onPaste = (e) => {
      const items = e.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile()
          if (blob) {
            e.preventDefault()
            handleUploadImage(blob)
            break
          }
        }
      }
    }

    const currentModal = uploadModalRef.current
    if (currentModal) {
      currentModal.addEventListener("paste", onPaste)
    }

    return () => {
      if (currentModal) {
        currentModal.removeEventListener("paste", onPaste)
      }
    }
  }, [uploadModalLeadId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 text-gray-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading leads...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        <p className="text-lg font-semibold">Error loading leads</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 text-lg mb-2">No leads found</div>
        <div className="text-gray-500 text-sm">Try adding some or adjust your filters</div>
      </div>
    )
  }

  return (
    <>
      {/* View Image Modal */}
      {modalImage && (
        <div
          onClick={closeImageModal}
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4"
        >
          <img
            src={modalImage}
            alt="Lead"
            className="max-w-full max-h-[80vh] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mt-4 flex space-x-3">
            <Button
              variant="destructive"
              onClick={handleDeleteImage}
              disabled={deletingImage}
              className="flex items-center"
            >
              {deletingImage ? "Deleting..." : (
                <>
                  <Trash className="w-4 h-4 mr-1" /> Delete Image
                </>
              )}
            </Button>
            <Button onClick={closeImageModal} variant="outline">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Upload Image Modal with clipboard paste support */}
      {uploadModalLeadId && (
        <div
          ref={uploadModalRef}
          tabIndex={0} // Make div focusable for paste events
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 text-center">
            <h2 className="text-lg font-semibold">Upload Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={onFileInputChange}
              disabled={uploadingImage}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Or paste an image (Ctrl+V) directly here
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setUploadModalLeadId(null)}
                disabled={uploadingImage}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="text-left p-4 text-gray-200">Image</th>
              <th className="text-left p-4 text-gray-200">Client Number</th>
              <th className="text-left p-4 text-gray-200">My Number</th>
              <th className="text-left p-4 text-gray-200">Team Member</th>
              <th className="text-left p-4 text-gray-200">Status</th>
              <th className="text-left p-4 text-gray-200">Remarks</th>
              <th className="text-left p-4 text-gray-200">Date</th>
              <th className="text-left p-4 text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead._id || index}
                className={`border-b border-gray-700 hover:bg-gray-750 transition-colors ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"
                }`}
              >
                <td className="p-4">
                  {lead.imageUrl ? (
                    <img
                      src={lead.imageUrl}
                      alt="Lead"
                      className="w-10 h-10 object-cover rounded cursor-pointer"
                      onClick={() => openImageModal(lead.imageUrl, lead._id)}
                      title="Click to view full image"
                    />
                  ) : (
                    <ImageIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      title="Click to upload image"
                      onClick={() => setUploadModalLeadId(lead._id)}
                    />
                  )}
                </td>
                <Reminder lead={lead} />

                <td className="p-4 text-gray-300">{lead.myNumber}</td>
                <td className="p-4 text-white">{lead.teamMember}</td>
                <td className="p-4">
                  <Badge className={statusColors[lead.status] || statusColors["Not Interested"]}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="p-4 text-gray-300 text-sm max-w-xs truncate">{lead.remarks}</td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(lead.createdAt || lead.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(lead)}
                      className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteLead(lead)}
                      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
