import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // --- Fetch
    fetchTodosRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTodosSuccess: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTodosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Add
    // ✅ expects a string payload (title)
    addTodoRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.todos.push({
        id: Date.now().toString(),
        title: action.payload,
        completed: false,
      });
    },
    addTodoSuccess: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    // --- Update
    // ✅ expects full Todo object as payload
    updateTodoRequest: (state, _action: PayloadAction<Todo>) => {
      state.loading = true;
      state.error = null;
      state.todos = state.todos.map((todo) =>
        todo.id === _action.payload.id ? _action.payload : todo
      );
    },
    updateTodoSuccess: (state, action: PayloadAction<Todo>) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
      state.loading = false;
      state.error = null;
    },

    // --- Delete
    // ✅ expects todoId as string
    deleteTodoRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.todos = state.todos.filter((todo) => todo.id !== _action.payload);
    },
    deleteTodoSuccess: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoRequest,
  addTodoSuccess,
  updateTodoRequest,
  updateTodoSuccess,
  deleteTodoRequest,
  deleteTodoSuccess,
} = todoSlice.actions;

export default todoSlice.reducer;
