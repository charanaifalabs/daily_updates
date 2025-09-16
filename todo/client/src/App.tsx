import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import "./index.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 via-teal-200 to-teal-500 flex items-start justify-center p-6">
        <Home />
      </div>
    </QueryClientProvider>
  );
}
