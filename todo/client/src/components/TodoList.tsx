import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, updateTodo, deleteTodo } from "../api/todoApi";
import type { todo } from "../types/todo";

export default function TodoList() {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // Fetch todos
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      completed,
      title,
      description,
    }: {
      id: string;
      completed: boolean;
      title: string;
      description: string;
    }) => updateTodo(id, { title, description, completed, _id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditId(null);
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const handleEdit = (todo: todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditCompleted(todo.completed);
  };

  const handleSave = (todo:todo) => {
    updateMutation.mutate({
      id: todo._id,
      title: editTitle,
      description: editDescription,
      completed: editCompleted,
    });
  };

  if (isLoading)
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-6 text-red-500">Error fetching todos</p>
    );

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {todos.map((todo: todo) => (
        <div
          key={todo._id}
          className="rounded-xl shadow-md p-4 transition-transform transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-black-700 via-white-700 to-white"
        >
          {editId === todo._id ? (
            <div className="flex flex-col gap-3">
              <input
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="p-2 border bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <textarea
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="p-2 border bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editCompleted}
                  onChange={(e) => setEditCompleted(e.target.checked)}
                  className="h-5 w-5 text-blue-500 border-gray-700 rounded focus:ring-blue-500"
                />
                <label className="font-medium text-black">
                  Mark as Completed
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(todo)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-1"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h3
                className={`text-lg font-semibold ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-black ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <span
                className={`inline-block mr-40 text-center text-xs font-semibold px-2 py-1 rounded-full ${
                  todo.completed
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {todo.completed ? "Completed " : "Pending "}
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="flex-1 px-3 py-1 bg-gray-400 hover:bg-gray-600 text-black rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(todo._id)}
                  className="flex-1 px-3 py-1 bg-red-400 hover:bg-red-600 text-black rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
