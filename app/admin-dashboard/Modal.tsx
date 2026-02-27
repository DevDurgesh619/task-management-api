"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/fetchWrapper"

export function Modal({
  onClose,
  selectedUser,
}: {
  onClose: () => void
  selectedUser: string
}) {
  const getTodos = async () => {
    const res = await apiFetch(`/api/v1/users/${selectedUser}`)
    if (!res?.ok) throw new Error("Failed to fetch todos")
    return res.json()
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", selectedUser],
    queryFn: getTodos,
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[500px] max-h-[80vh] rounded-2xl shadow-xl p-6 overflow-y-auto animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">User Todos</h2>

        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error loading todos</p>}

        <div className="space-y-3">
          {data?.data.todos.map((todo: any, index: number) => (
            <div
              key={todo.id}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {index + 1}. {todo.title}
                </span>
                <span className="text-sm text-gray-500">
                  {todo.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {todo.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}