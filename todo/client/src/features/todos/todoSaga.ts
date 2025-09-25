import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoRequest,
  addTodoSuccess,
  updateTodoRequest,
  updateTodoSuccess,
  deleteTodoRequest,
  deleteTodoSuccess,
  type Todo,
} from "./todoSlice";

// Mock API
const api = {
  fetchTodos: async (): Promise<Todo[]> =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([{ id: "1", title: "Learn Redux-Saga", completed: false }]),
        800
      )
    ),
  addTodo: async (title: string): Promise<Todo> =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ id: Date.now().toString(), title, completed: false }),
        500
      )
    ),
  updateTodo: async (todo: Todo): Promise<Todo> =>
    new Promise((resolve) => setTimeout(() => resolve({ ...todo }), 500)),
  deleteTodo: async (id: string): Promise<string> =>
    new Promise((resolve) => setTimeout(() => resolve(id), 500)),
};

// --- Fetch Todos
function* fetchTodosSaga() {
  try {
    const todos: Todo[] = yield call(() => api.fetchTodos());
    yield put(fetchTodosSuccess(todos));
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while fetching todos.";
    console.error("Fetch Todos Error:", error);
    yield put(fetchTodosFailure(message));
  }
}

// --- Add Todo
function* addTodoSaga(action: ReturnType<typeof addTodoRequest>) {
  try {
    const newTodo: Todo = yield call(() => api.addTodo(action.payload));
    yield put(addTodoSuccess(newTodo));
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while adding a todo.";
    console.error("Add Todo Error:", error);
    yield put(fetchTodosFailure(message));
  }
}

// --- Update Todo
function* updateTodoSaga(action: ReturnType<typeof updateTodoRequest>) {
  try {
    const updated: Todo = yield call(() => api.updateTodo(action.payload));
    yield put(updateTodoSuccess(updated));
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while updating a todo.";
    console.error("Update Todo Error:", error);
    yield put(fetchTodosFailure(message));
  }
}

// --- Delete Todo
function* deleteTodoSaga(action: ReturnType<typeof deleteTodoRequest>) {
  try {
    const deletedId: string = yield call(() => api.deleteTodo(action.payload));
    yield put(deleteTodoSuccess(deletedId));
    console.log(`Todo deleted successfully: ${deletedId}`);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while deleting a todo.";
    console.error("Delete Todo Error:", error);
    yield put(fetchTodosFailure(message));
  }
}

// --- Root Saga
export default function* rootSaga() {
  yield all([
    takeLatest(fetchTodosRequest.type, fetchTodosSaga),
    takeLatest(addTodoRequest.type, addTodoSaga),
    takeLatest(updateTodoRequest.type, updateTodoSaga),
    takeLatest(deleteTodoRequest.type, deleteTodoSaga),
  ]);
}
