import axios from "axios";
import type { todo } from "../types/todo";

const API = axios.create({
  baseURL: "http://localhost:5000/api/todos",
});

export const getTodos = async () => {
  const res = await API.get("/");
  return res.data;
};

export const createTodo = async (todo: { title: string; description: string; completed: boolean}) => {
  const res = await API.post("/", todo);
  return res.data;
};

export const updateTodo = async (
  id: string,
  todo: todo
  
) => {
  const res = await API.put(`/${id}`, todo);
  return res.data;
};

export const deleteTodo = async (id: string) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};
