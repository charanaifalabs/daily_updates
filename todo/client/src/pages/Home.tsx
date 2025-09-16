import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <div className="w-full max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        📝 To-Do App
      </h1>
      <TodoForm />
      <div className="mt-6">
        <TodoList />
      </div>
    </div>
  );
}
