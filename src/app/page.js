// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./dashboard/page";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./settings/page";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
