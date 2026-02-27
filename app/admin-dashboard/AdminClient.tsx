"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Modal } from "./Modal"
import { apiFetch } from "@/lib/fetchWrapper"
import { useRouter } from "next/navigation"

export function AdminClient() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const queryClient = useQueryClient()
const router = useRouter()
  // Fetch users
  const getUsers = async () => {
    const res = await apiFetch("/api/v1/users")
    if (!res?.ok) throw new Error("Failed to fetch users")
    return res.json()
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  // Delete mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiFetch(`/api/v1/users/${userId}`, {
        method: "DELETE",
      })
      if (!res?.ok) throw new Error("Delete failed")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
// Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch("/api/v1/auth/logout", {
        method: "POST",
      })
      if (!res?.ok) throw new Error("Logout failed")
      return res.json()
    },
    onSuccess: () => {
      router.push("/auth/signup")
    },
  })
  if (isLoading)
    return <div className="p-6 text-gray-500">Loading users...</div>

  if (error)
    return <div className="p-6 text-red-500">Error loading users</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
       {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => logoutMutation.mutate()}
          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>


      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {data?.data.map((user: any, index: number) => (
          <div
            key={user.id}
            className="flex justify-between items-center px-6 py-4 border-b hover:bg-gray-50 transition"
          >
            <div
              className="cursor-pointer flex gap-6 flex-1"
              onClick={() => setSelectedUser(user.id)}
            >
              <span className="text-gray-400">{index + 1}</span>
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-500">{user.email}</span>
            </div>

            <button
              onClick={() => deleteUserMutation.mutate(user.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <Modal
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}