import { Status } from "@prisma/client";
import { useState } from "react";
import { apiFetch } from "@/lib/fetchWrapper";
import { useQueryClient } from "@tanstack/react-query";

export function UpdateTodoModal({
  todo,
  onClose,
}: {
  todo: any;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description,
    status: todo.status,
  });

  const handleUpdate = async () => {
    await apiFetch(`/api/v1/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    queryClient.invalidateQueries({ queryKey: ["todos"] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h2 className="text-lg font-semibold">Update Todo</h2>

        <input
          className="border p-2 rounded w-full"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="border p-2 rounded w-full"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="border p-2 rounded w-full"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Status })
          }
        >
          <option value={Status.PENDING}>PENDING</option>
          <option value={Status.COMPLETED}>COMPLETED</option>
          <option value={Status.FAILED}>FAILED</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-black text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}