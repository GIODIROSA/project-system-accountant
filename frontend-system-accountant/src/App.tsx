import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
