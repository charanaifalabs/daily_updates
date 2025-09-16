import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../api/todoApi";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setDescription("");
      setCompleted(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    mutate({ title, description, completed });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl max-w-xl mx-auto flex flex-col bg-gradient-to-br from-black-700 via-white-700 to-white shadow-xl gap-2"
    >
      <h2 className="text-1xl font-bold text-black mb-2">Add New Todo</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="p-3 border border-gray-700 bg-gray-800 text-white rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="p-3 border border-gray-700 bg-gray-800 text-white rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition"
        rows={4}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-5 w-5 text-blue-500 border-gray-700 rounded focus:ring-blue-500"
        />
        <label className="font-medium text-balck-300 ">Mark as Completed</label>
      </div>

      <button
        type="submit"
        className="mt-3 px-6 py-3 bg-gray-500 hover:bg-gray-700 text-white 
                   font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
      >
        Add Todo
      </button>
    </form>
  );
}
