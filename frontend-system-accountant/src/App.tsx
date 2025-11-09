import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* A future Navbar can go here */}
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
          <h1 className="text-xl font-bold">System Accountant</h1>
          {/* Navigation links can be added here */}
        </nav>
      </header>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
