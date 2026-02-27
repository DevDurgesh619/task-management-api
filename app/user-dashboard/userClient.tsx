"use client";

import { apiFetch } from "@/lib/fetchWrapper";
import { Status } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateTodoModal } from "../components/UpdateTodoModal";

type TodoError = {
  title?: string;
  description?: string;
  status?: string;
};

export default function UserClient({ name,userId}: { name: string,userId:string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTodo, setSelectedTodo] = useState<any | null>(null);
type FormType = {
  title: string;
  description: string;
  status: Status;
};

  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
    status: Status.PENDING,
  });

  const [todoError, setTodoError] = useState<TodoError>({});
  {/* get todos */}
  const getTodos = async () => {
    const res = await apiFetch("/api/v1/todos");
    return res?.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos",userId],
    queryFn: getTodos,
    enabled: !!userId
  });

   {/* create todos */}
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch("/api/v1/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res?.json();

      if (!data.success && data.errors?.fieldErrors) {
        const fieldErrors = data.errors.fieldErrors;
        const formatted: TodoError = {};

        Object.keys(fieldErrors).forEach((key) => {
          formatted[key as keyof TodoError] = fieldErrors[key]?.[0];
        });

        setTodoError(formatted);
        return;
      }

      if (!res?.ok) throw new Error("Server error");

      setForm({ title: "", description: "", status: Status.PENDING });
      setTodoError({});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos",userId] });
    },
  });

   {/* delete todos */}
  const handleDelete = async (id: string) => {
    await apiFetch(`/api/v1/todos/${id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["todos",userId] });
  };

   {/* logout */}
 const logoutMutation = useMutation({
  mutationFn: async () => {
    const res = await apiFetch("/api/v1/auth/logout", {
      method: "POST",
    })
    if (!res?.ok) throw new Error("Logout failed")
    return res.json()
  },
  onSuccess: () => {
    queryClient.clear()  
    router.push("/auth/signup")
  },
})

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10">Error loading todos</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold">
          User Dashboard — Welcome, {name}
        </h1>

        <button
          onClick={()=> logoutMutation.mutate()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-8 space-y-8">

        {/* todo form */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Create Todo</h2>

          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col">
              <input
                className="border rounded px-3 py-2 w-48"
                placeholder="Title"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setTodoError((p) => ({ ...p, title: undefined }));
                }}
              />
              {todoError.title && (
                <span className="text-red-500 text-sm">
                  {todoError.title}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                className="border rounded px-3 py-2 w-48"
                placeholder="Description"
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  setTodoError((p) => ({ ...p, description: undefined }));
                }}
              />
              {todoError.description && (
                <span className="text-red-500 text-sm">
                  {todoError.description}
                </span>
              )}
            </div>

            <select
              className="border rounded px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Status })
              }
            >
              <option value={Status.PENDING}>PENDING</option>
              <option value={Status.COMPLETED}>COMPLETED</option>
              <option value={Status.FAILED}>FAILED</option>
            </select>

            <button
              onClick={() => mutation.mutate()}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
            >
              Add Todo
            </button>
          </div>
        </div>

        {/* todo list  */}
        {data?.data?.todos?.map((todo: any) => (
          <div
            key={todo.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <h3 className="font-medium">{todo.title}</h3>
              <p className="text-sm text-gray-600">{todo.description}</p>
              <span className="text-xs text-gray-500">
                {todo.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTodo(todo)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
          {selectedTodo && (
      <UpdateTodoModal
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />
    )}
    </div>
  );
}
